'use client';
import { useSharedState } from '@/app/ui/components/SharedState/Context';
import Link from 'next/link';

export default function Button() {

  const { sharedState } = useSharedState();
  let { isLogedIn, session } = sharedState || {};

  const { pinboards } = session || {};

  if (isLogedIn && pinboards?.length) {
    return (
      <div className='fixed z-10 bottom-10 right-10'>
        <div className='relative bg-lime-400 rounded-full p-5 group'>
          <Link href='/boards?space=private'>
            <img className="w-5 relative" alt="My boards" src="/images/board-cards.svg" />
          </Link>
          <span className='absolute top-[-30px] left-1/2 transform -translate-x-1/2 bg-black text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 font-space-mono whitespace-nowrap'>
            My boards
          </span>
        </div>
      </div>
    );
  }

  return null;
}