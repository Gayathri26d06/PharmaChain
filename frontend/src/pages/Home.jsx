import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  QrCode,
  Box,
  PlusCircle,
  Search,
  CheckCircle2,
  Database,
  Lock,
  ArrowRight,
  Pill,
  Sparkles
} from "lucide-react";

export const Home = () => {
  const [searchId, setSearchId] = useState("");
  const navigate = useNavigate();

  const handleQuickVerify = (e) => {
    e.preventDefault();
    if (!searchId.trim()) return;
    navigate(`/verify/${searchId.trim().toUpperCase()}`);
  };

  return (
    <div>
      {/* Hero Section */}
      <section style={{ backgroundColor: "#0f172a", color: "#ffffff", padding: "4.5rem 1.5rem 5rem 1.5rem", position: "relative", overflow: "hidden" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", textAlign: "center", position: "relative", zIndex: 2 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.35rem 0.9rem", backgroundColor: "rgba(2, 132, 199, 0.2)", border: "1px solid rgba(56, 189, 248, 0.3)", borderRadius: "9999px", color: "#38bdf8", fontSize: "0.85rem", fontWeight: 600, marginBottom: "1.5rem" }}>
            <Sparkles size={14} /> Immutable Pharmaceutical Provenance Protocol
          </div>

          <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.25rem)", fontWeight: 800, color: "#ffffff", letterSpacing: "-0.03em", lineHeight: 1.15 }}>
            Decentralized Medicine Authentication <br />
            <span style={{ background: "linear-gradient(135deg, #38bdf8 0%, #818cf8 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Powered by Ethereum Blockchain
            </span>
          </h1>

          <p style={{ maxWidth: "720px", margin: "1.25rem auto 2.5rem auto", fontSize: "1.1rem", color: "#cbd5e1", lineHeight: 1.6 }}>
            Eliminate counterfeit pharmaceuticals through unit-level cryptographic serialization, high-density optical QR verification, and tamper-evident smart contracts.
          </p>

          {/* Quick Verification Search Box */}
          <form onSubmit={handleQuickVerify} style={{ maxWidth: "600px", margin: "0 auto 2rem auto", display: "flex", gap: "0.5rem", background: "rgba(255, 255, 255, 0.08)", padding: "0.45rem", borderRadius: "12px", border: "1px solid rgba(255, 255, 255, 0.2)", backdropFilter: "blur(8px)" }}>
            <div style={{ display: "flex", alignItems: "center", paddingLeft: "0.75rem", color: "#94a3b8" }}>
              <Search size={20} />
            </div>
            <input
              type="text"
              placeholder="Enter Medicine ID (e.g. MED-2026-A8F92K)..."
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "#ffffff", fontSize: "0.95rem", fontFamily: "var(--font-mono)" }}
            />
            <button type="submit" className="btn btn-primary" style={{ padding: "0.65rem 1.25rem", whiteSpace: "nowrap" }}>
              Verify Now
            </button>
          </form>

          {/* Action Links */}
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link to="/verify" className="btn btn-primary btn-lg">
              <QrCode size={18} /> Scan QR Code
            </Link>
            <Link to="/login" className="btn btn-secondary btn-lg" style={{ background: "rgba(255,255,255,0.1)", color: "#ffffff", borderColor: "rgba(255,255,255,0.25)" }}>
              Manufacturer Portal <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* 4 Pillars Section */}
      <section style={{ maxWidth: "1200px", margin: "-2rem auto 4rem auto", padding: "0 1.5rem", position: "relative", zIndex: 10 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.5rem" }}>
          <div className="card" style={{ padding: "1.75rem" }}>
            <div style={{ width: "44px", height: "44px", borderRadius: "10px", backgroundColor: "#e0f2fe", display: "flex", alignItems: "center", justifyContent: "center", color: "#0284c7", marginBottom: "1rem" }}>
              <Box size={22} />
            </div>
            <h3 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>Immutable Smart Contracts</h3>
            <p style={{ fontSize: "0.88rem", color: "#64748b" }}>
              Pharmaceutical batches are recorded on an Ethereum smart contract. Once registered, no entity can falsify expiry dates or batch numbers.
            </p>
          </div>

          <div className="card" style={{ padding: "1.75rem" }}>
            <div style={{ width: "44px", height: "44px", borderRadius: "10px", backgroundColor: "#ecfdf5", display: "flex", alignItems: "center", justifyContent: "center", color: "#10b981", marginBottom: "1rem" }}>
              <QrCode size={22} />
            </div>
            <h3 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>Unit-Level QR Serialization</h3>
            <p style={{ fontSize: "0.88rem", color: "#64748b" }}>
              High-density optical barcodes link physical packaging directly to on-chain cryptographic tokens for real-time camera scanning.
            </p>
          </div>

          <div className="card" style={{ padding: "1.75rem" }}>
            <div style={{ width: "44px", height: "44px", borderRadius: "10px", backgroundColor: "#fef3c7", display: "flex", alignItems: "center", justifyContent: "center", color: "#d97706", marginBottom: "1rem" }}>
              <ShieldCheck size={22} />
            </div>
            <h3 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>Anti-Counterfeit Telemetry</h3>
            <p style={{ fontSize: "0.88rem", color: "#64748b" }}>
              Automated heuristics detect velocity anomalies, such as multiple duplicate packaging scans across distant locations, flagging suspicious drugs.
            </p>
          </div>

          <div className="card" style={{ padding: "1.75rem" }}>
            <div style={{ width: "44px", height: "44px", borderRadius: "10px", backgroundColor: "#f3e8ff", display: "flex", alignItems: "center", justifyContent: "center", color: "#9333ea", marginBottom: "1rem" }}>
              <Lock size={22} />
            </div>
            <h3 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>Role-Governed Integrity</h3>
            <p style={{ fontSize: "0.88rem", color: "#64748b" }}>
              Only verified pharmaceutical manufacturers can mint medicine records on the ledger; patients verify authentic provenance without private keys.
            </p>
          </div>
        </div>
      </section>

      {/* Architectural Explanation: MongoDB vs Blockchain */}
      <section style={{ maxWidth: "1100px", margin: "0 auto 4.5rem auto", padding: "0 1.5rem" }}>
        <div className="card" style={{ padding: "2.25rem" }}>
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", color: "#0284c7", fontWeight: 700, fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              <Database size={16} /> Data Architecture Architecture
            </div>
            <h2 style={{ fontSize: "1.75rem", marginTop: "0.35rem" }}>What Data is Stored Where?</h2>
            <p style={{ color: "#64748b", fontSize: "0.92rem", marginTop: "0.5rem", maxWidth: "680px", margin: "0.5rem auto 0 auto" }}>
              PharmaChain implements a hybrid architecture balancing high-throughput query performance with absolute cryptographic immutability.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.5rem" }}>
            {/* Blockchain Column */}
            <div style={{ background: "#f8fafc", padding: "1.5rem", borderRadius: "12px", border: "1px solid #cbd5e1" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#0284c7", fontWeight: 700, fontSize: "1.1rem", marginBottom: "1rem" }}>
                <Box size={20} />
                <span>On Ethereum Blockchain (PharmaChain.sol)</span>
              </div>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.88rem" }}>
                <li style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem" }}>
                  <CheckCircle2 size={16} color="#10b981" style={{ marginTop: "3px", flexShrink: 0 }} />
                  <span><strong>Medicine ID</strong> — Unique deterministic hash key.</span>
                </li>
                <li style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem" }}>
                  <CheckCircle2 size={16} color="#10b981" style={{ marginTop: "3px", flexShrink: 0 }} />
                  <span><strong>Product Name & Batch Number</strong> — Tamper-proof drug identifier.</span>
                </li>
                <li style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem" }}>
                  <CheckCircle2 size={16} color="#10b981" style={{ marginTop: "3px", flexShrink: 0 }} />
                  <span><strong>Manufacturing & Expiry Timestamps</strong> — Permanent epoch baseline.</span>
                </li>
                <li style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem" }}>
                  <CheckCircle2 size={16} color="#10b981" style={{ marginTop: "3px", flexShrink: 0 }} />
                  <span><strong>Lifecycle Status</strong> — Genuine, Expired, Suspicious, Recalled.</span>
                </li>
                <li style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem" }}>
                  <CheckCircle2 size={16} color="#10b981" style={{ marginTop: "3px", flexShrink: 0 }} />
                  <span><strong>Manufacturer Wallet Address</strong> — Non-repudiation cryptographic signature.</span>
                </li>
              </ul>
            </div>

            {/* MongoDB Column */}
            <div style={{ background: "#f8fafc", padding: "1.5rem", borderRadius: "12px", border: "1px solid #cbd5e1" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#16a34a", fontWeight: 700, fontSize: "1.1rem", marginBottom: "1rem" }}>
                <Database size={20} />
                <span>In MongoDB Database</span>
              </div>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.88rem" }}>
                <li style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem" }}>
                  <CheckCircle2 size={16} color="#16a34a" style={{ marginTop: "3px", flexShrink: 0 }} />
                  <span><strong>User Credentials</strong> — Encrypted passwords (bcrypt) and JWT roles.</span>
                </li>
                <li style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem" }}>
                  <CheckCircle2 size={16} color="#16a34a" style={{ marginTop: "3px", flexShrink: 0 }} />
                  <span><strong>Operational Descriptions & Quantity</strong> — Rich logistics metadata.</span>
                </li>
                <li style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem" }}>
                  <CheckCircle2 size={16} color="#16a34a" style={{ marginTop: "3px", flexShrink: 0 }} />
                  <span><strong>Transaction Hashes & Block Numbers</strong> — Fast relational query indexing.</span>
                </li>
                <li style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem" }}>
                  <CheckCircle2 size={16} color="#16a34a" style={{ marginTop: "3px", flexShrink: 0 }} />
                  <span><strong>Verification Audit Logs</strong> — Scan frequencies, IPs, and telemetry history.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
