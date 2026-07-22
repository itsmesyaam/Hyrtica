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
  title: "Hyrtica | AI-Powered Job & Candidate Search Platform",
  description: "Match job listings to over 50,000+ candidate profiles instantly using vector search and AI resume parsing.",
  openGraph: {
    title: "Hyrtica | Modern Talent Matching Platform",
    description: "Intelligent candidate matching engine powered by vector embeddings.",
    url: "https://hyrtica-production.up.railway.app",
    siteName: "Hyrtica",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hyrtica",
    description: "Intelligent candidate matching engine powered by vector embeddings.",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
