"use client";
import {
  CallControls,
  CallingState,
  SpeakerLayout,
  useCall,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import { Loader2 } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

const MeetingRoom = (meetingId: { meetingId: string }) => {
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

  const leaveMeeting = async () => {
    await call?.endCall();
    router.push("/");
  };

  if (callingState !== CallingState.JOINED) {
    return (
      <div className="h-screen w-full flex-center text-white">
        <Loader2 className="animate-spin" height={60} width={60} />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen h-max w-full flex-col-center lg:p-20 bg-dark-1 ">
      <div
        className="absolute top-3 right-3 max-sm:scale-75"
        onClick={() => {
          navigator.clipboard.writeText(`${meetingId}`);
          toast({ title: "ID copied" });
        }}
      >
        <Button>
          <img src="/icons/copy.svg" alt="copy icon" /> Copy meeting id
        </Button>
      </div>
      <div className="w-10/12 ">
        <SpeakerLayout participantsBarPosition="right" />
      </div>
      <div className="flex-center gap-2 flex-wrap">
        <CallControls onLeave={leaveMeeting} />
        {isMeetingOwner && (
          <Button
            className="bg-red-600 hover:bg-red-700 rounded-xl"
            onClick={callEnd}
          >
            End call for everyone
          </Button>
        )}
      </div>
    </div>
  );
};

export default MeetingRoom;
