import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, LogIn, Pill } from "lucide-react";

export const Landing = () => {
  return (
    <div style={{ backgroundColor: "#0f172a", minHeight: "calc(100vh - 65px)", display: "flex", flexDirection: "column", justifyContent: "center", padding: "2rem" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
        
        <div style={{ width: "64px", height: "64px", borderRadius: "16px", background: "linear-gradient(135deg, #0ea5e9, #2563eb)", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 2rem auto" }}>
          <Pill size={36} />
        </div>

        <h1 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 800, color: "#ffffff", marginBottom: "1rem" }}>
          Welcome to PharmaChain
        </h1>
        <p style={{ color: "#94a3b8", fontSize: "1.1rem", maxWidth: "600px", margin: "0 auto 3rem auto", lineHeight: 1.6 }}>
          A blockchain-powered authenticity verification system for pharmaceutical medicines. Please select your role to continue.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
          
          <div className="card" style={{ padding: "2rem", display: "flex", flexDirection: "column", alignItems: "center", backgroundColor: "#1e293b", border: "1px solid #334155" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "12px", backgroundColor: "rgba(16, 185, 129, 0.15)", color: "#10b981", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1rem" }}>
              <ShieldCheck size={24} />
            </div>
            <h3 style={{ fontSize: "1.25rem", color: "#ffffff", marginBottom: "0.5rem" }}>Customer</h3>
            <p style={{ color: "#94a3b8", fontSize: "0.9rem", textAlign: "center", marginBottom: "1.5rem" }}>
              Verify the authenticity of your medicine package. No account required.
            </p>
            <Link to="/customer" className="btn btn-primary" style={{ width: "100%" }}>
              Enter Public Portal
            </Link>
          </div>

          <div className="card" style={{ padding: "2rem", display: "flex", flexDirection: "column", alignItems: "center", backgroundColor: "#1e293b", border: "1px solid #334155" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "12px", backgroundColor: "rgba(139, 92, 246, 0.15)", color: "#a78bfa", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1rem" }}>
              <LogIn size={24} />
            </div>
            <h3 style={{ fontSize: "1.25rem", color: "#ffffff", marginBottom: "0.5rem" }}>Admin / Manufacturer</h3>
            <p style={{ color: "#94a3b8", fontSize: "0.9rem", textAlign: "center", marginBottom: "1.5rem" }}>
              Secure login for authorized pharmaceutical manufacturers and administrators.
            </p>
            <Link to="/login" className="btn btn-secondary" style={{ width: "100%", backgroundColor: "rgba(255,255,255,0.05)", color: "#ffffff", borderColor: "rgba(255,255,255,0.1)" }}>
              Account Sign In
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Landing;
