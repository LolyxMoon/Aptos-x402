# x402 Payment Flow - Complete Guide

## Overview

This document explains the complete payment flow for x402 with ElizaOS AI agents, API servers, and blockchain settlement.

## High-Level Flow

```
┌──────────────┐
│   AI Agent   │ (ElizaOS)
│   (Buyer)    │
└──────┬───────┘
       │ 1. Request resource
       ▼
┌──────────────┐
│  API Server  │
│  (Seller)    │
└──────┬───────┘
       │ 2. Return 402 + payment requirements
       ▼
┌──────────────┐
│   AI Agent   │
└──────┬───────┘
       │ 3. Evaluate price & budget
       ▼
┌──────────────┐
│   AI Agent   │
└──────┬───────┘
       │ 4. Sign USDC transaction
       ▼
┌──────────────┐
│  API Server  │
└──────┬───────┘
       │ 5. Verify signature
       ▼
┌──────────────┐
│ Facilitator  │
└──────┬───────┘
       │ 6. Settle on blockchain
       ▼
┌──────────────┐
│  Blockchain  │ (BNB/Base)
└──────┬───────┘
       │ 7. Confirm transaction
       ▼
┌──────────────┐
│  API Server  │
└──────┬───────┘
       │ 8. Deliver resource
       ▼
┌──────────────┐
│   AI Agent   │
└──────────────┘
```

## Detailed Flow

### Phase 1: Initial Request (No Payment)

```mermaid
sequenceDiagram
    participant Agent as AI Agent (ElizaOS)
    participant API as API Server
    
    Agent->>API: GET /api/weather HTTP/1.1<br/>Accept: application/json
    
    Note over API: Check for X-PAYMENT header<br/>Not found - payment required
    
    API->>Agent: HTTP/1.1 402 Payment Required<br/>Content-Type: application/json<br/><br/>{<br/>  "x402Version": 1,<br/>  "accepts": [{<br/>    "scheme": "exact",<br/>    "network": "base-sepolia",<br/>    "token": "USDC",<br/>    "amount": "10000",<br/>    "recipient": "0x1234..."<br/>  }]<br/>}
    
    Note over Agent: Received payment requirements
```

**HTTP Request:**
```http
GET /api/weather HTTP/1.1
Host: api.example.com
Accept: application/json
```

**HTTP Response (402):**
```http
HTTP/1.1 402 Payment Required
Content-Type: application/json

{
  "x402Version": 1,
  "accepts": [
    {
      "scheme": "exact",
      "network": "base-sepolia",
      "token": "USDC",
      "amount": "10000",
      "recipient": "0x1234567890abcdef1234567890abcdef12345678"
    }
  ]
}
```

### Phase 2: Agent Evaluation

```mermaid
sequenceDiagram
    participant Agent as AI Agent
    participant Memory as Agent Memory
    participant Wallet as Wallet Provider
    
    Agent->>Agent: Extract payment requirements<br/>(amount: $0.01, network: base-sepolia)
    
    Agent->>Memory: Check budget settings
    Memory->>Agent: MAX_PRICE: $0.10<br/>DAILY_BUDGET: $5.00<br/>Spent today: $0.45
    
    Agent->>Agent: Evaluate:<br/>$0.01 < $0.10 ✓<br/>$0.45 + $0.01 < $5.00 ✓
    
    Agent->>Wallet: Check balance
    Wallet->>Agent: Balance: 50 USDC<br/>Sufficient: ✓
    
    Agent->>Memory: Check service reputation
    Memory->>Agent: api.example.com<br/>Rating: 4.5/5<br/>Past payments: 12<br/>Success rate: 100%
    
    Agent->>Agent: Decision: APPROVE<br/>Reason: Within budget, trusted service
```

**Agent Decision Logic:**
```typescript
async function evaluatePayment(requirements) {
  const price = parseFloat(requirements.amount) / 1e6; // Convert to dollars
  
  // Check 1: Price within per-request limit
  if (price > agent.MAX_PRICE_PER_REQUEST) {
    return { decision: 'REJECT', reason: 'Exceeds max price' };
  }
  
  // Check 2: Daily budget not exceeded
  const spentToday = await agent.getSpentToday();
  if (spentToday + price > agent.DAILY_BUDGET) {
    return { decision: 'REJECT', reason: 'Daily budget exceeded' };
  }
  
  // Check 3: Wallet has sufficient balance
  const balance = await agent.getWalletBalance();
  if (balance < price) {
    return { decision: 'REJECT', reason: 'Insufficient balance' };
  }
  
  // Check 4: Service reputation
  const reputation = await agent.getServiceReputation(requirements.url);
  if (reputation.rating < 3.0) {
    return { decision: 'REJECT', reason: 'Low service reputation' };
  }
  
  // Auto-approve small amounts
  if (price < agent.AUTO_APPROVE_UNDER) {
    return { decision: 'APPROVE', reason: 'Auto-approved (small amount)' };
  }
  
  return { decision: 'APPROVE', reason: 'Within budget and trusted' };
}
```

### Phase 3: Transaction Signing (Offline)

```mermaid
sequenceDiagram
    participant Agent as AI Agent
    participant Wallet as Wallet
    
    Agent->>Wallet: Create USDC transfer<br/>To: 0x1234...<br/>Amount: 10000 (0.01 USDC)<br/>Network: base-sepolia
    
    Wallet->>Wallet: Build transaction object
    
    Wallet->>Wallet: Sign with private key<br/>(ECDSA signature)
    
    Wallet->>Wallet: Serialize transaction<br/>(EIP-712 format)
    
    Wallet->>Wallet: Base64 encode
    
    Wallet->>Agent: Signed payload<br/>{<br/>  signature: "0xabc...",<br/>  transaction: {...}<br/>}
    
    Note over Agent: Transaction signed offline<br/>No blockchain interaction yet
```

**Transaction Structure (Base):**
```json
{
  "x402Version": 1,
  "scheme": "exact",
  "network": "base-sepolia",
  "payload": {
    "from": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    "to": "0x1234567890abcdef1234567890abcdef12345678",
    "value": "10000",
    "token": "0xUSDC_CONTRACT_ADDRESS",
    "validAfter": 1698156000,
    "validBefore": 1698159600,
    "nonce": "0x123abc...",
    "signature": "0x456def..."
  }
}
```

### Phase 4: Payment Request

```mermaid
sequenceDiagram
    participant Agent as AI Agent
    participant API as API Server
    
    Agent->>Agent: Create X-PAYMENT header<br/>(base64 encoded payload)
    
    Agent->>API: GET /api/weather HTTP/1.1<br/>X-PAYMENT: eyJ4NDAyVmV...<br/>Accept: application/json
    
    Note over API: Received request with payment<br/>Extract X-PAYMENT header
```

**HTTP Request with Payment:**
```http
GET /api/weather HTTP/1.1
Host: api.example.com
Accept: application/json
X-PAYMENT: eyJ4NDAyVmVyc2lvbiI6MSwic2NoZW1lIjoiZXhhY3QiLCJuZXR3b3JrIjoi...
```

### Phase 5: Payment Verification (Fast)

```mermaid
sequenceDiagram
    participant API as API Server
    participant Facilitator as Facilitator
    
    API->>Facilitator: POST /verify<br/>{<br/>  paymentHeader: "eyJ4NDA...",<br/>  requirements: {...}<br/>}
    
    Facilitator->>Facilitator: Decode base64 payload
    
    Facilitator->>Facilitator: Validate structure<br/>✓ x402Version: 1<br/>✓ scheme: "exact"<br/>✓ network: "base-sepolia"
    
    Facilitator->>Facilitator: Verify signature<br/>✓ Signature matches sender<br/>✓ Sender = transaction.from
    
    Facilitator->>Facilitator: Check amount & recipient<br/>✓ Amount: 10000<br/>✓ Recipient: 0x1234...
    
    Facilitator->>Facilitator: Check expiry<br/>✓ validAfter < now < validBefore
    
    Facilitator->>API: HTTP 200 OK<br/>{<br/>  "isValid": true,<br/>  "invalidReason": null<br/>}<br/>X-Verification-Time: 23ms
    
    Note over API: Verification passed<br/>No blockchain interaction<br/>Total time: ~10-50ms
```

**Verification Checks:**
1. ✅ Valid base64 encoding
2. ✅ Correct x402Version (1)
3. ✅ Supported scheme ("exact")
4. ✅ Valid network identifier
5. ✅ Cryptographic signature is valid
6. ✅ Amount matches requirement
7. ✅ Recipient matches requirement
8. ✅ Transaction not expired
9. ✅ Nonce not previously used (replay protection)

### Phase 6: Payment Settlement (Slow)

```mermaid
sequenceDiagram
    participant API as API Server
    participant Facilitator as Facilitator
    participant Blockchain as Blockchain (Base)
    
    API->>Facilitator: POST /settle<br/>{<br/>  paymentHeader: "eyJ4NDA...",<br/>  network: "base-sepolia"<br/>}
    
    Facilitator->>Facilitator: Decode & deserialize<br/>transaction payload
    
    Facilitator->>Facilitator: Reconstruct signed<br/>transaction object
    
    Facilitator->>Blockchain: Submit transaction<br/>(USDC.transfer)
    
    Blockchain->>Blockchain: Validate on-chain<br/>✓ Signature valid<br/>✓ Sender has balance<br/>✓ USDC allowance OK
    
    Blockchain->>Blockchain: Execute USDC transfer<br/>From: 0x742d...<br/>To: 0x1234...<br/>Amount: 10000
    
    Blockchain->>Blockchain: Include in block<br/>Block #12345678<br/>Confirm transaction
    
    Blockchain->>Facilitator: Transaction receipt<br/>{<br/>  hash: "0xabc123...",<br/>  status: "success",<br/>  blockNumber: 12345678<br/>}
    
    Facilitator->>API: HTTP 200 OK<br/>{<br/>  "success": true,<br/>  "txHash": "0xabc123...",<br/>  "blockNumber": 12345678<br/>}<br/>X-Settlement-Time: 1247ms
    
    Note over API: Settlement confirmed<br/>Payment on blockchain<br/>Total time: ~1000-3000ms
```

**Settlement on Base:**
```typescript
// Facilitator submits transaction
const provider = new ethers.JsonRpcProvider(RPC_URL);
const tx = await provider.sendTransaction(signedTx);
const receipt = await tx.wait(1); // Wait for 1 confirmation

// Result
{
  hash: "0xabc123...",
  blockNumber: 12345678,
  gasUsed: "21000",
  status: 1 // success
}
```

### Phase 7: Resource Delivery

```mermaid
sequenceDiagram
    participant API as API Server
    participant Agent as AI Agent
    participant Memory as Agent Memory
    
    Note over API: Payment settled successfully<br/>Proceed with business logic
    
    API->>API: Execute handler<br/>const weather = getWeather()
    
    API->>API: Create response<br/>+ Add payment details<br/>to X-PAYMENT-RESPONSE
    
    API->>Agent: HTTP 200 OK<br/>Content-Type: application/json<br/>X-PAYMENT-RESPONSE: {...}<br/>X-Verification-Time: 23ms<br/>X-Settlement-Time: 1247ms<br/><br/>{<br/>  "temperature": 72,<br/>  "condition": "Sunny",<br/>  "humidity": 45<br/>}
    
    Agent->>Agent: Extract payment info<br/>from X-PAYMENT-RESPONSE
    
    Agent->>Memory: Record transaction<br/>{<br/>  service: "api.example.com",<br/>  cost: "$0.01",<br/>  txHash: "0xabc123...",<br/>  quality: 5/5,<br/>  timestamp: now<br/>}
    
    Note over Agent: Update spending totals<br/>Update service reputation
    
    Agent->>Agent: Return data to user<br/>"Temperature: 72°F, Sunny<br/>(Paid $0.01)"
```

**HTTP Response (Success):**
```http
HTTP/1.1 200 OK
Content-Type: application/json
X-Payment-Response: {"settlement":{"txHash":"0xabc123...","amount":"10000"}}
X-Verification-Time: 23ms
X-Settlement-Time: 1247ms

{
  "temperature": 72,
  "condition": "Sunny",
  "humidity": 45,
  "location": "San Francisco",
  "paid": true
}
```

## Error Flows

### Error: Insufficient Balance

```mermaid
sequenceDiagram
    participant Agent as AI Agent
    participant API as API Server
    participant Facilitator as Facilitator
    participant Blockchain as Blockchain
    
    Agent->>API: GET /api/weather<br/>X-PAYMENT: eyJ4NDA...
    
    API->>Facilitator: POST /verify
    Facilitator->>API: ✓ Valid
    
    API->>Facilitator: POST /settle
    Facilitator->>Blockchain: Submit transaction
    
    Blockchain->>Facilitator: ❌ Insufficient balance<br/>(Revert)
    
    Facilitator->>API: {<br/>  "success": false,<br/>  "error": "Insufficient balance"<br/>}
    
    API->>Agent: HTTP 402 Payment Required<br/>{<br/>  "error": "Payment settlement failed",<br/>  "reason": "Insufficient balance",<br/>  "balance": "5000",<br/>  "required": "10000"<br/>}
    
    Note over Agent: Payment failed<br/>No resource delivered
```

### Error: Invalid Signature

```mermaid
sequenceDiagram
    participant Agent as AI Agent
    participant API as API Server
    participant Facilitator as Facilitator
    
    Agent->>API: GET /api/weather<br/>X-PAYMENT: eyJ4NDA...
    
    API->>Facilitator: POST /verify
    
    Facilitator->>Facilitator: Verify signature<br/>❌ Invalid
    
    Facilitator->>API: {<br/>  "isValid": false,<br/>  "invalidReason": "Invalid signature"<br/>}
    
    API->>Agent: HTTP 402 Payment Required<br/>{<br/>  "error": "Payment verification failed",<br/>  "reason": "Invalid signature"<br/>}
    
    Note over Agent: Fast fail (~20ms)<br/>No blockchain interaction<br/>No resource delivered
```

### Error: Price Too High (Agent Rejects)

```mermaid
sequenceDiagram
    participant Agent as AI Agent
    participant API as API Server
    
    Agent->>API: GET /api/expensive
    
    API->>Agent: HTTP 402 Payment Required<br/>{<br/>  "amount": "500000" // $0.50<br/>}
    
    Agent->>Agent: Evaluate price<br/>$0.50 > $0.10 MAX_PRICE<br/>❌ REJECT
    
    Agent->>Agent: Search for alternatives
    
    Note over Agent: Find cheaper API or<br/>inform user of cost
```

## Timing Breakdown

| Phase | Duration | Blockchain | Description |
|-------|----------|------------|-------------|
| Initial 402 | 10-50ms | ❌ No | Server returns requirements |
| Agent Evaluation | 50-200ms | ❌ No | Agent decides to pay |
| Sign Transaction | 50-200ms | ❌ No | Create & sign offline |
| Verification | 10-50ms | ❌ No | Cryptographic validation |
| Settlement | 400ms-3s | ✅ Yes | Blockchain confirmation |
| API Processing | 10-100ms | ❌ No | Business logic |
| **Total (first call)** | **1-3.5s** | - | End-to-end with payment |
| **Total (cached)** | **10-150ms** | ❌ No | If response cached |

## Caching Strategy

```mermaid
graph TD
    A[Request] --> B{Cached?}
    B -->|Yes| C[Return FREE]
    B -->|No| D{Payment?}
    D -->|Yes| E[Verify & Settle]
    D -->|No| F[Return 402]
    E --> G[Get Data]
    G --> H[Cache Response]
    H --> C
```

**Implementation:**
```typescript
async function handleRequest(req, res) {
  // Check cache first
  const cached = await redis.get(cacheKey);
  if (cached) {
    return res.json(JSON.parse(cached)); // FREE!
  }
  
  // Cache miss - require payment
  const payment = req.headers['x-payment'];
  if (!payment) {
    return res.status(402).json(paymentRequirements);
  }
  
  // Verify & settle payment
  await verifyAndSettle(payment);
  
  // Get data
  const data = await getData();
  
  // Cache for 5 minutes
  await redis.setex(cacheKey, 300, JSON.stringify(data));
  
  return res.json(data);
}
```

## Complete Flow Summary

```
1. Agent requests resource → 2. Server returns 402
   ↓                              ↓
3. Agent evaluates price    ←  ─  ┘
   ↓
4. Agent signs transaction (offline)
   ↓
5. Agent retries with X-PAYMENT
   ↓
6. Server verifies signature (~20ms, no blockchain)
   ↓
7. Server settles payment (~1-3s, blockchain)
   ↓
8. Server delivers resource
   ↓
9. Agent records transaction & updates reputation

Total: ~1-3 seconds (with blockchain)
       ~20-100ms (if cached)
```

## Key Principles

1. **Fast Verification**: Cryptographic checks without blockchain (10-50ms)
2. **Atomic Delivery**: Resource ONLY delivered after blockchain confirmation
3. **Agent Autonomy**: AI decides based on budget and reputation
4. **Replay Protection**: Each transaction can only be used once
5. **Caching**: Avoid paying for repeated identical requests

## Resources

- [Protocol Sequence Diagram](protocol-sequence.md)
- [HTTP 402 Concepts](core-concepts/http-402.md)
- [ElizaOS Integration](core-concepts/elizaos.md)
- [API Reference](api-reference/server-api.md)

---

**x402 Flow: From request to payment to delivery in ~1-3 seconds**