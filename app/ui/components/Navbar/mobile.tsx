"use client";
import { useState } from 'react';
import { usePathname, redirect } from 'next/navigation';
import { redirectToLogin } from '@/app/lib/auth';
import NavLink from "./navlink";
import Link from 'next/link';
import { useSharedState } from '@/app/ui/components/SharedState/Context';
import Loading from '@/app/ui/components/Loading';

export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { sharedState } = useSharedState();
  const [loading, setLoading] = useState(false);

  // Function to toggle the menu open/close state
  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const currPath = usePathname();
  const loginRedirect = (e:any)=>{
      e.preventDefault()
      if (sharedState?.session?.username) {
        setLoading(true);
        return redirect('/profile');
      };
      redirectToLogin(currPath)
  }

  return (
    <>
    <div className='w-full relative bg-white py-[20px] box-border text-center text-base text-black font-noto-sans border-b-[1px] border-black border-solid z-10'>
      <div className='inner relative w-full mx-auto px-[20px] lg:px-[80px] xl:px-[40px] xxl:px-[80px] box-border flex flex-row items-center justify-between'>
          <Link href='/'>
            <img
              className='w-[50px]'
              alt='UNDP logo'
              src='/images/undp-logo.svg'
            />
          </Link>
          <p className='ml-[20px] mr-auto mb-0'>SDG Commons</p>

          {/* Toggle between menu icons */}
          <div
            className="flex flex-col items-center justify-start p-[13px] cursor-pointer"
            onClick={(e) => toggleMenu()}
          >
            <div className="flex flex-col items-center justify-start">
              {/* Conditionally show the appropriate icon */}
              <img
                className='relative'
                alt='menu toggle'
                src={isMenuOpen ? '/images/menu-burger-close.png' : '/images/menu-burger-green.svg'}
              />
            </div>
          </div>
        </div>

      {/* Conditionally show the menu content */}
      {isMenuOpen && (
        <div className="self-stretch flex flex-col items-start justify-start z-[2]">
          <NavLink />
          <div className="self-stretch flex flex-col items-start justify-center py-10 px-8 gap-10 text-center text-[16px]">
            {/* <img
              className="w-[40.7px] relative h-[37.2px] object-cover"
              alt=""
              src="/images/gtranslate.svg"
            /> */}
            <Link href={'/search/all'}>
              <img className="w-[40.7px] relative h-[37.2px] object-cover" alt="Search" src="/images/search.svg" />
            </Link>
            {sharedState?.session?.username ? <>
              <button onClick={loginRedirect} className='no-underline text-black bottom-0 bg-inherit'>
                <span className="leading-[38px] text-[12px] cursor-pointer bg-lime-yellow px-5 py-5">
                  Welcome {sharedState?.session?.username || ''}
                </span>
              </button>
            </>
              : <>
                <button onClick={loginRedirect} className="w-[143.1px] relative h-[51.3px]">
                  <div className="absolute top-[0px] left-[0px] bg-lime-yellow w-[143.1px] h-[51.3px]" />
                  <b className="absolute top-[15px] left-[22px] leading-[21px] inline-block w-[98.9px] h-[21px]">
                    Login
                  </b>
                </button>
              </>
            }
          </div>
        </div>
      )}
    </div>
    <Loading isLoading={loading} />
        </>
  );
}
