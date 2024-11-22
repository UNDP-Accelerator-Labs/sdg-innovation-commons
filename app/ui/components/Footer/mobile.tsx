import clsx from 'clsx';
import Link from 'next/link';

export default function DesktopMediaLinks({ className }: { className?: string }) {
  return (
    <>
      <div className={clsx('text-white w-[375px] md:w-[744px] lg:w-[992px] xl:w-[1200px] xxl:w-[1440px] px-[40px] py-[80px] mx-auto box-border', className)}>
        {/* Social media links for desktop view */}
        <div className='w-full grid grid-cols-6 gap-[20px] mb-[20px]'>
          <div className='col-span-3 flex items-center'>
            <img
                className='h-[150px] relative'
                alt=''
                src='/images/UNDP-Logo-White-Large.png'
              />
          </div>
          {/*<div className='col-span-4 col-start-9'>
            <h2 className='mb-[20px]'>Sign up for our newsletter</h2>
            <p>The subscription service is currently unavailable. Please check again later.</p>
          </div>*/}
        </div>

        <div className='w-full md:grid md:grid-cols-3 md:gap-[20px] border-t-[1px] border-white border-solid pt-[40px] mb-[60px]'>
          <div className='md:grid md:grid-cols-2 md:col-span-2 md:gap-[20px]'>
            <div>
              <h3 className='uppercase text-[16px] mb-[20px]'>Who we are</h3>
              <ul className='list-none m-0 p-0'>
                <li className='mb-[20px]'><Link href="https://www.undp.org/acceleratorlabs/aboutus" target="_blank" rel="noopener noreferrer" className='text-white text-[14px]'>About us</Link></li>
                <li className='mb-[20px]'><Link href="https://www.undp.org/acceleratorlabs/our-work" target="_blank" rel="noopener noreferrer" className='text-white text-[14px]'>Our work</Link></li>
                <li className='mb-[20px]'><Link href="https://www.undp.org/acceleratorlabs/partnerships-core-our-network" target="_blank" rel="noopener noreferrer" className='text-white text-[14px]'>Partnerships: the core of our network</Link></li>
                <li className='mb-[20px]'><Link href="https://www.undp.org/acceleratorlabs/our-work/untapped" target="_blank" rel="noopener noreferrer" className='text-white text-[14px]'>UNTAPPED</Link></li>
                <li className='mb-[20px]'><Link href="https://www.undp.org/acceleratorlabs/peoplepowered" target="_blank" rel="noopener noreferrer" className='text-white text-[14px]'>Grassroots Energy Solutions</Link></li>
              </ul>
            </div>
            <div>
              <h3 className='uppercase text-[16px] mb-[20px]'>Where we are</h3>
              <ul className='list-none m-0 p-0'>
                <li className='mb-[20px]'><Link href="https://www.undp.org/acceleratorlabs/our-locations" target="_blank" rel="noopener noreferrer" className='text-white text-[14px]'>Our Locations</Link></li>
                {/* <li className='mb-[20px]'><Link href="/" target="_blank" rel="noopener noreferrer" className='text-white text-[14px]'>Human Development Report</Link></li>
                <li className='mb-[20px]'><Link href="/" target="_blank" rel="noopener noreferrer" className='text-white text-[14px]'>Our Strategic Plan</Link></li>
                <li className='mb-[20px]'><Link href="/" target="_blank" rel="noopener noreferrer" className='text-white text-[14px]'>Our Expertise</Link></li> */}
              </ul>
            </div>
            <div>
              <h3 className='uppercase text-[16px] mb-[20px]'>Our Learnings</h3>
              <ul className='list-none m-0 p-0'>
                <li className='mb-[10px]'><Link href="https://www.undp.org/acceleratorlabs/globalpublications" target="_blank" rel="noopener noreferrer" className='text-white text-[14px]'>Global Publications</Link></li>
                <li className='mb-[10px]'><Link href="https://www.undp.org/acceleratorlabs/localpublications" target="_blank" rel="noopener noreferrer" className='text-white text-[14px]'>Country Publications</Link></li>
                <li className='mb-[10px]'><Link href="https://www.undp.org/acceleratorlabs/blog" target="_blank" rel="noopener noreferrer" className='text-white text-[14px]'>Blogs</Link></li>
                {/* <li className='mb-[10px]'><Link href="/" target="_blank" rel="noopener noreferrer" className='text-white text-[14px]'>Stories</Link></li>
                <li className='mb-[10px]'><Link href="/" target="_blank" rel="noopener noreferrer" className='text-white text-[14px]'>Asset Library</Link></li> */}
              </ul>
            </div>
            <div>
              <h3 className='uppercase text-[16px] mb-[20px]'>News</h3>
              <ul className='list-none m-0 p-0'>
                <li className='mb-[10px]'><Link href="https://www.undp.org/acceleratorlabs/news-updates" target="_blank" rel="noopener noreferrer" className='text-white text-[14px]'>News center</Link></li>
                <li className='mb-[10px]'><Link href="https://www.undp.org/acceleratorlabs/events" target="_blank" rel="noopener noreferrer" className='text-white text-[14px]'>Events</Link></li>
                <li className='mb-[10px]'><Link href="https://www.undp.org/acceleratorlabs/newsletters" target="_blank" rel="noopener noreferrer" className='text-white text-[14px]'>Newsletters</Link></li>
                <li className='mb-[10px]'><Link href="https://undp.us3.list-manage.com/subscribe?u=ff020e3d052a15deb7058d052&id=a1f6e5947a" target="_blank" rel="noopener noreferrer" className='text-white text-[14px]'>Join our community</Link></li>
              </ul>
            </div>
          </div>
          <div className='md:text-right col-start-3 flex flex-col justify-start mt-[40px] md:mt-0'>
            <div>
              <img
                  className="w-[50px] w-[45.6px] relative h-[50px] h-[45.6px]"
                  alt=""
                  src="/images/Group 244.svg"
                />
            </div>
            <div>
              <ul className='list-none m-0 p-0'>
              <li className='mb-[10px]'><Link href="https://www.undp.org/accountability/audit/investigations" target="_blank" rel="noopener noreferrer" className='text-white text-[14px]'>Report Fraud, Abuse, Misconduct</Link></li>
              <li className='mb-[10px]'><Link href="https://www.undp.org/accountability/audit/social-and-environmental-compliance-review-and-stakeholder-response-mechanism" target="_blank" rel="noopener noreferrer" className='text-white text-[14px]'>Submit social environment complaint</Link></li>
              <li className='mb-[10px]'><Link href="https://www.undp.org/scam-alert" target="_blank" rel="noopener noreferrer" className='text-white text-[14px]'>Scam Alert</Link></li>
              <li className='mb-[10px]'><Link href="https://www.undp.org/copyright-terms-use" target="_blank" rel="noopener noreferrer" className='text-white text-[14px]'>Terms of Use</Link></li>
              </ul>
            </div>
            <div className='w-full flex justify-between mb-[20px]'>
              <Link href='https://x.com/UNDPAccLabs?prefetchTimestamp=1728383203979' target='_blank' rel='noopener noreferrer'>
                <img
                  className="w-[50px] w-[45.6px] relative h-[50px] h-[45.6px]"
                  alt=""
                  src="/images/Group 244.svg"
                />
              </Link>
              <Link href='https://www.linkedin.com/company/undp-accelerator-labs/' target='_blank' rel='noopener noreferrer'>
                <img
                  className="w-[50px] w-[45.6px] relative h-[50px] h-[45.6px]"
                  alt=""
                  src="/images/Group 243.svg"
                />
              </Link>
              <Link href='https://acclabs.medium.com/' target='_blank' rel='noopener noreferrer'>
                <img
                  className="w-[50px] w-[45.6px] relative h-[50px] h-[45.6px]"
                  alt=""
                  src="/images/Group 245.svg"
                />
              </Link>
              <Link href='https://www.instagram.com/acceleratorlabs/' target='_blank' rel='noopener noreferrer'>
                <img
                  className="w-[50px] w-[45.6px] relative h-[50px] h-[45.6px]"
                  alt=""
                  src="/images/Group 242.svg"
                />
              </Link>
            </div>
          </div>
        </div>
        {/* END: Scial media links for desktop view */}
        {/*END:  UNDP LINKS */}
        <small className='mb-0 text-[12px]'>© All Rights Reserved</small>
      </div>
    </>
  );
}