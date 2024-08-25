"use server";
import User from "@/models/User";
import bcrypt from "bcryptjs";
export async function resetPassword(email: string, password: string) {
  if (!email || !password) throw new Error("Email and password required!");
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.findOneAndUpdate(
    { email },
    {
      $set: { password: hashedPassword },
    }
  );
  return true;
}
