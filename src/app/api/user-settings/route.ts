import { auth } from "@/auth";
import { connectDb } from "@/lib/connectDb";
import UserSettings from "@/models/UserSettings";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
  await connectDb();
  const user = await auth();
  if (!user) {
    redirect("/auth");
  }
  let userSettings = await UserSettings.findOne({ userId: user.user?.id });
  if (!userSettings) {
    const newUserSettings = new UserSettings({
      userId: user.user?.id,
      currencyCode: "USD",
    });
    userSettings = await newUserSettings.save();
    if (!userSettings) {
      return Response.error();
    }
  }
  revalidatePath("/");

  return Response.json(userSettings);
}
