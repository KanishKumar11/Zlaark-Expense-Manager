import { Schema, model, models } from "mongoose";
export interface IUser {
  fullName?: string;
  email: string;
  password?: string;
  avatar?: string;
}

const userSchema = new Schema<IUser>(
  {
    fullName: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/\S+@\S+\.\S+/, "is invalid"],
    },
    password: {
      type: String,
      required: false,
    },
    avatar: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

const User = models?.users || model("users", userSchema);

export default User;