"use client";
import Image from "next/image";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { MenuIcon } from "lucide-react";
import MobileNav from "./MobileNav";
import { UserProfile } from "./UserProfile";

const Navbar = () => {
  const [isNavbarActive, setIsNavbarActive] = useState(false);
  const handleClick = () => {
    setIsNavbarActive(!isNavbarActive);
  };
  return (
    <div className="fixed top-0 z-50 w-full">
      <div className="absolute left-0 top-0 sm:hidden">
        <MobileNav
          isNavbarActive={isNavbarActive}
          handleClick={handleClick}
        />
      </div>

      <nav
        className={`transition-all w-full flex justify-between px-4 sm:px-10 py-4 bg-dark-1`}
      >
        <div className="text-white flex items-center text-3xl font-semibold gap-1">
          <Image src="/icons/logo.svg" alt="logo" width={48} height={48} />
          <p className="max-sm:hidden">YOOM</p>
        </div>


        <div className="flex-center md:mr-4 gap-2 cursor-pointer text-black">

          {/* this is for small devices */}
          <Button
            onClick={handleClick}
            className="bg-dark-1 text-white sm:hidden"
          >
            <MenuIcon className="bg-dark-1 mt-2 text-white scale-[2]" />
          </Button>
          <UserProfile />          
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
