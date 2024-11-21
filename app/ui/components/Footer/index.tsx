import { Button } from '@/app/ui/components/Button';
import Link from 'next/link';

import Mobile from './mobile';
import Tablet from './tablet';
import Desktop from './desktop';

export default function Footer() {
    return (
      <>
        <section className='home-section py-[40px]'>
          <div className='inner md:w-[744px] lg:w-[1440px] mx-auto md:px-[40px] lg:px-[80px]'>
            <div className='section-content grid grid-cols-9 gap-[20px]'>
              <div className='md:col-span-9 lg:col-span-1'>
                <p className='font-space-mono'>
                  <b>Powered by</b>
                </p>
              </div>
              <div className='md:col-span-9 lg:col-span-5'>
                <img
                  className='w-full relative object-cover'
                  alt=''
                  src='/images/UNDP_AccLabs_Partners_banner.png'
                />
              </div>
              <div className='md:col-span-9 lg:col-span-3 text-right'>
                <p className='font-space-mono'>
                  <b>Signup for our Platform</b>
                </p>
                <Button>
                    <Link href={'/#contact'}>
                        Join Platform
                    </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
        <section className='lg:home-section lg:py-[40px] bg-undp-blue'>
          {/* Mobile Buttons: Display on medium and larger screens */}
          <Mobile className='md:hidden lg:hidden' />
          {/* Tablet Buttons: Display on medium and larger screens */}
          <Tablet className='hidden md:block lg:hidden' />
          {/* Desktop Buttons: Display on medium and larger screens */}
          <Desktop className='hidden lg:block' />
        </section>
      </>
    );
  }
  