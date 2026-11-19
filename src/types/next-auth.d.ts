import { IUser } from "@/models/User";
import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt";

// Extend the default user interface
declare module "next-auth" {
  interface User {
    id: string;
    email: string;
    fullName: string;
    avatar: string;
  }
}

// Extend the JWT interface
declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    username: string;
    fullName: string;
    phoneNumber: string;
    avatar: string;
    loggedIn: boolean;
    active: boolean;
  }
}
