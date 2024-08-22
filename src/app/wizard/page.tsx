import { auth } from "@/auth";
import CurrencyComboBox from "@/components/CurrencyComboBox";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

const Page = async () => {
  const session = await auth();
  if (!session) redirect("/auth");
  return (
    <div className="container flex max-w-2xl flex-col items-center justify-center h-full gap-4 ">
      <div className="">
        {" "}
        <h1 className="text-center text-3xl font-bold">
          Welcome, {session.user?.fullName.split(" ")[0]}!
        </h1>
        <h2 className="mt-4 text-center text-base text-muted-foreground">
          Let &apos;s get started by setting up your currency
        </h2>
        <h3 className="mt-2 text-center text-sm text-muted-foreground">
          You can change these settings at any time
        </h3>
      </div>

      <Separator />
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Currency</CardTitle>
          <CardDescription>
            Set your default currency for transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CurrencyComboBox />
        </CardContent>
      </Card>
      <Separator />
      <Button className="w-full" asChild>
        <Link href="/">I&apos;m done! Take me to the dashboard</Link>
      </Button>
    </div>
  );
};

export default Page;
