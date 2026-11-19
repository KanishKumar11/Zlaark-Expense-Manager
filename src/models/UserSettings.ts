import { Schema, model, models, Document } from "mongoose";

export interface IUserSettings extends Document {
  userId: Schema.Types.ObjectId; // Reference to User's _id
  currencyCode: string;
}

const userSettingsSchema = new Schema<IUserSettings>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    currencyCode: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const UserSettings =
  models?.userSettings || model("userSettings", userSettingsSchema);

export default UserSettings;
