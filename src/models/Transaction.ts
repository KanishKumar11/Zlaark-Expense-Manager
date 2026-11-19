import { Schema, model, models, Document } from "mongoose";

export interface ITransaction extends Document {
  amount: number;
  description: string;
  date: Date;
  userId: Schema.Types.ObjectId; // Reference to User's _id
  type: string; // e.g., "income" or "expense"
  category: string;
  categoryIcon: string;
}

const transactionSchema = new Schema<ITransaction>(
  {
    amount: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    date: {
      type: Date,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      index: true,
      required: true,
    },
    type: {
      type: String,
      index: true,
      required: true,
    },
    category: {
      type: String,
      index: true,
      required: true,
    },
    categoryIcon: {
      type: String,
      index: true,
      required: true,
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt
);

const Transaction =
  models?.Transaction || model("Transaction", transactionSchema);

export default Transaction;
