"use client";
import { sidebarLinks } from "@/constants";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import "./../../public/icons/Home.svg"
import { cn } from "@/lib/utils";

const Sidebar = () => {

  const pathname = usePathname();

  return (
    <section className="sticky left-0 top-0 w-fit lg:w-[264px] px-4  pt-20 bg-dark-1 h-screen max-sm:hidden">
      <div className="flex flex-col pt-8 gap-2">
        {sidebarLinks.map((link) => {
          const isActive = pathname === link.route || pathname.startsWith(`${link.route}/`)  
          return (
            <Link
            
              href={link.route}
              key={link.label}
              className={cn("text-white text-lg rounded-lg px-2 py-3 flex items-center gap-4",{'bg-blue-600':isActive,})}
            >
              <Image 
              src={link.imageURL}
              alt="nav-icons"
              height={24}
              width={24}
              />
              <p className="text-lg max-md:hidden">
                {link.label}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default Sidebar;
