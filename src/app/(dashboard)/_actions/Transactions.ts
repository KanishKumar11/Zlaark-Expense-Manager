"use server";

import { auth } from "@/auth";
import { connectDb } from "@/lib/connectDb";
import Category from "@/models/Category";
import MonthHistory from "@/models/MonthHistory";
import Transaction from "@/models/Transaction";
import YearHistory from "@/models/YearHistory";
import {
  CreateTransactionSchema,
  CreateTransactionSchemaType,
} from "@/schema/Transaction";
import mongoose from "mongoose";
import { redirect } from "next/navigation";

export async function CreateTransaction(form: CreateTransactionSchemaType) {
  await connectDb();
  const parsedBody = CreateTransactionSchema.safeParse(form);
  if (!parsedBody.success) {
    throw new Error(parsedBody.error.message);
  }

  const session = await auth();
  if (!session) {
    return redirect("/auth");
  }

  const { amount, category, date, description, type } = parsedBody.data;
  const categoryRow = await Category.findOne({
    name: category,
    userId: session.user?.id,
  });

  if (!categoryRow) {
    throw new Error("Category not found");
  }

  const mongooseSession = await mongoose.startSession();
  mongooseSession.startTransaction();

  try {
    const newTransaction = new Transaction({
      userId: session.user?.id,
      amount,
      date,
      categoryIcon: categoryRow.icon,
      category: categoryRow.name,
      description: description || "",
      type,
    });

    await newTransaction.save({ session: mongooseSession });

    const updatedMonthHistory = await MonthHistory.findOneAndUpdate(
      {
        userId: session.user?.id,
        day: date.getUTCDate(),
        month: date.getUTCMonth(),
        year: date.getUTCFullYear(),
      },
      {
        $inc: {
          expense: type === "expense" ? amount : 0,
          income: type === "income" ? amount : 0,
        },
      },
      { session: mongooseSession, upsert: true, new: true }
    );

    const updatedYearHistory = await YearHistory.findOneAndUpdate(
      {
        userId: session.user?.id,
        month: date.getUTCMonth(),
        year: date.getUTCFullYear(),
      },
      {
        $inc: {
          expense: type === "expense" ? amount : 0,
          income: type === "income" ? amount : 0,
        },
      },
      { session: mongooseSession, upsert: true, new: true }
    );

    await mongooseSession.commitTransaction();
  } catch (err) {
    await mongooseSession.abortTransaction();
    console.error("Transaction failed, rolling back:", err);
    throw new Error("Unable to create transaction");
  } finally {
    mongooseSession.endSession();
  }
}
