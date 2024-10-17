import clsx from 'clsx';
import Link from 'next/link';

export default function MobileMediaLinks({ className }: { className?: string }) {
  return (
    <>
      <div className={clsx('flex justify-between items-center', className)}>

          {/* UNDP LINKS */}
          <a
            href="/faq"
            target="_blank"
            rel="noopener noreferrer"
            className="relative leading-[18px] lg:leading-[22px]"
          >
            <b>FAQ</b>
          </a>
          <a
            href="/privacy-policy"
            target="_blank"
            rel="noopener noreferrer"
            className="relative leading-[18px] lg:leading-[22px]"
          >
            <b>Privacy Policy</b>
          </a>

          <hr className="border-1 w-full border-black md:hidden lg:hidden" />

          <a
            href="https://www.undp.org"
            target="_blank"
            rel="noopener noreferrer"
            className="relative leading-[18px] lg:leading-[22px] text-left"
          >
            <b className="lg:hidden">
              <p className="m-0">United Nations</p>
              <p className="m-0">Development Programme</p>
            </b>
            <b className="hidden lg:flex">
              United Nations Development Programme
            </b>
          </a>
          <a
            href="https://acceleratorlabs.undp.org"
            target="_blank"
            rel="noopener noreferrer"
            className="relative leading-[18px] lg:leading-[22px]"
          >
            <b>UNDP Accelerator Labs</b>
          </a>
        {/*END:  UNDP LINKS */}

        {/* Mobile view- Social media links */}
        <div className="flex flex-row items-center justify-start gap-2.5 lg:hidden">
          <a
            href="https://www.instagram.com/acceleratorlabs/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              className="w-[50px] relative h-[50px]"
              alt=""
              src="images/Group 242.svg"
            />
          </a>
          <a
            href="https://www.linkedin.com/company/undp-accelerator-labs/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              className="w-[50px] lg:w-[45.6px] relative h-[50px]"
              alt=""
              src="images/Group 243.svg"
            />
          </a>
          <a
            href="https://x.com/UNDPAccLabs?prefetchTimestamp=1728383203979"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              className="w-[50px] relative h-[50px]"
              alt=""
              src="images/Group 244.svg"
            />
          </a>
          <a
            href="https://acclabs.medium.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              className="w-[50px] relative h-[50px]"
              alt=""
              src="images/Group 245.svg"
            />
          </a>
        </div>
        {/* END: Mobile view- Social media links */}

      <div className="self-stretch flex flex-row items-end justify-end md:items-start md:justify-start lg:hidden">
        <span className="relative leading-[18px] lg:leading-[22px]">All Rights Reserved</span>
      </div>
      </div>
    </>
  );
}