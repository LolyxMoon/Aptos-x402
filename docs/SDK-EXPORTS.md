# SDK Exports - x402 for AI Agents & APIs

## Overview

The x402 ecosystem provides SDKs for both **AI agents** (consuming paid APIs) and **API providers** (monetizing services). This guide covers the main packages and their exports.

---

## For AI Agents (ElizaOS)

### **Plugin: `@elizaos/plugin-x402`**

The ElizaOS x402 plugin provides autonomous payment capabilities for AI agents.

#### Installation

```bash
# Included in ElizaOS
pnpm add @elizaos/plugin-x402
```

#### Plugin Configuration

```typescript
// character.json
{
  "name": "Sofia",
  "plugins": [
    "@elizaos/plugin-x402",
    "@elizaos/plugin-solana"
  ],
  "settings": {
    "secrets": {
      "WALLET_PRIVATE_KEY": "...",
      "SOLANA_RPC_URL": "https://api.devnet.solana.com"
    },
    "MAX_PRICE_PER_REQUEST": "0.10",
    "DAILY_BUDGET": "5.00",
    "AUTO_APPROVE_UNDER": "0.01"
  }
}
```

#### Exported Actions

```typescript
import { 
  payForServiceAction,      // Pay for x402-protected APIs
  discoverServicesAction,   // Find x402 APIs
  evaluatePricingAction,    // Evaluate if price is fair
  manageWalletAction        // Check balance, view transactions
} from '@elizaos/plugin-x402';
```

##### 1. Pay For Service Action

```typescript
// Autonomous payment for APIs
export const payForServiceAction: Action = {
  name: 'PAY_FOR_SERVICE',
  description: 'Automatically pay for x402-protected API services',
  
  async handler(runtime: IAgentRuntime, message: Memory) {
    // Agent evaluates price and pays autonomously
    const result = await x402Client({
      privateKey: runtime.getSetting('WALLET_PRIVATE_KEY'),
      url: extractUrl(message.content.text),
      maxPrice: runtime.getSetting('MAX_PRICE_PER_REQUEST')
    });
    
    return {
      success: true,
      data: result.data,
      cost: result.paymentInfo.amount,
      txHash: result.paymentInfo.transactionHash
    };
  }
};

// Usage in agent
// User: "Get me weather data from the premium API"
// Agent: *automatically pays $0.01 and retrieves data*
```

##### 2. Discover Services Action

```typescript
// Find x402-enabled APIs
export const discoverServicesAction: Action = {
  name: 'DISCOVER_SERVICES',
  description: 'Find x402-enabled APIs by category',
  
  async handler(runtime: IAgentRuntime, message: Memory) {
    const query = extractQuery(message.content.text);
    const services = await searchX402Registry(query);
    
    // Filter by budget
    const maxPrice = runtime.getSetting('MAX_PRICE_PER_REQUEST');
    const affordable = services.filter(s => 
      parseFloat(s.price) <= maxPrice
    );
    
    return { services: affordable };
  }
};

// Usage
// User: "Find me weather APIs"
// Agent: *searches and returns list of affordable x402 weather APIs*
```

##### 3. Evaluate Pricing Action

```typescript
// Evaluate if a service's price is fair
export const evaluatePricingAction: Action = {
  name: 'EVALUATE_PRICING',
  description: 'Evaluate if API pricing is fair and within budget',
  
  async handler(runtime: IAgentRuntime, message: Memory) {
    const url = extractUrl(message.content.text);
    const pricing = await getPricingInfo(url);
    const maxPrice = runtime.getSetting('MAX_PRICE_PER_REQUEST');
    
    const evaluation = {
      affordable: parseFloat(pricing.price) <= maxPrice,
      price: pricing.price,
      maxPrice: maxPrice,
      alternatives: []
    };
    
    // Find cheaper alternatives if needed
    if (!evaluation.affordable) {
      evaluation.alternatives = await findCheaperAlternatives(pricing.category);
    }
    
    return evaluation;
  }
};

// Usage
// User: "Is $0.15 per request fair for this API?"
// Agent: *evaluates and suggests cheaper alternatives*
```

#### Exported Providers

```typescript
import {
  walletProvider,              // Wallet balance and address
  transactionHistoryProvider,  // Payment history
  budgetProvider               // Budget tracking
} from '@elizaos/plugin-x402';
```

##### Wallet Provider

```typescript
// Provides wallet context to agent
export const walletProvider: Provider = {
  get: async (runtime: IAgentRuntime) => ({
    address: runtime.getSetting('WALLET_ADDRESS'),
    balance: await getBalance(runtime),
    network: runtime.getSetting('NETWORK'),
    canPay: (await getBalance(runtime)) > 0
  })
};
```

##### Transaction History Provider

```typescript
// Provides payment history context
export const transactionHistoryProvider: Provider = {
  get: async (runtime: IAgentRuntime) => {
    const payments = await runtime.getMemories({
      action: 'PAY_FOR_SERVICE',
      limit: 50
    });
    
    return {
      payments: payments.map(p => ({
        service: p.metadata.url,
        amount: p.metadata.cost,
        timestamp: p.metadata.timestamp,
        txHash: p.metadata.txHash
      })),
      totalSpent: payments.reduce((sum, p) => sum + parseFloat(p.metadata.cost), 0)
    };
  }
};
```

#### Exported Client

```typescript
import { x402Client } from '@elizaos/plugin-x402';

// Low-level client for custom implementations
const response = await x402Client({
  privateKey: '0x...',
  url: 'https://api.example.com/data',
  network: 'base-sepolia',
  maxPrice: '0.10',
  timeout: 30000
});

console.log(response.data);
console.log(response.paymentInfo);
```

---

## For API Providers (Server-Side)

### **Package: `x402-express`**

Middleware for Express/Next.js to add x402 payment protection.

#### Installation

```bash
npm install x402-express
```

#### Main Export: `paymentMiddleware`

```typescript
import { paymentMiddleware } from 'x402-express';
import express from 'express';

const app = express();

// Configure payment middleware
app.use(
  paymentMiddleware(
    process.env.WALLET_ADDRESS!,  // Your payment recipient address
    {
      // Route configuration
      "GET /api/weather": {
        price: "$0.01",           // Price in dollars
        network: "base-sepolia"   // or "solana-devnet"
      },
      "POST /api/analyze": {
        price: "$0.05",
        network: "base-sepolia"
      }
    },
    {
      // Facilitator configuration
      url: "https://x402.org/facilitator"  // Free public facilitator
    }
  )
);

// Your API routes - payment handled automatically!
app.get('/api/weather', async (req, res) => {
  const weather = await getWeather();
  res.json(weather);
});
```

#### Types

```typescript
interface RouteConfig {
  price: string;              // "$0.01" or "10000" (in base units)
  network?: string;           // Default: 'base-sepolia'
  description?: string;       // API endpoint description
  mimeType?: string;          // Response content type
  maxTimeoutSeconds?: number; // Payment timeout
}

interface FacilitatorConfig {
  url: string;                // Facilitator base URL
  timeout?: number;           // Request timeout (default: 30000ms)
}
```

### Advanced Server Functions

```typescript
import {
  verifyPayment,      // Verify payment signature
  settlePayment,      // Settle payment on blockchain
  createPaymentResponse  // Create X-Payment-Response header
} from 'x402-express';

// Custom implementation example
app.post('/custom-endpoint', async (req, res) => {
  const paymentHeader = req.headers['x-payment'];
  
  if (!paymentHeader) {
    return res.status(402).json({
      x402Version: 1,
      accepts: [{
        scheme: 'exact',
        network: 'base-sepolia',
        token: 'USDC',
        amount: '10000',
        recipient: process.env.WALLET_ADDRESS
      }]
    });
  }
  
  // Verify payment
  const verification = await verifyPayment(
    paymentHeader,
    process.env.WALLET_ADDRESS,
    '10000',
    'base-sepolia'
  );
  
  if (!verification.isValid) {
    return res.status(402).json({
      error: 'Payment verification failed',
      reason: verification.invalidReason
    });
  }
  
  // Settle payment
  const settlement = await settlePayment(
    paymentHeader,
    'base-sepolia'
  );
  
  if (!settlement.success) {
    return res.status(402).json({
      error: 'Payment settlement failed'
    });
  }
  
  // Deliver resource
  const data = await getProtectedData();
  
  res.set('X-Payment-Response', createPaymentResponse(settlement));
  res.json(data);
});
```

---

## For Buyers (Non-Agent Clients)

### **Package: `x402-axios`**

Axios interceptor for automatic x402 payments.

#### Installation

```bash
npm install x402-axios
```

#### Exports

```typescript
import { 
  withPaymentInterceptor,   // Add payment to axios instance
  decodeXPaymentResponse    // Decode payment response header
} from 'x402-axios';
```

#### Usage

```typescript
import axios from 'axios';
import { withPaymentInterceptor, decodeXPaymentResponse } from 'x402-axios';
import { privateKeyToAccount } from 'viem/accounts';

// Create account
const account = privateKeyToAccount('0xYourPrivateKey');

// Create axios client with payment interceptor
const client = withPaymentInterceptor(
  axios.create({ baseURL: 'https://api.example.com' }),
  account
);

// Make requests - payment handled automatically!
const response = await client.get('/premium/data');
console.log(response.data);

// Check payment details
const paymentResponse = decodeXPaymentResponse(
  response.headers['x-payment-response']
);
console.log('Paid:', paymentResponse.settlement.amount);
console.log('TX Hash:', paymentResponse.settlement.txHash);
```

### **Package: `x402-fetch`**

Fetch wrapper for automatic x402 payments.

#### Installation

```bash
npm install x402-fetch
```

#### Exports

```typescript
import { withPaymentHeaders } from 'x402-fetch';
```

#### Usage

```typescript
import { withPaymentHeaders } from 'x402-fetch';
import { privateKeyToAccount } from 'viem/accounts';

const account = privateKeyToAccount('0xYourPrivateKey');

// Wrap fetch with automatic payment
const response = await withPaymentHeaders(
  fetch('https://api.example.com/premium/data'),
  account
);

const data = await response.json();
console.log(data);
```

---

## Utility Functions

### Blockchain Utilities (Solana)

```typescript
import {
  Connection,
  Keypair,
  PublicKey,
  Transaction,
  SystemProgram,
  sendAndConfirmTransaction
} from '@solana/web3.js';

// Get Solana connection
const connection = new Connection(
  'https://api.devnet.solana.com',
  'confirmed'
);

// Create keypair from private key
const keypair = Keypair.fromSecretKey(
  Buffer.from(privateKey, 'hex')
);

// Get balance
const balance = await connection.getBalance(keypair.publicKey);
console.log('Balance:', balance / 1e9, 'SOL');

// Transfer USDC (SPL Token)
import { getAssociatedTokenAddress, createTransferInstruction } from '@solana/spl-token';

const tokenMint = new PublicKey('USDC_MINT_ADDRESS');
const fromAta = await getAssociatedTokenAddress(tokenMint, keypair.publicKey);
const toAta = await getAssociatedTokenAddress(tokenMint, recipient);

const transferIx = createTransferInstruction(
  fromAta,
  toAta,
  keypair.publicKey,
  amount
);

const transaction = new Transaction().add(transferIx);
const signature = await sendAndConfirmTransaction(connection, transaction, [keypair]);
```

### Blockchain Utilities (Base / Ethereum)

```typescript
import { 
  createWalletClient,
  http,
  parseEther,
  formatEther
} from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { base, baseSepolia } from 'viem/chains';

// Create wallet client
const account = privateKeyToAccount('0xPrivateKey');
const client = createWalletClient({
  account,
  chain: baseSepolia,
  transport: http()
});

// Get balance
const balance = await client.getBalance({ address: account.address });
console.log('Balance:', formatEther(balance), 'ETH');

// Send USDC (ERC-20)
const usdcContract = '0xUSDC_CONTRACT_ADDRESS';
const transferHash = await client.writeContract({
  address: usdcContract,
  abi: [
    {
      name: 'transfer',
      type: 'function',
      inputs: [
        { name: 'to', type: 'address' },
        { name: 'amount', type: 'uint256' }
      ]
    }
  ],
  functionName: 'transfer',
  args: [recipient, amount]
});
```

---

## Complete Type Definitions

### ElizaOS Plugin Types

```typescript
interface X402PaymentInfo {
  transactionHash: string;
  amount: string;
  recipient: string;
  network: string;
  settled: boolean;
  timestamp: number;
}

interface X402ClientOptions {
  privateKey?: string;
  account?: Account;
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: any;
  headers?: Record<string, string>;
  network?: string;
  maxPrice?: string;
  timeout?: number;
}

interface X402Response<T = any> {
  status: number;
  data: T;
  headers: Record<string, string>;
  paymentInfo?: X402PaymentInfo;
  cached?: boolean;
}
```

### Server Types

```typescript
interface PaymentRequirements {
  x402Version: number;
  accepts: Array<{
    scheme: string;
    network: string;
    token: string;
    amount: string;
    recipient: string;
  }>;
}

interface VerificationResult {
  isValid: boolean;
  invalidReason?: string;
  verificat ionTime: number;
}

interface SettlementResult {
  success: boolean;
  txHash?: string;
  blockNumber?: number;
  settlementTime: number;
  error?: string;
}
```

---

## Quick Reference

### For AI Agents (ElizaOS)
```typescript
import { x402Plugin } from '@elizaos/plugin-x402';

const agent = {
  plugins: [x402Plugin],
  settings: {
    MAX_PRICE_PER_REQUEST: "0.10",
    DAILY_BUDGET: "5.00"
  }
};
```

### For API Providers
```typescript
import { paymentMiddleware } from 'x402-express';

app.use(
  paymentMiddleware(wallet, {
    "/api/data": { price: "$0.01" }
  })
);
```

### For API Consumers
```typescript
import { withPaymentInterceptor } from 'x402-axios';

const client = withPaymentInterceptor(axios.create(), account);
const data = await client.get('/api/data');
```

---

## Examples Repository

Complete working examples:
- [ElizaOS Agent Example](https://github.com/elizaOS/eliza/tree/main/examples/x402-agent)
- [Express Server Example](https://github.com/coinbase/x402/tree/main/examples/typescript/express)
- [Axios Client Example](https://github.com/coinbase/x402/tree/main/examples/typescript/axios)
- [Next.js Full Stack Example](https://github.com/coinbase/x402/tree/main/examples/typescript/nextjs)

---

## Support

- **Documentation**: https://x402.org
- **ElizaOS Docs**: https://docs.elizaos.ai
- **GitHub Issues**: https://github.com/coinbase/x402/issues
- **Discord**: https://discord.gg/x402

---

**Build autonomous AI agents with x402 - payments made simple!**