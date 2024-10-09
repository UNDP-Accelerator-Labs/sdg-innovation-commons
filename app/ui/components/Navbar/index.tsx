"use client";

import NavBar from './mobile'; // Mobile navbar
import DesktopNavBar from './desktop'; // Desktop navbar

export default function ResponsiveNavBar() {
  return (
    <>
      {/* Mobile Navbar: Display on small screens */}
      <div className="block lg:hidden">
        <NavBar />
      </div>

      {/* Desktop Navbar: Display on medium and larger screens */}
      <div className="hidden lg:block">
        <DesktopNavBar />
      </div>
    </>
  );
}
