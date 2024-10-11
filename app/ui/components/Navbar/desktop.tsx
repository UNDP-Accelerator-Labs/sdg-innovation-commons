"use client";
import Link from 'next/link'; 
import clsx from 'clsx';
import { navItems } from './navlink'

export default function DesktopNavBar() {

  return (
    <div className="w-full relative bg-white h-[134px] overflow-hidden flex flex-row items-start justify-between pt-2.5 pb-0 pl-[60px] pr-20 box-border text-center text-base text-black">
      {/* Logo */}
      <img className="w-[52px] relative h-[103.5px] z-[0] left-[3.5%]" alt="UNDP logo" src="/images/undp-logo.svg" />

      {/* Navigation Links */}
      <div className="flex flex-row items-center justify-start gap-[31px] z-[1]">
        <div className="flex flex-row items-center justify-start gap-[26px]">
          {/* Map over the navItems array */}
          {navItems.map((link, index) => (
            <Link key={index} href={link.href} passHref className='no-underline text-black'>
              <span className={clsx("relative leading-[69px] text-[16px] cursor-pointer", index == 0 ? 'font-bold' : '')}>
                {link.title}
              </span>
            </Link>
          ))}

          {/* Translate icon */}
          <img className="w-[31.8px] relative h-[29px] object-cover" alt="Google Translate" src="/images/gtranslate.svg" />
        </div>

        {/* Login button */}
        <button className="w-[143.1px] relative h-[51.3px]">
          <div className="absolute top-0 left-0 bg-lime-yellow w-[143.1px] h-[51.3px]" />
          <b className="absolute top-[15px] left-[22px] leading-[21px] inline-block w-[98.9px] h-[21px]">
            Login
          </b>
        </button>
      </div>

      {/* Bottom vector image */}
      <img
        className="w-[1442.8px] absolute bottom-[1.03px] left-[calc(50%_-_721.41px)] h-[47.3px] z-[2]"
        alt=""
        src="/images/Vector 31.svg"
      />
    </div>
  );
}