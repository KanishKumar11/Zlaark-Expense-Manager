"use server";

import { auth } from "@/auth";
import MonthHistory from "@/models/MonthHistory";
import Transaction from "@/models/Transaction";
import YearHistory from "@/models/YearHistory";
import mongoose from "mongoose";
import { redirect } from "next/navigation";

export async function DeleteTransaction(id: string) {
  const session = await auth();
  if (!session) redirect("/auth");

  const transaction = await Transaction.findByIdAndDelete(id);

  if (!transaction) throw new Error("No transaction found");

  const mongooseSession = await mongoose.startSession();
  mongooseSession.startTransaction();

  await MonthHistory.findOneAndUpdate(
    {
      userId: session.user?.id,
      month: transaction.date.getUTCMonth(),
      day: transaction.date.getUTCDate(),
      year: transaction.date.getUTCFullYear(),
    },
    {
      $inc: {
        ...(transaction.type === "expense" && { expense: -transaction.amount }),
        ...(transaction.type === "income" && { income: -transaction.amount }),
      },
    }
  );
  await YearHistory.findOneAndUpdate(
    {
      userId: session.user?.id,
      month: transaction.date.getUTCMonth(),
      year: transaction.date.getUTCFullYear(),
    },
    {
      $inc: {
        ...(transaction.type === "expense" && { expense: -transaction.amount }),
        ...(transaction.type === "income" && { income: -transaction.amount }),
      },
    }
  );
}
