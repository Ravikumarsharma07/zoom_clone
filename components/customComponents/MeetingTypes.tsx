"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { useSession } from "next-auth/react";
import {
  Call,
  useCall,
  useStreamVideoClient,
} from "@stream-io/video-react-sdk";
import { useToast } from "@/hooks/use-toast";
import { Input } from "../ui/input";
import { nanoid } from "nanoid";
import { Description } from "@radix-ui/react-dialog";
import { Textarea } from "../ui/textarea";
import DatePicker from "react-datepicker";

const MeetingTypesCard = ({
  icon,
  bgColor,
  heading,
  description,
  handleClick,
}: {
  icon: string;
  bgColor: string;
  heading: string;
  description: string;
  handleClick: () => void;
}) => {
  return (
    <div
      onClick={handleClick}
      className={`${bgColor} h-[200px] sm:h-[240px] rounded-lg px-4 py-6 flex flex-col justify-between cursor-pointer`}
    >
      <div className="text-white w-max p-2 bg-[#c0c0c062] rounded-md">
        <Image src={icon} width={27} height={27} alt="meeting types icon" />
      </div>
      <div>
        <h3 className="text-[#e6e6e6] font-semibold text-lg sm:text-xl ">{heading}</h3>
        <p className="text-[#cccccc] text-sm sm:text-lg">{description}</p>
      </div>
    </div>
  );
};


const MeetingTypes = () => {
  const { toast } = useToast();
  const [isCallingState, setIsCallingState] = useState<
    "isInstantMeeting" | "isJoiningMeeting" | "isScheduleMeeting" | undefined
  >();
  const router = useRouter();

  const { data: session } = useSession();
  const user = session?.user;
  const client = useStreamVideoClient();

  const [values, setValues] = useState({
    dateTime: new Date(),
    description: "",
    link: "",
  });
  const [callDetails, setCallDetails] = useState<Call>();

  const [roomId, setRoomId] = useState("");

  const joinMeeting = () => {
    if (!client) {
      toast({
        title: "user not registered",
        description: "Error occured",
        variant: "destructive",
      });
      return;
    }
    router.push(`/meeting/${roomId}`);
  };

  const [meetingLink, setMeetingLink] = useState('')

  const createMeeting = async () => {
    if (!user || !client) {
      toast({
        title: "user is not registered",
        description: "login before starting a call",
        variant: "destructive",
      });
      return;
    }

    try {
      const id = nanoid();
      const call = client.call("default", id);
      if (!call) {
        toast({
          title: "error in starting meeting",
        });
        return;
      }

      const startsAt =
        values.dateTime.toISOString() || new Date(Date.now()).toISOString();
      const description = values.description;
      await call.getOrCreate({
        data: {
          starts_at: startsAt,
          custom: {
            description,
          },
        },
      });
      setCallDetails(call);
      setMeetingLink(`${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${call.id}`)
      if (!values.description) {
        router.push(`/meeting/${call.id}`);
      }
      toast({
        title: "Meeting Created",
      });
    } catch (error) {
      toast({title:"Error occured", description:"Error occured while creating meeting", variant:"destructive"})
    }
  };




  return (
    <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <MeetingTypesCard
        icon="/icons/add-meeting.svg"
        bgColor="bg-orange-500"
        heading="New Meeting"
        description="Starts an instant meeting"
        handleClick={() => setIsCallingState("isInstantMeeting")}
      />
      <MeetingTypesCard
        icon="/icons/join-meeting.svg"
        bgColor="bg-blue-500"
        heading="Join Meeting"
        description="Join a meeting via link"
        handleClick={() => setIsCallingState("isJoiningMeeting")}
      />
      <MeetingTypesCard
        icon="/icons/schedule.svg"
        bgColor="bg-purple-500"
        heading="Schedule Meeting"
        description="Plan your meeting"
        handleClick={() => setIsCallingState("isScheduleMeeting")}
      />
      <MeetingTypesCard
        icon="/icons/recordings.svg"
        bgColor="bg-[#F9A90E]"
        heading="View Recordings"
        description="Meeting recordings"
        handleClick={() => router.push("/Recordings")}
      />

      {/* confirmation dialog for creating a call   */}
      <Dialog
        open={isCallingState === "isInstantMeeting"}
        onOpenChange={() => setIsCallingState(undefined)}
      >
        <DialogContent className="w-full w-max-[500px] py-5">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl mb-5">
              Start an instant meeting
            </DialogTitle>
            <Button
              onClick={createMeeting}
              className="bg-blue-500 hover:bg-blue-700 text-white text-lg w-full"
            >
              Create Meeting
            </Button>
          </DialogHeader>
          <Description></Description>
        </DialogContent>
      </Dialog>

      {/* confirmation dialog for joining a call   */}
      <Dialog
        open={isCallingState === "isJoiningMeeting"}
        onOpenChange={() => setIsCallingState(undefined)}
      >
        <DialogContent className="w-full w-max-[500px] py-5">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl mb-5">
              Enter meeting id to join meeting
            </DialogTitle>
            <Input
              type="text"
              placeholder="Room id"
              value={roomId}
              onChange={(e) => {
                setRoomId(e.target.value);
              }}
            />
            <Button
              onClick={joinMeeting}
              className="bg-blue-500 hover:bg-blue-700 text-white text-lg w-full"
            >
              Join Meeting
            </Button>
          </DialogHeader>
        </DialogContent>
      </Dialog>


      {/* confirmation dialog for Scheduling a call   */}
      {!callDetails ? (
        <Dialog
          open={isCallingState === "isScheduleMeeting"}
          onOpenChange={() => setIsCallingState(undefined)}
        >
          <DialogContent className="w-full w-max-[500px] py-5">
            <DialogHeader>
              <DialogTitle className="text-center text-2xl mb-5">
                Create Meeting
              </DialogTitle>
              <p>Description</p>
              <Textarea
              value={values.description}
                onChange={(e: any) =>
                  setValues({ ...values, description: e.target.value })
                }
                className="border-none outline-none bg-dark-1"
              />
              <br></br>
              Select date and time
              <DatePicker
                dateFormat="MMM d, yyyy h:mm aa"
                timeIntervals={15}
                timeCaption="time"
                showTimeSelect
                selected={values.dateTime}
                onChange={(date: any) =>
                  setValues({ ...values, dateTime: date! })
                }
                className="w-full h-10 bg-dark-1 border-[px] border-white rounded-md text-white outline-none"
              />
              <br />
              <Button
                onClick={createMeeting}
                className="bg-blue-500 hover:bg-blue-700 text-white text-lg w-full"
              >
                Schedule Meeting
              </Button>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      ) : (
        <Dialog
          open={isCallingState === "isScheduleMeeting"}
          onOpenChange={() => setIsCallingState(undefined)}
        >
          <DialogContent className="w-full w-max-[500px] py-5">
            <DialogHeader>
              <DialogTitle className="flex-col-center gap-4 mb-5">
              <img src="/icons/checked.svg" alt="copy icon" className="w-16"/>
              <p className="text-2xl font-semibold">Meeting Created</p>
              </DialogTitle>
              <Button
                onClick={()=>{
                  navigator.clipboard.writeText(meetingLink) 
                  toast({title:"Link cpoied"})
                }}
                className="bg-blue-500 hover:bg-blue-700 text-white text-lg w-full"
              >
                <img src="/icons/copy.svg" alt="copy icon" className="w-7"/> Copy meeting link
              </Button>              
            </DialogHeader>
          </DialogContent>
        </Dialog>
      )}
    </section>
  );
};

export default MeetingTypes;
