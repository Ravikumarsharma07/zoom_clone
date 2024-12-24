"use client";
import {
  CallControls,
  CallingState,
  SpeakerLayout,
  useCall,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import { Loader2 } from "lucide-react";
import React, { useEffect } from "react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

const MeetingRoom = ({meetingId, setIsSetUpComplete} : {meetingId: string, setIsSetUpComplete:(value:boolean)=>void}) => {
  const id = meetingId;
  const call = useCall();
  const router = useRouter();
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();
  const { toast } = useToast();
  const isMeetingOwner = call?.isCreatedByMe;


  const callEnd = async () => {
    await call?.endCall();
    router.push("/");
  };

  const leaveMeeting = () => {
    call?.leave();
    router.push("/");
  };


  switch (callingState) {
    case CallingState.IDLE:
      call?.join()
      break;
    case CallingState.JOINING:
      return (
        <div className="h-screen w-full flex-center flex-col gap-4 text-white">
          <Loader2 className="animate-spin" height={60} width={60} />
        </div>
      );
  }

  return (
    <div className="relative sm:min-h-screen max-sm:min-h-screen h-max w-full flex-col-center max-sm:pt-16 lg:p-20 lg:px-28 bg-dark-2 ">
      <div
        className="absolute top-3 right-3 max-sm:scale-75"
        onClick={() => {
          navigator.clipboard.writeText(`${id}`);
          toast({ title: "ID copied" });
        }}
      >
        <Button>
          <img src="/icons/copy.svg" alt="copy icon" /> Copy meeting id
        </Button>
      </div>
      <div className="w-10/12 flex-center sm:mt-10">
        <SpeakerLayout participantsBarPosition={window.innerWidth > 700 ? "right" : "bottom"} />
      </div>
      <div className="flex-center gap-2 flex-wrap">
        <CallControls onLeave={leaveMeeting}  />
        {isMeetingOwner && (
          <Button
            className="bg-red-600 hover:bg-red-700 rounded-xl"
            onClick={callEnd}
          >
            End call
          </Button>
        )}
      </div>
    </div>
  );
};

export default MeetingRoom;
