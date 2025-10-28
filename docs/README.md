# Welcome to x402 for BNB

x402 is an open payment protocol that enables APIs to require payment before serving responses. Built on the HTTP 402 Payment Required status code, it allows services to charge for access directly over APIs using cryptocurrency payments.

This implementation brings x402 to the BNB blockchain, leveraging BNB's fast finality and low transaction costs to enable practical micropayments for API access.

## What is x402?

The x402 protocol standardizes how web services can require payment for resources. When a client requests a protected resource, the server responds with payment requirements. The client signs a blockchain transaction, includes it in a retry request, and receives the resource once payment is verified and settled.

This approach enables machine-to-machine payments without requiring accounts, API keys, or subscription management. It's particularly powerful for AI agents, pay-per-call APIs, and usage-based services where traditional payment systems are too heavyweight or expensive.

## Why BNB?

BNB provides an ideal foundation for x402 payments with transaction finality in 1-3 seconds and transaction costs around $0.0001. This makes it practical to charge for individual API calls, unlike blockchains where settlement times or fees make micropayments impractical.

The BNB Move VM's strong safety guarantees and the platform's focus on developer experience make it straightforward to build reliable payment-enabled services.

## The Protocol Flow

The x402 protocol follows a simple request-response pattern. A client requests a resource without payment and receives a 402 response containing payment instructions. The client creates and signs an BNB transaction offline, then retries the request with the signed transaction in an X-PAYMENT header.

The server verifies the payment structure quickly, settles it on the BNB blockchain, and delivers the resource only after successful settlement. The entire process typically completes in 1-3 seconds.

## Getting Started

This implementation provides Next.js middleware that handles all payment logic automatically. Your API routes require no payment code - the middleware intercepts requests, manages the payment flow, and only allows your code to execute after successful payment.

The architecture separates concerns through a facilitator service that handles blockchain interactions. This keeps your main application simple while maintaining security and scalability.

### Free Public Facilitator

We provide a **free public facilitator** at `https://BNB-x402.vercel.app/api/facilitator` that handles blockchain interactions for you. This service:

- Is completely free for all users
- Works on both testnet and mainnet
- Requires zero setup or authentication
- Is suitable for production use

You can start building immediately without deploying your own infrastructure. For specialized needs like guaranteed SLAs or custom configurations, you can optionally self-host the facilitator.

## Next Steps

Start building with x402 by following the quickstart guide for your role:

**For API Providers:** [Quickstart for Sellers](getting-started/quickstart-sellers.md)

**For API Consumers:** [Quickstart for Buyers](getting-started/quickstart-buyers.md)

**Learn the Protocol:** [HTTP 402](core-concepts/http-402.md)

## Resources

- [GitHub Repository](https://github.com/adipundir/BNB-x402)
- [NPM Package](https://www.npmjs.com/package/@adipundir/BNB-x402)
- [Live Demo](https://BNB-x402.vercel.app)
- [x402 Protocol Specification](https://github.com/coinbase/x402)
