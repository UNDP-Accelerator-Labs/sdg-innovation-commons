'use client';

import { useBoardContext } from '@/app/ui/board/BoardContext';

export function BoardMetadata({
  contributors: initialContributors,
  padsCount: initialPadsCount,
}: {
  contributors?: number;
  padsCount?: number;
}) {
  const { boardState } = useBoardContext();

  const contributors = boardState.contributors ?? initialContributors;
  const padsCount = boardState.pads?.count ?? initialPadsCount;

  return (
    <>
      <span className='mr-[40px]'>
        <span className='number mr-[5px]'>{padsCount}</span>
        Note{padsCount !== 1 ? 's' : null}
      </span>
      <span>
        <span className='number mr-[5px]'>{contributors}</span>
        Contributor{contributors !== 1 ? 's' : null}
      </span>
    </>
  );
}
