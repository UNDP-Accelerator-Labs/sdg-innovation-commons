import Pad from '@/app/ui/pad';
import { incomingRequestParams } from '@/app/lib/utils';

export default async function Page({ params, searchParams }: incomingRequestParams) {
  const { pad } = await params;
  return (
    <Pad id={+pad} platform='solution' />
  );
}
