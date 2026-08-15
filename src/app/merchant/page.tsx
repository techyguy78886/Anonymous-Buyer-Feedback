"use client";

import { useState } from "react";
import { getClient } from "../../lib/contract";
import Link from "next/link";

export default function MerchantPage() {
  const [merchantKey, setMerchantKey] = useState("");
  const [minRating, setMinRating] = useState(1);
  const [loadingMerchant, setLoadingMerchant] = useState(false);

  const [flagCommitment, setFlagCommitment] = useState("");
  const [loadingFlag, setLoadingFlag] = useState(false);

  const [newMerchantId, setNewMerchantId] = useState("merchant_amazon_electronics_2027");
  const [resetMinRating, setResetMinRating] = useState(1);
  const [loadingReset, setLoadingReset] = useState(false);

  const [loadingSession, setLoadingSession] = useState(false);

  const [result, setResult] = useState<any>(null);
  const [logs, setLogs] = useState<{ msg: string; type: string }[]>([]);

  const addLog = (msg: string, type = "info") => setLogs(l => [...l, { msg, type }]);
  const isLoading = loadingMerchant || loadingFlag || loadingReset || loadingSession;

  const handleSetMerchantCommitment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingMerchant(true);
    setLogs([]);
    setResult(null);
    try {
      addLog("> [WALLET] Connecting to Midnight Lace Wallet session...", "info");
      addLog("> [ZK WITNESS] merchantSigningKey() — authorized brand secret key loaded", "info");
      addLog(`> [CIRCUIT] Executing setMerchantCommitment(Uint<32>) — minimumRating=${minRating}...`, "info");

      const client = getClient();
      client.setMerchantKey(merchantKey || "merchant_default_private_key");
      const res = await client.setMerchantCommitment(minRating);

      setResult({ ...res, circuit: "setMerchantCommitment(Uint<32>)" });
      addLog(`> [SUCCESS] Merchant authority anchored on-chain!`, "success");
      addLog(`> [COMMITMENT] ${res.merchantCommitment}`, "success");
      addLog(`> [MIN RATING] ${res.newMinimumRating} Stars`, "success");
      addLog(`> [TX HASH] ${res.txHash}`, "success");
    } catch (err: any) {
      addLog(`> [ERROR] ${err?.message || err}`, "error");
    } finally {
      setLoadingMerchant(false);
    }
  };

  const handleFlagFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingFlag(true);
    setLogs([]);
    setResult(null);
    try {
      addLog("> [WALLET] Connecting to Midnight Lace Wallet session...", "info");
      addLog("> [ZK WITNESS] merchantSigningKey() — generating ZK moderation authorization proof", "info");
      addLog(`> [CIRCUIT] Executing flagFeedback(Bytes<32>) for commitment...`, "info");

      const client = getClient();
      client.setMerchantKey(merchantKey || "merchant_default_private_key");
      const res = await client.flagFeedback(flagCommitment);

      setResult({ ...res, circuit: "flagFeedback(Bytes<32>)" });
      addLog(`> [SUCCESS] Feedback review flagged/disputed on-chain!`, "success");
      addLog(`> [FLAGGED COMMITMENT] ${res.flaggedCommitment}`, "success");
      addLog(`> [TX HASH] ${res.txHash}`, "success");
    } catch (err: any) {
      addLog(`> [ERROR] ${err?.message || err}`, "error");
    } finally {
      setLoadingFlag(false);
    }
  };

  const handleResetProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingReset(true);
    setLogs([]);
    setResult(null);
    try {
      addLog("> [WALLET] Connecting to Midnight Lace Wallet session...", "info");
      addLog(`> [CIRCUIT] Executing resetMerchantProduct("${newMerchantId}", ${resetMinRating})...`, "info");

      const client = getClient();
      const res = await client.resetMerchantProduct(newMerchantId, resetMinRating);

      setResult({ ...res, circuit: "resetMerchantProduct(Bytes<32>, Uint<32>)" });
      addLog(`> [SUCCESS] Merchant product catalog model ID updated on-chain!`, "success");
      addLog(`> [NEW ID] ${res.newMerchantId}`, "success");
      addLog(`> [TX HASH] ${res.txHash}`, "success");
    } catch (err: any) {
      addLog(`> [ERROR] ${err?.message || err}`, "error");
    } finally {
      setLoadingReset(false);
    }
  };

  const handleIncrementSession = async () => {
    setLoadingSession(true);
    setLogs([]);
    setResult(null);
    try {
      addLog("> [WALLET] Connecting to Midnight Lace Wallet session...", "info");
      addLog("> [CIRCUIT] Executing incrementSession() — rotating active epoch nonce...", "info");

      const client = getClient();
      const res = await client.incrementSession();

      setResult({ ...res, circuit: "incrementSession()" });
      addLog(`> [SUCCESS] Active session epoch incremented! TxHash: ${res.txHash}`, "success");
    } catch (err: any) {
      addLog(`> [ERROR] ${err?.message || err}`, "error");
    } finally {
      setLoadingSession(false);
    }
  };

  return (
    <div style={{ maxWidth: 880, margin: "0 auto", padding: "2rem 1.5rem 5rem" }}>
      {/* ── Page Header ── */}
      <div style={{ marginBottom: "2rem" }}>
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem", flexWrap: "wrap" }}>
          <span className="badge badge-cyan">Merchant Administration</span>
          <span className="badge badge-purple">Authority Controls</span>
          <span className="badge badge-emerald">Midnight Preview</span>
        </div>
        <h1 className="section-title">Merchant Admin Console</h1>
        <p className="section-desc">
          Merchant circuits require the store owner''s private signing key as a ZK witness. The private key is never revealed on-chain — only derived cryptographic commitments are verified.
        </p>
      </div>

      {/* ── Panel 1: Set Merchant Commitment ── */}
      <div className="glass-card" style={{ padding: "1.75rem", marginBottom: "1.5rem", borderLeft: "3px solid #8b5cf6" }}>
        <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#8b5cf6", marginBottom: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>
          🔑 Panel 1 — setMerchantCommitment(Uint&lt;32&gt;)
        </div>
        <p style={{ fontSize: "0.83rem", color: "#94a3b8", marginBottom: "1rem" }}>
          Anchors the merchant authority public commitment on-chain and configures the minimum required rating score.
        </p>
        <form onSubmit={handleSetMerchantCommitment} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "#94a3b8", display: "block", marginBottom: "0.4rem" }}>
              Merchant Private Signing Key (ZK Witness — merchantSigningKey())
            </label>
            <input
              type="password"
              id="merchantKey"
              value={merchantKey}
              onChange={e => setMerchantKey(e.target.value)}
              placeholder="Merchant private signing key (never transmitted)"
              autoComplete="off"
            />
          </div>
          <div>
            <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "#94a3b8", display: "block", marginBottom: "0.4rem" }}>
              Minimum Allowed Rating Score: <span style={{ color: "#8b5cf6", fontWeight: 700 }}>{minRating} Star{minRating > 1 ? "s" : ""}</span>
            </label>
            <input
              type="range"
              min={1}
              max={5}
              step={1}
              value={minRating}
              onChange={e => setMinRating(Number(e.target.value))}
              style={{ width: "100%", accentColor: "#8b5cf6" }}
            />
          </div>
          <button
            type="submit"
            className="btn-primary"
            disabled={isLoading}
            id="setMerchantBtn"
            style={{ background: "rgba(139, 92, 246, 0.2)", borderColor: "rgba(139, 92, 246, 0.5)" }}
          >
            {loadingMerchant ? <><span className="spinner" /> Anchoring Authority...</> : "Anchor Merchant Authority (ZK)"}
          </button>
        </form>
      </div>

      {/* ── Panel 2: Flag Feedback ── */}
      <div className="glass-card" style={{ padding: "1.75rem", marginBottom: "1.5rem", borderLeft: "3px solid #ef4444" }}>
        <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#ef4444", marginBottom: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>
          🚫 Panel 2 — flagFeedback(Bytes&lt;32&gt;)
        </div>
        <p style={{ fontSize: "0.83rem", color: "#94a3b8", marginBottom: "1rem" }}>
          Flag or dispute a fraudulent review claim. Requires merchant authority proof via <code>merchantSigningKey()</code> witness. Stored in <code>lastFlaggedCommitment</code>.
        </p>
        <form onSubmit={handleFlagFeedback} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "#94a3b8", display: "block", marginBottom: "0.4rem" }}>
              Feedback Commitment Hash to Dispute (Bytes&lt;32&gt;)
            </label>
            <input
              type="text"
              id="flagCommitment"
              value={flagCommitment}
              onChange={e => setFlagCommitment(e.target.value)}
              placeholder="0x... feedback commitment hash to flag"
              required
            />
          </div>
          <button
            type="submit"
            className="btn-primary"
            disabled={isLoading || !flagCommitment}
            id="flagFeedbackBtn"
            style={{ background: "rgba(239, 68, 68, 0.15)", borderColor: "rgba(239, 68, 68, 0.4)" }}
          >
            {loadingFlag ? <><span className="spinner" /> Flagging on Midnight...</> : "Dispute / Flag Review (ZK Auth)"}
          </button>
        </form>
      </div>

      {/* ── Panel 3: Reset Product Catalog ── */}
      <div className="glass-card" style={{ padding: "1.75rem", marginBottom: "1.5rem", borderLeft: "3px solid #10b981" }}>
        <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#10b981", marginBottom: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>
          🔄 Panel 3 — resetMerchantProduct(Bytes&lt;32&gt;, Uint&lt;32&gt;)
        </div>
        <p style={{ fontSize: "0.83rem", color: "#94a3b8", marginBottom: "1rem" }}>
          Rotate active product catalog model ID and update minimum rating bounds for new catalog lines.
        </p>
        <form onSubmit={handleResetProduct} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "#94a3b8", display: "block", marginBottom: "0.4rem" }}>
              New Merchant Catalog ID (Bytes&lt;32&gt;)
            </label>
            <input
              type="text"
              id="newMerchantId"
              value={newMerchantId}
              onChange={e => setNewMerchantId(e.target.value)}
              placeholder="merchant_amazon_electronics_2027"
              required
            />
          </div>
          <div>
            <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "#94a3b8", display: "block", marginBottom: "0.4rem" }}>
              New Minimum Rating Bound: <span style={{ color: "#10b981", fontWeight: 700 }}>{resetMinRating} Star{resetMinRating > 1 ? "s" : ""}</span>
            </label>
            <input
              type="range"
              min={1}
              max={5}
              step={1}
              value={resetMinRating}
              onChange={e => setResetMinRating(Number(e.target.value))}
              style={{ width: "100%", accentColor: "#10b981" }}
            />
          </div>
          <button
            type="submit"
            className="btn-primary"
            disabled={isLoading}
            id="resetProductBtn"
            style={{ background: "rgba(16, 185, 129, 0.15)", borderColor: "rgba(16, 185, 129, 0.4)" }}
          >
            {loadingReset ? <><span className="spinner" /> Updating Catalog...</> : "Rotate Catalog Model ID"}
          </button>
        </form>
      </div>

      {/* ── Panel 4: Increment Session ── */}
      <div className="glass-card" style={{ padding: "1.5rem", marginBottom: "1.5rem", borderLeft: "3px solid #06b6d4" }}>
        <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#06b6d4", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>
          🔒 Panel 4 — incrementSession()
        </div>
        <p style={{ fontSize: "0.83rem", color: "#94a3b8", marginBottom: "1rem" }}>
          Bumps the <code>activeSession</code> nonce to invalidate stale proofs from previous epochs and protect against replay attacks.
        </p>
        <button
          onClick={handleIncrementSession}
          className="btn-secondary"
          disabled={isLoading}
          id="incrementSessionBtn"
        >
          {loadingSession ? <><span className="spinner" /> Bumping Session Nonce...</> : "Increment Session Nonce"}
        </button>
      </div>

      {/* ── Activity Logs ── */}
      {logs.length > 0 && (
        <div className="glass-card" style={{ padding: "1.25rem", marginBottom: "1.5rem" }}>
          <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "#64748b", marginBottom: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Activity Log
          </div>
          <div className="log-box">
            {logs.map((l, i) => (
              <div key={i} className={`log-${l.type}`}>{l.msg}</div>
            ))}
          </div>
        </div>
      )}

      {/* ── Result Card ── */}
      {result && (
        <div className="glass-card fade-in" style={{ padding: "1.5rem", border: "1px solid rgba(16, 185, 129, 0.4)", background: "rgba(16, 185, 129, 0.04)" }}>
          <div style={{ color: "#10b981", fontWeight: 700, fontSize: "1.05rem", marginBottom: "1rem" }}>
            ✅ Transaction Confirmed on Midnight Preview
          </div>
          {Object.entries(result).map(([k, v]) => v !== undefined && (
            <div key={k} style={{ display: "flex", gap: "1rem", marginBottom: "0.4rem", flexWrap: "wrap" }}>
              <span style={{ fontSize: "0.78rem", color: "#64748b", minWidth: 170 }}>{k}:</span>
              <span style={{ fontSize: "0.78rem", color: "#f8fafc", fontFamily: "monospace", wordBreak: "break-all" }}>{String(v)}</span>
            </div>
          ))}
          <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.25rem", flexWrap: "wrap" }}>
            <Link href="/" className="btn-secondary">Back to Dashboard</Link>
            <Link href="/explorer" className="btn-secondary">View on Chain Explorer</Link>
          </div>
        </div>
      )}
    </div>
  );
}
