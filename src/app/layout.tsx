import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Content Automation Panel",
  description: "AI Powered Content Pipeline",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
