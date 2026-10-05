import React from "react";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";
import { User, Mail, Shield, Wallet, Calendar, LogOut, CheckCircle2 } from "lucide-react";

export const Profile = () => {
  const { user, logout, isManufacturer } = useAuth();

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-content">
        <div style={{ maxWidth: "700px", margin: "0 auto" }}>
          <div style={{ marginBottom: "1.75rem" }}>
            <h1 style={{ fontSize: "1.75rem", fontWeight: 800 }}>User Profile</h1>
            <p style={{ color: "#64748b", fontSize: "0.92rem", marginTop: "0.25rem" }}>
              Account security credentials and blockchain role authorization details
            </p>
          </div>

          <div className="card mb-6">
            <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", marginBottom: "1.75rem", paddingBottom: "1.25rem", borderBottom: "1px solid #f1f5f9" }}>
              <div style={{ width: "64px", height: "64px", borderRadius: "16px", background: "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", fontWeight: 700 }}>
                {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
              </div>

              <div>
                <h2 style={{ fontSize: "1.35rem", fontWeight: 700 }}>{user?.name}</h2>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.25rem" }}>
                  <span style={{ fontSize: "0.78rem", padding: "0.2rem 0.6rem", borderRadius: "9999px", background: isManufacturer ? "#e0f2fe" : "#f1f5f9", color: isManufacturer ? "#0369a1" : "#475569", fontWeight: 700, textTransform: "uppercase" }}>
                    {user?.role}
                  </span>
                  <span style={{ fontSize: "0.82rem", color: "#64748b" }}>
                    Account ID: {user?.id || user?._id}
                  </span>
                </div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.25rem", fontSize: "0.9rem" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
                <Mail size={18} color="#64748b" style={{ marginTop: "2px" }} />
                <div>
                  <span style={{ fontSize: "0.78rem", color: "#64748b", display: "block" }}>Email Address</span>
                  <span style={{ fontWeight: 600, color: "#0f172a" }}>{user?.email}</span>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
                <Shield size={18} color="#64748b" style={{ marginTop: "2px" }} />
                <div>
                  <span style={{ fontSize: "0.78rem", color: "#64748b", display: "block" }}>System Role</span>
                  <span style={{ fontWeight: 600, color: "#0f172a", textTransform: "capitalize" }}>
                    {user?.role}
                  </span>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
                <Wallet size={18} color="#64748b" style={{ marginTop: "2px" }} />
                <div>
                  <span style={{ fontSize: "0.78rem", color: "#64748b", display: "block" }}>Relayer Wallet Address</span>
                  <span className="hash-pill" style={{ fontSize: "0.78rem", marginTop: "2px", display: "inline-block" }}>
                    {user?.walletAddress || "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"}
                  </span>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
                <Calendar size={18} color="#64748b" style={{ marginTop: "2px" }} />
                <div>
                  <span style={{ fontSize: "0.78rem", color: "#64748b", display: "block" }}>Account Created</span>
                  <span style={{ fontWeight: 600, color: "#0f172a" }}>
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Active Session"}
                  </span>
                </div>
              </div>
            </div>

            <div style={{ marginTop: "1.75rem", paddingTop: "1.25rem", borderTop: "1px solid #f1f5f9" }}>
              <button
                type="button"
                onClick={logout}
                className="btn btn-danger btn-sm"
              >
                <LogOut size={15} /> End Session & Sign Out
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
