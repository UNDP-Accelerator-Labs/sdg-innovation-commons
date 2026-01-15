'use client';

import { useBoardContext } from '@/app/ui/board/BoardContext';

export function BoardMetadata({
  contributors: initialContributors,
  padsCount: initialPadsCount,
  locations,
  tags,
}: {
  contributors?: number;
  padsCount?: number;
  locations?: any;
  tags?: any;
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
      <span className='mr-[40px]'>
        <span className='number mr-[5px]'>{locations?.count}</span>
        Location{locations?.count !== 1 ? 's' : null}
      </span>
      <span className='mr-[40px]'>
        <span className='number mr-[5px]'>{tags?.count}</span>
        Thematic area{tags?.count !== 1 ? 's' : null}
      </span>
      <span>
        <span className='number mr-[5px]'>{contributors}</span>
        Contributor{contributors !== 1 ? 's' : null}
      </span>
    </>
  );
}
