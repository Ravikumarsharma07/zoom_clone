'use client'
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { useToast } from "./use-toast"


export const useGetCalls = () =>{
    const [calls, setCalls] = useState<Call[]>([])
    const client = useStreamVideoClient()
    const [isLoading, setIsLoading] = useState(false)
    const {data:session} = useSession()
    const user = session?.user
    const {toast} = useToast()
    
    useEffect(()=>{
        const loadCalls = async () => {
            if(!user || !client) {
                toast({title: 'User not found' , variant:"destructive"})
                return
            }
            setIsLoading(true)

            try {
                const {calls} = await client.queryCalls({
                    sort:[{field:'starts_at', direction:-1}],
                    limit:10,
                    filter_conditions:{
                        starts_at:{$exists:true},
                        $or:[
                            {created_by_user_id:user.email},
                            {members:{$in:[user.email]}}
                        ]
                    }
                })
                setCalls(calls)
            } catch (error) {
                console.log(error)
            }finally{
                setIsLoading(false)
            }
        }
        loadCalls()
    },[client, user?._id])

    const now = new Date()
    const endedCalls = calls.filter(({state:{startsAt}}:Call)=>{
        return startsAt && new Date(startsAt) < now
    })
    const upcomingCalls = calls.filter(({state:{startsAt}}:Call)=>{
        return startsAt && new Date(startsAt) > now
    })
    return {recordings:calls, endedCalls, upcomingCalls, isLoading}
}