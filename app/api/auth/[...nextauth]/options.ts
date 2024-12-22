import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/users";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "email", type: "text", placeholder: "email" },
        password: {
          label: "password",
          type: "password",
          placeholder: "password",
        },
      },
      async authorize(credentials: any): Promise<any> {
        await dbConnect();
        try {
          const user = await UserModel.findOne({ email: credentials.email });
          if (!user) {
            throw new Error("No user found with this email");
          }
          if(user.password === "google"){
            return user
          }
          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );
          if (isPasswordCorrect) {
            return user;
          } else {
            throw new Error("Incorrect password");
          }
        } catch (error: any) {
          console.log(error);
          throw new Error(error);
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  pages: {
    signIn: "/sign-in",
    newUser: "/",
  },

  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id;
        session.user.username = token.username;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id?.toString();
        token.username = user.username;
      }
      return token;
    },
    async signIn({ account, profile }) {
      if (account?.provider === "google") {
        await dbConnect();
        try {
          const user = await UserModel.findOne({ email: profile?.email });
          if (user) {
            console.log(user);
            return true;
          } else {
            const newUser = new UserModel({
              username: profile?.name,
              email: profile?.email,
              password: "google",
            });
            await newUser.save();
            return true;
          }
        } catch (error) {
          console.log("error while sign in: ", error);
          return false;
        }
      }
      return true;
    },
  },
  session: {
    strategy: "jwt", // Use "database" if you prefer database sessions
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // Update token every 24 hours
  },
  secret: process.env.NEXTAUTH_SECRET,
};
