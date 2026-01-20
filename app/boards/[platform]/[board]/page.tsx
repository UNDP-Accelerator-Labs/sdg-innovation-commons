import Board from '@/app/ui/board';
import { incomingRequestParams } from '@/app/lib/helpers/utils';
import type { Metadata, ResolvingMetadata } from 'next';
import boardData from '@/app/lib/data/board';

type Props = {
  params: Promise<{ platform: string; board: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { platform, board: id } = await params;
  const { PROD_ENV } = process.env;

  // fetch data
  const data = await boardData({
    id: +id,
    platform,
    searchParams: await searchParams,
  });

  const metadataBase = new URL('https://sdg-innovation-commons.org');
  const previousImages = (await parent)?.openGraph?.images || [];

  // point to a dynamic OG generator endpoint with encoded text
  const ogImageUrl = new URL(
    `/api/og?title=${encodeURIComponent(data?.title || '')}&subtitle=${encodeURIComponent(data?.description || '')}`,
    metadataBase
  ).toString();

  const metadata: Metadata = {
    title: data?.title,
    description: data?.description,
    openGraph: {
      images: [ogImageUrl, ...(previousImages as string[])],
    },
    twitter: {
      // Next Metadata supports twitter object
      card: 'summary_large_image',
      images: [ogImageUrl],
    },
    metadataBase,
  };

  if (PROD_ENV === 'staging') metadata.robots = 'noindex, nofollow';

  return metadata;
}

export default async function Page({
  params,
  searchParams,
}: incomingRequestParams) {
  let { platform, board } = await params;
  platform = decodeURI(Array.isArray(platform) ? platform[0] : platform);

  const sParams = await searchParams;
  if (!Object.keys(sParams).includes('page')) sParams['page'] = '1';

  return <Board platform={platform} id={+board} searchParams={sParams} />;
}
