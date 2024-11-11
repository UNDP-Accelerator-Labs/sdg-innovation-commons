import clsx from 'clsx';
import Link from 'next/link';

export default function DesktopMediaLinks({ className }: { className?: string }) {
  return (
    <>
      <div className={clsx('text-white lg:w-[1440px] px-[80px] mx-auto box-border', className)}>
        {/* Social media links for desktop view */}
        <div className='w-full grid lg:grid-cols-12 gap-[20px] mb-[20px]'>
          <div className='col-span-6'>
            Logo
          </div>
          <div className='col-span-4 col-start-9'>
            <h2 className='mb-[20px]'>Sign up for our newsletter</h2>
            <p>The subscription service is currently unavailable. Please check again later.</p>
          </div>
        </div>

        <div className='w-full grid lg:grid-cols-12 gap-[20px] border-t-[1px] border-white border-solid pt-[40px] mb-[60px]'>
          <div className='col-span-2'>
            <h3 className='uppercase text-[16px] mb-[20px]'>Who we are</h3>
            <ul className='list-none m-0 p-0'>
              <li className='mb-[20px]'><Link href="/" target="_blank" rel="noopener noreferrer" className='text-white text-[14px]'>About us</Link></li>
              <li className='mb-[20px]'><Link href="/" target="_blank" rel="noopener noreferrer" className='text-white text-[14px]'>Leadership</Link></li>
              <li className='mb-[20px]'><Link href="/" target="_blank" rel="noopener noreferrer" className='text-white text-[14px]'>Executive Board</Link></li>
              <li className='mb-[20px]'><Link href="/" target="_blank" rel="noopener noreferrer" className='text-white text-[14px]'>Our Partners</Link></li>
              <li className='mb-[20px]'><Link href="/" target="_blank" rel="noopener noreferrer" className='text-white text-[14px]'>Funding</Link></li>
              <li className='mb-[20px]'><Link href="/" target="_blank" rel="noopener noreferrer" className='text-white text-[14px]'>Transparency and Accountability</Link></li>
            </ul>
          </div>
          <div className='col-span-2'>
            <h3 className='uppercase text-[16px] mb-[20px]'>What we do</h3>
            <ul className='list-none m-0 p-0'>
              <li className='mb-[20px]'><Link href="/" target="_blank" rel="noopener noreferrer" className='text-white text-[14px]'>Sustainable Development Goals</Link></li>
              <li className='mb-[20px]'><Link href="/" target="_blank" rel="noopener noreferrer" className='text-white text-[14px]'>Human Development Report</Link></li>
              <li className='mb-[20px]'><Link href="/" target="_blank" rel="noopener noreferrer" className='text-white text-[14px]'>Our Strategic Plan</Link></li>
              <li className='mb-[20px]'><Link href="/" target="_blank" rel="noopener noreferrer" className='text-white text-[14px]'>Our Expertise</Link></li>
            </ul>
          </div>
          <div className='col-span-2'>
            <h3 className='uppercase text-[16px] mb-[20px]'>Our impact</h3>
            <ul className='list-none m-0 p-0'>
              <li className='mb-[10px]'><Link href="/" target="_blank" rel="noopener noreferrer" className='text-white text-[14px]'>News Center</Link></li>
              <li className='mb-[10px]'><Link href="/" target="_blank" rel="noopener noreferrer" className='text-white text-[14px]'>Results</Link></li>
              <li className='mb-[10px]'><Link href="/" target="_blank" rel="noopener noreferrer" className='text-white text-[14px]'>Publications</Link></li>
              <li className='mb-[10px]'><Link href="/" target="_blank" rel="noopener noreferrer" className='text-white text-[14px]'>Blogs</Link></li>
              <li className='mb-[10px]'><Link href="/" target="_blank" rel="noopener noreferrer" className='text-white text-[14px]'>Stories</Link></li>
              <li className='mb-[10px]'><Link href="/" target="_blank" rel="noopener noreferrer" className='text-white text-[14px]'>Asset Library</Link></li>
            </ul>
          </div>
          <div className='col-span-2'>
            <h3 className='uppercase text-[16px] mb-[20px]'>Get involved</h3>
            <ul className='list-none m-0 p-0'>
              <li className='mb-[10px]'><Link href="/" target="_blank" rel="noopener noreferrer" className='text-white text-[14px]'>Careers</Link></li>
              <li className='mb-[10px]'><Link href="/" target="_blank" rel="noopener noreferrer" className='text-white text-[14px]'>Procurement</Link></li>
              <li className='mb-[10px]'><Link href="/" target="_blank" rel="noopener noreferrer" className='text-white text-[14px]'>UNDP Shop</Link></li>
              <li className='mb-[10px]'><Link href="/" target="_blank" rel="noopener noreferrer" className='text-white text-[14px]'>UNDP Giving</Link></li>
              <li className='mb-[10px]'><Link href="/" target="_blank" rel="noopener noreferrer" className='text-white text-[14px]'>Contact Us</Link></li>
            </ul>
          </div>
          <div className='text-right col-span-3 col-start-10 flex flex-col justify-between'>
            <div>
              <img
                  className="w-[50px] lg:w-[45.6px] relative h-[50px] lg:h-[45.6px]"
                  alt=""
                  src="/images/Group 244.svg"
                />
            </div>
            <div>
              <ul className='list-none m-0 p-0'>
                <li className='mb-[10px]'><Link href="/" target="_blank" rel="noopener noreferrer" className='text-white text-[14px]'>Report Fraud, Abuse, Misconduct</Link></li>
                <li className='mb-[10px]'><Link href="/" target="_blank" rel="noopener noreferrer" className='text-white text-[14px]'>Submit social environment complaint</Link></li>
                <li className='mb-[10px]'><Link href="/" target="_blank" rel="noopener noreferrer" className='text-white text-[14px]'>Scam Alert</Link></li>
                <li className='mb-[10px]'><Link href="/" target="_blank" rel="noopener noreferrer" className='text-white text-[14px]'>Terms of Use</Link></li>
              </ul>
            </div>
            <div className='w-full flex justify-between mb-[20px]'>
              <Link href='https://x.com/UNDPAccLabs?prefetchTimestamp=1728383203979' target='_blank' rel='noopener noreferrer'>
                <img
                  className="w-[50px] lg:w-[45.6px] relative h-[50px] lg:h-[45.6px]"
                  alt=""
                  src="/images/Group 244.svg"
                />
              </Link>
              <Link href='https://www.linkedin.com/company/undp-accelerator-labs/' target='_blank' rel='noopener noreferrer'>
                <img
                  className="w-[50px] lg:w-[45.6px] relative h-[50px] lg:h-[45.6px]"
                  alt=""
                  src="/images/Group 243.svg"
                />
              </Link>
              <Link href='https://acclabs.medium.com/' target='_blank' rel='noopener noreferrer'>
                <img
                  className="w-[50px] lg:w-[45.6px] relative h-[50px] lg:h-[45.6px]"
                  alt=""
                  src="/images/Group 245.svg"
                />
              </Link>
              <Link href='https://www.instagram.com/acceleratorlabs/' target='_blank' rel='noopener noreferrer'>
                <img
                  className="w-[50px] lg:w-[45.6px] relative h-[50px] lg:h-[45.6px]"
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