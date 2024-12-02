"use client";
import { useEffect, useState  } from 'react';
import { sess } from './navlink';
import NavBar from './mobile'; // Mobile navbar
import DesktopNavBar from './desktop'; // Desktop navbar
import clsx from 'clsx';
import { useSharedState } from '@/app/ui/components/SharedState/Context';
import { is_user_logged_in } from '@/app/lib/session';

export default function ResponsiveNavBar() {

  // FOR HIDING THE NAVBAR ON SCROLL
  const [position, setPosition] = useState(0);
  const [visible, setVisible] = useState(true);
  const { setSharedState } = useSharedState();

  const handleScroll = () => {
     let moving = window.pageYOffset
     
     setVisible(position > moving);
     setPosition(moving)
  };

  useEffect(() => {
    async function fetchData() {
      const data = await sess();
      const isValidUser = await is_user_logged_in()
      setSharedState((prevState: any) => ({
          ...prevState, 
          isLogedIn: isValidUser,
          session: data
      }));
    }

    fetchData();
  },[]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return(() => {
       window.removeEventListener('scroll', handleScroll);
    });
  });

  const cls = visible ? 'movein' : 'moveout';

  return (
    <>
      {/* Mobile Navbar: Display on small screens */}
      <div className={clsx('navbar lg:hidden z-[100] fixed w-[100%] top-0', cls)}>
        <NavBar/>
      </div>

      {/* Desktop Navbar: Display on medium and larger screens */}
      <div className={clsx('navbar hidden lg:block z-[100] fixed w-[100%] top-0', cls)}>
        <DesktopNavBar/>
      </div>
    </>
  );
}
