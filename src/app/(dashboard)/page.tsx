import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import UserSettings from "@/models/UserSettings";
import { redirect } from "next/navigation";
import React from "react";
import CreateTransactionDialog from "./_components/CreateTransactionDialog";
import Overview from "./_components/Overview";
import History from "./_components/History";
import DockArea from "@/components/DockArea";

const page = async () => {
  const session = await auth();
  if (!session) {
    redirect("/auth");
  }
  const userSettings = await UserSettings.findOne({ userId: session.user?.id });
  if (!userSettings) redirect("/wizard");
  return (
    <div className="h-full bg-background relative pb-10">
      <div className="border-b bg-card ">
        <div className="container flex flex-wrap items-center justify-between gap-6 py-8">
          <p className="font-bold text-3xl">
            Hello, {session.user?.fullName.split(" ")[0]}! 👋
          </p>
          <div className="flex items-center gap-3">
            <CreateTransactionDialog
              trigger={
                <Button
                  variant={"outline"}
                  className="border-emerald-500 bg-emerald-950 hover:bg-emerald-700 hover:text-white text-white"
                >
                  New income 🤑
                </Button>
              }
              type="income"
            />
            <CreateTransactionDialog
              trigger={
                <Button
                  variant={"outline"}
                  className="border-rose-500 bg-rose-950 hover:bg-rose-700 hover:text-white text-white"
                >
                  New expense 😤
                </Button>
              }
              type="expense"
            />
          </div>
        </div>
      </div>
      <Overview userSettings={userSettings} />
      <History userSettings={userSettings} />
      <div className="fixed bottom-1 mx-auto w-full">
        <DockArea />
      </div>
    </div>
  );
};

export default page;
