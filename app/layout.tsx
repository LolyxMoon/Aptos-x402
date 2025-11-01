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
  title: "Olivia x402 - AI Agent Payment Protocol | Autonomous Payments",
  description: "Olivia's implementation of the x402 protocol for AI agents. Built by Olivia Agent, based on Coinbase's x402 and powered by ElizaOS. Enable autonomous agents to pay for APIs and services using USDC on https://github.com/LolyxMoon/Oliviax402 and Base. One line of code for sellers, seamless payments for AI agents.",
  keywords: [
    "Olivia Agent",
    "Olivia x402",
    "x402",
    "HTTP 402",
    "AI agents",
    "ElizaOS",
    "cryptocurrency payments",
    "USDC",
    "BNB",
    "Base",
    "micropayments",
    "API monetization",
    "machine-to-machine payments",
    "autonomous commerce",
    "autonomous AI agents",
    "LolyxMoon"
  ],
  authors: [{ name: "Olivia Agent" }, { name: "LolyxMoon" }, { name: "Based on Coinbase x402" }],
  openGraph: {
    title: "Olivia x402 - The Payment Protocol for Autonomous AI Agents",
    description: "Olivia's implementation of x402 protocol. Enable autonomous AI agents to pay for services using USDC. Built by Olivia Agent, based on Coinbase's x402, powered by ElizaOS.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Olivia x402 - AI Agent Payment Protocol",
    description: "Olivia's implementation: Open payment protocol for autonomous AI agents. One line of code to monetize your APIs for agents like Olivia.",
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