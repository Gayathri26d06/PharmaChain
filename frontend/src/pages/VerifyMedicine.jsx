import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import medicineService from "../services/medicineService";
import QRScanner from "../components/QRScanner";
import StatusBadge from "../components/StatusBadge";
import {
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Flame,
  QrCode,
  Search,
  Box,
  CheckCircle2,
  Calendar,
  Building,
  Layers,
  Activity,
  ArrowRight,
  RefreshCw
} from "lucide-react";

export const VerifyMedicine = () => {
  const { id: paramId } = useParams();
  const navigate = useNavigate();

  const [medicineIdInput, setMedicineIdInput] = useState(paramId || "");
  const [activeTab, setActiveTab] = useState(paramId ? "manual" : "scanner"); // 'scanner' | 'manual'
  const [loading, setLoading] = useState(false);
  const [verificationData, setVerificationData] = useState(null);
  const [errorResult, setErrorResult] = useState(null);

  const performVerification = async (targetId, source = "MANUAL_INPUT") => {
    if (!targetId || !targetId.trim()) return;

    const cleanId = targetId.trim().toUpperCase();
    setLoading(true);
    setErrorResult(null);
    setVerificationData(null);

    try {
      const result = await medicineService.verifyMedicine(cleanId, source);
      setVerificationData(result);
    } catch (err) {
      const errResponse = err.response?.data;
      if (errResponse) {
        setErrorResult({
          medicineId: cleanId,
          verificationResult: errResponse.verificationResult || "INVALID",
          message: errResponse.message || "Invalid or counterfeit medicine.",
          details: errResponse.details
        });
      } else {
        setErrorResult({
          medicineId: cleanId,
          verificationResult: "INVALID",
          message: "Unable to verify. Check network connection to blockchain node."
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (paramId) {
      setMedicineIdInput(paramId.toUpperCase());
      performVerification(paramId.toUpperCase(), "DIRECT_LINK");
    }
  }, [paramId]);

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (medicineIdInput) {
      navigate(`/verify/${medicineIdInput.trim().toUpperCase()}`);
    }
  };

  const handleScanSuccess = (scannedId) => {
    setMedicineIdInput(scannedId);
    setActiveTab("manual");
    navigate(`/verify/${scannedId}`);
  };

  const getResultCalloutClass = (result) => {
    switch (result) {
      case "GENUINE":
        return "result-genuine";
      case "EXPIRED":
        return "result-expired";
      case "SUSPICIOUS":
        return "result-suspicious";
      case "INVALID":
      default:
        return "result-invalid";
    }
  };

  const getResultIcon = (result) => {
    switch (result) {
      case "GENUINE":
        return <ShieldCheck size={36} color="#10b981" />;
      case "EXPIRED":
        return <AlertTriangle size={36} color="#f59e0b" />;
      case "SUSPICIOUS":
        return <Flame size={36} color="#ea580c" />;
      case "INVALID":
      default:
        return <ShieldAlert size={36} color="#ef4444" />;
    }
  };

  return (
    <div style={{ maxWidth: "900px", margin: "2rem auto", padding: "0 1.25rem" }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "#0f172a" }}>
          Medicine Authenticity Verification
        </h1>
        <p style={{ color: "#64748b", fontSize: "1rem", marginTop: "0.4rem" }}>
          Scan package QR barcode or input unique Medicine ID to cross-verify against the Ethereum smart contract
        </p>

        {/* Tab Toggle */}
        <div style={{ display: "inline-flex", background: "#e2e8f0", padding: "4px", borderRadius: "10px", marginTop: "1.25rem" }}>
          <button
            type="button"
            onClick={() => setActiveTab("scanner")}
            style={{
              padding: "0.55rem 1.25rem",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "0.9rem",
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              background: activeTab === "scanner" ? "#ffffff" : "transparent",
              color: activeTab === "scanner" ? "#0284c7" : "#64748b",
              boxShadow: activeTab === "scanner" ? "0 1px 3px rgba(0,0,0,0.1)" : "none"
            }}
          >
            <QrCode size={16} /> Scan QR Code
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("manual")}
            style={{
              padding: "0.55rem 1.25rem",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "0.9rem",
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              background: activeTab === "manual" ? "#ffffff" : "transparent",
              color: activeTab === "manual" ? "#0284c7" : "#64748b",
              boxShadow: activeTab === "manual" ? "0 1px 3px rgba(0,0,0,0.1)" : "none"
            }}
          >
            <Search size={16} /> Enter ID Manually
          </button>
        </div>
      </div>

      {/* Mode 1: Optical Camera Scanner */}
      {activeTab === "scanner" && (
        <div className="mb-6">
          <QRScanner onScanSuccess={handleScanSuccess} />
        </div>
      )}

      {/* Mode 2: Manual Input Form */}
      {activeTab === "manual" && (
        <div className="card mb-6" style={{ maxWidth: "600px", margin: "0 auto 2rem auto" }}>
          <form onSubmit={handleManualSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="manualId">Enter Medicine ID</label>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <input
                  id="manualId"
                  type="text"
                  placeholder="e.g. MED-2026-A8F92K"
                  value={medicineIdInput}
                  onChange={(e) => setMedicineIdInput(e.target.value)}
                  className="form-input"
                  style={{ fontFamily: "var(--font-mono)", fontSize: "1rem" }}
                  required
                />
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? <RefreshCw size={16} className="spin" /> : "Verify"}
                </button>
              </div>
              <span className="form-helper">
                The Medicine ID is printed below the QR code on the packaging blister/box.
              </span>
            </div>
          </form>
        </div>
      )}

      {/* Loading Indicator */}
      {loading && (
        <div style={{ textAlign: "center", padding: "2.5rem 1rem", color: "#0284c7" }}>
          <RefreshCw size={36} className="spin" style={{ margin: "0 auto 1rem auto" }} />
          <h3 style={{ fontSize: "1.1rem" }}>Connecting to Ethereum Blockchain...</h3>
          <p style={{ color: "#64748b", fontSize: "0.85rem", marginTop: "0.25rem" }}>
            Querying smart contract mapping for verification tuple & checking tamper integrity
          </p>
        </div>
      )}

      {/* Scenario 1: Fake / Counterfeit / Invalid Medicine */}
      {errorResult && !loading && (
        <div className={`result-callout ${getResultCalloutClass(errorResult.verificationResult)}`}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
            <div style={{ flexShrink: 0, marginTop: "2px" }}>
              {getResultIcon(errorResult.verificationResult)}
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                <h2 style={{ fontSize: "1.45rem", fontWeight: 800, color: "inherit" }}>
                  {errorResult.message}
                </h2>
                <span className="hash-pill" style={{ background: "rgba(0,0,0,0.06)", color: "inherit" }}>
                  {errorResult.medicineId}
                </span>
              </div>

              <p style={{ marginTop: "0.5rem", fontSize: "0.95rem", lineHeight: 1.5 }}>
                {errorResult.details?.explanation ||
                  "This Medicine ID is NOT registered on the Ethereum blockchain ledger by any authorized pharmaceutical manufacturer. It may be counterfeit, illicitly duplicated, or counterfeit packaging."}
              </p>

              <div style={{ marginTop: "1rem", padding: "0.75rem 1rem", backgroundColor: "rgba(239, 68, 68, 0.1)", borderRadius: "8px", border: "1px solid rgba(239, 68, 68, 0.2)", fontSize: "0.85rem" }}>
                <strong>Recommendation:</strong> Do NOT consume or dispense this medication. Please report this package immediately to health regulatory authorities or the manufacturer.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Scenario 2: Verified Result (Genuine, Expired, or Suspicious) */}
      {verificationData && !loading && (
        <div>
          {/* Main Status Callout */}
          <div className={`result-callout ${getResultCalloutClass(verificationData.verificationResult)}`}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
              <div style={{ flexShrink: 0, marginTop: "2px" }}>
                {getResultIcon(verificationData.verificationResult)}
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                  <h2 style={{ fontSize: "1.45rem", fontWeight: 800, color: "inherit" }}>
                    {verificationData.verificationResult === "GENUINE" && "Genuine Medicine Verified"}
                    {verificationData.verificationResult === "EXPIRED" && "Medicine Expired"}
                    {verificationData.verificationResult === "SUSPICIOUS" && "Suspicious Medicine Detected"}
                  </h2>
                  <StatusBadge status={verificationData.verificationResult} />
                </div>

                <p style={{ marginTop: "0.4rem", fontSize: "0.95rem", fontWeight: 500 }}>
                  {verificationData.message}
                </p>

                {verificationData.verificationResult === "EXPIRED" && (
                  <div style={{ marginTop: "0.75rem", padding: "0.6rem 0.85rem", backgroundColor: "rgba(245, 158, 11, 0.15)", borderRadius: "6px", fontSize: "0.85rem", color: "#92400e" }}>
                    <strong>Warning:</strong> The official expiry date of this medicine has passed. Drug potency may be compromised or toxic. Safely discard this package.
                  </div>
                )}

                {verificationData.verificationResult === "SUSPICIOUS" && (
                  <div style={{ marginTop: "0.75rem", padding: "0.6rem 0.85rem", backgroundColor: "rgba(234, 88, 12, 0.15)", borderRadius: "6px", fontSize: "0.85rem", color: "#9a3412" }}>
                    <strong>Warning:</strong> Potential clone detected. Our telemetry recorded {verificationData.telemetry?.totalScans || "multiple"} separate scans for this serial number.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Medicine Details Card */}
          <div className="card mb-6">
            <div className="card-header">
              <h3 className="card-title">Verified Pharmaceutical Specifications</h3>
              <span className="hash-pill" style={{ fontSize: "0.88rem" }}>
                {verificationData.medicine?.medicineId}
              </span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.25rem" }}>
              <div>
                <span style={{ fontSize: "0.78rem", color: "#64748b", textTransform: "uppercase", fontWeight: 700 }}>Medicine Name</span>
                <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "#0f172a", marginTop: "2px" }}>
                  {verificationData.medicine?.name}
                </div>
              </div>

              <div>
                <span style={{ fontSize: "0.78rem", color: "#64748b", textTransform: "uppercase", fontWeight: 700 }}>Batch Number</span>
                <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "#0f172a", marginTop: "2px" }}>
                  {verificationData.medicine?.batchNumber}
                </div>
              </div>

              <div>
                <span style={{ fontSize: "0.78rem", color: "#64748b", textTransform: "uppercase", fontWeight: 700 }}>Manufacturer</span>
                <div style={{ fontSize: "1.05rem", fontWeight: 600, color: "#0f172a", marginTop: "2px" }}>
                  {verificationData.medicine?.manufacturer}
                </div>
              </div>

              <div>
                <span style={{ fontSize: "0.78rem", color: "#64748b", textTransform: "uppercase", fontWeight: 700 }}>Manufacturing Date</span>
                <div style={{ fontSize: "1rem", fontWeight: 600, color: "#0f172a", marginTop: "2px" }}>
                  {new Date(verificationData.medicine?.manufacturingDate).toLocaleDateString()}
                </div>
              </div>

              <div>
                <span style={{ fontSize: "0.78rem", color: "#64748b", textTransform: "uppercase", fontWeight: 700 }}>Expiry Date</span>
                <div style={{ fontSize: "1rem", fontWeight: 700, color: verificationData.verificationResult === "EXPIRED" ? "#ef4444" : "#0f172a", marginTop: "2px" }}>
                  {new Date(verificationData.medicine?.expiryDate).toLocaleDateString()}
                </div>
              </div>

              <div>
                <span style={{ fontSize: "0.78rem", color: "#64748b", textTransform: "uppercase", fontWeight: 700 }}>Packaging Quota</span>
                <div style={{ fontSize: "1rem", fontWeight: 600, color: "#0f172a", marginTop: "2px" }}>
                  {verificationData.medicine?.quantity || "Verified Lot"} Units
                </div>
              </div>
            </div>

            {verificationData.medicine?.description && (
              <div style={{ marginTop: "1.25rem", paddingTop: "1rem", borderTop: "1px solid #f1f5f9" }}>
                <span style={{ fontSize: "0.78rem", color: "#64748b", textTransform: "uppercase", fontWeight: 700 }}>Dosage / Usage Guidance</span>
                <p style={{ fontSize: "0.88rem", color: "#475569", marginTop: "4px" }}>
                  {verificationData.medicine.description}
                </p>
              </div>
            )}
          </div>

          {/* Blockchain Cryptographic Verification Card */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Box size={18} color="#0284c7" />
                Immutable Blockchain Verification
              </h3>
              <span style={{ fontSize: "0.78rem", padding: "0.2rem 0.6rem", background: "#ecfdf5", color: "#065f46", borderRadius: "9999px", fontWeight: 700 }}>
                On-Chain Confirmed
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem", fontSize: "0.88rem" }}>
              <div>
                <span style={{ color: "#64748b", display: "block", fontSize: "0.8rem", marginBottom: "2px" }}>Transaction Hash:</span>
                <div className="hash-pill" style={{ wordBreak: "break-all" }}>
                  {verificationData.medicine?.blockchainTransactionHash}
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
                <div>
                  <span style={{ color: "#64748b", display: "block", fontSize: "0.8rem", marginBottom: "2px" }}>Registering Wallet Address:</span>
                  <div className="hash-pill" style={{ fontSize: "0.78rem" }}>
                    {verificationData.blockchainProof?.registeredBy}
                  </div>
                </div>

                <div>
                  <span style={{ color: "#64748b", display: "block", fontSize: "0.8rem", marginBottom: "2px" }}>Mined Block:</span>
                  <span style={{ fontWeight: 600, color: "#0f172a" }}>
                    #{verificationData.blockchainProof?.registeredBlock}
                  </span>
                </div>

                <div>
                  <span style={{ color: "#64748b", display: "block", fontSize: "0.8rem", marginBottom: "2px" }}>Scan Telemetry Counter:</span>
                  <span style={{ fontWeight: 600, color: "#0284c7" }}>
                    {verificationData.telemetry?.totalScans || 1} Scans Recorded
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerifyMedicine;
