# Frequently Asked Questions

## General Questions

### What is x402?

x402 is an open protocol that enables HTTP APIs to require cryptocurrency payment before serving responses. It uses the HTTP 402 Payment Required status code and blockchain payments (USDC on BNB/Base) to enable machine-to-machine micropayments without requiring accounts or API keys.

Think of it as "pay-per-API-call" instead of monthly subscriptions.

### What is ElizaOS?

ElizaOS is a TypeScript framework for building autonomous AI agents. It provides 90+ plugins for social media, blockchain, AI models, and more. ElizaOS agents can discover, evaluate, and pay for x402-enabled services automatically using their own blockchain wallets.

### Why use blockchain payments instead of credit cards?

Traditional payment systems weren't designed for micropayments or machine-to-machine transactions:

- **Credit card fees**: $0.30 + 2.9% makes sub-dollar charges unprofitable
- **Settlement time**: T+2 days vs 1-3 seconds with blockchain
- **Minimum charges**: Most payment processors require $5-10 minimums
- **Human interaction**: Credit cards need humans; blockchain works for autonomous agents
- **Global access**: USDC works everywhere; credit cards have regional limitations

### How fast are payments?

- **Verification**: <50ms (cryptographic signature check, no blockchain)
- **Settlement**: 1-3 seconds (BNB) or 1-2 seconds (Base)
- **Total flow**: Typically completes in under 3 seconds from initial request to receiving the resource

### What does it cost?

**For API consumers:**
- Gas fees: ~$0.0001-0.001 per transaction
- Service price: Set by API provider (typically $0.001-0.10 per call)
- Protocol fees: **$0** (x402 is completely open source)

**For API providers:**
- Deployment: Free (use public facilitator)
- Infrastructure: Standard hosting costs
- Protocol fees: **$0** (x402 is completely open source)

### Which blockchains are supported?

Currently supported:
- **BNB** (mainnet, devnet) - Fastest, ~400ms finality
- **Base** (L2 Ethereum) - Ethereum ecosystem, 1-2 second finality
- **Ethereum** mainnet (via Base)

Payment token: **USDC** (USD-pegged stablecoin)

## For AI Agents

### Can AI agents use x402?

Yes! This is one of the primary use cases. ElizaOS agents can:

1. **Discover services**: Find x402-enabled APIs automatically
2. **Evaluate pricing**: Decide if a price is fair
3. **Make payments**: Sign transactions autonomously
4. **Use services**: Access paid APIs without human intervention
5. **Learn**: Remember which services provide good value

All without requiring API keys, accounts, or human approval.

### Do I need to code payment logic for my agent?

No. ElizaOS provides an x402 plugin with pre-built actions:

```typescript
import { x402Plugin } from '@elizaos/plugin-x402';

const agent = {
  name: "Olivia",
  plugins: [x402Plugin],
  actions: [
    'PAY_FOR_SERVICE',      // Automatically pays for APIs
    'DISCOVER_SERVICES',    // Finds x402 APIs
    'EVALUATE_PRICING'      // Checks if price is fair
  ]
};
```

The agent handles everything automatically based on natural language requests.

### How do agents decide when to pay?

You can configure spending limits and decision rules:

```typescript
// character.json
{
  "settings": {
    "MAX_PRICE_PER_REQUEST": "0.10",  // Max $0.10 per call
    "DAILY_BUDGET": "5.00",            // Max $5 per day
    "AUTO_APPROVE_UNDER": "0.01",      // Auto-pay if < $0.01
    "REQUIRE_APPROVAL_OVER": "0.10"    // Ask human if > $0.10
  }
}
```

Agents use these rules to make autonomous decisions.

## Security & Privacy

### Do I need a blockchain wallet?

**API providers** need a wallet address to receive payments, but don't need the private key on their servers.

**API consumers** (or AI agents) need a wallet with USDC to make payments. For development, you can generate wallets programmatically and fund them from testnet faucets.

### Is the agent's private key safe?

Private keys should be:
- Stored in environment variables (never in code)
- Kept client-side or in secure key management (AWS Secrets Manager, HashiCorp Vault)
- Never sent to servers
- Rotated periodically

ElizaOS agents sign transactions locally - the private key never leaves the agent's environment.

### Can someone steal payments?

No. The protocol uses cryptographic signatures:

1. Client signs the transaction with their private key
2. Server verifies the signature matches the expected sender
3. Payment can only go to the configured recipient address
4. Transactions are final once on-chain

Without the private key, no one can forge payments.

### What if my server is hacked?

Server-side implementations don't store private keys. The facilitator only submits transactions that clients have already signed. Worst case: an attacker could disrupt service but cannot steal funds.

For production, deploy the facilitator separately from your main application for additional security.

## Technical Questions

### Do my API routes need payment code?

**No.** The middleware handles all payment operations automatically:

```typescript
// server.ts
import { paymentMiddleware } from 'x402-express';

// One line of config
app.use(
  paymentMiddleware(
    process.env.WALLET_ADDRESS,
    { "/api/weather": { price: "$0.01" } }
  )
);

// Your API route - no payment logic needed!
app.get('/api/weather', async (req, res) => {
  const weather = await getWeather();
  res.json(weather);
});
```

Your business logic stays clean and focused.

### Can payments be refunded?

Blockchain transactions are final by default. However, you can implement refunds by:

1. Storing the client's payment address
2. Sending a separate transfer back to them
3. Implementing your own refund policy

The protocol itself doesn't include built-in refund mechanisms, but you can build them on top.

### What happens if a payment fails?

If verification or settlement fails:

1. Server returns 402 Payment Required
2. Client receives detailed error message
3. Your API route **never executes**
4. No resource is delivered

Common failures:
- Insufficient wallet balance
- Invalid signature
- Network congestion
- Incorrect payment amount

### Can I charge different amounts for different endpoints?

Yes! Configure each route independently:

```typescript
app.use(
  paymentMiddleware(
    wallet,
    {
      "/api/weather/current": { price: "$0.01" },
      "/api/weather/forecast": { price: "$0.02" },
      "/api/analysis/advanced": { price: "$0.10" },
    }
  )
);
```

The middleware automatically enforces the correct price for each endpoint.

### How do I handle rate limiting with micropayments?

You can combine x402 with traditional rate limiting:

```typescript
import rateLimit from 'express-rate-limit';

// Rate limit per wallet address
app.use('/api/*', rateLimit({
  windowMs: 60 * 1000,    // 1 minute
  max: 100,               // 100 requests per minute
  keyGenerator: (req) => {
    // Extract wallet from payment header
    return getWalletFromPayment(req.headers['x-payment']);
  }
}));
```

Or let price be your rate limiter - if calls cost $0.10 each, users naturally self-limit.

## Development & Testing

### How do I test without spending real money?

Use testnets with free test tokens:

**BNB Devnet:**
```bash
# Get free test SOL
curl -X POST https://api.devnet.BNB.com \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"requestAirdrop",
       "params":["YOUR_ADDRESS",1000000000]}'

# Configure for devnet
{ network: 'BNB-devnet' }
```

**Base Sepolia (Testnet):**
```bash
# Get free test ETH from faucet
https://portal.cdp.coinbase.com/products/faucet

# Get test USDC
https://faucet.circle.com/

# Configure for testnet
{ network: 'base-sepolia' }
```

Everything works identically to mainnet but uses test tokens with no real value.

### Can I use this in production?

**Yes!** The protocol is production-ready:

1. **Start with testnet** for development
2. **Deploy your own facilitator** (don't use public demo in prod)
3. **Switch to mainnet** when ready
4. **Monitor transactions** and implement error handling
5. **Set spending limits** for agents

Many projects already use x402 in production for AI agent commerce.

### What's a facilitator?

A facilitator is a service that handles blockchain interactions for x402 servers:

1. **Verify**: Check payment signatures (fast, no blockchain)
2. **Settle**: Submit transactions to blockchain (slow, on-chain)

Benefits:
- Keeps blockchain complexity separate from your API
- Allows multiple APIs to share one facilitator
- Improves security (no private keys on API servers)
- Can be self-hosted or use public facilitator

### Do I need to run my own facilitator?

**For development**: Use the free public facilitator at `https://x402.org/facilitator`

**For production**: Recommended to self-host for:
- Guaranteed uptime SLAs
- Custom rate limits
- Private network access
- Compliance requirements

But the public facilitator works fine for many production use cases.

## Pricing & Economics

### What's a fair price for my API?

Consider:
- **Compute cost**: What does the request cost you to serve?
- **Data value**: How valuable is the information?
- **Competitive analysis**: What do similar APIs charge?
- **Volume expectations**: Lower prices = more volume

Examples:
- Simple data lookup: $0.001-0.01
- AI inference: $0.01-0.05
- Complex analysis: $0.05-0.50
- Premium data: $0.50-5.00

Start low and adjust based on demand.

### Can I offer subscriptions?

The current protocol focuses on pay-per-use. However, you can implement subscription-like patterns:

1. **Prepaid credits**: Client pays upfront, server tracks usage
2. **Time-based access**: One payment unlocks access for N hours
3. **Batch payments**: Pay once for 100 requests

Future x402 spec may include native subscription schemes.

### How do I handle different currencies?

x402 primarily uses USDC (USD-pegged stablecoin) for stable pricing. You can:

1. **Price in dollars**: `price: "$0.01"` (most common)
2. **Price in tokens**: `price: "10000"` (in token base units)
3. **Dynamic pricing**: Update prices based on exchange rates

USDC minimizes currency risk since it's pegged to the US dollar.

## Integration

### What frameworks are supported?

**Server-side:**
- Express (Node.js)
- Next.js (API routes & middleware)
- Bun (fast JavaScript runtime)
- Any HTTP server that supports middleware

**Client-side:**
- ElizaOS (AI agents) - recommended
- Axios (JavaScript)
- Fetch API
- Any HTTP client

### Can I use this with my existing API?

Yes! Add x402 to existing APIs without breaking changes:

```typescript
// Before (free API)
app.get('/api/data', handler);

// After (add payment to some routes)
app.use(paymentMiddleware(wallet, {
  "/api/premium-data": { price: "$0.05" }
}));

app.get('/api/data', handler);        // Still free
app.get('/api/premium-data', handler); // Now requires payment
```

Free and paid endpoints can coexist.

### Does this work with GraphQL?

Yes, but requires custom integration:

```typescript
app.use('/graphql', 
  paymentMiddleware(wallet, {
    "/graphql": { price: "$0.01" }
  })
);

app.use('/graphql', graphqlHTTP({
  schema: mySchema,
  graphiql: true
}));
```

All GraphQL queries to that endpoint require payment.

## Troubleshooting

### My payment failed - why?

Common issues:

1. **Insufficient balance**: Check wallet has enough USDC + gas
2. **Wrong network**: Ensure client and server use same network
3. **Invalid signature**: Check private key is correct
4. **Expired transaction**: Retry with fresh transaction
5. **Gas price too low**: Increase gas price or wait for lower congestion

Check the error message in the 402 response for specifics.

### Payments are slow - how to speed up?

1. **Use BNB**: ~400ms vs 1-2s on Base
2. **Increase gas price**: Faster inclusion in blocks
3. **Cache responses**: Don't require payment for repeated identical requests
4. **Batch requests**: Multiple queries in one payment (future feature)

Typical flow is 1-3 seconds, which is reasonable for blockchain settlement.

### Can users avoid paying?

**No.** The middleware only executes your API code after verifying and settling payment on the blockchain. Clients cannot:

- Forge payments (cryptographic signatures)
- Replay old transactions (nonce checking)
- Reverse payments (blockchain finality)

Once a payment settles, it's final and verified.

## Ecosystem

### Who else is using x402?

Notable implementations:

- **Coinbase**: Built the protocol, hosts public facilitator
- **ElizaOS**: First AI agent framework with native x402 support
- **PayAI Network**: Multi-chain facilitator for agent commerce
- **Vercel**: MCP integration for x402 payments
- **Various AI agent projects**: Autonomous commerce platforms

The ecosystem is growing rapidly as AI agents become mainstream.

### Can I contribute to x402?

Yes! x402 is open source:

- **Protocol spec**: https://github.com/coinbase/x402
- **ElizaOS**: https://github.com/elizaOS/eliza
- **Plugin registry**: https://github.com/elizaos-plugins/registry

Contribute:
- New blockchain integrations
- Client libraries for languages
- Payment scheme implementations
- Documentation improvements

### Where can I get help?

Resources:

- **x402 Docs**: https://x402.org
- **ElizaOS Docs**: https://docs.elizaos.ai
- **GitHub Issues**: Report bugs and ask questions
- **Discord**: Join the community
- **Twitter**: @x402_org, @elizaos_ai

Community is active and helpful!

## Future of x402

### What's coming next?

**Short-term (Q4 2025):**
- ✅ Multi-chain support (BNB, Base, Ethereum)
- 🚧 MCP (Model Context Protocol) integration
- 🚧 Agent reputation systems
- 🚧 Service discovery protocol

**Medium-term (2026):**
- 🚧 Subscription payment schemes
- 🚧 Batch payment optimization
- 🚧 Cross-chain payments
- 🚧 Privacy-preserving payments

**Long-term vision:**
- Universal payment protocol for the internet
- Seamless AI agent commerce
- Micropayments for any digital resource
- Open, decentralized infrastructure

### How can I stay updated?

Follow:
- x402 blog: https://x402.org/blog
- ElizaOS updates: https://docs.elizaos.ai/changelog
- Twitter: @x402_org, @elizaos_ai
- GitHub: Watch the repositories
- Discord: Join announcements channel

---

**Still have questions?** 

Open an issue on [GitHub](https://github.com/coinbase/x402/issues) or join the [Discord community](https://discord.gg/x402)!