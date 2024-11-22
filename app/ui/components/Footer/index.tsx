'use client';
import { Button } from '@/app/ui/components/Button';
import Link from 'next/link';
import { redirectToLogin } from '@/app/lib/auth';
import Mobile from './mobile';
import Desktop from './desktop';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const currPath: string = usePathname();
  return (
    <>
      <section className='home-section py-[40px]'>
        <div className='inner w-[375px] md:w-[744px] lg:w-[992px] xl:w-[1200px] xxl:w-[1440px] mx-auto px-[20px] lg:px-[80px] xl:px-[40px] xxl:px-[80px]'>
          <div className='section-content grid grid-cols-9 gap-[20px]'>
            <div className='col-span-9 lg:col-span-1'>
              <p className='font-space-mono'>
                <b>Powered by</b>
              </p>
            </div>
            <div className='col-span-9 lg:col-span-5 mb-[20px] lg:mb-0'>
              <img
                className='w-full relative object-cover'
                alt=''
                src='/images/UNDP_AccLabs_Partners_banner.png'
              />
            </div>
            <div className='col-span-9 lg:col-span-3 text-right self-center'>
              {/*<p className='font-space-mono'>
                <b>Signup for our Platform</b>
              </p>*/}
              <Button onClick={(e) => {
                e.preventDefault()
                redirectToLogin(currPath)
              }}>
                  <Link href={'/#contact'}>
                      Sign up
                  </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      <section className='lg:home-section lg:py-[40px] bg-undp-blue'>
        {/* Mobile Buttons: Display on medium and larger screens */}
        <Mobile className='xl:hidden' />
        {/* Desktop Buttons: Display on medium and larger screens */}
        <Desktop className='hidden xl:block' />
      </section>
    </>
  );
}
  