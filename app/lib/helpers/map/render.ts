import * as d3Geo from 'd3-geo';
import { scaleLinear } from 'd3-scale';
import { extent } from 'd3-array';
import { createCanvas } from 'canvas';
import { BlobServiceClient } from '@azure/storage-blob';
import { v4 as uuidv4 } from 'uuid';
import { app_storage } from '@/app/lib/helpers/utils';

interface Layer {
  lat: number;
  lng: number;
  count: number;
  color?: string;
  type: string;
  label?: string;
}

interface RenderKwargs {
  basemap: any;
  projsize: number;
  projection: any;
  background_color?: string;
  base_color?: string;
  layers?: Layer[];
  simplification?: number;
}

interface RenderResult {
  status: number;
  file?: string;
  message?: string;
}

export default async function renderMap(kwargs: RenderKwargs): Promise<RenderResult> {
  const { basemap, projsize, projection, ...renderProperties } = kwargs;

  const width = projsize;
  const height = projsize;

  const canvas = createCanvas(width, height);
  const context = canvas.getContext('2d');

  let { background_color, base_color, layers, simplification } = renderProperties;

  if (!background_color) background_color = 'transparent';
  if (!base_color) base_color = 'rgba(102,117,127,.25)';
  if (layers && !Array.isArray(layers)) layers = [layers];
  if (!simplification) simplification = 10;

  const clip = (d3Geo as any).geoClipRectangle(0, 0, width, height);

  const state = {
    scale: 1,
    translate: [0, 0],
    area: 0,
  };

  const simplify = (d3Geo as any).geoTransform({
    point: function (x: number, y: number, z: number) {
      if (z >= simplification! * state.area) {
        this.stream.point(
          x * state.scale + state.translate[0],
          y * state.scale + state.translate[1]
        );
      }
    },
  });

  const canvasprojection = {
    stream: function (s: any) {
      return simplify.stream(clip(s));
    },
  };

  const path = (d3Geo.geoPath as any)(canvasprojection).context(context);

  // BACKGROUND
  context.save();
  context.fillStyle = background_color;
  context.fillRect(0, 0, width, height);
  context.restore();

  // BASE MAP
  context.save();
  context.beginPath();
  path(basemap);
  context.fillStyle = base_color;
  context.fill();
  context.restore();

  // LAYERS
  if (layers?.length) {
    const scale = scaleLinear()
      .domain(extent(layers, (d) => d.count) as [number, number])
      .range([Math.min(10, projsize / 250), Math.min(50, projsize / 50)]);

    layers.forEach((d) => {
      let { type, lat, lng, count, color } = d;
      if (!color) color = '#32bee1';
      if (type === 'point') {
        const location = projection([lng, lat]);
        context.save();
        context.translate(...(location as [number, number]));
        context.beginPath();
        context.arc(0, 0, scale(count) as number, 0, 2 * Math.PI);
        context.fillStyle = color;
        context.fill();
        context.restore();
      }
    });
  }

  // SAVE THE IMAGE TO AZURE BLOB STORAGE
  let fileerror = false;

  if (!app_storage || !process.env.AZURE_STORAGE_CONNECTION_STRING) {
    return {
      status: 500,
      message: 'Azure storage not configured',
    };
  }

  const { origin } = new URL(app_storage);

  // ESTABLISH THE CONNECTION TO AZURE
  const blobServiceClient = BlobServiceClient.fromConnectionString(
    process.env.AZURE_STORAGE_CONNECTION_STRING
  );

  const containerClient = blobServiceClient.getContainerClient('maps');
  await containerClient.createIfNotExists({ access: 'blob' });

  // FIND OR CREATE THE BLOB
  const filename = uuidv4();
  const blobClient = containerClient.getBlockBlobClient(`${filename}.png`);
  const exists = await blobClient.exists();

  if (exists) {
    return {
      status: 200,
      file: `${new URL('maps', origin).href}/${blobClient.name}`,
    };
  } else {
    await blobClient
      .uploadData(canvas.toBuffer('image/png'))
      .catch((err: any) => {
        fileerror = true;
        console.error('Error uploading map to Azure:', err);
      });

    if (!fileerror) {
      return {
        status: 200,
        file: `${new URL('maps', origin).href}/${blobClient.name}`,
      };
    } else {
      return {
        status: 500,
        message: 'Error generating the file',
      };
    }
  }
}
