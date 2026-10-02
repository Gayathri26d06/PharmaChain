import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import medicineService from "../services/medicineService";
import blockchainService from "../services/blockchainService";
import Sidebar from "../components/Sidebar";
import StatusBadge from "../components/StatusBadge";
import QRCodeDisplay from "../components/QRCodeDisplay";
import {
  Pill,
  ShieldCheck,
  AlertTriangle,
  Flame,
  Box,
  PlusCircle,
  QrCode,
  ArrowRight,
  RefreshCw,
  ExternalLink,
  Layers
} from "lucide-react";

export const Dashboard = () => {
  const { user, isManufacturer } = useAuth();
  const [stats, setStats] = useState({
    totalMedicines: 0,
    genuineMedicines: 0,
    expiredMedicines: 0,
    suspiciousMedicines: 0,
    blockchainTransactions: 0
  });
  const [recentMeds, setRecentMeds] = useState([]);
  const [recentVerifications, setRecentVerifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedQR, setSelectedQR] = useState(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const data = await medicineService.getDashboardStats();
      if (data.stats) {
        setStats(data.stats);
      }
      if (data.recentMedicines) {
        setRecentMeds(data.recentMedicines);
      }
      if (data.recentVerifications) {
        setRecentVerifications(data.recentVerifications);
      }
    } catch (err) {
      console.warn("Failed to load dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-content">
        {/* Welcome Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem", marginBottom: "1.75rem" }}>
          <div>
            <h1 style={{ fontSize: "1.75rem", fontWeight: 800 }}>
              Welcome back, {user?.name}
            </h1>
            <p style={{ color: "#64748b", fontSize: "0.92rem", marginTop: "0.25rem" }}>
              {isManufacturer
                ? "Manufacturer Operations Console & Smart Contract Relayer"
                : "Customer Verification Terminal & Provenance Inspector"}
            </p>
          </div>

          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button
              type="button"
              onClick={fetchDashboardData}
              className="btn btn-secondary btn-sm"
              title="Refresh telemetry"
            >
              <RefreshCw size={14} className={loading ? "spin" : ""} /> Refresh
            </button>

            {isManufacturer ? (
              <Link to="/add-medicine" className="btn btn-primary btn-sm">
                <PlusCircle size={15} /> Add Medicine
              </Link>
            ) : (
              <Link to="/verify" className="btn btn-primary btn-sm">
                <ShieldCheck size={15} /> Verify Medicine
              </Link>
            )}
          </div>
        </div>

        {/* 5 Stats Cards Required by Prompt */}
        <div className="stats-grid">
          {/* Total Medicines */}
          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: "#e0f2fe", color: "#0284c7" }}>
              <Pill size={24} />
            </div>
            <div>
              <div className="stat-val">{stats.totalMedicines}</div>
              <div className="stat-label">Total Medicines</div>
            </div>
          </div>

          {/* Verified / Genuine Medicines */}
          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: "#ecfdf5", color: "#10b981" }}>
              <ShieldCheck size={24} />
            </div>
            <div>
              <div className="stat-val">{stats.genuineMedicines}</div>
              <div className="stat-label">Verified Genuine</div>
            </div>
          </div>

          {/* Expired Medicines */}
          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: "#fffbeb", color: "#d97706" }}>
              <AlertTriangle size={24} />
            </div>
            <div>
              <div className="stat-val">{stats.expiredMedicines}</div>
              <div className="stat-label">Expired Batches</div>
            </div>
          </div>

          {/* Suspicious Medicines */}
          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: "#fff7ed", color: "#ea580c" }}>
              <Flame size={24} />
            </div>
            <div>
              <div className="stat-val">{stats.suspiciousMedicines}</div>
              <div className="stat-label">Suspicious Flagged</div>
            </div>
          </div>

          {/* Blockchain Transactions */}
          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: "#f3e8ff", color: "#9333ea" }}>
              <Box size={24} />
            </div>
            <div>
              <div className="stat-val">{stats.blockchainTransactions}</div>
              <div className="stat-label">Blockchain Tx Count</div>
            </div>
          </div>
        </div>

        {/* Role Tailored Action Cards */}
        <div style={{ marginBottom: "2rem" }}>
          <h3 style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>Quick Actions</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1rem" }}>
            {isManufacturer ? (
              <>
                <Link to="/add-medicine" className="card" style={{ display: "flex", alignItems: "center", gap: "1rem", textDecoration: "none" }}>
                  <div style={{ width: "42px", height: "42px", borderRadius: "10px", backgroundColor: "#e0f2fe", display: "flex", alignItems: "center", justifyContent: "center", color: "#0284c7" }}>
                    <PlusCircle size={22} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: "0.95rem", color: "#0f172a" }}>Register Medicine</h4>
                    <span style={{ fontSize: "0.8rem", color: "#64748b" }}>Mint new medicine to ledger</span>
                  </div>
                </Link>

                <Link to="/medicines" className="card" style={{ display: "flex", alignItems: "center", gap: "1rem", textDecoration: "none" }}>
                  <div style={{ width: "42px", height: "42px", borderRadius: "10px", backgroundColor: "#ecfdf5", display: "flex", alignItems: "center", justifyContent: "center", color: "#10b981" }}>
                    <Layers size={22} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: "0.95rem", color: "#0f172a" }}>My Medicines</h4>
                    <span style={{ fontSize: "0.8rem", color: "#64748b" }}>Manage batches and print QRs</span>
                  </div>
                </Link>

                <Link to="/blockchain" className="card" style={{ display: "flex", alignItems: "center", gap: "1rem", textDecoration: "none" }}>
                  <div style={{ width: "42px", height: "42px", borderRadius: "10px", backgroundColor: "#f3e8ff", display: "flex", alignItems: "center", justifyContent: "center", color: "#9333ea" }}>
                    <Box size={22} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: "0.95rem", color: "#0f172a" }}>Blockchain Ledger</h4>
                    <span style={{ fontSize: "0.8rem", color: "#64748b" }}>Inspect smart contract blocks</span>
                  </div>
                </Link>
              </>
            ) : (
              <>
                <Link to="/verify" className="card" style={{ display: "flex", alignItems: "center", gap: "1rem", textDecoration: "none" }}>
                  <div style={{ width: "42px", height: "42px", borderRadius: "10px", backgroundColor: "#e0f2fe", display: "flex", alignItems: "center", justifyContent: "center", color: "#0284c7" }}>
                    <ShieldCheck size={22} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: "0.95rem", color: "#0f172a" }}>Verify Medicine ID</h4>
                    <span style={{ fontSize: "0.8rem", color: "#64748b" }}>Check authenticity status</span>
                  </div>
                </Link>

                <Link to="/verify" className="card" style={{ display: "flex", alignItems: "center", gap: "1rem", textDecoration: "none" }}>
                  <div style={{ width: "42px", height: "42px", borderRadius: "10px", backgroundColor: "#ecfdf5", display: "flex", alignItems: "center", justifyContent: "center", color: "#10b981" }}>
                    <QrCode size={22} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: "0.95rem", color: "#0f172a" }}>Scan Package QR</h4>
                    <span style={{ fontSize: "0.8rem", color: "#64748b" }}>Instant browser camera scan</span>
                  </div>
                </Link>

                <Link to="/blockchain" className="card" style={{ display: "flex", alignItems: "center", gap: "1rem", textDecoration: "none" }}>
                  <div style={{ width: "42px", height: "42px", borderRadius: "10px", backgroundColor: "#f3e8ff", display: "flex", alignItems: "center", justifyContent: "center", color: "#9333ea" }}>
                    <Box size={22} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: "0.95rem", color: "#0f172a" }}>Blockchain Explorer</h4>
                    <span style={{ fontSize: "0.8rem", color: "#64748b" }}>View on-chain records</span>
                  </div>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Recent Registered Medicines Section */}
        <div className="card mb-6">
          <div className="card-header">
            <h3 className="card-title">
              {isManufacturer ? "Recently Registered Medicines" : "Recent Public Medicine Registry"}
            </h3>
            {isManufacturer && (
              <Link to="/medicines" style={{ fontSize: "0.86rem", fontWeight: 600, display: "flex", alignItems: "center", gap: "0.25rem" }}>
                View All <ArrowRight size={14} />
              </Link>
            )}
          </div>

          {recentMeds.length === 0 ? (
            <div style={{ textAlign: "center", padding: "2.5rem 1rem", color: "#64748b" }}>
              <Pill size={36} color="#cbd5e1" style={{ margin: "0 auto 0.5rem auto" }} />
              <p>No medicines recorded yet.</p>
              {isManufacturer && (
                <Link to="/add-medicine" className="btn btn-primary btn-sm mt-4">
                  <PlusCircle size={14} /> Register Your First Medicine
                </Link>
              )}
            </div>
          ) : (
            <div className="table-responsive">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Medicine ID</th>
                    <th>Product Name</th>
                    <th>Batch</th>
                    <th>Expiry Date</th>
                    <th>Status</th>
                    <th>Blockchain Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {recentMeds.map((med) => (
                    <tr key={med._id || med.medicineId}>
                      <td>
                        <span className="hash-pill">{med.medicineId}</span>
                      </td>
                      <td style={{ fontWeight: 600 }}>{med.name}</td>
                      <td>{med.batchNumber}</td>
                      <td>{new Date(med.expiryDate).toLocaleDateString()}</td>
                      <td>
                        <StatusBadge status={med.status} />
                      </td>
                      <td>
                        <span style={{ fontSize: "0.78rem", fontWeight: 600, color: med.blockchainStatus === "FAILED" ? "#ef4444" : "#10b981" }}>
                          {med.blockchainStatus || "COMMITTED"}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: "0.4rem" }}>
                          <button
                            type="button"
                            onClick={() => setSelectedQR(med)}
                            className="btn btn-secondary btn-sm"
                            title="View QR Code"
                          >
                            <QrCode size={13} /> QR
                          </button>
                          <Link
                            to={`/verify/${med.medicineId}`}
                            className="btn btn-primary btn-sm"
                            title="Verify"
                          >
                            <ExternalLink size={13} />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Verification History Log Section */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Live Verification & Telemetry Stream</h3>
          </div>

          {recentVerifications.length === 0 ? (
            <div style={{ textAlign: "center", padding: "2rem 1rem", color: "#64748b" }}>
              <ShieldCheck size={32} color="#cbd5e1" style={{ margin: "0 auto 0.5rem auto" }} />
              <p style={{ fontSize: "0.88rem" }}>No verifications logged in this session yet.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Timestamp</th>
                    <th>Medicine ID</th>
                    <th>Verification Result</th>
                    <th>Source</th>
                    <th>Telemetry Summary</th>
                  </tr>
                </thead>
                <tbody>
                  {recentVerifications.map((log) => (
                    <tr key={log._id}>
                      <td style={{ fontSize: "0.82rem", color: "#64748b" }}>
                        {new Date(log.createdAt).toLocaleTimeString()} &bull; {new Date(log.createdAt).toLocaleDateString()}
                      </td>
                      <td>
                        <Link to={`/verify/${log.medicineId}`} className="hash-pill">
                          {log.medicineId}
                        </Link>
                      </td>
                      <td>
                        <StatusBadge status={log.result} />
                      </td>
                      <td style={{ fontSize: "0.82rem" }}>{log.verificationSource}</td>
                      <td style={{ fontSize: "0.82rem", color: "#475569" }}>{log.notes || "Standard authenticity query"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* QR Code Modal */}
        {selectedQR && (
          <div className="modal-overlay" onClick={() => setSelectedQR(null)}>
            <div className="modal-card" onClick={(e) => e.stopPropagation()}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <h3 className="card-title">Medicine QR Verification Code</h3>
                <button
                  type="button"
                  onClick={() => setSelectedQR(null)}
                  className="btn btn-secondary btn-sm"
                >
                  ✕
                </button>
              </div>

              <QRCodeDisplay
                medicineId={selectedQR.medicineId}
                medicineName={selectedQR.name}
                batchNumber={selectedQR.batchNumber}
                size={220}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
