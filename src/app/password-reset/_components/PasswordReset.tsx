"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { verifyToken } from "@/lib/jwt";
import { redirect, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
} from "@/components/ui/form";
import { validatePassword } from "@/lib/actions";
import { resetPassword } from "../_actions/actions";
import { toast } from "sonner";

// Define the schema with Zod
const formSchema = z.object({
  password: z
    .string()
    .min(8)
    .refine(
      async (value) => {
        const validationResult = await validatePassword(value);
        return validationResult.isValid;
      },
      {
        message: "Password is too weak or has been compromised.",
      }
    ),
});

// Define types for form data
type FormData = z.infer<typeof formSchema>;

export default function ResetPassword() {
  const [isValidToken, setIsValidToken] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const searchParams = useSearchParams();

  const token = searchParams.get("token");

  useEffect(() => {
    if (token) {
      verifyToken(token)
        .then((res: any) => {
          if (res) {
            setIsValidToken(true);
            setEmail(res.email);
          }
        })
        .catch(() => setIsValidToken(false));
    }
  }, [token]);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    if (token) {
      toast.loading("Updating password...", {
        id: "reset-password",
      });
      await resetPassword(email, data.password);
      toast.success("Password changed successfully!", {
        id: "reset-password",
      });
      redirect("/auth"); // Redirect to login or success page after reset
    }
  };

  if (!token) redirect("/auth");

  return (
    <div className="flex items-center justify-center h-[80vh]">
      <Card>
        <CardHeader>
          <CardTitle>
            {isValidToken ? "Reset your password" : "Invalid Token"}
          </CardTitle>
          <CardDescription>
            {isValidToken
              ? "Enter your new password below"
              : "The token is expired or invalid. Please request a new one."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isValidToken ? (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Choose a strong password.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">Reset Password</Button>
              </form>
            </Form>
          ) : (
            <div className="text-center">
              <Button onClick={() => redirect("/auth")} className="mt-4">
                Try again!
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
