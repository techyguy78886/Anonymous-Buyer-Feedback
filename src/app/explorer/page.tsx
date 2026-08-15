import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Midnight Explorer | Anonymous Buyer Feedback",
  description: "View live on-chain state of the Anonymous Buyer Feedback ZK contract on Midnight Preview.",
};

const CONTRACT_ADDRESS = "0xc8b966f549c7c68b9e5faa18056e95ecfb5e8032466cb84180e289f34c13f5d5";

export default function ExplorerPage() {
  return (
    <div style={{ maxWidth: 880, margin: "0 auto", padding: "2rem 1.5rem 5rem" }}>
      <div style={{ marginBottom: "2rem" }}>
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}>
          <span className="badge badge-cyan">Midnight Explorer</span>
          <span className="badge badge-emerald">Preview Testnet</span>
        </div>
        <h1 className="section-title">Contract Explorer</h1>
        <p className="section-desc">
          Live on-chain state of the Anonymous Buyer Feedback ZK contract on Midnight Preview.
        </p>
      </div>

      <div className="glass-card" style={{ padding: "1.75rem", marginBottom: "1.5rem" }}>
        <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "#64748b", marginBottom: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>
          Contract Address
        </div>
        <code style={{ fontSize: "0.85rem", color: "#06b6d4", wordBreak: "break-all" }}>
          {CONTRACT_ADDRESS}
        </code>
        <div style={{ marginTop: "1.25rem" }}>
          <a
            href={`https://preview.midnightexplorer.com/contracts/${CONTRACT_ADDRESS}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
            style={{ display: "inline-flex" }}
          >
            🔍 View on Midnight Explorer →
          </a>
        </div>
      </div>

      <div className="glass-card" style={{ padding: "1.75rem", marginBottom: "2rem" }}>
        <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "#64748b", marginBottom: "1rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>
          Public Ledger Fields (8 On-Chain Fields)
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {[
            { field: "feedbackCount: Counter", desc: "Total verified anonymous reviews submitted", color: "#10b981" },
            { field: "flaggedCount: Counter", desc: "Total moderated / disputed feedback commitments", color: "#ef4444" },
            { field: "activeSession: Counter", desc: "Epoch nonce for replay attack prevention", color: "#06b6d4" },
            { field: "merchantId: Bytes<32>", desc: "Active merchant brand / product catalog identifier", color: "#14b8a6" },
            { field: "merchantCommitment: Bytes<32>", desc: "Merchant authority anchor derived from signing key", color: "#f59e0b" },
            { field: "lastFeedbackCommitment: Bytes<32>", desc: "Most recent ZK feedback claim commitment hash", color: "#8b5cf6" },
            { field: "lastFlaggedCommitment: Bytes<32>", desc: "Most recent flagged / disputed commitment hash", color: "#ef4444" },
            { field: "minimumRatingScore: Uint<32>", desc: "Minimum rating threshold parameter (1-5 stars)", color: "#06b6d4" },
          ].map(f => (
            <div key={f.field} style={{ display: "flex", gap: "1rem", padding: "0.75rem 0", borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
              <code style={{ fontSize: "0.8rem", color: f.color, minWidth: "290px" }}>{f.field}</code>
              <span style={{ fontSize: "0.8rem", color: "#94a3b8" }}>{f.desc}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        <Link href="/" className="btn-secondary">Back to Dashboard</Link>
        <Link href="/submit" className="btn-primary">Submit Buyer Feedback →</Link>
      </div>
    </div>
  );
}
