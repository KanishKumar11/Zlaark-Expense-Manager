"use client";
import React, { ReactNode, useState } from "react";
import { ThemeProvider } from "../theme-provider";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "../ui/sonner";
import Navbar from "../Navbar";
import AddToHomeScreen from "../AddToHomeScreen";
const RootProviders = ({ children }: { children: ReactNode }) => {
  const [queryClient] = useState(() => new QueryClient({}));
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
        <AddToHomeScreen />
        <Toaster richColors position="top-center" />
        <Navbar />
        {children}
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default RootProviders;
