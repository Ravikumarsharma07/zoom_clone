"use client";
import { useCall, VideoPreview } from "@stream-io/video-react-sdk";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { useToast } from "@/hooks/use-toast";

const MeetingSetUp = ({
  meetingId,
  setIsSetUpComplete,
}: {
  setIsSetUpComplete: (value: boolean) => void;
  meetingId: string;
}) => {
  const [isMicCamToggledOn, setIsMicCamToggledOn] = useState(true);

  const { toast } = useToast();
  const call = useCall();
  const [isMediaAvailable, setIsMediaAvailable] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      setIsMediaAvailable(true);
    }, 2000);
  }, []);

  useEffect(() => {
    if (!isMicCamToggledOn) {
      call?.camera.disable();
      call?.microphone.disable();
    } else {
      call?.camera.enable();
      call?.microphone.enable();
    }
  }, [isMicCamToggledOn, call?.camera, call?.microphone]);
  return (
    <div className="flex-center flex-col gap-4 w-full sm:w-[600px] ">
      <div
        className="absolute top-3 right-1 sm:right-3 max-sm:scale-75 z-50"
        onClick={() => {
          navigator.clipboard.writeText(`${meetingId}`);
          toast({ title: "ID copied" });
        }}
      >
        <Button>
          <img src="/icons/copy.svg" alt="copy icon" /> Copy meeting id
        </Button>
      </div>
      <h1 className="text-white font-semibold text-3xl">Set up</h1>
      <div className="w-max max-sm:scale-75">
      {isMediaAvailable && <VideoPreview />}
      </div>
      <label>
        <input
          type="checkbox"
          onChange={(e) => setIsMicCamToggledOn(e.target.checked)}
          checked={isMicCamToggledOn}
        />
        <> </>Join with mic and camera on
      </label>
      <Button
        className="bg-green-600 hover:bg-green-800 font-semibold px-2 w-[150px]"
        onClick={() => {
          call?.join();
          setIsSetUpComplete(true);
        }}
      >
        Join
      </Button>
    </div>
  );
};

export default MeetingSetUp;
