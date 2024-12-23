"use client";
import { sidebarLinks } from "./../../constants"
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { cn } from "@/lib/utils";

const MobileNav = ({handleClick, isNavbarActive}:{handleClick:()=>void, isNavbarActive:boolean}) => {

  const pathname = usePathname();
  return (
    <section className={`transition-all duration-200 ease-linear sticky top-0  p-4 bg-dark-1 h-screen sm:hidden z-50 left-0 ${isNavbarActive ? "visible w-[264px]" : "hidden w-[2px]"}`}>
      <div className="text-white flex items-center justify-between gap-1">
        <div className="flex items-center text-2xl">
          <Image src="/icons/logo.svg" alt="logo" width={40} height={48} />
          <p>YOOM</p>
        </div>
        <div className="text-5xl font-thin rotate-45 cursor-pointer" onClick={handleClick}>+</div>
      </div>
      <div className="flex flex-col pt-8 gap-2">
        {sidebarLinks.map((link) => {
          const isActive =
            pathname === link.route;
          return (
            <Link
            onClick={handleClick}
              href={link.route}
              key={link.label}
              className={cn(
                "text-white text-lg rounded-lg px-2 py-3 flex items-center gap-4",
                { "bg-blue-600": isActive }
              )}
            >
              <Image
                src={link.imageURL}
                alt="nav-icons"
                height={24}
                width={24}
              />
              <p className="text-lg">{link.label}</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default MobileNav;
