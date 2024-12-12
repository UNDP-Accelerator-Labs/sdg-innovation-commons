'use client';
import { useSharedState } from '@/app/ui/components/SharedState/Context';

export default function Button() {

  const { sharedState } = useSharedState();
  let { isLogedIn, session } = sharedState || {};

  const { pinboards } = session || {};

  if (isLogedIn && pinboards?.length) {
    return (
      <div className='fixed z-[10] bottom-[80px] right-[80px]'>
    		<a href='/boards?space=private'>
          <button className='detach h-[60px] font-bold font-space-mono text-[18px] px-[40px]'>
            <span className='relative z-[2]'>
              My Boards
            </span>
          </button>
        </a>
    	</div>
    );
  }
}