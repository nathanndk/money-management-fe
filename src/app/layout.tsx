import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/navbar";
import { AuthProvider } from "@/components/providers/auth-providers";

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
        <AuthProvider>
          <ThemeProvider>
            <Navbar />
            <main className="mx-auto max-w-5xl px-4 py-6">{children}</main>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
