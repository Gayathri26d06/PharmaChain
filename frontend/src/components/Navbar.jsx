import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ShieldCheck, PlusCircle, LayoutDashboard, Box, User, LogOut, LogIn, UserPlus, Pill, Wallet } from "lucide-react";

export const Navbar = () => {
  const { user, isAuthenticated, logout, isManufacturer } = useAuth();
  const navigate = useNavigate();
  const [walletAccount, setWalletAccount] = useState("");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Optional MetaMask browser wallet connector
  const connectMetaMask = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        if (accounts && accounts[0]) {
          setWalletAccount(accounts[0]);
        }
      } catch (err) {
        console.warn("MetaMask connection request rejected or failed:", err);
      }
    } else {
      alert("MetaMask extension not found in your browser. Install MetaMask or use local Hardhat simulated signer.");
    }
  };

  const truncatedWallet = walletAccount
    ? `${walletAccount.substring(0, 6)}...${walletAccount.substring(walletAccount.length - 4)}`
    : "";

  return (
    <header className="navbar">
      <div className="navbar-inner">
        {/* Brand */}
        <Link to="/" className="nav-brand">
          <div className="nav-brand-icon">
            <Pill size={22} />
          </div>
          <div>
            <span>PharmaChain</span>
            <span style={{ display: "block", fontSize: "0.68rem", fontWeight: 500, color: "#0284c7", letterSpacing: "0.05em", textTransform: "uppercase" }}>
              Blockchain Authenticator
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav>
          <ul className="nav-links">
            <li>
              <NavLink to="/" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
                Home
              </NavLink>
            </li>

            <li>
              <NavLink to="/verify" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
                <ShieldCheck size={16} /> Verify Medicine
              </NavLink>
            </li>

            <li>
              <NavLink to="/blockchain" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
                <Box size={16} /> Blockchain
              </NavLink>
            </li>

            {isAuthenticated && (
              <li>
                <NavLink to="/dashboard" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
                  <LayoutDashboard size={16} /> Dashboard
                </NavLink>
              </li>
            )}

            {isAuthenticated && isManufacturer && (
              <>
                <li>
                  <NavLink to="/add-medicine" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
                    <PlusCircle size={16} /> Add Medicine
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/medicines" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
                    My Medicines
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </nav>

        {/* Auth / User Actions */}
        <div className="nav-auth">
          {/* Optional MetaMask Button */}
          <button
            type="button"
            onClick={connectMetaMask}
            className="btn btn-secondary btn-sm"
            style={{ fontSize: "0.78rem", padding: "0.35rem 0.65rem" }}
            title="Connect MetaMask Wallet (Optional)"
          >
            <Wallet size={14} color={walletAccount ? "#10b981" : "#64748b"} />
            {walletAccount ? truncatedWallet : "Web3 Wallet"}
          </button>

          {isAuthenticated ? (
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <Link
                to="/profile"
                className="btn btn-secondary btn-sm"
                style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}
              >
                <User size={14} />
                <span>{user?.name?.split(" ")[0]}</span>
                <span
                  style={{
                    fontSize: "0.68rem",
                    padding: "0.15rem 0.4rem",
                    borderRadius: "4px",
                    backgroundColor: isManufacturer ? "#e0f2fe" : "#f1f5f9",
                    color: isManufacturer ? "#0369a1" : "#475569",
                    fontWeight: 700,
                    textTransform: "uppercase"
                  }}
                >
                  {user?.role}
                </span>
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="btn btn-secondary btn-sm"
                title="Log Out"
              >
                <LogOut size={14} />
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Link to="/login" className="btn btn-secondary btn-sm">
                <LogIn size={14} /> Login
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                <UserPlus size={14} /> Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
