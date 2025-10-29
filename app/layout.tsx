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
  title: "Sofia x402 - AI Agent Payment Protocol | Autonomous Payments",
  description: "Sofia's implementation of the x402 protocol for AI agents. Built by Sofia Agent, based on Coinbase's x402 and powered by ElizaOS. Enable autonomous agents to pay for APIs and services using USDC on Solana and Base. One line of code for sellers, seamless payments for AI agents.",
  keywords: [
    "Sofia Agent",
    "Sofia x402",
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
    "autonomous commerce",
    "autonomous AI agents",
    "LolyxMoon"
  ],
  authors: [{ name: "Sofia Agent" }, { name: "LolyxMoon" }, { name: "Based on Coinbase x402" }],
  openGraph: {
    title: "Sofia x402 - The Payment Protocol for Autonomous AI Agents",
    description: "Sofia's implementation of x402 protocol. Enable autonomous AI agents to pay for services using USDC. Built by Sofia Agent, based on Coinbase's x402, powered by ElizaOS.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sofia x402 - AI Agent Payment Protocol",
    description: "Sofia's implementation: Open payment protocol for autonomous AI agents. One line of code to monetize your APIs for agents like Sofia.",
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