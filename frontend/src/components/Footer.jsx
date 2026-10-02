import React from "react";
import { Pill, ShieldCheck, Cpu } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 700, color: "#0f172a" }}>
            <Pill size={18} color="#0284c7" />
            <span>PharmaChain System</span>
          </div>
          <p style={{ fontSize: "0.82rem", color: "#64748b", marginTop: "0.25rem" }}>
            Decentralized Medicine Provenance & Anti-Counterfeit Verification Protocol
          </p>
        </div>

        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", fontSize: "0.78rem", color: "#64748b", alignItems: "center" }}>
          <span style={{ padding: "0.2rem 0.6rem", background: "#f1f5f9", borderRadius: "4px", border: "1px solid #e2e8f0" }}>
            Solidity 0.8.20
          </span>
          <span style={{ padding: "0.2rem 0.6rem", background: "#f1f5f9", borderRadius: "4px", border: "1px solid #e2e8f0" }}>
            Hardhat EVM
          </span>
          <span style={{ padding: "0.2rem 0.6rem", background: "#f1f5f9", borderRadius: "4px", border: "1px solid #e2e8f0" }}>
            Express & MongoDB
          </span>
          <span style={{ padding: "0.2rem 0.6rem", background: "#f1f5f9", borderRadius: "4px", border: "1px solid #e2e8f0" }}>
            React 18 & Vite
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
