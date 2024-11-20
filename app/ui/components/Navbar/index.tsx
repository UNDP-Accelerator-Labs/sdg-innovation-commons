"use client";
import { useEffect, useState  } from 'react';
import { sess } from './navlink';
import NavBar from './mobile'; // Mobile navbar
import DesktopNavBar from './desktop'; // Desktop navbar
import clsx from 'clsx';

export default function ResponsiveNavBar() {

  // FOR HIDING THE NAVBAR ON SCROLL
  const [position, setPosition] = useState(0);
  const [visible, setVisible] = useState(true);
  const [session, setSess] = useState<any>({});


  const handleScroll = () => {
     let moving = window.pageYOffset
     
     setVisible(position > moving);
     setPosition(moving)
  };

  useEffect(() => {
    async function fetchData() {
      const data = await sess();
      setSess(data)
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
      <div className="block lg:hidden">
        <NavBar session={session} />
      </div>

      {/* Desktop Navbar: Display on medium and larger screens */}
      <div className={clsx('navbar hidden lg:block z-[100] fixed w-[100%] top-0', cls)}>
        <DesktopNavBar session={session} />
      </div>
    </>
  );
}
