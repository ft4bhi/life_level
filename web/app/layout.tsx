import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { AudioProvider } from "./components/AudioContext";
import Navbar from "./components/Navbar";

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
    <html lang="en" data-scroll-behavior="smooth">
      <body className={`${DMSans.variable} font-sans`}>
        {/* 
          NOTE: You must place an audio file in the `/public` directory.
          For this example, we assume a file named `background-music.mp3` exists.
        */}
        <AudioProvider audioSrc="/music/sigmamusicart-epic-background-music-368177.mp3">
          <Navbar />
          {children}
        </AudioProvider>
      </body>
    </html>
  );
}
