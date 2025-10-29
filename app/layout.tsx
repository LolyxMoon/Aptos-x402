import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import Navbar from "./components/Navbar";
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
  title: "x402 - AI Agent Payment Protocol | ElizaOS Integration",
  description: "Open payment protocol for AI agents. Built by Coinbase. Enable autonomous agents to pay for APIs and services using USDC on Solana and Base. One line of code for sellers, seamless payments for buyers.",
  keywords: [
    "x402",
    "HTTP 402",
    "AI agents",
    "ElizaOS",
    "cryptocurrency payments",
    "USDC",
    "Solana",
    "Base",
    "micropayments",
    "API monetization",
    "machine-to-machine payments",
    "autonomous commerce"
  ],
  authors: [{ name: "Coinbase" }],
  openGraph: {
    title: "x402 - The Payment Protocol for AI Agents",
    description: "Enable autonomous AI agents to pay for services using USDC. Built by Coinbase. Integrated with ElizaOS.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "x402 - AI Agent Payment Protocol",
    description: "Open payment protocol for autonomous AI agents. One line of code to monetize your APIs.",
  }
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
        <Navbar />
        {children}
        <Analytics />
      </body>
    </html>
  );
}