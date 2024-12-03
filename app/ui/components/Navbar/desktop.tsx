"use client";
import Link from 'next/link';
import clsx from 'clsx';
import { navItems } from './navlink';
import { usePathname } from 'next/navigation';
import { redirectToLogin } from '@/app/lib/auth';
import { useSharedState } from '@/app/ui/components/SharedState/Context';

export default function DesktopNavBar() {
  const currPath: string = usePathname();
  const currPathSplit: string[] = usePathname().split('/').filter((d: string) => d?.length).map((d: string) => decodeURI(d));
  const contentType = new Map()
  contentType.set('test', ['action plan', 'experiment']);
  contentType.set('see', ['solution']);

  const { sharedState } = useSharedState();

  const loginRedirect = (e:any)=>{
      e.preventDefault()
      redirectToLogin(currPath)
  }

  return (
    <div className='w-full relative bg-white pt-[10px] pb-[10px] box-border text-center text-base text-black font-noto-sans border-b-[1px] border-black border-solid'>
      <div className='inner relative w-[1440px] mx-auto px-[80px] box-border'>
        {/* Logo */}
        <div className='before:content-[""] before:w-[89px] before:bg-white before:absolute before:left-[-1px] before:top-[-1px] before:h-[79px] w-[87px] absolute text-center bg-white border-black border-[1px] border-solid pb-[17.5px]'>
          <Link href='/'>
            <img className='w-[50px] relative z-[0] m-auto' 
              alt='UNDP logo' 
              src='/images/undp-logo.svg'
            />
          </Link>
        </div>
        {/* Navigation Links */}
        <div className='flex flex-row items-center justify-end gap-[31px] z-[1]'>
          <p className='ml-[100px] mr-auto mb-0'>SDG Commons</p>
          <div className='flex flex-row items-center justify-start gap-[26px]'>
            {/* Map over the navItems array */}
            {navItems.map((link, index) => {
              const currHref: string[] = link.href.split('/').filter((d: string) => d?.length);
              const content = contentType.get(currHref[0]);
              let active = false;
              if (currPathSplit[0] === 'pads') {
                /*
                  this is to highlight the right section when reading a pad
                */ 
                active = content?.some((d: string) => currPathSplit.includes(d)) || false;
              } else active = currHref[0] === currPathSplit[0]
              return (
                <Link key={index} href={link.href} passHref className='no-underline text-black'>
                  <span className={clsx('relative leading-[69px] text-[16px] cursor-pointer')}>
                    {active ? (
                      <b>{link.title}</b>
                    ) : (
                      link.title
                    )}
                  </span>
                </Link>
              )
            })}
          <Link href={'/search/all'}>
            <img className="w-[31.8px] relative h-[29px] object-cover" alt="Search" src="/images/search.svg" />
          </Link>

            {/* Translate icon */}
            {/* <img className="w-[31.8px] relative h-[29px] object-cover" alt="Google Translate" src="/images/gtranslate.svg" /> */}
          </div>

          {/* Login button */}
          {sharedState?.session?.username ? <>
            <button onClick={loginRedirect} className='no-underline text-black bottom-0 bg-inherit'>
                <span className={clsx("relative leading-[38px] text-[12px] cursor-pointer bg-lime-yellow px-5 py-5")}>
                  Welcome {sharedState?.session?.username || ''}
                </span>
            </button>
          </>
          : <>
            <button onClick={loginRedirect} className="w-[143.1px] relative h-[51.3px] cursor-pointer">
              <div className="absolute top-0 left-0 bg-lime-yellow w-[143.1px] h-[51.3px]" />
              <b className="absolute top-[15px] left-[22px] leading-[21px] inline-block w-[98.9px] h-[21px]">
                Login
              </b>
            </button>
          </>}
        </div>

        {/* Bottom vector image */}
        {/*<img
          className="w-[1442.8px] absolute bottom-[1.03px] left-[calc(50%_-_721.41px)] h-[47.3px] z-[2]"
          alt=""
          src="/images/Vector 31.svg"
        />*/}
      </div>
    </div>
  );
}