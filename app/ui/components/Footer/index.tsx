import { Button } from '@/app/ui/components/Button';
import Link from 'next/link';

import DesktopMediaLinks from './desktop'; // Desktop navbar
import MobileMediaLinks from './mobile'; // Desktop navbar

export default function Footer() {
    return (
      <>
        <section className='lg:home-section lg:px-[80px] lg:py-[40px]'>
          <div className='section-content grid grid-cols-9 gap-[20px]'>
            <div>
              <p className='font-space-mono'>
                <b>Powered by</b>
              </p>
            </div>
            <div className='col-span-5'>
              <img
                className="w-full relative object-cover"
                alt=""
                src="images/UNDP_AccLabs_Partners_banner.png"
              />
            </div>
            <div className='col-span-3 text-right'>
              <p className='font-space-mono'>
                <b>Signup for our Platform</b>
              </p>
              <Button>
                  <Link href={'#'}>
                      Join Platform
                  </Link>
              </Button>
            </div>
          </div>
        </section>
        <section className='lg:home-section lg:px-[80px] lg:py-[40px]'>
          {/* Desktop Buttons: Display on medium and larger screens */}
          <DesktopMediaLinks className='hidden lg:flex' />
          {/* Mobile Buttons: Display on medium and larger screens */}
          <MobileMediaLinks className='lg:hidden' />
        </section>
      </>
    );
  }
  