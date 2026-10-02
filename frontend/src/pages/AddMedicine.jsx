import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import medicineService from "../services/medicineService";
import Sidebar from "../components/Sidebar";
import QRCodeDisplay from "../components/QRCodeDisplay";
import { PlusCircle, Box, AlertCircle, CheckCircle2, ArrowLeft } from "lucide-react";

export const AddMedicine = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    batchNumber: "",
    manufacturer: user?.name || "",
    manufacturingDate: new Date().toISOString().split("T")[0],
    expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    quantity: 100,
    description: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successResult, setSuccessResult] = useState(null);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.batchNumber || !formData.manufacturer || !formData.manufacturingDate || !formData.expiryDate || !formData.quantity) {
      setError("Please complete all required fields");
      return;
    }

    if (new Date(formData.expiryDate) <= new Date(formData.manufacturingDate)) {
      setError("Expiry date must be after manufacturing date");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await medicineService.addMedicine(formData);
      setSuccessResult(response);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to register medicine. Ensure backend and blockchain node are running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-content">
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          {/* Header */}
          <div style={{ marginBottom: "1.75rem" }}>
            <h1 style={{ fontSize: "1.75rem", fontWeight: 800 }}>
              Register New Medicine
            </h1>
            <p style={{ color: "#64748b", fontSize: "0.92rem", marginTop: "0.25rem" }}>
              Mint an immutable pharmaceutical record to the Ethereum blockchain and generate verification QR codes
            </p>
          </div>

          {error && (
            <div style={{ padding: "0.85rem", backgroundColor: "#fef2f2", border: "1px solid #fecaca", borderRadius: "8px", color: "#991b1b", fontSize: "0.88rem", display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.5rem" }}>
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          <div className="card">
            <form onSubmit={handleSubmit}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.25rem" }}>
                {/* Medicine Name */}
                <div className="form-group">
                  <label className="form-label" htmlFor="name">Medicine / Brand Name *</label>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Paracetamol 500mg, Amoxicillin"
                    className="form-input"
                    required
                  />
                </div>

                {/* Batch Number */}
                <div className="form-group">
                  <label className="form-label" htmlFor="batchNumber">Batch / Lot Number *</label>
                  <input
                    id="batchNumber"
                    type="text"
                    name="batchNumber"
                    value={formData.batchNumber}
                    onChange={handleChange}
                    placeholder="e.g. BATCH-2026-09"
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.25rem" }}>
                {/* Manufacturer */}
                <div className="form-group">
                  <label className="form-label" htmlFor="manufacturer">Manufacturer Entity *</label>
                  <input
                    id="manufacturer"
                    type="text"
                    name="manufacturer"
                    value={formData.manufacturer}
                    onChange={handleChange}
                    placeholder="e.g. Pfizer Global Manufacturing"
                    className="form-input"
                    required
                  />
                </div>

                {/* Quantity */}
                <div className="form-group">
                  <label className="form-label" htmlFor="quantity">Batch Quantity (Units) *</label>
                  <input
                    id="quantity"
                    type="number"
                    name="quantity"
                    min="1"
                    value={formData.quantity}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.25rem" }}>
                {/* Manufacturing Date */}
                <div className="form-group">
                  <label className="form-label" htmlFor="manufacturingDate">Manufacturing Date *</label>
                  <input
                    id="manufacturingDate"
                    type="date"
                    name="manufacturingDate"
                    value={formData.manufacturingDate}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </div>

                {/* Expiry Date */}
                <div className="form-group">
                  <label className="form-label" htmlFor="expiryDate">Expiry Date *</label>
                  <input
                    id="expiryDate"
                    type="date"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </div>
              </div>

              {/* Description */}
              <div className="form-group">
                <label className="form-label" htmlFor="description">Product Description & Dosage Notes</label>
                <textarea
                  id="description"
                  name="description"
                  rows="3"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="e.g. Antipyretic and analgesic oral tablets. Store below 25°C in dry place."
                  className="form-textarea"
                />
              </div>

              <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: "1.25rem", marginTop: "1.25rem", display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
                <button
                  type="button"
                  onClick={() => navigate("/medicines")}
                  className="btn btn-secondary"
                  disabled={loading}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="btn btn-primary btn-lg"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Box size={18} className="spin" />
                      Broadcasting to Blockchain...
                    </>
                  ) : (
                    <>
                      <PlusCircle size={18} />
                      Register & Mint on Ledger
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Registration Success Modal with QR Code */}
          {successResult && (
            <div className="modal-overlay">
              <div className="modal-card" style={{ maxWidth: "600px" }}>
                <div style={{ textAlign: "center", marginBottom: "1.25rem" }}>
                  <div style={{ width: "48px", height: "48px", borderRadius: "50%", backgroundColor: "#ecfdf5", color: "#10b981", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 0.75rem auto" }}>
                    <CheckCircle2 size={28} />
                  </div>
                  <h3 style={{ fontSize: "1.35rem", fontWeight: 700 }}>Medicine Registered Successfully!</h3>
                  <p style={{ fontSize: "0.88rem", color: "#64748b" }}>
                    Recorded on Ethereum ledger and indexed in PharmaChain database
                  </p>
                </div>

                {/* QR Display */}
                <QRCodeDisplay
                  medicineId={successResult.medicine?.medicineId}
                  medicineName={successResult.medicine?.name}
                  batchNumber={successResult.medicine?.batchNumber}
                  size={200}
                />

                {/* Blockchain Info Box */}
                <div style={{ marginTop: "1.25rem", padding: "0.85rem", backgroundColor: "#f8fafc", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "0.82rem" }}>
                  <div style={{ color: "#64748b", marginBottom: "3px" }}>Transaction Hash:</div>
                  <div className="hash-pill" style={{ wordBreak: "break-all" }}>
                    {successResult.blockchain?.transactionHash || successResult.medicine?.blockchainTransactionHash}
                  </div>
                  {successResult.blockchain?.blockNumber && (
                    <div style={{ marginTop: "0.5rem", color: "#475569" }}>
                      Mined at Block: <strong>#{successResult.blockchain.blockNumber}</strong>
                    </div>
                  )}
                </div>

                <div style={{ marginTop: "1.5rem", display: "flex", gap: "0.75rem" }}>
                  <button
                    type="button"
                    onClick={() => {
                      setSuccessResult(null);
                      setFormData({
                        name: "",
                        batchNumber: "",
                        manufacturer: user?.name || "",
                        manufacturingDate: new Date().toISOString().split("T")[0],
                        expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
                        quantity: 100,
                        description: ""
                      });
                    }}
                    className="btn btn-secondary"
                    style={{ flex: 1 }}
                  >
                    Register Another
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate("/medicines")}
                    className="btn btn-primary"
                    style={{ flex: 1 }}
                  >
                    Go to My Medicines
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AddMedicine;
