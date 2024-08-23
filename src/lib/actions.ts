"use server";
import User from "../models/User";
import { connectDb } from "../lib/connectDb";
import { defaultCategories } from "./constants";
import Category from "@/models/Category";

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
    await Promise.all(
      defaultCategories.map(category => {
        const newCategory = new Category({
          ...category,
          userId: savedUser._doc._id
        });
         newCategory.save();
      }))
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
