"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { verifyToken } from "@/lib/jwt";
import { useSearchParams } from "next/navigation";
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
import { signIn } from "next-auth/react";
import { validatePassword } from "@/lib/actions";

// Define the schema with Zod
const formSchema = z.object({
  fullName: z.string().min(2).max(50),
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

export default function Verify() {
  const [isValidToken, setIsValidToken] = useState<boolean>(false);
  const [email, setEmail] = useState<string | undefined>(undefined); // Explicitly set type
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
    await signIn("credentials", {
      ...data,
      email,
      redirectTo: "/wizard",
    });
  };

  if (!token) return <div>Error: No token provided.</div>;
  if (!isValidToken) return <div>Token expired or invalid.</div>;

  return (
    <div className="flex items-center justify-center h-[80vh]">
      <Card>
        <CardHeader>
          <CardTitle>Enter your details</CardTitle>
          <CardDescription>
            To enter the world of Zlaark expense manager
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormDescription>
                      Please enter your full name.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Choose a strong password.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Continue</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
