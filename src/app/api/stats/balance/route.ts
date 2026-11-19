import { auth } from "@/auth";
import { connectDb } from "@/lib/connectDb";
import Transaction from "@/models/Transaction";
import { OverviewQuerySchema } from "@/schema/overview";
import mongoose from "mongoose";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
  const session = await auth();
  if (!session) redirect("/auth");
  const { searchParams } = new URL(request.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const queryParams = OverviewQuerySchema.safeParse({ from, to });
  if (!queryParams.success) {
    return Response.json(queryParams.error.message, {
      status: 400,
    });
  }
  const stats = await getBalanceStats(
    session.user?.id!,
    queryParams.data.from,
    queryParams.data.to
  );
  return Response.json(stats);
}
export type getBalanceStatsResponseType = Awaited<
  ReturnType<typeof getBalanceStats>
>;
async function getBalanceStats(userId: string, from: Date, to: Date) {
  await connectDb();
  const totals = await Transaction.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        date: { $gte: from, $lte: to },
      },
    },
    {
      $group: {
        _id: "$type",
        sum: { $sum: "$amount" },
      },
    },
  ]);

  return {
    expense: totals.find((t) => t._id === "expense")?.sum || 0,
    income: totals.find((t) => t._id === "income")?.sum || 0,
  };
}
