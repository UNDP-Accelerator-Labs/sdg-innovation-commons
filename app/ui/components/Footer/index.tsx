'use client';
import { Button } from '@/app/ui/components/Button';
import BoardsButton from '@/app/ui/components/BoardsButton';
import { redirectToLogin } from '@/app/lib/auth';
import Mobile from './mobile';
import Desktop from './desktop';
import { usePathname } from 'next/navigation';
import { useSharedState } from '@/app/ui/components/SharedState/Context';
import Link from 'next/link';

export default function Footer() {
  const currPath: string = usePathname();
  const { sharedState } = useSharedState();
  const { isLogedIn, session } = sharedState || {}
  return (
    <>
      <section id='api-documentation' className="home-section flex lg:mx-0 lg:py-[10px] grid-bg font-noto-sans">
        <div className="inner mx-auto lg:w-[846px]">
          <div className="box-border items-center justify-start gap-10 px-5 lg:px-0 py-[80px]">
            <div className="relative self-stretch text-center">
              <p className="m-0">
                <b>
                  <span className="text-sm leading-5 lg:text-[22px] lg:leading-[36px]">
                    Build with SDG Commons Data
                  </span>
                </b>
              </p>
              <p className="my-5 pb-5 text-sm font-medium leading-5 lg:text-[20px] lg:leading-[28px]">
                Access our databases of solutions, experiments, and insights through our developer-friendly APIs.
                Integrate the collective intelligence of global sustainability efforts into your applications and research projects.
              </p>

              <Button>
                <Link href="https://apis.sdg-innovation-commons.org/" target='_blank'>
                  Explore API Documentation
                </Link>
                <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section id='powered-by' className='home-section py-[40px]'>
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

              <Button>
                <Link href='/register'>Get Involved</Link>
              </Button>

            </div>
          </div>
        </div>
      </section>
      <section id='footer' className='lg:home-section lg:py-[40px] bg-undp-blue'>
        {/* Mobile Buttons: Display on medium and larger screens */}
        <Mobile className='xl:hidden' />
        {/* Desktop Buttons: Display on medium and larger screens */}
        <Desktop className='hidden xl:block' />
        <BoardsButton />
      </section>
    </>
  );
}
