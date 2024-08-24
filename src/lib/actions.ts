"use server";
import User from "../models/User";
import { connectDb } from "../lib/connectDb";
import { defaultCategories } from "./constants";
import Category from "@/models/Category";
import { Profile } from "next-auth";
import bcrypt from "bcryptjs";
import zxcvbn from "zxcvbn";

// A function to handle database operations for user sign-in
export async function handleUserSignIn(profile: Profile | undefined) {
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
      defaultCategories.map((category) => {
        const newCategory = new Category({
          ...category,
          userId: savedUser._doc._id,
        });
        newCategory.save();
      })
    );
    return savedUser;
  }

  return existingUser;
}

// A function to fetch user data during JWT callback
export async function getUserByEmail(email: string) {
  await connectDb();
  const user = await User.findOne({ email }).select("+password");
  if (!user) return null;
  return user._doc;
}

export async function handleGithubSignIn(profile: Profile | undefined) {
  await connectDb();

  // Check if the user already exists in the database
  const existingUser = await User.findOne({ email: profile?.email });

  // If the user doesn't exist, create a new user
  if (!existingUser) {
    const newUser = new User({
      fullName: profile?.name,
      email: profile?.email,
      avatar: profile?.avatar_url,
    });
    const savedUser = await newUser.save();

    return savedUser;
  }

  return existingUser;
}
export async function handleEmailSignIn(
  fullName: string | undefined,
  email: string,
  avatar: string,
  password: string
) {
  await connectDb();

  // Check if the user already exists in the database
  const existingUser = await User.findOne({ email });

  // If the user doesn't exist, create a new user
  if (!existingUser) {
    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword, // Save the hashed password
      avatar,
    });
    const savedUser = await newUser.save();

    // Create default categories for the new user
    await Promise.all(
      defaultCategories.map((category) => {
        const newCategory = new Category({
          ...category,
          userId: savedUser._doc._id,
        });
        return newCategory.save();
      })
    );

    return savedUser;
  }

  return existingUser;
}
export async function validatePassword(
  password: string
): Promise<{ isValid: boolean; message: string }> {
  // Use zxcvbn to evaluate password strength
  const strength = zxcvbn(password);
  if (strength.score < 2) {
    return {
      isValid: false,
      message:
        "Password is too weak. Please include a mix of letters, numbers, and special characters.",
    };
  }

  // If all checks pass
  return { isValid: true, message: "Password is strong." };
}
