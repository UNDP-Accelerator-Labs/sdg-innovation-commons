'use client';
import { useSharedState } from '@/app/ui/components/SharedState/Context';
import Link from 'next/link';

export default function Button() {

  const { sharedState } = useSharedState();
  let { isLogedIn, session } = sharedState || {};

  const { pinboards } = session || {};

  if (isLogedIn && pinboards?.length) {
    return (
      <div className='fixed z-10 bottom-5  right-5 lg:bottom-10 lg:right-10'>
        <div className='relative bg-lime-yellow rounded-full p-5 group'>
          <Link href='/boards?space=private'>
            <img className="w-4 h-4 lg:w-8 lg:h-8 relative" alt="My boards" src="/images/board-cards.svg" />
          </Link>
          <span className='absolute top-[-30px] left-1/2 transform -translate-x-1/2 bg-black text-white text-xs rounded p-0 lg:py-1 lg:px-2 opacity-0 group-hover:opacity-100 font-space-mono whitespace-nowrap'>
            My boards
          </span>
        </div>
      </div>
    );
  }

  return null;
}
