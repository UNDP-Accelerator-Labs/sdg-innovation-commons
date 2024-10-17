import clsx from 'clsx';
import Link from 'next/link';

export default function DesktopMediaLinks({ className }: { className?: string }) {
  return (
    <>
      <div className={clsx('flex justify-between items-center', className)}>
        {/* Social media links for desktop view */}
        <div>
          <Link href='https://www.instagram.com/acceleratorlabs/' target='_blank' rel='noopener noreferrer'>
            <img
              className="w-[50px] lg:w-[45.6px] relative h-[50px] lg:h-[45.6px]"
              alt=""
              src="images/Group 242.svg"
            />
          </Link>
          <Link href='https://www.linkedin.com/company/undp-accelerator-labs/' target='_blank' rel='noopener noreferrer'>
            <img
              className="w-[50px] lg:w-[45.6px] relative h-[50px] lg:h-[45.6px]"
              alt=""
              src="images/Group 243.svg"
            />
          </Link>
          <Link href='https://x.com/UNDPAccLabs?prefetchTimestamp=1728383203979' target='_blank' rel='noopener noreferrer'>
            <img
              className="w-[50px] lg:w-[45.6px] relative h-[50px] lg:h-[45.6px]"
              alt=""
              src="images/Group 244.svg"
            />
          </Link>
          <Link href='https://acclabs.medium.com/' target='_blank' rel='noopener noreferrer'>
            <img
              className="w-[50px] lg:w-[45.6px] relative h-[50px] lg:h-[45.6px]"
              alt=""
              src="images/Group 245.svg"
            />
          </Link>
        </div>
        {/* END: Scial media links for desktop view */}
        {/* UNDP LINKS */}
        <Link href="/faq" target="_blank" rel="noopener noreferrer" className='font-space-mono'>
          <b>FAQ</b>
        </Link>
        <Link href="/privacy-policy" target="_blank" rel="noopener noreferrer" className='font-space-mono'>
          <b>Privacy Policy</b>
        </Link>
        <Link href="https://www.undp.org" target="_blank" rel="noopener noreferrer" className='font-space-mono'>
          <b>United Nations Development Programme</b>
        </Link>
        <Link href="https://acceleratorlabs.undp.org" target="_blank" rel="noopener noreferrer" className='font-space-mono'>
          <b>UNDP Accelerator Labs</b>
        </Link>
        {/*END:  UNDP LINKS */}
        <small className='mb-0'>All Rights Reserved</small>
      </div>
    </>
  );
}