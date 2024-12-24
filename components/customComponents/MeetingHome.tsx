"use client";
import { useGetCallById } from "@/hooks/useGetCallById";
import {
  StreamCall,
  StreamTheme,
} from "@stream-io/video-react-sdk";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import MeetingRoom from "./MeetingRoom";
import MeetingSetUp from "./MeetingSetUp";
import { useToast } from "@/hooks/use-toast";

const MeetingHome = (meetingId:{id:string}) => {
  const {id} = meetingId;
    const [isSetUpComplete, setIsSetUpComplete] = useState(false);
    const { call, isCallLoading } = useGetCallById(id);
    const {toast} = useToast()
    useEffect(() => {

      return  () => {
        call?.leave();
      };
    }, [call]);
    if (isCallLoading || !call) {
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
              <MeetingRoom meetingId={id} setIsSetUpComplete={setIsSetUpComplete} />
            ) : (
              <MeetingSetUp meetingId={id} setIsSetUpComplete={setIsSetUpComplete} />
            )}
          </StreamTheme>
        </StreamCall>
      </main>
    );
}

export default MeetingHome
