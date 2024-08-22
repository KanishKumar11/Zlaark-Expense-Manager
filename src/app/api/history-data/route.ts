import { auth } from "@/auth";
import { connectDb } from "@/lib/connectDb";
import MonthHistory from "@/models/MonthHistory";
import YearHistory from "@/models/YearHistory";
import { Period, TimeFrame } from "@/types/types";
import { getDaysInMonth } from "date-fns";
import mongoose from "mongoose";
import { redirect } from "next/navigation";
import { z } from "zod";
const getHistoryDataSchema = z.object({
  timeframe: z.enum(["month", "year"]),
  month: z.coerce.number().min(0).max(11).default(0),
  year: z.coerce.number().min(2000).max(3000).default(0),
});
export async function GET(request: Request) {
  await connectDb();
  const session = await auth();
  if (!session) {
    redirect("/auth");
  }
  const { searchParams } = new URL(request.url);
  const timeframe = searchParams.get("timeframe");
  const year = searchParams.get("year");
  const month = searchParams.get("month");
  const queryParams = getHistoryDataSchema.safeParse({
    timeframe,
    year,
    month,
  });
  if (!queryParams.success) {
    return Response.json(queryParams.error.message, {
      status: 400,
    });
  }
  const data = await getHistoryData(
    session.user?.id!,
    queryParams.data.timeframe,
    {
      month: queryParams.data.month,
      year: queryParams.data.year,
    }
  );
  return Response.json(data);
}
export type getHistoryDataResponseType = Awaited<
  ReturnType<typeof getHistoryData>
>;
async function getHistoryData(
  userId: string,
  timeframe: TimeFrame,
  period: Period
) {
  switch (timeframe) {
    case "year":
      return await getYearHistoryData(userId, period.year);
    case "month":
      return await getMonthHistoryData(userId, period.year, period.month);
  }
}
type HistoryData = {
  expense: number;
  income: number;
  year: number;
  month: number;
  day?: number;
};
async function getYearHistoryData(userId: string, year: number) {
  const result = await YearHistory.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        year,
      },
    },
    {
      $group: {
        _id: {
          month: "$month",
        },
        expense: {
          $sum: "$expense",
        },
        income: {
          $sum: "$income",
        },
      },
    },
    {
      $sort: {
        month: 1,
      },
    },
  ]);
  if (!result || result.length === 0) return [];
  const history: HistoryData[] = [];
  for (let i = 0; i < 12; i++) {
    let expense = 0;
    let income = 0;
    const month = result.find((row) => row._id.month === i);
    if (month) {
      expense = month.expense || 0;
      income = month.income || 0;
    }
    history.push({
      year,
      month: i,
      expense,
      income,
    });
  }
  return history;
}
async function getMonthHistoryData(
  userId: string,
  year: number,
  month: number
) {
  const result = await MonthHistory.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        year,
        month,
      },
    },
    {
      $group: {
        _id: "$day",
        expense: {
          $sum: "$expense",
        },
        income: {
          $sum: "$income",
        },
      },
    },
    {
      $sort: {
        day: 1,
      },
    },
  ]);
  if (!result || result.length === 0) return [];
  const history: HistoryData[] = [];
  const daysInMonth = getDaysInMonth(new Date(year, month));
  for (let i = 1; i <= daysInMonth; i++) {
    let expense = 0;
    let income = 0;
    const day = result.find((row) => row._id === i);
    if (day) {
      expense = day.expense || 0;
      income = day.income || 0;
    }
    history.push({
      expense,
      income,
      year,
      month,
      day: i,
    });
  }
  return history;
}
