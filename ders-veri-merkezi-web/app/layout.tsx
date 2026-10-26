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
  title: "Ders Veri Merkezi • Kurumsal Eğitim Platformu",
  description: "Malatya Turgut Özal Üniversitesi Yazılım Mühendisliği Staj Projesi",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="tr"
      suppressHydrationWarning
      style={{ backgroundColor: "#0f172a" }}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body
        style={{ backgroundColor: "#0f172a" }}
        className="min-h-full flex flex-col bg-slate-900 text-slate-100"
      >
        {children}
      </body>
    </html>
  );
}