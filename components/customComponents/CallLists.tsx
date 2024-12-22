//@ts-nocheck
"use client";
import { useGetCalls } from "@/hooks/useGetCalls";
import { Call, CallRecording } from "@stream-io/video-react-sdk";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { useToast } from "@/hooks/use-toast";
import { avatar } from "@/constants";

const CallLists = ({ type }: { type: "upcoming" | "recordings" | "ended" }) => {
  const { endedCalls, upcomingCalls, recordings, isLoading } = useGetCalls();
  const [meetingRecordings, setMeetingRecordings] = useState([]);
  const router = useRouter();

  const { toast } = useToast();

  const getCalls = () => {
    switch (type) {
      case "ended":
        return endedCalls;
      case "recordings":
        return meetingRecordings;
      case "upcoming":
        return upcomingCalls;
    }
  };
  const getCallMessage = () => {
    switch (type) {
      case "ended":
        return "no previous calls";
      case "recordings":
        return "No recordings";
      default:
        return "No upcoming calls";
    }
  };

  let icon = "";
  if (type === "upcoming") {
    icon = "/icons/upcoming.svg";
  } else if (type === "ended") {
    icon = "/icons/previous.svg";
  } else {
    icon = "/icons/recordings.svg";
  }

  useEffect(() => {
    const fetchRecordings = async () => {
      try {
        const callData = await Promise.all(recordings.map((meeting) => meeting.queryRecordings()) ?? []);
        const callRecordings = callData
        .filter((call) => call.recordings.length > 0)
        .flatMap((call) => call.recordings);
        
        setMeetingRecordings(callRecordings);
      } catch (error) {
        toast({ title: "Failed to fetch recordings, try again", variant:"destructive" });
      }
    };
      if (type === "recordings") {
        fetchRecordings();
      }
  }, [type, recordings]);

  if (isLoading) {
    return (
      <div className="h-screen w-full flex-center text-white">
        <Loader2 className="animate-spin" height={60} width={60} />
      </div>
    );
  }

  const calls = getCalls();
  const noCallMessage = getCallMessage();

  return (
    <div className="text-white grid grid-cols-1 lg:grid-cols-2 gap-4">
      {calls.length > 0 ? (
        calls.map((meeting: Call | CallRecording | any) => {
          return (
            <div
              className="p-4 flex flex-col bg-dark-1 rounded-lg gap-2"
              key={meeting.id || meeting.url}
            >
              <img src={icon} alt={`${type} icon`} className="w-6" />
              <h3 className="text-2xl font-semibold">
                {meeting.state?.custom?.description.substring(0, 30) ||
                meeting.filename?.substring(0,25) ||
                  "No description"}{" "}
              </h3>
              <p className="text-sm opacity-90">
                Start time: {meeting.state?.startsAt?.toLocaleString() || meeting.start_time?.toLocaleString()}
                {type === "ended" &&
                  ` -- End time: ${meeting.state?.endedAt$?.source?._value?.toLocaleString()}`}
              </p>
              <div className="flex justify-between items-center">
                {type !== "recordings" && (
                  <div className="grid grid-flow-col w-[140px] overflow-visible">
                    {avatar.map((avt, index) => {
                      return (
                        <img
                          key={index}
                          src={avt.src}
                          alt="avatar"
                          className="w-8 h-8 rounded-full"
                        />
                      );
                    })}
                  </div>
                )}

                {type === "upcoming" && (
                  <div className="flex gap-2 mt-2">
                    <Button
                      className="bg-blue-500 hover:bg-blue-700"
                      onClick={() => router.push(`/meeting/${meeting.id}`)}
                    >
                      Start
                    </Button>
                    <Button
                      onClick={() => {
                        navigator.clipboard.writeText(
                          `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${meeting.id}`
                        );
                        toast({ title: "Link copied" });
                      }}
                    >
                      <img src="/icons/copy.svg" alt="play icon" width={14} />{" "}
                      Copy invitaion link
                    </Button>
                  </div>
                )}

                {type === "recordings" && (
                  <div className="w-full grid gap-2 grid-cols-2 mt-2">
                    <Button
                      className="bg-blue-500 hover:bg-blue-700 w-full"
                      onClick={() => router.push(`${(meeting as CallRecording).url}`)}
                    >
                      <img src="/icons/play.svg" alt="play icon" width={12} />{" "}
                      Play
                    </Button>
                    <Button
                      className="w-full"
                      onClick={() => {
                        navigator.clipboard.writeText(meeting.url);
                        toast({ title: "Link copied" });
                      }}
                    >
                      <img src="/icons/share.svg" alt="play icon" width={12} />{" "}
                      Share{" "}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          );
        })
      ) : (
        <p>{noCallMessage}</p>
      )}
    </div>
  );
};

export default CallLists;
