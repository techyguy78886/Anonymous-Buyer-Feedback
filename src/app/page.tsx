import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Anonymous Buyer Feedback | Zero-Knowledge E-Commerce Reviews on Midnight',
  description: 'Submit and verify e-commerce product reviews anonymously using zero-knowledge proofs on the Midnight Network.',
};

const CONTRACT_ADDRESS = "0xc8b966f549c7c68b9e5faa18056e95ecfb5e8032466cb84180e289f34c13f5d5";

export default function HomePage() {
  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 1.5rem 5rem" }}>
      {/* ── Hero Section ── */}
      <section className="hero">
        <div className="hero-badge">
          <span>🛡️</span> Midnight Preview Network — Live ZK dApp
        </div>
        <h1>Anonymous Buyer Feedback</h1>
        <p>
          Submit cryptographically verified product reviews and star ratings using <strong>zero-knowledge proofs</strong> — without disclosing your buyer identity, order receipts, purchase dates, or credit card information on-chain.
        </p>
        <div className="hero-actions">
          <Link href="/submit" className="btn-primary" style={{ fontSize: "1rem", padding: "0.75rem 2rem" }}>
            ✍️ Submit Feedback (ZK Proof) →
          </Link>
          <Link href="/merchant" className="btn-secondary" style={{ fontSize: "1rem", padding: "0.75rem 2rem" }}>
            🏪 Merchant Console
          </Link>
          <Link href="/explorer" className="btn-secondary" style={{ fontSize: "1rem", padding: "0.75rem 2rem" }}>
            🔍 Explorer
          </Link>
        </div>
      </section>

      {/* ── Key Metrics Grid ── */}
      <section style={{ marginBottom: "3.5rem" }}>
        <div className="stats-grid">
          <div className="glass-card stat-card">
            <div className="stat-value" style={{ color: "#10b981" }}>6</div>
            <div className="stat-label">ZK Circuits</div>
            <div style={{ fontSize: "0.72rem", color: "#64748b", marginTop: "0.35rem" }}>Compact v0.23 logic</div>
          </div>
          <div className="glass-card stat-card">
            <div className="stat-value" style={{ color: "#06b6d4" }}>8</div>
            <div className="stat-label">Ledger Fields</div>
            <div style={{ fontSize: "0.72rem", color: "#64748b", marginTop: "0.35rem" }}>Public on-chain state</div>
          </div>
          <div className="glass-card stat-card">
            <div className="stat-value" style={{ color: "#8b5cf6" }}>5</div>
            <div className="stat-label">Private Witnesses</div>
            <div style={{ fontSize: "0.72rem", color: "#64748b", marginTop: "0.35rem" }}>Kept strictly private</div>
          </div>
          <div className="glass-card stat-card">
            <div className="stat-value" style={{ color: "#f59e0b" }}>10/10</div>
            <div className="stat-label">Unit Tests Passing</div>
            <div style={{ fontSize: "0.72rem", color: "#64748b", marginTop: "0.35rem" }}>Vitest test suite</div>
          </div>
        </div>
      </section>

      {/* ── How It Works (3 Steps) ── */}
      <section style={{ marginBottom: "3.5rem" }}>
        <div style={{ marginBottom: "1.5rem" }}>
          <span className="badge badge-emerald">Zero-Knowledge Architecture</span>
          <h2 className="section-title" style={{ marginTop: "0.5rem" }}>How Anonymous Feedback Works</h2>
          <p className="section-desc">
            Traditional reviews force buyers to expose their real identities or allow fake bot accounts. ABF proves genuine purchases mathematically.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.25rem" }}>
          {[
            {
              step: "01",
              title: "Local Witness Input",
              badge: "Private (Browser)",
              color: "#10b981",
              desc: "Buyer enters product secret key, receipt invoice hash, and star rating (1–5). These never leave the local device."
            },
            {
              step: "02",
              title: "ZK Proof Generation",
              badge: "Client Prover",
              color: "#06b6d4",
              desc: "The Compact circuit asserts valid rating bounds and purchase credentials, generating a 32-byte cryptographic commitment hash."
            },
            {
              step: "03",
              title: "On-Chain Ledger Anchor",
              badge: "Public Ledger",
              color: "#8b5cf6",
              desc: "Only the review commitment is published on Midnight. Observers verify authenticity while the buyer remains 100% anonymous."
            },
          ].map(c => (
            <div key={c.step} className="glass-card" style={{ padding: "1.75rem", borderTop: `3px solid ${c.color}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <span style={{ fontSize: "1.5rem", fontWeight: 800, color: c.color, fontFamily: "monospace" }}>{c.step}</span>
                <span className="badge" style={{ background: `${c.color}22`, color: c.color, border: `1px solid ${c.color}44` }}>{c.badge}</span>
              </div>
              <h3 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: "0.5rem" }}>{c.title}</h3>
              <p style={{ fontSize: "0.85rem", color: "#94a3b8", lineHeight: 1.6 }}>{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Feature Navigation Cards ── */}
      <section style={{ marginBottom: "3.5rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.25rem" }}>
          {[
            {
              href: "/submit",
              icon: "✍️",
              title: "Submit Buyer Feedback",
              desc: "Submit anonymous verified ratings and review commitments with client-side ZK proof generation.",
              color: "#10b981"
            },
            {
              href: "/merchant",
              icon: "🏪",
              title: "Merchant Admin Console",
              desc: "Anchor merchant authority, configure rating parameters, rotate catalog IDs, and moderate disputed claims.",
              color: "#06b6d4"
            },
            {
              href: "/explorer",
              icon: "🔍",
              title: "Contract Explorer",
              desc: "Inspect live public ledger state, verified feedback counts, and on-chain contract parameters on Midnight Preview.",
              color: "#8b5cf6"
            }
          ].map(card => (
            <Link key={card.href} href={card.href} style={{ textDecoration: "none" }}>
              <div className="glass-card" style={{ padding: "1.75rem", height: "100%", transition: "all 0.2s ease" }}>
                <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>{card.icon}</div>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#f8fafc", marginBottom: "0.5rem" }}>{card.title}</h3>
                <p style={{ fontSize: "0.85rem", color: "#94a3b8", lineHeight: 1.6 }}>{card.desc}</p>
                <div style={{ marginTop: "1rem", fontSize: "0.85rem", fontWeight: 700, color: card.color }}>
                  Launch portal →
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Contract Overview Card ── */}
      <section className="glass-card" style={{ padding: "1.75rem", borderLeft: "3px solid #10b981" }}>
        <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "#10b981", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>
          On-Chain Deployment Details
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1rem", marginTop: "1rem" }}>
          <div>
            <div style={{ fontSize: "0.75rem", color: "#64748b", marginBottom: "0.25rem" }}>Contract Address</div>
            <code style={{ fontSize: "0.78rem", color: "#06b6d4", wordBreak: "break-all" }}>{CONTRACT_ADDRESS}</code>
          </div>
          <div>
            <div style={{ fontSize: "0.75rem", color: "#64748b", marginBottom: "0.25rem" }}>Network</div>
            <div style={{ fontSize: "0.88rem", fontWeight: 600, color: "#10b981" }}>Midnight Preview Testnet</div>
          </div>
          <div>
            <div style={{ fontSize: "0.75rem", color: "#64748b", marginBottom: "0.25rem" }}>Explorer Link</div>
            <a
              href={`https://preview.midnightexplorer.com/contracts/${CONTRACT_ADDRESS}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#8b5cf6", fontSize: "0.82rem", textDecoration: "none", fontWeight: 600 }}
            >
              View on Midnight Explorer ↗
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
