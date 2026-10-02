import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import medicineService from "../services/medicineService";
import Sidebar from "../components/Sidebar";
import MedicineCard from "../components/MedicineCard";
import StatusBadge from "../components/StatusBadge";
import QRCodeDisplay from "../components/QRCodeDisplay";
import {
  PlusCircle,
  Search,
  Filter,
  QrCode,
  ExternalLink,
  Pill,
  LayoutGrid,
  List,
  RefreshCw
} from "lucide-react";

export const MyMedicines = () => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [viewMode, setViewMode] = useState("table"); // 'table' | 'grid'
  const [selectedQR, setSelectedQR] = useState(null);

  const fetchMedicines = async () => {
    setLoading(true);
    try {
      const data = await medicineService.getMedicines({
        search: search || undefined,
        status: statusFilter || undefined,
        manufacturerOnly: "true"
      });
      if (data.medicines) {
        setMedicines(data.medicines);
      }
    } catch (err) {
      console.warn("Failed to fetch medicines:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, [statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchMedicines();
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-content">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem", marginBottom: "1.75rem" }}>
          <div>
            <h1 style={{ fontSize: "1.75rem", fontWeight: 800 }}>My Registered Medicines</h1>
            <p style={{ color: "#64748b", fontSize: "0.92rem", marginTop: "0.25rem" }}>
              Manage manufactured lots, generate serialized packaging barcodes, and monitor on-chain states
            </p>
          </div>

          <Link to="/add-medicine" className="btn btn-primary">
            <PlusCircle size={16} /> Register New Medicine
          </Link>
        </div>

        {/* Filter and Search Bar */}
        <div className="card mb-6" style={{ padding: "1rem 1.25rem" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", alignItems: "center", justifyContent: "space-between" }}>
            <form onSubmit={handleSearchSubmit} style={{ display: "flex", gap: "0.5rem", flex: 1, minWidth: "260px" }}>
              <input
                type="text"
                placeholder="Search by name, batch number, or Medicine ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="form-input"
                style={{ padding: "0.55rem 0.85rem" }}
              />
              <button type="submit" className="btn btn-secondary btn-sm" style={{ padding: "0 1rem" }}>
                <Search size={15} /> Search
              </button>
            </form>

            <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <Filter size={15} color="#64748b" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="form-select"
                  style={{ padding: "0.5rem 0.75rem", fontSize: "0.85rem" }}
                >
                  <option value="">All Statuses</option>
                  <option value="GENUINE">Genuine</option>
                  <option value="EXPIRED">Expired</option>
                  <option value="SUSPICIOUS">Suspicious</option>
                  <option value="RECALLED">Recalled</option>
                </select>
              </div>

              {/* View Toggle */}
              <div style={{ display: "flex", border: "1px solid #cbd5e1", borderRadius: "8px", overflow: "hidden" }}>
                <button
                  type="button"
                  onClick={() => setViewMode("table")}
                  style={{
                    padding: "0.5rem 0.75rem",
                    background: viewMode === "table" ? "#e0f2fe" : "#ffffff",
                    border: "none",
                    cursor: "pointer",
                    color: viewMode === "table" ? "#0284c7" : "#64748b"
                  }}
                  title="Table View"
                >
                  <List size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  style={{
                    padding: "0.5rem 0.75rem",
                    background: viewMode === "grid" ? "#e0f2fe" : "#ffffff",
                    border: "none",
                    cursor: "pointer",
                    color: viewMode === "grid" ? "#0284c7" : "#64748b"
                  }}
                  title="Grid Cards View"
                >
                  <LayoutGrid size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Medicines Content */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "3rem 1rem", color: "#64748b" }}>
            <RefreshCw size={24} className="spin" style={{ margin: "0 auto 0.5rem auto", color: "#0284c7" }} />
            <p>Fetching ledger records...</p>
          </div>
        ) : medicines.length === 0 ? (
          <div className="card" style={{ textAlign: "center", padding: "3.5rem 1rem" }}>
            <Pill size={42} color="#cbd5e1" style={{ margin: "0 auto 0.75rem auto" }} />
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700 }}>No medicines found</h3>
            <p style={{ fontSize: "0.88rem", color: "#64748b", marginTop: "0.25rem", maxWidth: "420px", margin: "0.25rem auto 1.5rem auto" }}>
              {search || statusFilter
                ? "No registered batches match your query. Try clearing the search filter."
                : "You have not registered any medicine batches on the blockchain yet."}
            </p>
            <Link to="/add-medicine" className="btn btn-primary">
              <PlusCircle size={16} /> Add Your First Medicine
            </Link>
          </div>
        ) : viewMode === "grid" ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.25rem" }}>
            {medicines.map((med) => (
              <MedicineCard
                key={med._id || med.medicineId}
                medicine={med}
                onShowQR={(m) => setSelectedQR(m)}
              />
            ))}
          </div>
        ) : (
          <div className="card" style={{ padding: 0, overflow: "hidden" }}>
            <div className="table-responsive">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Medicine ID</th>
                    <th>Product Name</th>
                    <th>Batch</th>
                    <th>Mfg Date</th>
                    <th>Expiry Date</th>
                    <th>Quantity</th>
                    <th>Status</th>
                    <th>Blockchain Tx</th>
                    <th style={{ textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {medicines.map((med) => (
                    <tr key={med._id || med.medicineId}>
                      <td>
                        <span className="hash-pill">{med.medicineId}</span>
                      </td>
                      <td style={{ fontWeight: 600 }}>{med.name}</td>
                      <td>{med.batchNumber}</td>
                      <td>{new Date(med.manufacturingDate).toLocaleDateString()}</td>
                      <td>{new Date(med.expiryDate).toLocaleDateString()}</td>
                      <td>{med.quantity}</td>
                      <td>
                        <StatusBadge status={med.status} />
                      </td>
                      <td>
                        {med.blockchainTransactionHash ? (
                          <span className="hash-pill" title={med.blockchainTransactionHash}>
                            {med.blockchainTransactionHash.substring(0, 8)}...
                          </span>
                        ) : (
                          <span style={{ color: "#94a3b8" }}>—</span>
                        )}
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <div style={{ display: "inline-flex", gap: "0.4rem" }}>
                          <button
                            type="button"
                            onClick={() => setSelectedQR(med)}
                            className="btn btn-secondary btn-sm"
                            title="Generate / View QR Code"
                          >
                            <QrCode size={13} /> QR
                          </button>
                          <Link
                            to={`/verify/${med.medicineId}`}
                            className="btn btn-primary btn-sm"
                            title="Verify on Blockchain"
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
          </div>
        )}

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

export default MyMedicines;
