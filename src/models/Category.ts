import { Schema, model, models, Document } from "mongoose";

export interface ICategory {
  name: string;
  icon: string;
  type: string;
  userId: Schema.Types.ObjectId;
}

const categorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

const Category = models?.Category || model("Category", categorySchema);

export default Category;
