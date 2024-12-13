import Collection from '@/app/ui/collection';
import { incomingRequestParams } from '@/app/lib/utils';

export default async function Page({ params, searchParams }: incomingRequestParams) {
  let { collection } = await params;
  // platform = decodeURI(platform);

  const sParams = await searchParams;
  if (!Object.keys(sParams).includes('page')) sParams['page'] = '1';

  return (
    <Collection id={collection} searchParams={sParams} />
  );
}