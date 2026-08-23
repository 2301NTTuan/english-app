import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/components/app-provider";
import { AppShell } from "@/components/app-shell";

export const metadata: Metadata = { title: "English Mastery", description: "Adaptive English learning from A1 to C2" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><AppProvider><AppShell>{children}</AppShell></AppProvider></body></html>;
}
