import { Schema, model, models, Document } from "mongoose";

export interface IMonthHistory extends Document {
  userId: Schema.Types.ObjectId; // Reference to User's _id
  day: number;
  month: number;
  year: number;
  income: number;
  expense: number;
}

const monthHistorySchema = new Schema<IMonthHistory>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    day: {
      type: Number,
      required: true,
    },
    month: {
      type: Number,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    income: {
      type: Number,
      default: 0,
    },
    expense: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt
);

const MonthHistory =
  models?.MonthHistory || model("MonthHistory", monthHistorySchema);

export default MonthHistory;
