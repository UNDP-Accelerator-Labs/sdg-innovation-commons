import tempData from '../tempData'
import Board from '@/app/ui/board';
import { incomingRequestParams } from '@/app/lib/utils';

export default async function Page({ params, searchParams }: incomingRequestParams) {
  let { collection } = await params;
  platform = decodeURI(platform);

  const sParams = await searchParams;
  if (!Object.keys(sParams).includes('page')) sParams['page'] = '1';

  return (
    <Board id={collection} searchParams={sParams} />
  );
}