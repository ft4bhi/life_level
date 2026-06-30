import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";

const DMSans = DM_Sans({ 
  subsets: ["latin"],
  variable: '--font-dm-sans',
});

export const metadata: Metadata = {
  title: "Life Levels",
  description: "A journaling app where every completed day becomes a visual level on a map.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${DMSans.variable} font-sans`}>
        {children}
      </body>
    </html>
  );
}
