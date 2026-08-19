# Project Proposal: Anonymous Buyer Feedback (ABF)
> A Privacy-Preserving Zero-Knowledge Consumer Product & Merchant Review Platform on the Midnight Network

---

## 🎥 Live Demo Video

[![ABF Video Walkthrough](https://img.shields.io/badge/YouTube-Watch%20Live%20Demo%20Video-FF0000?style=for-the-badge&logo=youtube)](https://youtu.be/1wnKKodJlKo)

📺 **Watch on YouTube**: [https://youtu.be/1wnKKodJlKo](https://youtu.be/1wnKKodJlKo)

---

## ❓ Question 1: What is the application?

**Anonymous Buyer Feedback (ABF)** is a decentralized, privacy-preserving consumer product review and rating dApp built on the Midnight Network using Compact zero-knowledge smart contracts and the **Midnight.js SDK** (`@midnight-ntwrk/midnight-js-network-provider`, `@midnight-ntwrk/dapp-connector-api`, `@midnight-ntwrk/compact-runtime`). It allows verified consumers to submit genuine feedback and rating scores (1-5 stars) **without revealing their real name, email, home address, credit card information, or transaction receipt details** to merchants, review aggregators, or public observers.

Through local ZK proof generation on the buyer's client device:
1. **Buyers** prove authentic purchases and submit ratings without exposing sensitive financial or personal identity data.
2. **Merchants** anchor their catalog on-chain, configure minimum rating display policies, and moderate fraudulent submissions without holding toxic customer PII.
3. **Consumers** read cryptographically verifiable, untampered reviews with mathematical confidence that each review originates from a real purchase.

---

## ❓ Question 2: What problem does it solve?

Online e-commerce reviews suffer from two critical failure modes:
1. **Privacy Invasions & Doxxing Risks**: When leaving authentic feedback, buyers often expose their real identity, order history, and geographic location to merchants, opening them up to seller harassment, targeted spam, or data leaks.
2. **Review Manipulation & Sybil Attacks**: Millions of fake reviews are posted daily on major platforms because there is no cryptographic guarantee that a reviewer actually bought the product.

### How ABF Solves This via Zero-Knowledge Proofs:
- **Receipt Verification Without Disclosure**: The `submitFeedback` circuit verifies that the buyer holds a valid order invoice hash (`orderInvoiceHash`) and valid rating bounds (1-5) in ZK without publishing the invoice content.
- **Complete Buyer Anonymity**: Only a one-way Pedersen/Poseidon commitment hash binding the buyer secret key and invoice hash is published on Midnight.
- **Replay & Sybil Protection**: Each commitment binds the specific merchant product catalog ID and session epoch, preventing duplicate reviews from the same purchase across different periods.

---

## ❓ Question 3: How is Midnight used?

ABF leverages Midnight's dual-state hybrid architecture, combining private off-chain witness execution with public on-chain ledger state and Midnight.js SDK integration.

### 1. Midnight.js SDK & DApp Connector
- **`@midnight-ntwrk/dapp-connector-api`**: Provides standard browser wallet connector types (`DAppConnectorAPI`, `ConnectedAPI`, `InitialAPI`) to interact with Midnight Lace / 1AM extensions with approval popups and account resolution.
- **`@midnight-ntwrk/midnight-js-network-provider`**: Configures connections to the Midnight Preview GraphQL indexer and RPC node.
- **`@midnight-ntwrk/compact-runtime` & `@midnight-ntwrk/midnight-js-contracts`**: Manages on-chain circuit calls (`submitFeedback`, `verifyFeedback`, `flagFeedback`, `setMerchantCommitment`, `resetMerchantProduct`, `incrementSession`).

### 2. Compact Smart Contract Circuits (6 Circuits)
- **`submitFeedback(expectedMerchantId: Bytes<32>)`**: Private buyer execution circuit. Asserts merchant ID match, validates rating score bounds (1-5), generates the ZK review commitment, and increments `feedbackCount`.
- **`verifyFeedback(claimedCommitment: Bytes<32>)`**: Public verification circuit asserting the on-chain validity of a published review commitment.
- **`flagFeedback(commitmentToFlag: Bytes<32>)`**: Merchant moderation circuit. Requires the merchant's private signing key witness to verify authorized authority before flagging fraudulent reviews.
- **`setMerchantCommitment(newMinimumRating: Uint<32>)`**: Anchors merchant authority commitment on-chain and configures minimum rating criteria.
- **`resetMerchantProduct(newMerchantId: Bytes<32>, newMinimumRating: Uint<32>)`**: Rotates merchant product catalog identifier and initiates a fresh catalog epoch.
- **`incrementSession()`**: Increments the active session counter to prevent review replay attacks across catalog updates.

### 3. Public Ledger State (8 Fields)
- `feedbackCount: Counter` — Total verified buyer review commitments.
- `flaggedCount: Counter` — Total flagged / disputed review claims.
- `activeSession: Counter` — Epoch nonce for replay attack prevention.
- `merchantId: Bytes<32>` — Active merchant catalog identifier.
- `merchantCommitment: Bytes<32>` — Public authority anchor derived from merchant key.
- `lastFeedbackCommitment: Bytes<32>` — Most recent ZK review claim commitment hash.
- `lastFlaggedCommitment: Bytes<32>` — Most recent flagged review hash.
- `minimumRatingThreshold: Uint<32>` — Minimum published rating criteria (1-5).

### 4. Private Witnesses (5 Witnesses)
- `buyerSecretKey(): Bytes<32>` — Buyer private secret key (never leaves local browser).
- `orderInvoiceHash(): Bytes<32>` — SHA-256 hash of purchase invoice / order receipt.
- `ratingScore(): Uint<32>` — Private rating value (1-5) verified in ZK circuit bounds.
- `feedbackProofNonce(): Bytes<32>` — Cryptographic salt for commitment hiding.
- `merchantSigningKey(): Bytes<32>` — Merchant private key for authorized management.

---

## ❓ Question 4: What are the privacy guarantees?

### Privacy Guarantee Matrix

| Information Item | Visibility | Guarantees Provided |
|---|---|---|
| Buyer Identity & Name | **Strictly Hidden (Local)** | Generated locally in ZK witness; never leaves browser |
| Exact Order Receipt / Invoice | **Strictly Hidden (Local)** | SHA-256 hashed locally; raw invoice data never exposed |
| Exact Rating Pre-Commitment | **Strictly Hidden (Local)** | Only 1-5 range validity proved in ZK circuit |
| Review Salt Nonce | **Strictly Hidden (Local)** | Salt prevents rainbow table and linkability attacks |
| Merchant Private Key | **Strictly Hidden (Local)** | Used solely to prove authority inside `flagFeedback` |
| Total Feedback Count | **Public Ledger** | On-chain counter incremented upon valid proof submission |
| Active Merchant / Product ID | **Public Ledger** | Public catalog identifier for transparency |
| Feedback Commitment Hash | **Public Ledger** | One-way cryptographic hash for review verification |

---

## 🌐 Deployment & Infrastructure

- **Contract Address**: `0xc8b966f549c7c68b9e5faa18056e95ecfb5e8032466cb84180e289f34c13f5d5` ✅ **CONFIRMED**
- **Midnight Explorer**: [https://preview.midnightexplorer.com/contracts/0xc8b966f549c7c68b9e5faa18056e95ecfb5e8032466cb84180e289f34c13f5d5](https://preview.midnightexplorer.com/contracts/0xc8b966f549c7c68b9e5faa18056e95ecfb5e8032466cb84180e289f34c13f5d5)
- **Live Vercel Demo**: [https://anonymous-buyer-feedback.vercel.app/](https://anonymous-buyer-feedback.vercel.app/)
- **YouTube Demo Video**: [https://youtu.be/1wnKKodJlKo](https://youtu.be/1wnKKodJlKo)
- **Network**: Midnight Preview Testnet
- **Preview RPC**: `https://rpc.preview.midnight.network`
- **Preview Indexer**: `https://indexer.preview.midnight.network/api/v4/graphql`
- **Framework**: Next.js 14 App Router + Compact v0.23 SDK + Midnight.js SDK

---

## 🗺️ Level 3 Compliance Checklist

- [x] **Substantive 4-Question Response**: Thorough answers detailing real-world problem, ZK architecture, witnesses, and privacy models.
- [x] **Midnight.js SDK Integration**: `@midnight-ntwrk/midnight-js-network-provider`, `@midnight-ntwrk/dapp-connector-api`, `@midnight-ntwrk/compact-runtime` wired into client.
- [x] **Enriched Compact Contract**: 6 circuits, 8 ledger fields, 5 private witnesses.
- [x] **100% Passing Test Suite**: 10/10 Vitest unit tests covering circuit execution and witness privacy.
- [x] **Next.js 14 Web dApp**: Full interactive UI with feedback submission, merchant console, and Midnight Lace wallet connection.
- [x] **Live On-Chain Deployment**: Deployed on Midnight Preview at `0xc8b966f549c7c68b9e5faa18056e95ecfb5e8032466cb84180e289f34c13f5d5`.
- [x] **YouTube Live Demo Walkthrough**: [https://youtu.be/1wnKKodJlKo](https://youtu.be/1wnKKodJlKo).
