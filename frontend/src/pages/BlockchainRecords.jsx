import React, { useEffect, useState } from "react";
import blockchainService from "../services/blockchainService";
import BlockchainRecord from "../components/BlockchainRecord";
import { Box, RefreshCw, Cpu, CheckCircle2, Search, Terminal, ExternalLink } from "lucide-react";

export const BlockchainRecords = () => {
  const [info, setInfo] = useState(null);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inspectorId, setInspectorId] = useState("");
  const [inspectorResult, setInspectorResult] = useState(null);
  const [inspecting, setInspecting] = useState(false);

  const fetchBlockchainData = async () => {
    setLoading(true);
    try {
      const [infoRes, recordsRes] = await Promise.all([
        blockchainService.getBlockchainInfo(),
        blockchainService.getBlockchainRecords()
      ]);

      if (infoRes?.network) {
        setInfo(infoRes.network);
      }
      if (recordsRes?.records) {
        setRecords(recordsRes.records);
      }
    } catch (err) {
      console.warn("Failed to fetch blockchain data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlockchainData();
  }, []);

  const handleInspect = async (e) => {
    e.preventDefault();
    if (!inspectorId.trim()) return;

    setInspecting(true);
    setInspectorResult(null);

    try {
      const res = await blockchainService.getSingleChainRecord(inspectorId.trim().toUpperCase());
      setInspectorResult(res.data);
    } catch (err) {
      setInspectorResult({ error: err.response?.data?.message || "Medicine not registered on smart contract" });
    } finally {
      setInspecting(false);
    }
  };

  return (
    <div style={{ maxWidth: "1100px", margin: "2rem auto", padding: "0 1.25rem" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ fontSize: "1.85rem", fontWeight: 800, display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Box size={28} color="#0284c7" />
            Ethereum Blockchain Ledger
          </h1>
          <p style={{ color: "#64748b", fontSize: "0.95rem", marginTop: "0.25rem" }}>
            Real-time decentralized ledger state, smart contract storage, and cryptographic transaction receipts
          </p>
        </div>

        <button
          type="button"
          onClick={fetchBlockchainData}
          className="btn btn-secondary btn-sm"
          disabled={loading}
        >
          <RefreshCw size={14} className={loading ? "spin" : ""} /> Sync Ledger
        </button>
      </div>

      {/* Network Overview Card */}
      <div className="card mb-6" style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)", color: "#ffffff", border: "none" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Cpu size={20} color="#38bdf8" />
            <span style={{ fontWeight: 700, fontSize: "1.05rem" }}>Hardhat EVM Local Network</span>
          </div>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", padding: "0.25rem 0.65rem", background: "rgba(16, 185, 129, 0.2)", border: "1px solid rgba(16, 185, 129, 0.4)", borderRadius: "9999px", color: "#34d399", fontSize: "0.78rem", fontWeight: 700 }}>
            <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#10b981" }}></span>
            {info?.isOnline ? "Network Online" : "Local Node Ready"}
          </span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", fontSize: "0.85rem" }}>
          <div>
            <span style={{ color: "#94a3b8", display: "block" }}>Smart Contract:</span>
            <span className="hash-pill" style={{ background: "rgba(255,255,255,0.1)", color: "#38bdf8", marginTop: "2px", display: "inline-block" }}>
              {info?.contractAddress || "0x5FbDB2315678afecb367f032d93F642f64180aa3"}
            </span>
          </div>

          <div>
            <span style={{ color: "#94a3b8", display: "block" }}>RPC Endpoint:</span>
            <span style={{ fontFamily: "var(--font-mono)", color: "#f1f5f9" }}>
              {info?.rpcUrl || "http://127.0.0.1:8545"}
            </span>
          </div>

          <div>
            <span style={{ color: "#94a3b8", display: "block" }}>Chain ID:</span>
            <span style={{ fontWeight: 700, color: "#f1f5f9" }}>
              {info?.chainId || "31337"} (EVM Localhost)
            </span>
          </div>

          <div>
            <span style={{ color: "#94a3b8", display: "block" }}>Total Medicines on Chain:</span>
            <span style={{ fontWeight: 700, color: "#38bdf8", fontSize: "1.1rem" }}>
              {info?.totalMedsOnChain !== undefined ? info.totalMedsOnChain : records.length}
            </span>
          </div>
        </div>
      </div>

      {/* Raw Smart Contract Data Inspector */}
      <div className="card mb-6">
        <div className="card-header">
          <h3 className="card-title" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Terminal size={18} color="#0284c7" />
            Smart Contract Inspector (Direct EVM Call)
          </h3>
        </div>

        <p style={{ fontSize: "0.88rem", color: "#64748b", marginBottom: "1rem" }}>
          Execute a read-only <code style={{ color: "#0284c7" }}>getMedicine(medicineId)</code> RPC query directly against the deployed Solidity contract.
        </p>

        <form onSubmit={handleInspect} style={{ display: "flex", gap: "0.5rem", maxWidth: "600px" }}>
          <input
            type="text"
            placeholder="Enter Medicine ID (e.g. MED-2026-A8F92K)..."
            value={inspectorId}
            onChange={(e) => setInspectorId(e.target.value)}
            className="form-input"
            style={{ fontFamily: "var(--font-mono)" }}
            required
          />
          <button type="submit" className="btn btn-primary" disabled={inspecting}>
            {inspecting ? <RefreshCw size={15} className="spin" /> : "Inspect"}
          </button>
        </form>

        {inspectorResult && (
          <div style={{ marginTop: "1.25rem", padding: "1rem", backgroundColor: "#0f172a", borderRadius: "8px", color: "#38bdf8", fontFamily: "var(--font-mono)", fontSize: "0.82rem", overflowX: "auto" }}>
            <div style={{ color: "#94a3b8", marginBottom: "0.5rem" }}>// Solidity EVM Query Response:</div>
            <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>
              {JSON.stringify(inspectorResult, null, 2)}
            </pre>
          </div>
        )}
      </div>

      {/* Immutable Transaction History */}
      <div>
        <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "1rem" }}>
          Recorded Medicine Transactions
        </h3>

        {loading ? (
          <div style={{ textAlign: "center", padding: "3rem 1rem", color: "#64748b" }}>
            <RefreshCw size={24} className="spin" style={{ margin: "0 auto 0.5rem auto", color: "#0284c7" }} />
            <p>Loading ledger receipts...</p>
          </div>
        ) : records.length === 0 ? (
          <div className="card" style={{ textAlign: "center", padding: "3rem 1rem", color: "#64748b" }}>
            <Box size={38} color="#cbd5e1" style={{ margin: "0 auto 0.5rem auto" }} />
            <h4 style={{ fontWeight: 600, color: "#0f172a", marginTop: "0.5rem" }}>No Transactions Mined Yet</h4>
            <p style={{ fontSize: "0.88rem", marginTop: "0.25rem" }}>
              Transactions appear here automatically as soon as a manufacturer registers a new medicine.
            </p>
          </div>
        ) : (
          <div>
            {records.map((rec, idx) => (
              <BlockchainRecord key={rec.medicineId || idx} record={rec} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlockchainRecords;
