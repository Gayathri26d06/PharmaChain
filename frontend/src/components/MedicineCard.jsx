import React from "react";
import { Link } from "react-router-dom";
import { QrCode, ShieldCheck, Calendar, Layers, Building } from "lucide-react";
import StatusBadge from "./StatusBadge";

export const MedicineCard = ({ medicine, onShowQR }) => {
  const mfgFormatted = medicine.manufacturingDate
    ? new Date(medicine.manufacturingDate).toLocaleDateString()
    : "N/A";
  const expFormatted = medicine.expiryDate
    ? new Date(medicine.expiryDate).toLocaleDateString()
    : "N/A";

  const isExpired = medicine.expiryDate && new Date() > new Date(medicine.expiryDate);
  const displayStatus = isExpired ? "EXPIRED" : medicine.status;

  return (
    <div className="card flex flex-col justify-between" style={{ height: "100%" }}>
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.5rem" }}>
          <div>
            <h4 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#0f172a" }}>{medicine.name}</h4>
            <div className="hash-pill" style={{ display: "inline-block", marginTop: "0.25rem" }}>
              {medicine.medicineId}
            </div>
          </div>
          <StatusBadge status={displayStatus} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", marginTop: "1rem", fontSize: "0.86rem", color: "#475569" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Building size={14} color="#64748b" />
            <span>Mfr: <strong>{medicine.manufacturer}</strong></span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Layers size={14} color="#64748b" />
            <span>Batch: <strong>{medicine.batchNumber}</strong> ({medicine.quantity} units)</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Calendar size={14} color="#64748b" />
            <span>Mfg: {mfgFormatted} &bull; Exp: <strong style={{ color: isExpired ? "#ef4444" : "inherit" }}>{expFormatted}</strong></span>
          </div>
        </div>

        {medicine.description && (
          <p style={{ fontSize: "0.8rem", color: "#64748b", marginTop: "0.75rem", lineClamp: 2, display: "-webkit-box", WebkitBoxOrient: "vertical", overflow: "hidden" }}>
            {medicine.description}
          </p>
        )}
      </div>

      <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: "0.85rem", marginTop: "1rem", display: "flex", gap: "0.5rem", justifyContent: "space-between" }}>
        <button
          type="button"
          onClick={() => onShowQR && onShowQR(medicine)}
          className="btn btn-secondary btn-sm"
          style={{ flex: 1 }}
        >
          <QrCode size={14} /> View QR
        </button>

        <Link
          to={`/verify/${medicine.medicineId}`}
          className="btn btn-primary btn-sm"
          style={{ flex: 1 }}
        >
          <ShieldCheck size={14} /> Verify
        </Link>
      </div>
    </div>
  );
};

export default MedicineCard;
