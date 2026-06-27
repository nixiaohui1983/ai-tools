import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Stack Hub — AI Tool Decision & Workflow Platform",
  description:
    "Choose + combine + use AI tools to complete tasks. The AI tool decision & workflow platform.",
  keywords: ["AI tools", "workflow", "AI productivity", "tool comparison"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <div className="min-h-screen flex flex-col bg-bg-light dark:bg-bg-dark text-text-primary">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
