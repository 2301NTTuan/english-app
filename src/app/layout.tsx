import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/components/app-provider";
import { AppShell } from "@/components/app-shell";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = { title: "English Mastery", description: "Adaptive English learning from A1 to C2" };
const themeScript = `(()=>{try{const saved=localStorage.getItem("english-mastery-theme")||"system";const resolved=saved==="system"?(matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"):saved;document.documentElement.dataset.theme=resolved;document.documentElement.style.colorScheme=resolved}catch{}})()`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{ __html: themeScript }}/></head><body><ThemeProvider><AppProvider><AppShell>{children}</AppShell></AppProvider></ThemeProvider></body></html>;
}
