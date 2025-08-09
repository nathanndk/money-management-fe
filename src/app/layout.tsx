import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/navbar";
import { SessionProvider } from "next-auth/react";

export const metadata: Metadata = {
  title: "Money Manager + ICP + Fetch.ai",
  description:
    "Minimalist personal finance tracker with ICP & Fetch.ai integrations",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <SessionProvider>
          <ThemeProvider>
            <Navbar />
            <main className="mx-auto max-w-5xl px-4 py-6">{children}</main>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
