import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ChildProps } from "@/types";
import { ThemeProvider } from "@/components/providers/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Продажа домов онлайн ",
  description: "Разместите дом на продажу или ищите доступные объекты для покупки. Найдите дом своей мечты с легкостью и надежностью.",
  keywords: "недвижимость, купить дом, продать дом, объявления о недвижимости, дома на продажу, платформа недвижимости",
  robots: "index, follow",
};

export default function RootLayout({ children }: ChildProps) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable}  antialiased`} suppressHydrationWarning>
        <ThemeProvider attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
