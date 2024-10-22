"use client"; 

import { useState } from "react";
import NavLink from "./navlink";

export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Function to toggle the menu open/close state
  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <div className="w-full relative bg-white border-black border-b-[1px] border-solid box-border overflow-hidden flex flex-col items-center justify-start text-left text-lg text-black">
      <div className="self-stretch border-black border-b-[1px] border-solid flex flex-row items-center justify-between pt-10 px-5 pb-5 z-[1]">
        <div className="flex flex-row items-start justify-start">
          <img
            className="w-[49.8px] relative h-[97.9px]"
            alt=""
            src="/images/undp-logo.svg"
          />
        </div>


        {/* Toggle between menu icons */}
        <div
          className="flex flex-col items-center justify-start p-[13px] cursor-pointer"
          onClick={toggleMenu}
        >
          <div className="flex flex-col items-center justify-start">
            {/* Conditionally show the appropriate icon */}
            <img
              className="relative"
              alt="menu toggle"
              src={isMenuOpen ? "images/menu-burger-close.png" : "images/menu-burger-green.svg"}
            />
          </div>
        </div>
      </div>

      {/* Conditionally show the menu content */}
      {isMenuOpen && (
        <div className="self-stretch flex flex-col items-start justify-start z-[2] grid-background">
          <NavLink />
          <div className="self-stretch flex flex-col items-start justify-center py-10 px-8 gap-10 text-center text-[16px]">
            <img
              className="w-[40.7px] relative h-[37.2px] object-cover"
              alt=""
              src="/images/gtranslate.svg"
            />
            <button className="w-[143.1px] relative h-[51.3px]">
              <div className="absolute top-[0px] left-[0px] bg-lime-yellow w-[143.1px] h-[51.3px]" />
              <b className="absolute top-[15px] left-[22px] leading-[21px] inline-block w-[98.9px] h-[21px]">
                Login
              </b>
            </button>
          </div> 
        </div>
      )}
    </div>
  );
}
