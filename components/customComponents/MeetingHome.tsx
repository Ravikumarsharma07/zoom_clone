"use client";
import { useGetCallById } from "@/hooks/useGetCallById";
import {
  StreamCall,
  StreamTheme,
  useStreamVideoClient,
} from "@stream-io/video-react-sdk";
import { Loader2 } from "lucide-react";
import React, { useState } from "react";
import MeetingRoom from "./MeetingRoom";
import MeetingSetUp from "./MeetingSetUp";

const MeetingHome = (meetingId:any) => {
  const {id} = meetingId;
    const [isSetUpComplete, setIsSetUpComplete] = useState(false);
    const { call, isCallLoading } = useGetCallById(id);
  
    const client = useStreamVideoClient();
  
    if (isCallLoading || !client || !call) {
      return (
        <div className="h-screen w-full flex-center text-white">
          <Loader2 className="animate-spin" height={60} width={60} />
        </div>
      );
    }
  
    return (
      <main className="h-max w-full flex-center flex-col gap-5 text-white ">
        <StreamCall call={call}>
          <StreamTheme className="flex-center">
            {isSetUpComplete ? (
              <MeetingRoom meetingId={id} />
            ) : (
              <MeetingSetUp meetingId={id} setIsSetUpComplete={setIsSetUpComplete} />
            )}
          </StreamTheme>
        </StreamCall>
      </main>
    );
}

export default MeetingHome
