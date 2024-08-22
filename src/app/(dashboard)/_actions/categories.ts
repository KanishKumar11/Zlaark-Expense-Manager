"use server";

import { auth } from "@/auth";
import { connectDb } from "@/lib/connectDb";
import Category from "@/models/Category";
import {
  CreateCategorySchema,
  CreateCategorySchemaType,
  DeleteCategorySchema,
  DeleteCategorySchemaType,
} from "@/schema/categories";
import { redirect } from "next/navigation";

export async function CreateCategory(form: CreateCategorySchemaType) {
  await connectDb();
  const parsedBody = CreateCategorySchema.safeParse(form);
  if (!parsedBody.success) {
    throw new Error("bad request");
  }
  const session = await auth();
  if (!session) {
    redirect("/auth");
  }
  const { name, icon, type } = parsedBody.data;
  const newCategory = new Category({
    name,
    icon,
    type,
    userId: session.user?.id,
  });
  await newCategory.save();

  return {
    name: newCategory._doc.name,
    icon: newCategory._doc.icon,
    type: newCategory._doc.type,
    userId: newCategory._doc.userId,
  };
}
export async function DeleteCategory(form: DeleteCategorySchemaType) {
  await connectDb();
  const parsedBody = DeleteCategorySchema.safeParse(form);
  if (!parsedBody.success) {
    throw new Error("bad request");
  }
  const session = await auth();
  if (!session) {
    redirect("/auth");
  }
  const { name, type } = parsedBody.data;
  const categories = await Category.findOneAndDelete(
    {
      name,
      type,
      userId: session.user?.id,
    },
    { new: true }
  );
}
