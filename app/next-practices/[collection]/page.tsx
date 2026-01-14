import Collection from '@/app/ui/collection';
import { incomingRequestParams } from '@/app/lib/helpers/utils';
import type { Metadata, ResolvingMetadata } from 'next';
import collectionData from '@/app/lib/data/collection';
import getSession from "@/app/lib/session";

type Props = {
  params: Promise<{ collection: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { collection: id } = await params;
  const { PROD_ENV } = process.env;

  const metadataBase = new URL('https://sdg-innovation-commons.org');

  // fetch data
  const data = await collectionData({ id, searchParams: await searchParams });
  // ensure highlights are included so approved/published creators can be shown in metadata checks
  const highlights = data?.highlights || null;
  const previousImages = (await parent)?.openGraph?.images || [];

  // ensure mainImage is absolute (or undefined) and build images array safely
  const mainImageRaw = data?.mainImage;
  const mainImage =
    mainImageRaw && /^https?:\/\//.test(mainImageRaw)
      ? mainImageRaw
      : mainImageRaw
      ? new URL(mainImageRaw, metadataBase).toString()
      : undefined;

  // fallback to dynamic OG generator if no main image present
  const fallbackOg = new URL(
    `/api/og?title=${encodeURIComponent(data?.title || '')}&subtitle=${encodeURIComponent(data?.description || '')}`,
    metadataBase
  ).toString();

  const images = [
    ...(mainImage ? [mainImage] : []),
    ...(Array.isArray(previousImages) ? (previousImages as string[]) : []),
  ].filter(Boolean) as string[];

  // if no images at all, use fallback dynamic OG
  if (images.length === 0) images.push(fallbackOg);

  const metadata: Metadata = {
    title: data?.title,
    description: data?.description,
    openGraph: {
      images,
    },
    twitter: {
      card: 'summary_large_image',
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
  let { collection } = await params;

  const session = await getSession();
  const sParams = await searchParams;
  if (!Object.keys(sParams).includes('page')) sParams['page'] = '1';

  return <Collection id={collection} searchParams={sParams} session={session} />;
}
