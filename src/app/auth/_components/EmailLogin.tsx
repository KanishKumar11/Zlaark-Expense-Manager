"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getUserByEmail } from "@/lib/actions";
import { generateToken } from "@/lib/jwt";
import { sendVerificationEmail } from "@/lib/mailer";
import { signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { z, ZodError } from "zod";
const emailSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export default function EmailLogin() {
  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [error, setError] = useState<string | null>(null);
  const [existingUser, setExistingUser] = useState<boolean>(false);
  const [isWaiting, setIsWaiting] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else {
      setIsWaiting(false);
    }

    return () => clearTimeout(timer);
  }, [timeLeft]);

  const handleSubmit = async () => {
    try {
      // Validate the email using the schema
      emailSchema.parse({ email });
      // If validation passes, proceed with your logic
      const existingUser = await getUserByEmail(email!);
      if (existingUser) {
        setExistingUser(true);
        toast.success("Found your account, Please enter your password");
      } else {
        const token = await generateToken(email!);
        sendVerificationEmail(email!, token);
        toast.success("Verification email sent successfully!");
        setError(null);
        setIsWaiting(true);
        setTimeLeft(30);
      }
    } catch (error) {
      if (error instanceof ZodError) {
        // Extract and set validation errors
        setError(error.errors[0]?.message || "Invalid input");
      }
    }
  };

  const loginUser = async () => {
    console.log(email);
    await signIn("credentials", {
      email,
      password,
      redirect: true,
    });
    console.log(password);
  };
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="email">Email</Label>
      <Input
        placeholder="Enter your email"
        name="email"
        type="email"
        disabled={existingUser}
        onChange={(e) => setEmail(e.target.value)}
      />

      {error && <p className="text-red-500">{error}</p>}
      {isWaiting && (
        <p className=" text-sm">
          Didn&#39;t got email? Resend after {timeLeft} seconds
        </p>
      )}
      {existingUser && (
        <>
          {" "}
          <Label htmlFor="password">Password</Label>
          <Input
            placeholder="Enter your password"
            name="password"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </>
      )}
      <Button
        onClick={existingUser ? loginUser : handleSubmit}
        disabled={isWaiting}
      >
        Continue
      </Button>
    </div>
  );
}
