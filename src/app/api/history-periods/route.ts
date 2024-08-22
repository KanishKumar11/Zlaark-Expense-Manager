import { auth } from "@/auth";
import { connectDb } from "@/lib/connectDb";
import MonthHistory from "@/models/MonthHistory";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user) redirect("/auth");
  const periods = await getHistoryPeriods(session.user.id!);
  return Response.json(periods);
}
export type getHistoryPeriodsResponseType = Awaited<
  ReturnType<typeof getHistoryPeriods>
>;

async function getHistoryPeriods(userId: string) {
  await connectDb();
  const result = await MonthHistory.find({ userId })
    .distinct("year")
    .sort({ year: "asc" });

  const years = result;
  if (years.length === 0) {
    return [new Date().getFullYear()];
  }
  return years;
}
