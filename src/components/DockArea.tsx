"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Dock, DockIcon } from "@/components/ui/dock";
import { ChartBar, Home, LogOut, Settings } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { auth } from "@/auth";
import { getSession, signOut } from "next-auth/react";
import { Session } from "next-auth";
import { redirect } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { ResetIcon } from "@radix-ui/react-icons";
import { generateToken } from "@/lib/jwt";
import { sendVerificationEmail } from "@/lib/mailer";
import { toast } from "sonner";

export type IconProps = React.HTMLAttributes<SVGElement>;

export default function DockArea() {
  const [session, setSession] = useState<Session | null>(null);
  useMemo(() => {
    getSession().then((res) => setSession(res));
  }, []);
  const handleForgotPassword = async () => {
    try {
      // Generate a token and send a password reset email
      const token = await generateToken(session?.user?.email!);
      sendVerificationEmail(session?.user?.email!, token, true);
      toast.success("Password reset email sent successfully!");
    } catch (error) {
      toast.error("Failed to send password reset email. Please try again.");
    }
  };
  console.log(session);
  console.log(session?.user?.name?.split(" ")[0]);
  return (
    <div className="relative">
      <Dock magnification={60} distance={100}>
        <Link href="/">
          <DockIcon className="bg-black/10 hover:scale-125 transition-transform ease-in-out dark:bg-white/10 p-3">
            {/* <Icons.gitHub className="size-full" /> */}
            <Home className="w-5 h-5" />
          </DockIcon>
        </Link>
        <Link href="/Transactions">
          <DockIcon className="bg-black/10 hover:scale-125 transition-transform ease-in-out dark:bg-white/10 p-3">
            {/* <Icons.googleDrive className="size-full" /> */}
            <ChartBar className="w-5 h-5" />
          </DockIcon>
        </Link>
        <Link href="/manage">
          {" "}
          <DockIcon className="bg-black/10 hover:scale-125 transition-transform ease-in-out dark:bg-white/10 p-3">
            {/* <Icons.notion className="size-full" /> */}
            <Settings className="w-5 h-5" />
          </DockIcon>
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <DockIcon className="bg-black/10 hover:scale-125 transition-transform ease-in-out dark:bg-white/10 p-0.5">
              <Avatar>
                <AvatarImage src={session?.user?.avatar || ""} />
                <AvatarFallback>
                  {session?.user?.fullName?.split(" ").map((name) => name[0])}
                </AvatarFallback>
              </Avatar>
            </DockIcon>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Your Profile</DropdownMenuLabel>
            <DropdownMenuItem onClick={handleForgotPassword}>
              <ResetIcon className="mr-2 h-4 w-4" />
              Reset Password
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                signOut();
              }}
            >
              {" "}
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </Dock>
    </div>
  );
}
