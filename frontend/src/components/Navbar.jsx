import React, { useState } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ShieldCheck, PlusCircle, LayoutDashboard, Box, User, LogOut, LogIn, UserPlus, Pill, Wallet, ArrowLeft } from "lucide-react";

export const Navbar = () => {
  const { user, isAuthenticated, logout, isManufacturer } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [walletAccount, setWalletAccount] = useState("");
  
  const isHomePage = location.pathname === "/" || location.pathname === "/customer";

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


        {/* Auth / User Actions */}
        <div className="nav-auth">


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
              {location.pathname !== "/" && (
                <Link to="/" className="btn btn-secondary btn-sm">
                  <ArrowLeft size={14} /> Welcome Page
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
