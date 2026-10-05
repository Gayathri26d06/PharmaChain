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
    <div style={{ backgroundColor: "#0f172a", minHeight: "calc(100vh - 65px)", display: "flex", flexDirection: "column" }}>
      {/* Hero Section */}
      <section style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", backgroundColor: "#0f172a", color: "#ffffff", padding: "2rem 1.5rem", position: "relative", overflow: "hidden" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", textAlign: "center", position: "relative", zIndex: 2 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.35rem 0.9rem", backgroundColor: "rgba(2, 132, 199, 0.2)", border: "1px solid rgba(56, 189, 248, 0.3)", borderRadius: "9999px", color: "#38bdf8", fontSize: "0.85rem", fontWeight: 600, marginBottom: "1.5rem" }}>
            Verify Medicines. Build Trust.
          </div>

          <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.25rem)", fontWeight: 800, color: "#ffffff", letterSpacing: "-0.03em", lineHeight: 1.15 }}>
            PharmaChain <br />
            <span style={{ background: "linear-gradient(135deg, #38bdf8 0%, #818cf8 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Blockchain-Based Medicine Verification
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
              placeholder="Enter Medicine ID "
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
          </div>
        </div>
      </section>



    </div>
  );
};

export default Home;
