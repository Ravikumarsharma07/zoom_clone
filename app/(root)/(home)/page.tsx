"use client";
import MeetingTypes from "@/components/customComponents/MeetingTypes";
import { useGetCalls } from "@/hooks/useGetCalls";
import React, { useEffect, useState } from "react";

const Page = () => {

  const [time,setTime] = useState(new Date().toLocaleTimeString("en-IN", {hour:"2-digit",minute:'2-digit'}));

  let now =  new Date()
  const date = (new Intl.DateTimeFormat("en-IN", {dateStyle:'full'})).format(now)
  
  const updateTime = () => {
    setInterval(() => {
      setTime(new Date().toLocaleTimeString("en-IN", {hour:"2-digit",minute:'2-digit'}));
    }, 1000 * 60);
  };

  useEffect(() => {
    updateTime();
  }, []);
  
  const {upcomingCalls, isLoading} = useGetCalls();
  const upcomingMeeting = upcomingCalls[0];
  //@ts-expect-error
  const meetingTime = upcomingMeeting?.state?.startsAt$?.source?._value.toLocaleString("en-IN")
  return (

    <section className="w-full min-h-screen h-max pt-8 sm:px-2 flex flex-col gap-5 ">
      <div className="bg-hero-section h-[200px] sm:h-[220px] px-5 sm:px-10 rounded-xl py-7 flex flex-col justify-between">
        <h3 className=" text-[#e0e0e0] text-[14px] rounded-sm w-max p-[4px] bg-dark-1">
          {meetingTime ? `Upcoming meeting at : ${meetingTime}` : "No upcoming meeting"}
        </h3>
        <div>
          <p className="text-4xl text-white font-bold">{time}</p>
          <p className="text-[#e0e0e0] text-[16px] pl-1 pt-1">{date}</p>
        </div>
      </div>
    <MeetingTypes/>
    </section>
  );
};

export default Page;
