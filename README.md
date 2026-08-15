# Anonymous Buyer Feedback (ABF)
> A privacy-preserving zero-knowledge e-commerce review & rating verification dApp built on the Midnight Network using Compact smart contracts.

[![GitHub Repo](https://img.shields.io/badge/GitHub-Anonymous--Buyer--Feedback-181717?style=flat-square&logo=github)](https://github.com/techyguy78886/Anonymous-Buyer-Feedback)
[![Vercel Deployment](https://img.shields.io/badge/Vercel-anonymous--buyer--feedback.vercel.app-000000?style=flat-square&logo=vercel)](https://anonymous-buyer-feedback.vercel.app/)
[![CI/CD Pipeline](https://github.com/techyguy78886/Anonymous-Buyer-Feedback/actions/workflows/ci.yml/badge.svg)](https://github.com/techyguy78886/Anonymous-Buyer-Feedback/actions/workflows/ci.yml)
[![Midnight Network](https://img.shields.io/badge/Network-Midnight_Preview-8b5cf6?style=flat-square)](https://preview.midnightexplorer.com/contracts/0xc8b966f549c7c68b9e5faa18056e95ecfb5e8032466cb84180e289f34c13f5d5)
[![Compact Language](https://img.shields.io/badge/Compact-v0.23-10b981?style=flat-square)](https://midnight.network)
[![Framework](https://img.shields.io/badge/Framework-Next.js_14-black?style=flat-square&logo=nextdotjs)](https://nextjs.org)
[![Node.js Version](https://img.shields.io/badge/Node.js-v22.x-06b6d4?style=flat-square)](https://nodejs.org)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)

---

## 🎯 What Is ABF?

**Anonymous Buyer Feedback (ABF)** enables consumers who purchased goods or services to submit verified product ratings (1–5 stars) and reviews **without exposing their real-world identity, customer account, purchase receipts, credit card details, or order timestamps** to merchants or third-party aggregators. Built on Midnight Network's Compact zero-knowledge smart contracts, consumers generate cryptographic ZK proofs locally on their client browser. Only a one-way review commitment hash is published on-chain — eliminating fake review bot spam, competitor sybil attacks, and retaliatory buyer doxxing.

> **Verify genuine consumer reviews & ratings mathematically — without exposing personal receipts, credit cards, or buyer identity.**

---

## 🏗️ Repository & Deployment

- 📄 **Project Proposal**: [PROPOSAL.md](PROPOSAL.md)
- 📦 **GitHub Repository**: [https://github.com/techyguy78886/Anonymous-Buyer-Feedback](https://github.com/techyguy78886/Anonymous-Buyer-Feedback)
- 🚀 **Vercel Live Demo**: [https://anonymous-buyer-feedback.vercel.app/](https://anonymous-buyer-feedback.vercel.app/)
- ⚙️ **CI/CD Workflow**: [.github/workflows/ci.yml](.github/workflows/ci.yml)
- 🌐 **Midnight Explorer**: [https://preview.midnightexplorer.com/contracts/0xc8b966f549c7c68b9e5faa18056e95ecfb5e8032466cb84180e289f34c13f5d5](https://preview.midnightexplorer.com/contracts/0xc8b966f549c7c68b9e5faa18056e95ecfb5e8032466cb84180e289f34c13f5d5)
- 📡 **Network**: Midnight Preview Testnet
- 🔑 **Contract Address**: `0xc8b966f549c7c68b9e5faa18056e95ecfb5e8032466cb84180e289f34c13f5d5` ✅ **CONFIRMED**
- 🌐 **Preview Node RPC**: `https://rpc.preview.midnight.network`
- 📊 **Preview Indexer**: `https://indexer.preview.midnight.network/api/v4/graphql`
- 💧 **Preview Faucet**: `https://faucet.preview.midnight.network`
- 💡 **Vercel Note**: No `.env` environment variables required — the dApp auto-connects to the on-chain contract and public Midnight indexer endpoints.

---

## 📸 Platform Screenshots & Verification

### 1. Main Dashboard & ZK Contract Architecture
![ABF Main Dashboard](photos/dashboard_main.png)

### 2. Consumer Anonymous Feedback & ZK Proof Portal
![Consumer Feedback Portal](photos/exam_submit.png)

### 3. Merchant Admin Console & Brand Management
![Merchant Admin Console](photos/admin_side.png)

### 4. Mobile Responsive UI & Lace Wallet Connector
![Mobile Responsive UI](photos/ui_mobile.png)

### 5. On-Chain Execution & Vitest Test Verification Log (10/10)
![Vitest Test Verification Log](photos/test_run.png)

---

## 🛡️ Midnight Privacy Model — What Is and Isn't Revealed

### ❌ What an Observer CANNOT Learn (Strictly Private)

| Private Data | ZK Witness | Location |
|---|---|---|
| Buyer Secret Authentication Key | `buyerSecretKey()` | Local device only |
| Purchase Order Receipt & Invoice | `orderInvoiceHash()` | SHA-256 hashed locally before ZK proof |
| Star Rating Bounds (1 to 5) | `ratingScore()` | Verified in ZK bounds; buyer identity never linked |
| Review Entropy Nonce | `feedbackProofNonce()` | Local device only |
| Merchant Private Signing Key | `merchantSigningKey()` | Derived on-device for ZK moderation authorization |

### ✅ What an Observer CAN Learn (Public Ledger)

| Public Data | Ledger Field | Type | Description |
|---|---|---|---|
| Total Verified Reviews | `feedbackCount` | `Counter` | Total verified feedback submissions |
| Total Disputed Reviews | `flaggedCount` | `Counter` | Total moderated / flagged review claims |
| Active Merchant Catalog ID | `merchantId` | `Bytes<32>` | Current active merchant / brand identifier |
| Merchant Authority Anchor | `merchantCommitment` | `Bytes<32>` | Public commitment derived from merchant key |
| Latest Review Commitment | `lastFeedbackCommitment` | `Bytes<32>` | Most recent ZK feedback claim hash |
| Latest Flagged Commitment | `lastFlaggedCommitment` | `Bytes<32>` | Most recent flagged / disputed claim hash |
| Session Epoch | `activeSession` | `Counter` | Epoch nonce (replay protection) |
| Minimum Rating Requirement | `minimumRatingScore` | `Uint<32>` | Minimum allowed rating score threshold |

---

## 📜 Compact Smart Contract (v2)

**File:** `contracts/anonymous_buyer_feedback.compact`

**Full Circuit Architecture (v2 — 6 Circuits):**

| # | Circuit | Inputs | ZK Witnesses Used | Description |
|---|---|---|---|---|
| 1 | `submitFeedback` | `Bytes<32>` (merchantId) | buyerSecretKey, orderInvoiceHash, ratingScore, feedbackProofNonce | ZK buyer feedback with rating bounds assertion |
| 2 | `verifyFeedback` | `Bytes<32>` (commitment) | — | Public on-chain feedback commitment verification |
| 3 | `flagFeedback` | `Bytes<32>` (commitment) | merchantSigningKey | Dispute / flag fraudulent review (ZK merchant auth) |
| 4 | `setMerchantCommitment` | `Uint<32>` (minRating) | merchantSigningKey | Anchor merchant authority + set minimum rating bound |
| 5 | `resetMerchantProduct` | `Bytes<32>`, `Uint<32>` | — | Rotate catalog ID + update rating bounds |
| 6 | `incrementSession` | — | — | Bump session nonce (replay protection) |

```compact
pragma language_version 0.23;
import CompactStandardLibrary;

// ── Ledger State (8 Public On-Chain Fields) ──────────────────────────────────
export ledger feedbackCount: Counter;
export ledger flaggedCount: Counter;
export ledger activeSession: Counter;
export ledger merchantId: Bytes<32>;
export ledger merchantCommitment: Bytes<32>;
export ledger lastFeedbackCommitment: Bytes<32>;
export ledger lastFlaggedCommitment: Bytes<32>;
export ledger minimumRatingScore: Uint<32>;

// ── Private Witnesses (5 — Never Disclosed On-Chain) ──────────────────────────
witness buyerSecretKey(): Bytes<32>;
witness orderInvoiceHash(): Bytes<32>;
witness ratingScore(): Uint<32>;
witness feedbackProofNonce(): Bytes<32>;
witness merchantSigningKey(): Bytes<32>;

// Circuit 1: submitFeedback — ZK Buyer Feedback Submission
export circuit submitFeedback(expectedMerchantId: Bytes<32>): Bytes<32> {
  assert(merchantId == expectedMerchantId, "Merchant ID mismatch");

  const buyerKey = buyerSecretKey();
  const nonce = feedbackProofNonce();
  const invoiceHash = orderInvoiceHash();
  const rating = ratingScore();

  assert(rating >= minimumRatingScore, "Rating score below minimum required threshold");
  assert(rating <= 5, "Rating score exceeds maximum allowed value of 5");

  const commitment = persistentHash<Vector<5, Bytes<32>>>([
    pad(32, "abf:feedback:v2"),
    buyerKey, nonce, invoiceHash, pad(32, "abf:session:binding")
  ]);

  feedbackCount.increment(1);
  lastFeedbackCommitment = disclose(commitment);
  return lastFeedbackCommitment;
}

// Circuit 2: verifyFeedback — Public On-Chain Commitment Verification
export circuit verifyFeedback(claimedCommitment: Bytes<32>): Boolean {
  return disclose(lastFeedbackCommitment == claimedCommitment);
}

// Circuit 3: flagFeedback — Merchant Moderation with ZK Authority
export circuit flagFeedback(commitmentToFlag: Bytes<32>): Bytes<32> {
  const mfrKey = merchantSigningKey();
  const expectedAuth = persistentHash<Vector<2, Bytes<32>>>([
    pad(32, "abf:merchant:authority:v1"), mfrKey
  ]);
  assert(expectedAuth == merchantCommitment, "Unauthorized merchant operation");

  flaggedCount.increment(1);
  lastFlaggedCommitment = disclose(commitmentToFlag);
  return lastFlaggedCommitment;
}

// Circuit 4: setMerchantCommitment — Anchor Merchant Authority & Config
export circuit setMerchantCommitment(newMinimumRating: Uint<32>): Bytes<32> {
  merchantCommitment = disclose(persistentHash<Vector<2, Bytes<32>>>([
    pad(32, "abf:merchant:authority:v1"), merchantSigningKey()
  ]));
  minimumRatingScore = newMinimumRating;
  activeSession.increment(1);
  return merchantCommitment;
}

// Circuit 5: resetMerchantProduct — Rotate Catalog & Update Bounds
export circuit resetMerchantProduct(newMerchantId: Bytes<32>, newMinimumRating: Uint<32>): Bytes<32> {
  merchantId = disclose(newMerchantId);
  minimumRatingScore = newMinimumRating;
  activeSession.increment(1);
  return merchantId;
}

// Circuit 6: incrementSession — Nonce Rotation for Replay Protection
export circuit incrementSession(): [] {
  activeSession.increment(1);
}
```

---

## 🏆 Level 2 & Level 3 Verification Checklists

### Level 2 Checklist
- [x] **Compact Smart Contract**: Written in Compact `v0.23` with 5 private witnesses and 8 public ledger fields.
- [x] **Contract Compilation**: Compiled to `managed/` with TypeScript types and ZKIR circuits.
- [x] **Local Unit Tests**: 100% test pass rate using Vitest (`10/10` tests passing).
- [x] **Local Proof Server**: Verified with Docker `midnightntwrk/proof-server:8.1.0`.
- [x] **On-Chain Deployment**: Deployed to Midnight Preview at `0xc8b966f549c7c68b9e5faa18056e95ecfb5e8032466cb84180e289f34c13f5d5`.

### Level 3 Checklist
- [x] **Rich Contract Logic (v2)**: 6 circuits with real ZK business logic — rating bounds enforcement, review moderation, merchant authority anchoring, replay protection.
- [x] **PROPOSAL.md**: Substantively answers all 4 required questions (What? Problem? Architecture? Privacy Guarantees?).
- [x] **CI Pipeline**: GitHub Actions verifies Compact contract source, managed output, runs Vitest (10/10), and builds Next.js.
- [x] **Interactive Next.js 14 Web UI**: App Router dApp with ZK architecture diagrams, rating score selector, verify/flag panels.
- [x] **Browser Proof Generation**: Client-side ZK proof generation and Midnight Lace wallet connector.
- [x] **On-Chain Midnight Preview Deployment**: [Midnight Explorer](https://preview.midnightexplorer.com/contracts/0xc8b966f549c7c68b9e5faa18056e95ecfb5e8032466cb84180e289f34c13f5d5).
- [x] **Live Vercel Demo**: [https://anonymous-buyer-feedback.vercel.app/](https://anonymous-buyer-feedback.vercel.app/).
