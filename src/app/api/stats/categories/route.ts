import { auth } from "@/auth";
import { connectDb } from "@/lib/connectDb";
import Transaction from "@/models/Transaction";
import { OverviewQuerySchema } from "@/schema/overview";
import mongoose from "mongoose";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
  await connectDb();
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
  const stats = await getCategoriesStats(
    session.user?.id!,
    queryParams.data.from,
    queryParams.data.to
  );
  return Response.json(stats);
}
export type getCategoriesStatsResponseType = Awaited<
  ReturnType<typeof getCategoriesStats>
>;
async function getCategoriesStats(userId: string, from: Date, to: Date) {
  const stats = await Transaction.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        date: { $gte: from, $lte: to },
      },
    },
    {
      $group: {
        _id: {
          type: "$type",
          category: "$category",
          categoryIcon: "$categoryIcon",
        },

        sum: { $sum: "$amount" },
      },
    },
    {
      $sort: { sum: -1 },
    },
  ]);
  return stats;
}
