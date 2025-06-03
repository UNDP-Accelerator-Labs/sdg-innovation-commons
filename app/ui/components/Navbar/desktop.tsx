"use client";
import Link from 'next/link';
import clsx from 'clsx';
import { navItems } from './navlink';
import { usePathname, redirect } from 'next/navigation';
import { redirectToLogin } from '@/app/lib/auth';
import { useSharedState } from '@/app/ui/components/SharedState/Context';
import Loading from '@/app/ui/components/Loading';
import { useState } from 'react';

export default function DesktopNavBar() {
  const currPath: string = usePathname();
  const currPathSplit: string[] = usePathname().split('/').filter((d: string) => d?.length).map((d: string) => decodeURI(d));
  const contentType = new Map();
  contentType.set('test', ['action plan', 'experiment']);
  contentType.set('see', ['solution']);

  const { sharedState } = useSharedState();
  const username = sharedState?.session?.username || null;

  const [loading, setLoading] = useState(false);

  const loginRedirect = (e: any) => {
    e.preventDefault();
    if (username) {
      setLoading(true);
      return redirect('/profile');
    }
    redirectToLogin(currPath);
  };

  return (
    <>
    <div className='w-full relative bg-white pt-[10px] pb-[10px] box-border text-center text-base text-black font-noto-sans border-b-[1px] border-black border-solid'>
      <div className='inner relative px-[20px] lg:px-[80px] xl:px-[40px] xxl:px-[80px] w-[375] md:w-[744px] lg:w-[992px] xl:w-[1200px] xxl:w-[1440px] mx-auto box-border'>
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
          <p className='ml-[100px] mr-auto mb-0 block lg:hidden xl:block'>SDG Commons</p>
          <div className='flex flex-row items-center justify-start gap-[26px]' key='desktop'>
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
              } else active = currHref[0] === currPathSplit[0];
              const { prefix, title, suffix } = link;

              return (
                <div key={index}>
                {index === 1 ? (
                  <span className='inline lg:hidden xl:inline xxl:hidden mr-[10px] text-light-gray-shade'>{prefix}-</span>
                ) : null}
                <Link href={link.href} passHref className='no-underline text-black'>
                  <span className={clsx('relative leading-[69px] text-[16px] cursor-pointer')}>
                    {active ? (
                      <b><span className='hidden xxl:inline'>{prefix} </span>{title}<span className='hidden xxl:inline'> {suffix}</span></b>
                    ) : (
                      <>
                      <span className='hidden xxl:inline'>{prefix} </span>{title}<span className='hidden xxl:inline'> {suffix}</span>
                      </>
                    )}
                  </span>
                </Link>
                </ div>
              );
            })}
            <Link href={'/search/all'}>
              <img className="w-[30px] relative h-[30px] object-cover" alt="Search" src="/images/search.svg" />
            </Link>

            {/* Login button */}
            {username ? (
              <button onClick={loginRedirect} className='cursor-pointer bg-lime-yellow h-[60px] px-[40px] font-bold font-space-mono text-[14px]'>
                Welcome {username.split(' ')[0]}
              </button>
            ) : (
              <button onClick={loginRedirect} className='cursor-pointer bg-lime-yellow h-[60px] px-[40px] font-bold font-space-mono text-[18px]'>
                Login
              </button>
            )}
          </div>
        </div>

        {/* Bottom vector image */}
        {/*<img
          className="w-[1442.8px] absolute bottom-[1.03px] left-[calc(50%_-_721.41px)] h-[47.3px] z-[2]"
          alt=""
          src="/images/Vector 31.svg"
        />*/}
      </div>
      <Loading isLoading={loading} />
    </div>
    </>
  );
}