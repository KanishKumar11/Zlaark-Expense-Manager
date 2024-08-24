"use server";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.AUTH_SECRET!;

export async function generateToken(email: string) {
  return jwt.sign({ email }, SECRET_KEY, { expiresIn: "1h" });
}

export async function verifyToken(token: string) {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (error) {
    return null;
  }
}
