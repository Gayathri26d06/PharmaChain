import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { UserPlus, AlertCircle, Building, UserCheck } from "lucide-react";

export const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "customer",
    walletAddress: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError("Please fill in all required registration fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must contain at least 6 characters");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await register(formData);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please check your information.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "520px", margin: "2.5rem auto", padding: "0 1.25rem" }}>
      <div className="card">
        <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>
          <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "linear-gradient(135deg, #0284c7, #0369a1)", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem auto" }}>
            <UserPlus size={24} />
          </div>
          <h2 style={{ fontSize: "1.5rem" }}>Create PharmaChain Account</h2>
          <p style={{ fontSize: "0.88rem", color: "#64748b", marginTop: "0.25rem" }}>
            Register as an authorized Manufacturer or verifying Customer
          </p>
        </div>

        {error && (
          <div style={{ padding: "0.75rem", backgroundColor: "#fef2f2", border: "1px solid #fecaca", borderRadius: "8px", color: "#991b1b", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.25rem" }}>
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Role Selector Tabs */}
          <div className="form-group">
            <label className="form-label">Account Role</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, role: "manufacturer" }))}
                style={{
                  padding: "0.75rem",
                  borderRadius: "8px",
                  border: formData.role === "manufacturer" ? "2px solid #0284c7" : "1px solid #cbd5e1",
                  backgroundColor: formData.role === "manufacturer" ? "#e0f2fe" : "#ffffff",
                  color: formData.role === "manufacturer" ? "#0369a1" : "#475569",
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem"
                }}
              >
                <Building size={16} /> Manufacturer
              </button>

              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, role: "customer" }))}
                style={{
                  padding: "0.75rem",
                  borderRadius: "8px",
                  border: formData.role === "customer" ? "2px solid #0284c7" : "1px solid #cbd5e1",
                  backgroundColor: formData.role === "customer" ? "#e0f2fe" : "#ffffff",
                  color: formData.role === "customer" ? "#0369a1" : "#475569",
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem"
                }}
              >
                <UserCheck size={16} /> Customer
              </button>
            </div>
            <span className="form-helper" style={{ marginTop: "4px" }}>
              {formData.role === "manufacturer"
                ? "Can register new medicines, mint smart contract tokens, and generate unit QR codes."
                : "Can verify medicine authenticity, scan packaging QR codes, and view provenance."}
            </span>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="name">
              {formData.role === "manufacturer" ? "Company / Facility Name" : "Full Name"}
            </label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder={formData.role === "manufacturer" ? "e.g. Novartis Pharmaceuticals Ltd" : "e.g. John Doe"}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="user@example.com"
              className="form-input"
              required
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
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

            <div className="form-group">
              <label className="form-label" htmlFor="confirmPassword">Confirm Password</label>
              <input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="form-input"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="walletAddress">
              Ethereum Wallet Address <span style={{ color: "#94a3b8", fontWeight: 400 }}>(Optional)</span>
            </label>
            <input
              id="walletAddress"
              type="text"
              name="walletAddress"
              value={formData.walletAddress}
              onChange={handleChange}
              placeholder="0x..."
              className="form-input"
              style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem" }}
            />
            <span className="form-helper">Leave blank to use default backend managed relayer wallet.</span>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg"
            style={{ width: "100%", marginTop: "0.5rem" }}
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Complete Registration"}
          </button>
        </form>

        <div style={{ marginTop: "1.5rem", textAlign: "center", fontSize: "0.88rem", color: "#64748b" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ fontWeight: 600, color: "#0284c7" }}>
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
