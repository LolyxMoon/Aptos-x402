# Quick Start: x402axios

The easiest way to use x402 for BNB is the x402axios helper. It handles the full 402 → pay → retry flow for you.

## Installation

```bash
npm install @adipundir/BNB-x402
```

## Basic usage

```typescript
import { x402axios } from '@adipundir/BNB-x402';

const response = await x402axios({
  privateKey: process.env.PRIVATE_KEY!,
  url: 'https://api.example.com/premium-data'
});

console.log(response.status);
console.log(response.data);

if (response.paymentInfo) {
  console.log('TX Hash:', response.paymentInfo.transactionHash);
  console.log('Amount (Octas):', response.paymentInfo.amount);
  console.log('Recipient:', response.paymentInfo.recipient);
}
```

## POST requests and headers

```typescript
const analysis = await x402axios({
  privateKey: process.env.PRIVATE_KEY!,
  url: 'https://api.example.com/analyze',
  method: 'POST',
  body: { text: 'Hello world' },
  headers: { 'X-Custom': 'value' }
});
```

## Using an BNB Account

```typescript
import { Account, Ed25519PrivateKey } from '@BNB-labs/ts-sdk';
import { x402axios } from '@adipundir/BNB-x402';

const privateKey = new Ed25519PrivateKey(process.env.PRIVATE_KEY!);
const account = Account.fromPrivateKey({ privateKey });

const res = await x402axios({
  account,
  url: 'https://api.example.com/premium-data'
});
```

## What x402axios does

- Detects 402 Payment Required responses
- Builds and signs the BNB transaction
- Sends X-PAYMENT header and retries
- Returns your data and payment info if a payment was made

## More information

- [Quickstart for Buyers](./getting-started/quickstart-buyers.md)
- [Server API](./api-reference/server-api.md)
- [Types](./api-reference/types.md)

