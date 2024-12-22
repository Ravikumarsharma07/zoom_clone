"use client";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react";
import { useToast } from "./use-toast";
import { useRouter } from "next/navigation";

export const useGetCallById = (id: string | string[]) => {
  const [call, setCall] = useState<Call>();
  const [isCallLoading, setIsCallLoading] = useState(true);
  const { toast } = useToast();
  const client = useStreamVideoClient();
  const router = useRouter();

  useEffect(() => {
    if (!client) {
      toast({
        title: "Error in creating meeting",
        description: "client not found",
        variant: "destructive",
      });
      router.push("/");
      return;
    }

    const loadCall = async () => {
      try {
        
      } catch (error) {
        
      }
      const { calls } = await client.queryCalls({
        filter_conditions: {
          id,
        },
      });
      if (calls.length > 0) {
        setCall(calls[0]);
      } else {
        toast({
          title: "No call found with this room id",
          variant: "destructive",
        });
        router.push("/");
        return;
      }
    };
    setIsCallLoading(false);
    loadCall();
  }, [client, id]);  
  return { call, isCallLoading };
};
