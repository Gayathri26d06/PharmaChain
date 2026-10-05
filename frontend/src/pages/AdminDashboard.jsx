import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";
import StatusBadge from "../components/StatusBadge";
import { UserPlus, Trash2, Shield, Loader, AlertTriangle, Box, Activity, CheckCircle, XCircle } from "lucide-react";

export const AdminDashboard = () => {
  const { user } = useAuth();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const currentTab = queryParams.get("tab") || "stats";

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Data States
  const [stats, setStats] = useState({ totalManufacturers: 0, totalMedicines: 0, onChainTransactions: 0 });
  const [manufacturers, setManufacturers] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [logs, setLogs] = useState([]);
  const [blockchainInfo, setBlockchainInfo] = useState(null);

  // Form State for Manufacturer creation
  const [form, setForm] = useState({ name: "", email: "", password: "", companyName: "", registrationNumber: "", address: "" });
  const [formMsg, setFormMsg] = useState({ type: "", text: "" });

  const fetchAdminData = async () => {
    setLoading(true);
    setError("");
    const token = localStorage.getItem("pharmachain_token");
    try {
      if (currentTab === "stats" || !currentTab) {
        const res = await fetch("http://localhost:5000/api/admin/stats", { headers: { Authorization: `Bearer ${token}` } });
        const data = await res.json();
        if (data.success) setStats(data.stats);
      } else if (currentTab === "manufacturers") {
        const res = await fetch("http://localhost:5000/api/admin/manufacturers", { headers: { Authorization: `Bearer ${token}` } });
        const data = await res.json();
        if (data.success) setManufacturers(data.manufacturers);
      } else if (currentTab === "medicines") {
        const res = await fetch("http://localhost:5000/api/admin/medicines", { headers: { Authorization: `Bearer ${token}` } });
        const data = await res.json();
        if (data.success) setMedicines(data.medicines);
      } else if (currentTab === "audit") {
        const res = await fetch("http://localhost:5000/api/admin/logs", { headers: { Authorization: `Bearer ${token}` } });
        const data = await res.json();
        if (data.success) setLogs(data.logs);
      }
    } catch (err) {
      setError("Failed to connect to the server or fetch data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, [currentTab]);

  const handleAddManufacturer = async (e) => {
    e.preventDefault();
    setFormMsg({ type: "", text: "" });
    try {
      const res = await fetch("http://localhost:5000/api/admin/manufacturers", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("pharmachain_token")}` },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (data.success) {
        setFormMsg({ type: "success", text: "Manufacturer created successfully!" });
        setForm({ name: "", email: "", password: "", companyName: "", registrationNumber: "", address: "" });
        fetchAdminData();
      } else {
        setFormMsg({ type: "error", text: data.message });
      }
    } catch (err) {
      setFormMsg({ type: "error", text: "Server error." });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this manufacturer?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/admin/manufacturers/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("pharmachain_token")}` }
      });
      const data = await res.json();
      if (data.success) {
        fetchAdminData();
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert("Server error.");
    }
  };

  const renderContent = () => {
    if (loading) return <div style={{ padding: "3rem", textAlign: "center" }}><Loader className="spin" size={32} style={{ color: "#64748b", margin: "0 auto" }} /></div>;
    if (error) return <div style={{ padding: "2rem", color: "#ef4444", textAlign: "center" }}><AlertTriangle size={32} style={{ margin: "0 auto 1rem" }} /><p>{error}</p></div>;

    switch (currentTab) {
      case "manufacturers":
        return (
          <>
            <div className="card" style={{ maxWidth: "800px", marginBottom: "2rem" }}>
              <h3 className="card-title" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}><UserPlus size={18} /> Create New Manufacturer</h3>
              {formMsg.text && (
                <div style={{ padding: "0.75rem", marginBottom: "1rem", borderRadius: "8px", backgroundColor: formMsg.type === "error" ? "#fef2f2" : "#ecfdf5", color: formMsg.type === "error" ? "#ef4444" : "#10b981", border: `1px solid ${formMsg.type === "error" ? "#fecaca" : "#a7f3d0"}` }}>
                  {formMsg.text}
                </div>
              )}
              <form onSubmit={handleAddManufacturer} style={{ display: "grid", gap: "1rem" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div>
                    <label className="form-label">Contact Name</label>
                    <input type="text" className="form-input" required value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} placeholder="John Doe" />
                  </div>
                  <div>
                    <label className="form-label">Email</label>
                    <input type="email" className="form-input" required value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} placeholder="manufacturer@pharma.com" />
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div>
                    <label className="form-label">Password (Temporary)</label>
                    <input type="password" className="form-input" required value={form.password} onChange={(e) => setForm({...form, password: e.target.value})} placeholder="••••••••" />
                  </div>
                  <div>
                    <label className="form-label">Company Name</label>
                    <input type="text" className="form-input" required value={form.companyName} onChange={(e) => setForm({...form, companyName: e.target.value})} placeholder="PharmaCorp Inc." />
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div>
                    <label className="form-label">Registration Number</label>
                    <input type="text" className="form-input" required value={form.registrationNumber} onChange={(e) => setForm({...form, registrationNumber: e.target.value})} placeholder="REG-12345" />
                  </div>
                  <div>
                    <label className="form-label">Address</label>
                    <input type="text" className="form-input" required value={form.address} onChange={(e) => setForm({...form, address: e.target.value})} placeholder="123 Pharma Lane" />
                  </div>
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: "fit-content", marginTop: "0.5rem" }}>Create Manufacturer</button>
              </form>
            </div>
            
            <div className="card">
              <div className="card-header"><h3 className="card-title">Registered Manufacturers</h3></div>
              {manufacturers.length === 0 ? (
                <div style={{ padding: "2rem", textAlign: "center", color: "#64748b" }}><Shield size={32} style={{ margin: "0 auto 0.5rem", color: "#cbd5e1" }} /><p>No manufacturers registered yet.</p></div>
              ) : (
                <div className="table-responsive">
                  <table className="custom-table">
                    <thead><tr><th>Company</th><th>Contact</th><th>Reg. No.</th><th>Address</th><th>Actions</th></tr></thead>
                    <tbody>
                      {manufacturers.map((m) => (
                        <tr key={m._id}>
                          <td style={{ fontWeight: 600 }}>{m.companyDetails?.companyName}</td>
                          <td><div>{m.name}</div><div style={{ fontSize: "0.82rem", color: "#64748b" }}>{m.email}</div></td>
                          <td><span className="hash-pill">{m.companyDetails?.registrationNumber}</span></td>
                          <td style={{ fontSize: "0.85rem" }}>{m.companyDetails?.address}</td>
                          <td>
                            <button onClick={() => handleDelete(m._id)} className="btn btn-secondary btn-sm" style={{ color: "#ef4444", borderColor: "#fecaca", backgroundColor: "#fef2f2" }}><Trash2 size={14} /> Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        );
      
      case "medicines":
        return (
          <div className="card">
            <div className="card-header"><h3 className="card-title">Global Medicine Records</h3></div>
            {medicines.length === 0 ? (
              <div style={{ padding: "2rem", textAlign: "center", color: "#64748b" }}><p>No medicines recorded yet across all manufacturers.</p></div>
            ) : (
              <div className="table-responsive">
                <table className="custom-table">
                  <thead><tr><th>Medicine ID</th><th>Name / Batch</th><th>Manufacturer</th><th>Expiry</th><th>Status</th><th>On-Chain Tx</th></tr></thead>
                  <tbody>
                    {medicines.map((m) => (
                      <tr key={m._id}>
                        <td><span className="hash-pill">{m.medicineId}</span></td>
                        <td><div style={{ fontWeight: 600 }}>{m.name}</div><div style={{ fontSize: "0.82rem", color: "#64748b" }}>Batch: {m.batchNumber}</div></td>
                        <td>{m.manufacturer}</td>
                        <td>{new Date(m.expiryDate).toLocaleDateString()}</td>
                        <td><StatusBadge status={m.status} /></td>
                        <td>
                          {m.blockchainTransactionHash ? (
                            <span style={{ fontSize: "0.75rem", color: "#10b981", display: "flex", alignItems: "center", gap: "4px" }}><CheckCircle size={14} /> Confirmed</span>
                          ) : (
                            <span style={{ fontSize: "0.75rem", color: "#64748b", display: "flex", alignItems: "center", gap: "4px" }}><Loader size={14} /> Pending/Failed</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );

      case "audit":
        return (
          <div className="card">
            <div className="card-header"><h3 className="card-title">System Audit Logs</h3></div>
            {logs.length === 0 ? (
              <div style={{ padding: "2rem", textAlign: "center", color: "#64748b" }}><p>No audit logs available yet.</p></div>
            ) : (
              <div className="table-responsive">
                <table className="custom-table">
                  <thead><tr><th>Timestamp</th><th>Action</th><th>Details</th><th>Performed By</th></tr></thead>
                  <tbody>
                    {logs.map((log) => (
                      <tr key={log._id}>
                        <td style={{ fontSize: "0.8rem", color: "#64748b", whiteSpace: "nowrap" }}>{new Date(log.createdAt).toLocaleString()}</td>
                        <td><span style={{ fontSize: "0.75rem", padding: "0.25rem 0.5rem", backgroundColor: "#e2e8f0", borderRadius: "4px", fontWeight: 600, color: "#334155" }}>{log.action}</span></td>
                        <td style={{ fontSize: "0.85rem" }}>{log.details}</td>
                        <td style={{ fontSize: "0.8rem" }}>{log.performedBy ? log.performedBy.email : "System"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );

      case "stats":
      default:
        return (
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: "#e0f2fe", color: "#0284c7" }}><Box size={24} /></div>
              <div>
                <div className="stat-val">{stats.totalManufacturers}</div>
                <div className="stat-label">Total Manufacturers</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: "#ecfdf5", color: "#10b981" }}><Activity size={24} /></div>
              <div>
                <div className="stat-val">{stats.onChainTransactions}</div>
                <div className="stat-label">On-Chain Tx Records</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: "#f3e8ff", color: "#9333ea" }}><Shield size={24} /></div>
              <div>
                <div className="stat-val">{stats.totalMedicines}</div>
                <div className="stat-label">Registered Medicines</div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-content">
        <div style={{ marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 800 }}>Admin Console</h1>
          <p style={{ color: "#64748b", fontSize: "0.92rem", marginTop: "0.25rem" }}>
            Global oversight of PharmaChain manufacturers, records, and blockchain infrastructure.
          </p>
        </div>
        
        <div style={{ marginBottom: "2rem", display: "flex", gap: "0.5rem", borderBottom: "1px solid #e2e8f0", paddingBottom: "1rem" }}>
          <span style={{ fontWeight: 600, color: "#64748b", marginRight: "1rem", alignSelf: "center" }}>Active View:</span>
          <span style={{ padding: "0.5rem 1rem", backgroundColor: "#0284c7", color: "white", borderRadius: "8px", fontWeight: 600, fontSize: "0.9rem", textTransform: "capitalize" }}>
            {currentTab === "stats" ? "Dashboard Stats" : currentTab}
          </span>
        </div>

        {renderContent()}
      </main>
    </div>
  );
};

export default AdminDashboard;
