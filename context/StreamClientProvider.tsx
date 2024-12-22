"use client";

import tokenProvider from "@/actions/stream.actions";
import { useToast } from "@/hooks/use-toast";
import {
  StreamVideo,
  StreamVideoClient,
} from "@stream-io/video-react-sdk";
import { useSession } from "next-auth/react";
import { ReactNode, useEffect, useState } from "react";
import { nanoid } from 'nanoid';

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;

const StreamVideoProvider = ({ children }: { children: ReactNode }) => {
  const { data: session } = useSession();
  const user = session?.user;

  const [videoClient, setVideoClient] = useState<StreamVideoClient | null>(null);
  const {toast} = useToast()
  
  useEffect(() => {
     const createStreamClient = async () => {   
      if (!user){
      toast({
        title:"unexpected error ",
        description:"user not logged in properly",
        variant:"destructive"
      })
      return
    }
    if (!apiKey) throw new Error("Stream API key is missing");
    
    const client = new StreamVideoClient(apiKey);
    const id = nanoid()

    if(!user?.email){
      throw new Error("email not found")
    }
    // Connect the user separately
    await client.connectUser(
      {
        id: user._id || id,
        name: user.name || user.username || "",
        image: user.image|| "",
      },
      tokenProvider // Provide a token provider function or token directly
    );
    setVideoClient(client);
  }
    createStreamClient();
  }, [user]);

  if (!videoClient) return null; // Avoid rendering until the client is ready
  
  return (
    <StreamVideo client={videoClient}>
      {children}
    </StreamVideo>
  );
};

export default StreamVideoProvider;
