import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LogIn, Lock, Mail, AlertCircle, Sparkles, Building, UserCheck } from "lucide-react";

export const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/dashboard";

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError("Please fill in both email and password");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await login(formData);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to log in. Please verify your credentials.");
    } finally {
      setLoading(false);
    }
  };

  // Quick fill helper for presentation demonstration
  const quickFill = (role) => {
    if (role === "manufacturer") {
      setFormData({
        email: "manufacturer@pharmachain.com",
        password: "Password123"
      });
    } else {
      setFormData({
        email: "customer@pharmachain.com",
        password: "Password123"
      });
    }
    setError("");
  };

  return (
    <div style={{ maxWidth: "460px", margin: "3rem auto", padding: "0 1.25rem" }}>
      <div className="card">
        <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>
          <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "linear-gradient(135deg, #0284c7, #0369a1)", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem auto" }}>
            <LogIn size={24} />
          </div>
          <h2 style={{ fontSize: "1.5rem" }}>Sign in to PharmaChain</h2>
          <p style={{ fontSize: "0.88rem", color: "#64748b", marginTop: "0.25rem" }}>
            Select your role or enter your account credentials
          </p>
        </div>

        {/* Demo Credentials Helper */}
        <div style={{ background: "#f8fafc", padding: "0.85rem", borderRadius: "10px", border: "1px solid #e2e8f0", marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", fontSize: "0.78rem", fontWeight: 700, color: "#475569", textTransform: "uppercase" }}>
            <Sparkles size={13} color="#0284c7" /> One-Click Demo Accounts
          </div>
          <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
            <button
              type="button"
              onClick={() => quickFill("manufacturer")}
              className="btn btn-secondary btn-sm"
              style={{ flex: 1, fontSize: "0.76rem" }}
            >
              <Building size={13} /> Manufacturer
            </button>
            <button
              type="button"
              onClick={() => quickFill("customer")}
              className="btn btn-secondary btn-sm"
              style={{ flex: 1, fontSize: "0.76rem" }}
            >
              <UserCheck size={13} /> Customer
            </button>
          </div>
        </div>

        {error && (
          <div style={{ padding: "0.75rem", backgroundColor: "#fef2f2", border: "1px solid #fecaca", borderRadius: "8px", color: "#991b1b", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.25rem" }}>
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email Address</label>
            <div style={{ position: "relative" }}>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="name@company.com"
                className="form-input"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="form-input"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg"
            style={{ width: "100%", marginTop: "0.5rem" }}
            disabled={loading}
          >
            {loading ? "Authenticating..." : "Sign In"}
          </button>
        </form>

        <div style={{ marginTop: "1.5rem", textAlign: "center", fontSize: "0.88rem", color: "#64748b" }}>
          Don't have an account?{" "}
          <Link to="/register" style={{ fontWeight: 600, color: "#0284c7" }}>
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
