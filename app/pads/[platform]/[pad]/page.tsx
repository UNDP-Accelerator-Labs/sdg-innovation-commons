import Pad from '@/app/ui/pad';
import { incomingRequestParams } from '@/app/lib/utils';
import type { Metadata, ResolvingMetadata } from 'next';
import platformApi from '@/app/lib/data/platform-api';

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
  const [datum] = data;
  let { title, vignette, snippet } = datum || {};
  const previousImages = (await parent)?.openGraph?.images || [];

  const metadata: Metadata = {
    title,
    description: snippet,
    openGraph: {
      images: [vignette, ...previousImages],
    },
    metadataBase: new URL('https://sdg-innovation-commons.org'),
  };

  // Add robots metadata if in staging environment
  if (PROD_ENV === 'staging') {
    metadata.robots = 'noindex, nofollow';
  }
  
  return metadata;
}

export default async function Page({
  params,
  searchParams,
}: incomingRequestParams) {
  let { platform, pad } = await params;
  platform = decodeURI(platform);

  return <Pad platform={platform} id={+pad} />;
}
