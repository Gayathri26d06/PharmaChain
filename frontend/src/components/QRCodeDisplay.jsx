import React, { useRef, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Download, Copy, Check, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

export const QRCodeDisplay = ({ medicineId, medicineName, batchNumber, size = 200 }) => {
  const [copied, setCopied] = useState(false);
  const qrRef = useRef(null);

  const verificationUrl = `${window.location.origin}/verify/${medicineId}`;

  const handleDownload = () => {
    const canvas = qrRef.current?.querySelector("canvas");
    if (!canvas) return;

    const pngUrl = canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");

    const downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = `PharmaChain_QR_${medicineId}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(verificationUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col items-center p-4 bg-white rounded-lg border border-gray-200 shadow-sm" style={{ textAlign: "center" }}>
      <div ref={qrRef} style={{ background: "#ffffff", padding: "12px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
        <QRCodeCanvas
          value={verificationUrl}
          size={size}
          level="H"
          includeMargin={true}
        />
      </div>

      <div style={{ marginTop: "1rem", width: "100%" }}>
        <div style={{ fontWeight: 700, fontSize: "1.05rem", color: "#0f172a" }}>
          {medicineName || "Pharmaceutical Unit"}
        </div>
        <div className="hash-pill" style={{ display: "inline-block", margin: "0.4rem 0", fontWeight: 600 }}>
          {medicineId}
        </div>
        {batchNumber && (
          <div style={{ fontSize: "0.82rem", color: "#64748b" }}>
            Batch: <strong>{batchNumber}</strong>
          </div>
        )}
      </div>

      <div style={{ display: "flex", gap: "0.5rem", marginTop: "1.25rem", flexWrap: "wrap", justifyContent: "center" }}>
        <button
          type="button"
          onClick={handleDownload}
          className="btn btn-secondary btn-sm"
          title="Download High-Res QR Code PNG"
        >
          <Download size={14} /> Download QR
        </button>

        <button
          type="button"
          onClick={handleCopy}
          className="btn btn-secondary btn-sm"
          title="Copy Verification URL"
        >
          {copied ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
          {copied ? "Copied!" : "Copy Link"}
        </button>

        <Link
          to={`/verify/${medicineId}`}
          className="btn btn-primary btn-sm"
          title="Direct Test Verification"
        >
          <ExternalLink size={14} /> Verify
        </Link>
      </div>

      <div style={{ fontSize: "0.74rem", color: "#94a3b8", marginTop: "0.75rem", wordBreak: "break-all" }}>
        Target: {verificationUrl}
      </div>
    </div>
  );
};

export default QRCodeDisplay;
