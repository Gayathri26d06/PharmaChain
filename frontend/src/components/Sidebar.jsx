import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard,
  PlusCircle,
  Pill,
  ShieldCheck,
  Box,
  User,
  ShieldAlert,
  LogOut
} from "lucide-react";

export const Sidebar = () => {
  const { user, isManufacturer, logout } = useAuth();

  return (
    <aside className="sidebar">
      <div className="sidebar-heading">Navigation</div>
      <nav className="sidebar-nav">
        <NavLink
          to="/dashboard"
          end
          className={({ isActive }) => (isActive ? "sidebar-link active" : "sidebar-link")}
        >
          <LayoutDashboard size={18} />
          <span>Dashboard</span>
        </NavLink>

        {isManufacturer ? (
          <>
            <NavLink
              to="/add-medicine"
              className={({ isActive }) => (isActive ? "sidebar-link active" : "sidebar-link")}
            >
              <PlusCircle size={18} />
              <span>Add Medicine</span>
            </NavLink>

            <NavLink
              to="/medicines"
              className={({ isActive }) => (isActive ? "sidebar-link active" : "sidebar-link")}
            >
              <Pill size={18} />
              <span>My Medicines</span>
            </NavLink>
          </>
        ) : (
          <NavLink
            to="/verify"
            className={({ isActive }) => (isActive ? "sidebar-link active" : "sidebar-link")}
          >
            <ShieldCheck size={18} />
            <span>Verify Medicine</span>
          </NavLink>
        )}

        <NavLink
          to="/blockchain"
          className={({ isActive }) => (isActive ? "sidebar-link active" : "sidebar-link")}
        >
          <Box size={18} />
          <span>Blockchain Ledger</span>
        </NavLink>

        <NavLink
          to="/profile"
          className={({ isActive }) => (isActive ? "sidebar-link active" : "sidebar-link")}
        >
          <User size={18} />
          <span>User Profile</span>
        </NavLink>
      </nav>

      <div style={{ marginTop: "auto", paddingTop: "1.5rem", borderTop: "1px solid #e2e8f0" }}>
        <div style={{ padding: "0.75rem", backgroundColor: "#f8fafc", borderRadius: "8px", border: "1px solid #e2e8f0", marginBottom: "0.75rem" }}>
          <div style={{ fontSize: "0.72rem", color: "#64748b", textTransform: "uppercase", fontWeight: 700 }}>
            Session Role
          </div>
          <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "#0f172a", textTransform: "capitalize", marginTop: "2px" }}>
            {user?.role}
          </div>
          <div style={{ fontSize: "0.74rem", color: "#0284c7", marginTop: "4px" }}>
            Hardhat Chain ID: 31337
          </div>
        </div>

        <button
          type="button"
          onClick={logout}
          className="btn btn-secondary btn-sm"
          style={{ width: "100%", justifyContent: "flex-start" }}
        >
          <LogOut size={16} /> Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
