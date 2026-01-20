import Pad from '@/app/ui/pad';
import { incomingRequestParams } from '@/app/lib/helpers/utils';
import type { Metadata, ResolvingMetadata } from 'next';
import platformApi from '@/app/lib/data/platform';

type Props = {
  params: Promise<{ platform: string; pad: string | number }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { platform, pad: id } = await params;
  const { PROD_ENV } = process.env;

  const data = await platformApi(
    {
      pads: +id,
      include_locations: true,
      include_data: true,
      pseudonymize: false,
      include_source: true,
      include_metafields: true,
    },
    decodeURI(platform),
    'pads'
  );
  
  // Handle new {count, data} structure or legacy array
  const padsArray = (data as any)?.data || data || [];
  const [datum] = padsArray;
  let { title, vignette, snippet } = datum || {};

  const metadataBase = new URL('https://sdg-innovation-commons.org');
  const previousImagesRaw = (await parent)?.openGraph?.images || [];

  // normalize previous images to string[]
  const previousImages = Array.isArray(previousImagesRaw)
    ? (previousImagesRaw as string[])
    : previousImagesRaw
    ? [String(previousImagesRaw)]
    : [];

  // make vignette absolute if present
  const vignetteAbs =
    vignette && /^https?:\/\//i.test(vignette)
      ? vignette
      : vignette
      ? new URL(vignette, metadataBase).toString()
      : undefined;

  // build images array and filter falsy
  const images = [
    ...(vignetteAbs ? [vignetteAbs] : []),
    ...previousImages,
  ].filter(Boolean) as string[];

  // fallback to dynamic OG generator if no image available
  const fallbackOg = new URL(
    `/api/og?title=${encodeURIComponent(title || 'SDG Commons')}&subtitle=${encodeURIComponent(snippet || '')}`,
    metadataBase
  ).toString();

  if (images.length === 0) images.push(fallbackOg);

  const metadata: Metadata = {
    title: title || 'SDG Commons',
    description: snippet || '',
    openGraph: {
      title: title || 'SDG Commons',
      description: snippet || '',
      url: `/pads/${platform}/${id}`,
      siteName: 'SDG Commons',
      type: 'article',
      images,
    },
    twitter: {
      card: 'summary_large_image',
      title: title || 'SDG Commons',
      description: snippet || '',
      images: images[0] ? [images[0]] : [fallbackOg],
    },
    metadataBase,
  };

  // Add robots metadata if in staging environment
  if (PROD_ENV === 'staging') {
    (metadata as any).robots = 'noindex, nofollow';
  }

  return metadata;
}

export default async function Page({
  params,
  searchParams,
}: incomingRequestParams) {
  let { platform, pad } = await params;
  platform = decodeURI(Array.isArray(platform) ? platform[0] : platform);

  return <Pad platform={platform} id={+pad} />;
}
