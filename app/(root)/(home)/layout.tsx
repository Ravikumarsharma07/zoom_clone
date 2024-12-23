
import Navbar from "@/components/customComponents/Navbar";
import React, { ReactNode } from "react";
import Sidebar from "@/components/customComponents/Sidebar";

const HomeLayout = ({ children }: { children: ReactNode }) => {
  return (
    <main className="">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <section className="w-full bg-dark-2 pt-[5.2rem] pb-12 px-4 sm:px-8">
        {children}
        </section>
      </div>
    </main>
  );
};

export default HomeLayout;
