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
  title:
    "Q-Simak – Aplikasi Penyimak Hafalan Al-Quran Digital untuk Guru & Ustadz",
  description:
    "Q-Simak adalah aplikasi digital berbasis web untuk membantu guru dan ustadz menyimak hafalan Al-Quran santri dengan mudah, akurat, dan efisien. Dilengkapi fitur penandaan kesalahan, catatan hafalan, dan pelacakan perkembangan santri.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
