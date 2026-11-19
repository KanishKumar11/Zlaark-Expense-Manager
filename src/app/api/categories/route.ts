import { auth } from "@/auth";
import { connectDb } from "@/lib/connectDb";
import Category from "@/models/Category";
import { redirect } from "next/navigation";
import { z } from "zod";

export async function GET(request: Request) {
  await connectDb();
  const session = await auth();
  if (!session) {
    redirect("/auth");
  }
  const { searchParams } = new URL(request.url);
  const paramType = searchParams.get("type");
  const validator = z.enum(["expense", "income"]).nullable();
  const queryParams = validator.safeParse(paramType);
  if (!queryParams.success) {
    return Response.json(queryParams.error, { status: 400 });
  }
  const type = queryParams.data;
  const categories = await Category.find({
    userId: session.user?.id,
    ...(type && { type }),
  }).sort({ name: 1 });
  return Response.json(categories);
}
