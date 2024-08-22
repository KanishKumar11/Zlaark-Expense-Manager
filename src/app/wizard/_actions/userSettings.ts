"use server";

import { auth } from "@/auth";
import { connectDb } from "@/lib/connectDb";
import UserSettings from "@/models/UserSettings";
import { UpdateUserCurrencySchema } from "@/schema/userSettings";
import { redirect } from "next/navigation";

export async function UpdateUserCurrency(currencyCode: string) {
  await connectDb();
  const parsedBody = UpdateUserCurrencySchema.safeParse({
    currencyCode,
  });

  if (!parsedBody.success) {
    throw parsedBody.error;
  }
  const user = await auth();
  if (!user) {
    redirect("/");
  }
  const userSettings = await UserSettings.findOneAndUpdate(
    { userId: user.user?.id },
    {
      currencyCode,
    },
    { new: true }
  );
  return {
    userId: userSettings._doc.userId,
    currencyCode: userSettings._doc.currencyCode,
  };
}
