import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Box, Check, Copy, ExternalLink, ShieldCheck } from "lucide-react";
import StatusBadge from "./StatusBadge";

export const BlockchainRecord = ({ record }) => {
  const [copied, setCopied] = useState(false);

  const copyTx = () => {
    if (!record.transactionHash) return;
    navigator.clipboard.writeText(record.transactionHash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const truncatedTx = record.transactionHash
    ? `${record.transactionHash.substring(0, 10)}...${record.transactionHash.substring(record.transactionHash.length - 8)}`
    : "Unconfirmed / Pending";

  return (
    <div className="card mb-4" style={{ padding: "1.25rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.75rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div style={{ width: "42px", height: "42px", borderRadius: "10px", backgroundColor: "#e0f2fe", display: "flex", alignItems: "center", justifyContent: "center", color: "#0284c7" }}>
            <Box size={22} />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ fontWeight: 700, fontSize: "1rem", color: "#0f172a" }}>{record.name}</span>
              <span className="hash-pill">{record.medicineId}</span>
            </div>
            <div style={{ fontSize: "0.82rem", color: "#64748b", marginTop: "2px" }}>
              Batch: <strong>{record.batchNumber}</strong> &bull; Manufacturer: <strong>{record.manufacturer}</strong>
            </div>
          </div>
        </div>

        <StatusBadge status={record.status} />
      </div>

      <div style={{ marginTop: "1rem", padding: "0.85rem", backgroundColor: "#f8fafc", borderRadius: "8px", border: "1px solid #e2e8f0", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "0.75rem", fontSize: "0.82rem" }}>
        <div>
          <span style={{ color: "#64748b", display: "block", marginBottom: "2px" }}>Transaction Hash:</span>
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <span className="hash-pill" title={record.transactionHash}>{truncatedTx}</span>
            {record.transactionHash && (
              <button
                type="button"
                onClick={copyTx}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b" }}
                title="Copy full TxHash"
              >
                {copied ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
              </button>
            )}
          </div>
        </div>

        <div>
          <span style={{ color: "#64748b", display: "block", marginBottom: "2px" }}>Block Number:</span>
          <span style={{ fontWeight: 600, color: "#0f172a" }}>
            {record.blockNumber ? `#${record.blockNumber}` : "Genesis / Auto-mine"}
          </span>
        </div>

        <div>
          <span style={{ color: "#64748b", display: "block", marginBottom: "2px" }}>Ledger Commit Status:</span>
          <span style={{ fontWeight: 600, color: record.blockchainStatus === "FAILED" ? "#ef4444" : "#10b981" }}>
            {record.blockchainStatus || "COMMITTED"}
          </span>
        </div>

        <div>
          <span style={{ color: "#64748b", display: "block", marginBottom: "2px" }}>Verification Link:</span>
          <Link
            to={`/verify/${record.medicineId}`}
            style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem", color: "#0284c7", fontWeight: 600 }}
          >
            <ShieldCheck size={14} /> Audit On-Chain <ExternalLink size={12} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlockchainRecord;
