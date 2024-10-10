export default function Footer() {
    return (
      <div className="w-full relative bg-white border-black border-t-[1px] border-solid box-border flex flex-col items-start justify-start py-10 px-5 lg:px-20 gap-20 lg:gap-20 text-center text-sm text-black">
        
        {/* Logo and CTA */}
        <div className="self-stretch flex flex-col lg:flex-row md:flex-row items-start justify-start lg:justify-between gap-[60px] z-[0]"> 
          <div className="self-stretch flex flex-col lg:flex-row items-start justify-start lg:justify-between gap-5 lg:gap-[30px]">
            <div className="flex flex-row items-end justify-start">
              <div className="flex flex-row items-center justify-start">
                <b className="relative leading-[18px] lg:leading-[22px] lg:text-[17px] text-[14px]">Powered by</b>
              </div>
            </div>
            <img
              className="w-[359px] lg:w-[439.7px] relative h-[87.7px] lg:h-[107.4px] object-cover"
              alt=""
              src="images/UNDP_Acc_Labs_Patners_2022_CorePartners_Horizontal_RGB 1.png"
            />
          </div>
          
          <div className="md:w-[254px] lg:w-[254px] flex flex-col items-start justify-start md:items-end md:justify-end gap-[22px]">
            <b className="self-stretch relative leading-[18px] lg:leading-[22px] lg:text-[17px] text-[14px]">Signup for our Platform</b>
            <button className="self-stretch relative h-[53.8px] lg:h-[80.3px] group bg-inherit">
              <div className="absolute h-[87.55%] w-[95.98%] top-[0%] right-[-0.02%] bottom-[12.45%] left-[4.03%] transition-all duration-300 bg-lime-yellow group-hover:left-[0.03%] group-hover:top-[15%] " />
              <div className="absolute h-[87.17%] w-[95.98%] top-[12.46%] right-[4.02%] bottom-[0.37%] left-[0%] border-black border-[0.7px] lg:border-[1px] border-solid box-border" />
              <b className="absolute w-[77.01%] top-[37.87%] lg:top-[42.34%] left-[9.68%] leading-[17.76px] lg:leading-[22px] inline-block">Join Platform</b>
            </button>
          </div>
        </div>
        {/* END: Logo and CTA */}

        <hr className="hidden border-1 w-full border-black md:block" /> {/* Horizontal rule for tablet view only */}

        <div className="self-stretch flex flex-col lg:flex-row items-start justify-start lg:justify-between gap-[50px] z-[1] lg:text-[17px] text-[14px]">
          <div className="self-stretch flex flex-col lg:flex-row items-start justify-start gap-[50px]">
            <div className="self-stretch flex flex-row items-center justify-start flex-wrap lg:justify-between content-center gap-x-10 gap-y-[30px] lg:gap-7">
            
            {/* Social media links for desktop view */}
            <div className="hidden lg:flex">
            <a
                href="https://www.instagram.com/acceleratorlabs/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  className="w-[50px] lg:w-[45.6px] relative h-[50px] lg:h-[45.6px]"
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
                  className="w-[50px] lg:w-[45.6px] relative h-[50px] lg:h-[45.6px]"
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
                  className="w-[50px] lg:w-[45.6px] relative h-[50px] lg:h-[45.6px]"
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
                  className="w-[50px] lg:w-[45.6px] relative h-[50px] lg:h-[45.6px]"
                  alt=""
                  src="images/Group 245.svg"
                />
              </a>
            </div>
            {/* END: Scial media links for desktop view */}

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

              <span className="hidden lg:flex relative leading-[22px] place-items-end">All Rights Reserved</span>
            </div>

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

          </div>
          <div className="self-stretch flex flex-row items-end justify-end md:items-start md:justify-start lg:hidden">
            <span className="relative leading-[18px] lg:leading-[22px]">All Rights Reserved</span>
          </div>
        </div>
      </div>
    );
  }
  