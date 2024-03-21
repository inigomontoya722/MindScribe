import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { FC } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MindScrobe",
  description: "MindScribe StartUp Project",
};

const RootLayout: FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
};

export default RootLayout;
