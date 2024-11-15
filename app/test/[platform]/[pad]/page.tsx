import Pad from '@/app/ui/pad';
import { incomingRequestParams } from '@/app/lib/utils';

export default async function Page({ params, searchParams }: incomingRequestParams) {
  let { platform, pad } = await params;
  platform = decodeURI(platform);
  
  return (
    <Pad id={+pad} platform={platform} />
  );
}
