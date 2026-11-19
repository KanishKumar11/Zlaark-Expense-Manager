import { Schema, model, models, Document } from "mongoose";

export interface IYearHistory extends Document {
  userId: Schema.Types.ObjectId; // Reference to User's _id
  month: number;
  year: number;
  income: number;
  expense: number;
}

const yearHistorySchema = new Schema<IYearHistory>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
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

const YearHistory =
  models?.YearHistory || model("YearHistory", yearHistorySchema);

export default YearHistory;
