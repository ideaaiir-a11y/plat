import type { Metadata } from "next";
import { Vazirmatn, Lalezar } from "next/font/google";
import "./globals.css";

const vazirmatn = Vazirmatn({
  subsets: ["arabic", "latin"],
  variable: "--font-vazirmatn",
});

const lalezar = Lalezar({
  weight: "400",
  subsets: ["arabic", "latin"],
  variable: "--font-lalezar",
});

export const metadata: Metadata = {
  title: "پنل مدیریت روبیکا | Rubika Admin Panel",
  description: "پنل مدیریت هوشمند و خودکار محتوای روبیکا",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" className="dark">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
      </head>
      <body
        className={`${vazirmatn.variable} ${lalezar.variable} font-vazirmatn antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
