"use server";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import UserModel from "@/models/users";
import { StreamClient } from "@stream-io/node-sdk";
import { getServerSession } from "next-auth";

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
const secret = process.env.STREAM_SECRET_KEY;

const tokenProvider =async () => {

  const session = await getServerSession(authOptions)
  const email = session?.user.email

  if (!email) {
    throw new Error("user not found")
  }
  if (!apiKey) {
    throw new Error("No API key provided");
  }
  if (!secret) {
    throw new Error("No stream secret provided");
  }
  const client = new StreamClient(apiKey, secret);

  const exp = Math.round(new Date().getTime() / 1000) + 60 * 60;
  const issued = Math.round(Date.now() / 1000) - 60;
  const token = client.createToken(email as string, exp, issued);
  return token;
};

export default tokenProvider;
