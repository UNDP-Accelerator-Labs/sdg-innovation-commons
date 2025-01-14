import Collection from '@/app/ui/collection';
import { incomingRequestParams } from '@/app/lib/utils';
import type { Metadata, ResolvingMetadata } from 'next';
import collectionData from '@/app/lib/data/collection';

type Props = {
  params: Promise<{ collection: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { collection : id } = await params;

  // fetch data
  const data = await collectionData({ id, searchParams: await searchParams });
  const previousImages = (await parent)?.openGraph?.images || [];

  return {
    title: data?.title,
    description: data?.description,
    openGraph: {
      images: [data?.mainImage, ...previousImages],
    },
  };
}

export default async function Page({
  params,
  searchParams,
}: incomingRequestParams) {
  let { collection } = await params;

  const sParams = await searchParams;
  if (!Object.keys(sParams).includes('page')) sParams['page'] = '1';

  return <Collection id={collection} searchParams={sParams} />;
}
