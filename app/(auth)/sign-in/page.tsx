"use client";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import React, { useState } from "react";
import { Form, FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import Link from "next/link";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

// import { Google } from "@mui/icons-material";

const signInSchema = z.object({
  email: z.string({message:"can not be empty"}),
  password: z.string(),
});

const page = () => {
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const {toast} = useToast()
  async function onSubmit(data: z.infer<typeof signInSchema>) {
    setIsSubmitting(true)
    try {
      const response = await signIn("credentials", {
        redirect:false,
        email:data.email,
        password:data.password
      })
      if(!response?.ok){
        toast({
          title:response?.error as string + ". try again",
          description:"",
          variant:'destructive'
        })
        return
      }
      router.push("/")

    } catch (error:any) {
      console.log(error)
      toast({
        title:"unexpected error occured while sign in",
        variant:'destructive'
      })
      
    }finally{
      setIsSubmitting(false)
    }
  }

  return (
    <div className="h-screen w-full bg-dark-2  flex-center text-white">
      <div className="h-[530px] w-[420px] shadow-lg flex flex-col  items-center gap-4 bg-dark-1 p-10 rounded-xl">
        <h1 className="text-2xl font-semibold">Sign In</h1>
        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-5 w-full pt-2"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting} className="w-full h-10 rounded-xl text-lg">
        {
          isSubmitting ? (<><Loader2 className="animate-spin mr-2" />Please wait</>) : ("Sign In")
        }
        </Button> 
          </form>
        </FormProvider>
        <p>Or</p>
        <Button
          onClick={() => signIn("google")}
          className="bg-white text-black text-lg hover:bg-[#cecece] w-full h-10 rounded-xl"
        >
          {/* <Google /> */}
          <img src="/images/google-logo.png" width={28} alt="google logo"></img>
          Sign in with Google
        </Button>
        <p>Don't have accout ? 
        <Link href='/sign-up' className="text-blue-600"> Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default page;
