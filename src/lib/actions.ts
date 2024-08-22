"use server";
import User from "../models/User";
import { connectDb } from "../lib/connectDb";

// A function to handle database operations for user sign-in
export async function handleUserSignIn(profile: any) {
  await connectDb();

  // Check if the user already exists in the database
  const existingUser = await User.findOne({ email: profile?.email });

  // If the user doesn't exist, create a new user
  if (!existingUser) {
    const newUser = new User({
      fullName: profile?.name,
      email: profile?.email,
      avatar: profile?.picture,
    });
    const savedUser = await newUser.save();

    return savedUser;
  }

  return existingUser;
}

// A function to fetch user data during JWT callback
export async function getUserByEmail(email: string) {
  await connectDb();
  const user = await User.findOne({ email });
  return user;
}
