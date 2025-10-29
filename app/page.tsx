"use client";

import { ArrowRight, Code2, Zap, Shield, Package } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      
      <div className="relative">
        {/* Hero Section */}
        <div className="container mx-auto px-6 pt-32 pb-24 max-w-5xl">
          <div className="text-center space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-200 bg-zinc-50/50 backdrop-blur-sm text-sm text-zinc-700">
              <Package className="w-3 h-3" />
              <span>x402 Payment Protocol for AI Agents</span>
            </div>

            {/* Headline */}
            <h1 className="text-6xl md:text-7xl font-bold tracking-tight text-zinc-900">
              HTTP 402 for APIs.
              <br />
              <span className="text-zinc-600">AI agents that pay.</span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl text-zinc-600 max-w-2xl mx-auto">
              Enable autonomous AI agents to pay for services using USDC on Solana and Base. 
              One line of code for sellers, seamless payments for buyers.
            </p>

            {/* CTA Buttons */}
            <div className="flex items-center justify-center gap-4 pt-4">
              <Link
                href="/demo"
                className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-900 text-white rounded-lg font-medium hover:bg-zinc-800 transition-colors"
              >
                Try Demo
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/docs"
                className="inline-flex items-center gap-2 px-6 py-3 border border-zinc-200 text-zinc-900 rounded-lg font-medium hover:bg-zinc-50 transition-colors"
              >
                Documentation
              </Link>
            </div>

            {/* Quick Install */}
            <div className="pt-8">
              <p className="text-sm text-zinc-500 mb-3">Get started with ElizaOS</p>
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-zinc-900 rounded-lg font-mono text-sm text-zinc-100">
                <span>https://github.com/LolyxMoon/Sofiax402</span>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="container mx-auto px-6 pb-24 max-w-5xl">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="p-6 rounded-lg border border-zinc-200 bg-white/50 backdrop-blur-sm hover:border-zinc-300 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-zinc-900 flex items-center justify-center mb-4">
                <Code2 className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-zinc-900 mb-2">
                Zero Payment Logic
              </h3>
              <p className="text-zinc-600 text-sm leading-relaxed">
                Single middleware line. Your API routes stay clean—no payment code, no accounts, no subscriptions.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-lg border border-zinc-200 bg-white/50 backdrop-blur-sm hover:border-zinc-300 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-zinc-900 flex items-center justify-center mb-4">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-zinc-900 mb-2">
                Instant Settlement
              </h3>
              <p className="text-zinc-600 text-sm leading-relaxed">
                Built on Solana and Base. Near-zero fees, sub-second verification, instant USDC settlement.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-lg border border-zinc-200 bg-white/50 backdrop-blur-sm hover:border-zinc-300 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-zinc-900 flex items-center justify-center mb-4">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-zinc-900 mb-2">
                Open Standard
              </h3>
              <p className="text-zinc-600 text-sm leading-relaxed">
                Built by Coinbase. Backed by Google, AWS, Cloudflare, and Visa. Chain-agnostic protocol.
              </p>
            </div>
          </div>
        </div>

        {/* Code Example Section */}
        <div className="container mx-auto px-6 pb-24 max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-zinc-900 mb-3">
              Simple to implement
            </h2>
            <p className="text-zinc-600">
              Three steps to enable AI agent payments
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {/* Step 1 */}
            <div className="rounded-lg border border-zinc-200 bg-white/50 backdrop-blur-sm overflow-hidden">
              <div className="p-4 border-b border-zinc-200 bg-zinc-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-zinc-900 text-white flex items-center justify-center text-xs font-semibold">
                    1
                  </div>
                  <h3 className="font-semibold text-zinc-900 text-sm">
                    Configure middleware
                  </h3>
                </div>
              </div>
              <div className="p-4">
                <div className="space-y-2 text-xs text-zinc-600">
                  <div className="flex items-start gap-2">
                    <div className="w-1 h-1 rounded-full bg-zinc-400 mt-1.5 flex-shrink-0"></div>
                    <span>Set recipient wallet address</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1 h-1 rounded-full bg-zinc-400 mt-1.5 flex-shrink-0"></div>
                    <span>Configure protected routes</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1 h-1 rounded-full bg-zinc-400 mt-1.5 flex-shrink-0"></div>
                    <span>Set price per request</span>
                  </div>
                </div>
                <pre className="mt-4 bg-zinc-900 text-zinc-100 p-3 rounded text-xs overflow-x-auto leading-relaxed">
{`// server.ts
import express from "express";
import { paymentMiddleware } 
  from "x402-express";

const app = express();

app.use(
  paymentMiddleware(
    process.env.WALLET_ADDRESS,
    {
      "GET /api/weather": {
        price: "$0.01",
        network: "base-sepolia"
      },
      "POST /api/analyze": {
        price: "$0.05",
        network: "base-sepolia"
      }
    },
    { 
      url: "https://x402.org/facilitator"
    }
  )
);`}
                </pre>
              </div>
            </div>

            {/* Step 2 */}
            <div className="rounded-lg border border-zinc-200 bg-white/50 backdrop-blur-sm overflow-hidden">
              <div className="p-4 border-b border-zinc-200 bg-zinc-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-zinc-900 text-white flex items-center justify-center text-xs font-semibold">
                    2
                  </div>
                  <h3 className="font-semibold text-zinc-900 text-sm">
                    Write your API route
                  </h3>
                </div>
              </div>
              <div className="p-4">
                <div className="space-y-2 text-xs text-zinc-600">
                  <div className="flex items-start gap-2">
                    <div className="w-1 h-1 rounded-full bg-zinc-400 mt-1.5 flex-shrink-0"></div>
                    <span>No payment logic needed</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1 h-1 rounded-full bg-zinc-400 mt-1.5 flex-shrink-0"></div>
                    <span>Payment verified automatically</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1 h-1 rounded-full bg-zinc-400 mt-1.5 flex-shrink-0"></div>
                    <span>Focus on your business logic</span>
                  </div>
                </div>
                <pre className="mt-4 bg-zinc-900 text-zinc-100 p-3 rounded text-xs overflow-x-auto leading-relaxed">
{`// /api/weather/route.ts
import { NextResponse } 
  from 'next/server';

export async function GET(
  request: Request
) {
  // Payment already verified
  // by x402 middleware!
  
  const weatherData = 
    await fetchWeather();
  
  return NextResponse.json({
    temperature: 72,
    condition: 'Sunny',
    humidity: 45,
    paid: true
  });
}`}
                </pre>
              </div>
            </div>

            {/* Step 3 */}
            <div className="rounded-lg border border-zinc-200 bg-white/50 backdrop-blur-sm overflow-hidden">
              <div className="p-4 border-b border-zinc-200 bg-zinc-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-zinc-900 text-white flex items-center justify-center text-xs font-semibold">
                    3
                  </div>
                  <h3 className="font-semibold text-zinc-900 text-sm">
                    AI Agent pays automatically
                  </h3>
                </div>
              </div>
              <div className="p-4">
                <div className="space-y-2 text-xs text-zinc-600">
                  <div className="flex items-start gap-2">
                    <div className="w-1 h-1 rounded-full bg-zinc-400 mt-1.5 flex-shrink-0"></div>
                    <span>Detects 402 response</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1 h-1 rounded-full bg-zinc-400 mt-1.5 flex-shrink-0"></div>
                    <span>Signs USDC transaction</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1 h-1 rounded-full bg-zinc-400 mt-1.5 flex-shrink-0"></div>
                    <span>Retries with payment proof</span>
                  </div>
                </div>
                <pre className="mt-4 bg-zinc-900 text-zinc-100 p-3 rounded text-xs overflow-x-auto leading-relaxed">
{`// eliza-agent/action.ts
import { x402Client } 
  from '@elizaos/plugin-x402';

const payAction = {
  name: "PAY_FOR_SERVICE",
  async handler(runtime) {
    const result = 
      await x402Client({
        privateKey: 
          runtime.getSetting(
            "WALLET_PRIVATE_KEY"
          ),
        url: 'https://api.example.com
          /weather'
      });
    
    return result.data;
  }
};`}
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* ElizaOS Integration Section */}
        <div className="container mx-auto px-6 pb-24 max-w-5xl">
          <div className="rounded-lg border border-zinc-200 bg-gradient-to-br from-zinc-50 to-white p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold text-zinc-900 mb-4">
                  Built for ElizaOS Agents
                </h2>
                <p className="text-zinc-600 mb-6">
                  The first AI agent framework with native x402 support. ElizaOS agents can autonomously 
                  discover, evaluate, and pay for services across the internet using USDC micropayments.
                </p>
                <ul className="space-y-3 text-sm text-zinc-600">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-900 mt-2 flex-shrink-0"></div>
                    <span>90+ plugins for blockchain, social, AI, and DeFi</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-900 mt-2 flex-shrink-0"></div>
                    <span>Persistent memory and learning capabilities</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-900 mt-2 flex-shrink-0"></div>
                    <span>Natural language to autonomous payments</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-900 mt-2 flex-shrink-0"></div>
                    <span>Deploy on Solana, Base, Ethereum, and more</span>
                  </li>
                </ul>
                <div className="flex gap-3 mt-6">
                  <a
                    href="https://docs.elizaos.ai"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white rounded-lg text-sm font-medium hover:bg-zinc-800 transition-colors"
                  >
                    ElizaOS Docs
                    <ArrowRight className="w-3 h-3" />
                  </a>
                  <a
                    href="https://github.com/elizaOS/eliza"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 border border-zinc-200 text-zinc-900 rounded-lg text-sm font-medium hover:bg-zinc-50 transition-colors"
                  >
                    View on GitHub
                  </a>
                </div>
              </div>
              <div className="bg-zinc-900 rounded-lg p-6 overflow-x-auto">
                <pre className="text-xs text-zinc-100 leading-relaxed">
{`// character.json
{
  "name": "Sofia",
  "bio": [
    "AI agent that autonomously",
    "pays for data and services",
    "using x402 protocol"
  ],
  "plugins": [
    "@elizaos/plugin-solana",
    "@elizaos/plugin-x402",
    "@elizaos/plugin-twitter"
  ],
  "settings": {
    "secrets": {
      "WALLET_PRIVATE_KEY": "...",
      "SOLANA_RPC_URL": "..."
    }
  },
  "actions": [
    "PAY_FOR_SERVICE",
    "DISCOVER_SERVICES",
    "EVALUATE_PRICING"
  ]
}`}
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* Use Cases Section */}
        <div className="container mx-auto px-6 pb-24 max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-zinc-900 mb-3">
              Real-world use cases
            </h2>
            <p className="text-zinc-600">
              x402 enables new business models impossible with traditional payments
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 rounded-lg border border-zinc-200 bg-white/50">
              <h3 className="text-lg font-semibold text-zinc-900 mb-2">
                🤖 AI Agent Marketplaces
              </h3>
              <p className="text-sm text-zinc-600 mb-4">
                Autonomous agents discover and pay for services like API access, data analysis, 
                and compute without human intervention.
              </p>
              <code className="text-xs text-zinc-500 block bg-zinc-100 p-2 rounded">
                Agent requests → 402 Payment Required → Signs with wallet → Service delivered
              </code>
            </div>

            <div className="p-6 rounded-lg border border-zinc-200 bg-white/50">
              <h3 className="text-lg font-semibold text-zinc-900 mb-2">
                📊 Micropayment APIs
              </h3>
              <p className="text-sm text-zinc-600 mb-4">
                Charge $0.001 per request for data feeds, AI inference, or premium content. 
                No minimum charges, no monthly fees.
              </p>
              <code className="text-xs text-zinc-500 block bg-zinc-100 p-2 rounded">
                Pay-per-use pricing as low as 0.1¢ per API call
              </code>
            </div>

            <div className="p-6 rounded-lg border border-zinc-200 bg-white/50">
              <h3 className="text-lg font-semibold text-zinc-900 mb-2">
                🔐 Content Monetization
              </h3>
              <p className="text-sm text-zinc-600 mb-4">
                Paywall premium articles, videos, or datasets without forcing users to create 
                accounts or subscribe to monthly plans.
              </p>
              <code className="text-xs text-zinc-500 block bg-zinc-100 p-2 rounded">
                One-time payment per article, no tracking, no accounts
              </code>
            </div>

            <div className="p-6 rounded-lg border border-zinc-200 bg-white/50">
              <h3 className="text-lg font-semibold text-zinc-900 mb-2">
                ⚡ Machine-to-Machine Commerce
              </h3>
              <p className="text-sm text-zinc-600 mb-4">
                IoT devices, ML models, and autonomous systems transact directly with each other 
                using trustless, instant payments.
              </p>
              <code className="text-xs text-zinc-500 block bg-zinc-100 p-2 rounded">
                Sub-second settlement, near-zero fees, no intermediaries
              </code>
            </div>
          </div>
        </div>

        {/* Footer with Large Branding */}
        <div className="container mx-auto px-6 pb-12 max-w-5xl">
          <div className="pt-24 border-t border-zinc-200">
            {/* Large Typography */}
            <div className="text-center mb-12">
              <h2 className="text-[120px] md:text-[160px] lg:text-[200px] font-black leading-none tracking-tighter text-zinc-900" style={{ fontFamily: 'Impact, "Arial Black", sans-serif' }}>
                x402
              </h2>
              <p className="text-sm text-zinc-500 mt-4">
                The payment protocol for autonomous AI agents
              </p>
            </div>
            
            {/* Footer Links */}
            <div className="flex items-center justify-between text-sm text-zinc-600">
              <div>
                Built by <span className="font-semibold text-zinc-900">Coinbase</span> for the AI economy
              </div>
              <div className="flex items-center gap-6">
                <a
                  href="https://github.com/coinbase/x402"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-zinc-900 transition-colors"
                >
                  GitHub
                </a>
                <a
                  href="https://x402.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-zinc-900 transition-colors"
                >
                  x402.org
                </a>
                <a
                  href="https://docs.elizaos.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-zinc-900 transition-colors"
                >
                  ElizaOS
                </a>
                <Link href="/docs" className="hover:text-zinc-900 transition-colors">
                  Docs
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}