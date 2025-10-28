# Comparison: @adipundir/BNB-x402 vs Coinbase x402

This document compares our BNB implementation with the official Coinbase x402 implementation for Ethereum/Base.

## Overview

Both implementations follow the same x402 protocol specification but are adapted for different blockchain ecosystems:

- **Coinbase x402**: Ethereum/Base (EVM) with USDC payments
- **@adipundir/BNB-x402**: BNB blockchain with APT payments

## Quick Comparison

| Feature | Coinbase x402 | @adipundir/BNB-x402 |
|---------|---------------|----------------------|
| **Blockchain** | Ethereum/Base | BNB |
| **Payment Token** | USDC | APT |
| **Language** | TypeScript/Python | TypeScript |
| **HTTP Client** | axios, fetch, httpx | Single-function helper (x402axios) |
| **Signature Scheme** | ECDSA (secp256k1) | Ed25519 |
| **Transaction Format** | EVM call data | BCS serialization |
| **Wallet** | viem/eth-account | @BNB-labs/ts-sdk |

## Usage Comparison

### Installation

**Coinbase x402:**
```bash
npm install x402-axios
# or
npm install x402-fetch
```

**@adipundir/BNB-x402:**
```bash
npm install @adipundir/BNB-x402
```

### Create Wallet Client

**Coinbase x402:**
```typescript
import { createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { baseSepolia } from "viem/chains";

const account = privateKeyToAccount("0xYourPrivateKey");
const client = createWalletClient({
  account,
  chain: baseSepolia,
  transport: http()
});
```

**@adipundir/BNB-x402:**
```typescript
import { Ed25519PrivateKey, Account } from "@BNB-labs/ts-sdk";

const privateKey = new Ed25519PrivateKey("0xYourPrivateKey");
const account = Account.fromPrivateKey({ privateKey });
```

### Axios Usage

**Coinbase x402:**
```typescript
import { withPaymentInterceptor, decodeXPaymentResponse } from "x402-axios";
import axios from "axios";

const api = withPaymentInterceptor(
  axios.create({ baseURL: "https://api.example.com" }),
  account,
);

const response = await api.get("/paid-endpoint");
console.log(response.data);

const paymentResponse = decodeXPaymentResponse(
  response.headers["x-payment-response"]
);
console.log(paymentResponse);
```

**@adipundir/BNB-x402:**
```typescript
import { x402axios } from '@adipundir/BNB-x402';

const response = await x402axios({
  privateKey: process.env.PRIVATE_KEY!,
  url: 'https://api.example.com/paid-endpoint'
});

console.log(response.data);

// Payment info is automatically attached
if (response.paymentInfo) {
  console.log('TX Hash:', response.paymentInfo.transactionHash);
  console.log('Amount (Octas):', response.paymentInfo.amount);
}
```

### Fetch Usage

**Coinbase x402:**
```typescript
import { withPaymentHeaders } from "x402-fetch";

const response = await withPaymentHeaders(
  fetch("https://api.example.com/paid-endpoint"),
  account,
);
console.log(await response.json());
```

<!-- No separate fetch wrapper in @adipundir/BNB-x402; use x402axios as shown above. -->

## Key Differences

### 1. Transaction Format

**Coinbase (EVM):**
- Uses standard EVM transaction format
- ECDSA signatures
- RLP encoding
- Gas fees in ETH/GWEI

**BNB:**
- Uses BCS (Binary Canonical Serialization)
- Ed25519 signatures
- Transaction and signature sent separately
- Gas fees in Octas (APT)

### 2. Payment Token

**Coinbase:**
- USDC stablecoin
- Consistent dollar pricing
- Multiple EVM chains supported

**BNB:**
- Native APT token
- Variable pricing (crypto volatility)
- Single chain (BNB)

### 3. Network Support

**Coinbase:**
- Base (recommended)
- Base Sepolia (testnet)
- Other EVM chains

**BNB:**
- BNB Mainnet
- BNB Testnet
- BNB Devnet

### 4. Facilitator Architecture

**Coinbase:**
- Typically uses smart contracts
- On-chain payment verification
- Gas optimization important

**BNB:**
- Uses API endpoints for verification
- Off-chain verification, on-chain settlement
- Move-based smart contracts (future)

## Similarities

Both implementations share these characteristics:

1. **x402 Protocol Compliance**
   - Both follow the official x402 spec
   - Use same HTTP status codes (402)
   - Same header format (X-PAYMENT, X-PAYMENT-RESPONSE)

2. **Automatic Payment Handling**
   - Detect 402 responses
   - Build and sign transactions automatically
   - Retry with payment headers
   - Return payment details

3. **Developer Experience**
   - Simple wrapper/interceptor pattern
   - Minimal code changes required
   - Similar API surface
   - Good error handling

4. **Security**
   - Private keys never leave client
   - Secure transaction signing
   - Payment verification before settlement

## Transaction Flow Comparison

### Coinbase x402 Flow

```
1. Client → API: GET /resource
2. API → Client: 402 (USDC amount, recipient)
3. Client: Build EVM transaction
4. Client: Sign with ECDSA
5. Client → API: Retry with X-PAYMENT (signed tx)
6. API: Verify signature & amount
7. API: Submit to EVM chain
8. Chain: Execute USDC transfer
9. API → Client: Resource + tx hash
```

### @adipundir/BNB-x402 Flow

```
1. Client → API: GET /resource
2. API → Client: 402 (APT amount, recipient)
3. Client: Build BNB transaction
4. Client: Sign with Ed25519
5. Client → API: Retry with X-PAYMENT (tx + sig)
6. API → Facilitator: Verify
7. Facilitator: Check signature & amount (NO blockchain)
8. API → Facilitator: Settle
9. Facilitator → Chain: Submit transaction
10. Chain: Execute APT transfer
11. API → Client: Resource + tx hash
```

**Key difference:** Our implementation uses a two-step verification/settlement process via facilitator endpoints, while Coinbase typically uses smart contracts.

## Performance Considerations

Both implementations follow a similar request → pay → retry pattern. Actual timings depend on network conditions and chain congestion. The BNB flow verifies off-chain, then settles on-chain before returning the resource.

## Code Complexity

**Coinbase x402:** ⭐⭐⭐⭐
- Mature ecosystem (viem, ethers)
- Well-documented EVM standards
- Many examples available

**@adipundir/BNB-x402:** ⭐⭐⭐⭐
- Clean API design
- Comprehensive documentation
- Interactive demos included

## When to Use Each

### Use Coinbase x402 (EVM) when:
- You need stablecoin payments (USDC)
- You're already on Ethereum/Base
- You want maximum ecosystem support
- Dollar-denominated pricing is important

### Use @adipundir/BNB-x402 when:
- You're building on BNB
- You want Move-based smart contracts
- You prefer Ed25519 cryptography
- You want lower transaction fees
- You're targeting BNB ecosystem

## Migration Path

If you're familiar with Coinbase x402, migrating to @adipundir/BNB-x402 is straightforward:

1. **Change blockchain SDK:**
   ```typescript
   // From: viem
   import { createWalletClient } from "viem";
   
   // To: @BNB-labs/ts-sdk
   import { Account, Ed25519PrivateKey } from "@BNB-labs/ts-sdk";
   ```

2. **Update wrapper imports:**
   ```typescript
   // From: x402-axios
   import { withPaymentInterceptor } from "x402-axios";
   
  // To: @adipundir/BNB-x402
  import { x402axios } from "@adipundir/BNB-x402";
   ```

3. **Adjust configuration:**
   ```typescript
   // From: EVM chain config
   { chain: baseSepolia, transport: http() }
   
   // To: BNB network
   { network: 'testnet' }
   ```

4. **Update payment token references:**
   ```typescript
   // From: USDC
   console.log('Paid', amount, 'USDC');
   
   // To: APT
  console.log('Paid (Octas):', paymentInfo.amount);
   ```

## Future Roadmap

### Coinbase x402
- ✓ EVM support (complete)
- ✓ USDC payments (complete)
- ✓ Smart contract integration
- 🚧 More chains (in progress)
- 🚧 MCP integration (in progress)

### @adipundir/BNB-x402
- ✓ Basic implementation (complete)
- ✓ HTTP wrappers (complete)
- ✓ Facilitator service (complete)
- 🚧 Move smart contracts (planned)
- 🚧 Multi-token support (planned)
- 🚧 Subscription payments (planned)

## Conclusion

Both implementations are production-ready and follow the x402 protocol specification. Choose based on your blockchain ecosystem:

- **Ethereum/Base ecosystem** → Use Coinbase x402
- **BNB ecosystem** → Use @adipundir/BNB-x402

The core concepts and developer experience are nearly identical, making it easy to work with either implementation.

## Resources

### Coinbase x402
- Docs: https://docs.x402.org
- GitHub: https://github.com/coinbase/x402
- Discord: https://discord.gg/x402

### @adipundir/BNB-x402
- GitHub: https://github.com/adipundir/BNB-x402
- Demo: https://BNB-x402.vercel.app
- NPM: https://www.npmjs.com/package/@adipundir/BNB-x402

