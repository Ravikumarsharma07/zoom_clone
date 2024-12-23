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
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import Link from "next/link";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { ApiResponse } from "@/types/ApiResponse";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

const signUpSchema = z.object({
  // identifier can be username or Email
  username: z
    .string()
    .min(2, { message: "username must contain at least 2 characters" })
    .max(25, { message: "username should not be more than 15 characters" }),
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: "Password must contain atleast 8 characters" }),
});

const Page = () => {
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });


  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  async function onSubmit(data: z.infer<typeof signUpSchema>) {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>("/api/sign-up", data);
      console.log(response);
      toast({
        title: response.data.message,
        variant: response.data.success ? "default" : "destructive",
      });
      if (!response.data.success) {
        return;
      } else {
        const response = await signIn("credentials", {
          redirect: false,
          email: data.email,
          password: data.password,
        });
        router.push("/");
      }
    } catch (error: any) {
      toast({
        title: error.response.data.message,
        description: " error occured",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="h-screen w-full bg-dark-2 flex-center max-sm:pb-20 text-white">
      <div className="h-max w-[420px] shadow-lg flex flex-col  items-center gap-2 bg-dark-1 py-6 px-10 rounded-xl">
        <h1 className="text-2xl font-semibold">Sign Up</h1>
        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-5 w-full pt-7"
          >
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-10 rounded-xl text-lg"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin mr-2" />
                  Please wait
                </>
              ) : (
                "Sign Up"
              )}
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
          Sign up with Google
        </Button>
        <p className="mt-2">
          Already a member ?
          <Link href="/sign-in" className="text-blue-600">
            {" "}
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Page;
