import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ShadowRank - The Real-Life RPG",
  description: "Turn your daily habits into epic quests. Level up IRL with gamified habit tracking.",
  keywords: ["habit tracker", "gamification", "RPG", "productivity", "leveling", "quests"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#1a1a2e] text-[#eaeaea] min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
