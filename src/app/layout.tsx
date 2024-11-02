import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import "@/styles/shadcn.css";
import RootProviders from "@/components/providers/RootProviders";
import { GoogleAnalytics } from "@next/third-parties/google";
import { cn } from "@/lib/utils";

const montserrat = Montserrat({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Zlaark | The Expense Manager App",
  description: "Zlaark | The Expense Manager App",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link
          rel="icon"
          type="image/png"
          sizes="192x192"
          href="/logo-192.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="512x512"
          href="/logo-512.png"
        />
        <link rel="apple-touch-icon" sizes="180x180" href="/logo-192.png" />
        <link
          rel="icon"
          type="image/png"
          sizes="192x192"
          href="/logo-192.png"
        />

        <meta name="apple-mobile-web-app-title" content="Zlaark" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />

        <meta name="theme-color" content="#000000" />

        <GoogleAnalytics gaId="G-TQT9MD1JJL" />
      </head>
      <body className={cn(montserrat.className)}>
        <RootProviders>{children}</RootProviders>
      </body>
    </html>
  );
}
