"use client";
import Link from 'next/link'; 
import clsx from 'clsx';
import { navItems } from './navlink';
import {usePathname, useSearchParams} from 'next/navigation';

export default function DesktopNavBar() {
  const currPath = usePathname();

  return (
    <div className="w-full relative bg-white pt-[10px] pb-[10px] pl-[80px] pr-[80px] box-border text-center text-base text-black font-noto-sans border-b-[1px] border-black border-solid">

      {/* Logo */}
      <div className='before:content-[""] before:w-[89px] before:bg-white before:absolute before:left-[-1px] before:top-[-1px] before:h-[79px] w-[87px] absolute text-center bg-white border-black border-[1px] border-solid pb-[17.5px]'>
        <Link href='/'>
          <img className="w-[52px] relative h-[103.5px] z-[0] m-auto" alt="UNDP logo" src="/images/undp-logo.svg" />
        </Link>
      </div>
      {/* Navigation Links */}
      <div className="flex flex-row items-center justify-end gap-[31px] z-[1]">
        <div className="flex flex-row items-center justify-start gap-[26px]">
          {/* Map over the navItems array */}
          {navItems.map((link, index) => (
            <Link key={index} href={link.href} passHref className='no-underline text-black'>
              <span className={clsx("relative leading-[69px] text-[16px] cursor-pointer")}>
                {link.href === currPath ? (
                    <b>{link.title}</b>
                  ) : (
                    link.title
                )}
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
      {/*<img
        className="w-[1442.8px] absolute bottom-[1.03px] left-[calc(50%_-_721.41px)] h-[47.3px] z-[2]"
        alt=""
        src="/images/Vector 31.svg"
      />*/}
    </div>
  );
}