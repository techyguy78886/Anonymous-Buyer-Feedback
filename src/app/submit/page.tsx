"use client";

import { useState } from "react";
import { getClient, NETWORK_CONFIG, type AnonymousBuyerFeedbackClient } from "../../lib/contract";
import type { ConnectedAPI } from "@midnight-ntwrk/dapp-connector-api";
import type { NetworkConfiguration } from "@midnight-ntwrk/midnight-js-network-provider";
import type { MidnightProviders } from "@midnight-ntwrk/midnight-js-types";
import Link from "next/link";

export default function SubmitFeedbackPage() {
  const [merchantId, setMerchantId] = useState("merchant_apple_store_us");
  const [buyerSecretKey, setBuyerSecretKey] = useState("");
  const [orderInvoice, setOrderInvoice] = useState("");
  const [ratingScore, setRatingScore] = useState(5);
  const [reviewComments, setReviewComments] = useState("");
  const [loading, setLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [verifyResult, setVerifyResult] = useState<any>(null);
  const [claimedCommitment, setClaimedCommitment] = useState("");
  const [logs, setLogs] = useState<{ msg: string; type: string }[]>([]);

  const addLog = (msg: string, type = "info") => setLogs(l => [...l, { msg, type }]);

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLogs([]);
    setResult(null);
    setVerifyResult(null);

    try {
      addLog("> [WALLET] Connecting to Midnight Lace Wallet via @midnight-ntwrk/dapp-connector-api...", "info");
      addLog(`> [NETWORK] Using Midnight Network Provider (NetworkId: ${NETWORK_CONFIG.networkId})`, "info");
      addLog(`> [ZK WITNESS] buyerSecretKey() - private customer secret loaded`, "info");
      addLog(`> [ZK WITNESS] orderInvoiceHash() - receipt SHA-256 hashed locally`, "info");
      addLog(`> [ZK WITNESS] ratingScore() = ${ratingScore} Stars (asserting 1 <= rating <= 5)...`, "info");
      addLog(`> [CIRCUIT] Invoking submitFeedback(Bytes<32>) on Midnight Preview...`, "info");

      const client: AnonymousBuyerFeedbackClient = getClient();
      client.setBuyerKey(buyerSecretKey || "sample_buyer_secret_key");
      client.setInvoiceHash(orderInvoice || "sample_order_invoice_hash");
      client.setRatingScore(ratingScore);

      const res = await client.submitFeedback(merchantId);

      setResult(res);
      setClaimedCommitment(res.commitmentHex);
      addLog(`> [SUCCESS] ZK Buyer Feedback commitment anchored on-chain!`, "success");
      addLog(`> [COMMITMENT] ${res.commitmentHex}`, "success");
      addLog(`> [TX HASH] ${res.txHash}`, "success");
      addLog(`> [FEE] ${res.txFee} ${res.txFeeAsset} paid by ${res.signedBy}`, "success");
    } catch (err: any) {
      addLog(`> [ERROR] ${err?.message || err}`, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCommitment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!claimedCommitment) return;
    setVerifyLoading(true);
    try {
      addLog(`> [CIRCUIT] Executing verifyFeedback(Bytes<32>) for commitment...`, "info");
      const client = getClient();
      const res = await client.verifyFeedback(claimedCommitment);
      setVerifyResult(res);
      addLog(`> [VERIFY] On-chain proof verification status: ${res.matches ? "VALID" : "INVALID"}`, res.matches ? "success" : "error");
    } catch (err: any) {
      addLog(`> [VERIFY ERROR] ${err?.message || err}`, "error");
    } finally {
      setVerifyLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 880, margin: "0 auto", padding: "2rem 1.5rem 5rem" }}>
      {/* ── Page Header ── */}
      <div style={{ marginBottom: "2rem" }}>
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem", flexWrap: "wrap" }}>
          <span className="badge badge-emerald">Review Prover</span>
          <span className="badge badge-cyan">Client Prover (Midnight.js)</span>
          <span className="badge badge-gold">Midnight Preview</span>
        </div>
        <h1 className="section-title">Anonymous Feedback Submission</h1>
        <p className="section-desc">
          Submit authentic, verified product feedback in zero-knowledge. Your purchase receipt is proven valid without revealing your name, address, credit card details, or transaction items.
        </p>
      </div>

      {/* ── Submission Form Card ── */}
      <div className="glass-card" style={{ padding: "2rem", marginBottom: "2rem", borderLeft: "3px solid #10b981" }}>
        <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "#10b981", marginBottom: "1.25rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>
          🔒 Step 1 — Buyer Proof Parameters
        </div>

        <form onSubmit={handleSubmitFeedback} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div>
            <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "#94a3b8", display: "block", marginBottom: "0.4rem" }}>
              Target Merchant Identifier (Public Parameter)
            </label>
            <input
              type="text"
              id="merchantId"
              value={merchantId}
              onChange={e => setMerchantId(e.target.value)}
              placeholder="e.g. merchant_apple_store_us"
              required
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
            <div>
              <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "#94a3b8", display: "block", marginBottom: "0.4rem" }}>
                Buyer Secret Key (ZK Witness — buyerSecretKey())
              </label>
              <input
                type="password"
                id="buyerSecretKey"
                value={buyerSecretKey}
                onChange={e => setBuyerSecretKey(e.target.value)}
                placeholder="Private key (never leaves your browser)"
                autoComplete="off"
              />
            </div>

            <div>
              <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "#94a3b8", display: "block", marginBottom: "0.4rem" }}>
                Order Receipt / Invoice Identifier (ZK Witness)
              </label>
              <input
                type="text"
                id="orderInvoice"
                value={orderInvoice}
                onChange={e => setOrderInvoice(e.target.value)}
                placeholder="e.g. INV-2026-987452-AMZ (hashed locally in SHA-256)"
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "#94a3b8", display: "block", marginBottom: "0.5rem" }}>
              Verified Rating Score: <span style={{ color: "#eab308", fontWeight: 700 }}>{"★".repeat(ratingScore)}{"☆".repeat(5 - ratingScore)} ({ratingScore}/5 Stars)</span>
            </label>
            <input
              type="range"
              min={1}
              max={5}
              step={1}
              value={ratingScore}
              onChange={e => setRatingScore(Number(e.target.value))}
              style={{ width: "100%", accentColor: "#10b981" }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.72rem", color: "#64748b", marginTop: "0.25rem" }}>
              <span>1 Star (Poor)</span>
              <span>2 Stars (Fair)</span>
              <span>3 Stars (Average)</span>
              <span>4 Stars (Good)</span>
              <span>5 Stars (Excellent)</span>
            </div>
          </div>

          <div>
            <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "#94a3b8", display: "block", marginBottom: "0.4rem" }}>
              Review Comments (Optional Feedback Narrative)
            </label>
            <textarea
              rows={3}
              id="reviewComments"
              value={reviewComments}
              onChange={e => setReviewComments(e.target.value)}
              placeholder="e.g. Exceptional product quality and swift customer support. Highly recommended!"
            />
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
            id="submitFeedbackBtn"
            style={{ marginTop: "0.5rem" }}
          >
            {loading ? (
              <>
                <span className="spinner" /> Generating ZK Proof & Submitting...
              </>
            ) : (
              "🔒 Generate ZK Proof & Submit Anonymous Feedback"
            )}
          </button>
        </form>
      </div>

      {/* ── Activity Execution Log ── */}
      {logs.length > 0 && (
        <div className="glass-card" style={{ padding: "1.25rem", marginBottom: "2rem" }}>
          <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "#64748b", marginBottom: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            ZK Prover & Activity Log
          </div>
          <div className="log-box">
            {logs.map((l, i) => (
              <div key={i} className={`log-${l.type}`}>{l.msg}</div>
            ))}
          </div>
        </div>
      )}

      {/* ── Submission Result Card ── */}
      {result && (
        <div className="glass-card fade-in" style={{ padding: "1.75rem", marginBottom: "2rem", border: "1px solid rgba(16, 185, 129, 0.4)", background: "rgba(16, 185, 129, 0.04)" }}>
          <div style={{ color: "#10b981", fontWeight: 700, fontSize: "1.1rem", marginBottom: "1rem" }}>
            ✅ ZK Buyer Feedback Successfully Anchored On-Chain
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <div>
              <span style={{ fontSize: "0.75rem", color: "#64748b" }}>Feedback Commitment Hash (Bytes&lt;32&gt;):</span>
              <code style={{ display: "block", fontSize: "0.82rem", color: "#10b981", wordBreak: "break-all", marginTop: "0.2rem" }}>
                {result.commitmentHex}
              </code>
            </div>

            <div>
              <span style={{ fontSize: "0.75rem", color: "#64748b" }}>Transaction Hash:</span>
              <code style={{ display: "block", fontSize: "0.82rem", color: "#06b6d4", wordBreak: "break-all", marginTop: "0.2rem" }}>
                {result.txHash}
              </code>
            </div>

            <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap", marginTop: "0.5rem" }}>
              <div>
                <span style={{ fontSize: "0.75rem", color: "#64748b" }}>Rating Score Valid:</span>
                <div style={{ fontSize: "0.88rem", fontWeight: 600, color: "#10b981" }}>✅ 1-5 Range Verified</div>
              </div>
              <div>
                <span style={{ fontSize: "0.75rem", color: "#64748b" }}>Transaction Fee:</span>
                <div style={{ fontSize: "0.88rem", fontWeight: 600, color: "#f8fafc" }}>{result.txFee} {result.txFeeAsset}</div>
              </div>
              <div>
                <span style={{ fontSize: "0.75rem", color: "#64748b" }}>Signed By:</span>
                <div style={{ fontSize: "0.88rem", fontWeight: 600, color: "#94a3b8" }}>{result.signedBy}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Public Verification Card ── */}
      <div className="glass-card" style={{ padding: "1.75rem", borderLeft: "3px solid #06b6d4" }}>
        <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#06b6d4", marginBottom: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>
          🔍 Step 2 — Verify Feedback Commitment (Public Circuit)
        </div>
        <p style={{ fontSize: "0.83rem", color: "#94a3b8", marginBottom: "1rem" }}>
          Merchants and observers can verify that a specific feedback commitment exists in the latest public on-chain ledger state without knowing the buyer identity.
        </p>

        <form onSubmit={handleVerifyCommitment} style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <input
            type="text"
            id="claimedCommitment"
            value={claimedCommitment}
            onChange={e => setClaimedCommitment(e.target.value)}
            placeholder="0x... feedback commitment hash to verify"
            style={{ flex: 1, minWidth: 260 }}
            required
          />
          <button type="submit" className="btn-secondary" disabled={verifyLoading || !claimedCommitment} id="verifyCommitmentBtn">
            {verifyLoading ? <><span className="spinner" /> Verifying...</> : "Verify On-Chain"}
          </button>
        </form>

        {verifyResult && (
          <div className="fade-in" style={{ marginTop: "1rem", padding: "1rem", borderRadius: "8px", background: verifyResult.matches ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)", border: `1px solid ${verifyResult.matches ? "rgba(16, 185, 129, 0.3)" : "rgba(239, 68, 68, 0.3)"}` }}>
            <span style={{ fontWeight: 700, color: verifyResult.matches ? "#10b981" : "#ef4444" }}>
              {verifyResult.matches ? "✅ Valid: Feedback commitment confirmed in on-chain ledger state!" : "❌ Invalid: Commitment not found or mismatched."}
            </span>
          </div>
        )}
      </div>

      <div style={{ display: "flex", gap: "1rem", marginTop: "2rem", flexWrap: "wrap" }}>
        <Link href="/" className="btn-secondary">Back to Dashboard</Link>
        <Link href="/merchant" className="btn-secondary">Merchant Console</Link>
        <Link href="/explorer" className="btn-primary">View on Chain Explorer →</Link>
      </div>
    </div>
  );
}
