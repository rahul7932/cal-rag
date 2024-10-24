import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import ChatSupport from "@/components/chat-support";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Berkeley Knowledge",
  description: "Build by 307 boys!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-black text-white`}>
        <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark">
          {children}
          <ChatSupport />
        </ThemeProvider>
      </body>
    </html>
  );
}
