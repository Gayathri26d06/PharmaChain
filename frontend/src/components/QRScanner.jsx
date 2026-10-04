import React, { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Camera, RefreshCw, Upload, AlertCircle } from "lucide-react";

export const QRScanner = ({ onScanSuccess }) => {
  const [scannerActive, setScannerActive] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const html5QrCodeRef = useRef(null);
  const fileInputRef = useRef(null);

  const scannerRegionId = "qr-reader-viewport";

  // Parse ID from scanned text: could be full URL "http://.../verify/MED-2026-XXXX" or plain ID
  const parseMedicineId = (decodedText) => {
    if (!decodedText) return "";
    const trimmed = decodedText.trim();
    if (trimmed.includes("/verify/")) {
      const parts = trimmed.split("/verify/");
      return parts[1]?.split("?")[0]?.trim() || trimmed;
    }
    return trimmed;
  };

  const handleScanResult = async (decodedText) => {
    const medicineId = parseMedicineId(decodedText);
    if (medicineId && onScanSuccess) {
      setIsProcessing(true);
      await stopScanner();
      onScanSuccess(medicineId);
    }
  };

  const startScanner = async () => {
    setErrorMessage("");
    try {
      if (!html5QrCodeRef.current) {
        html5QrCodeRef.current = new Html5Qrcode(scannerRegionId);
      }

      const cameras = await Html5Qrcode.getCameras();
      if (!cameras || cameras.length === 0) {
        setErrorMessage("No camera hardware detected on this device. You can upload a QR image below.");
        return;
      }

      const cameraId = cameras[0].id;

      await html5QrCodeRef.current.start(
        cameraId,
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0
        },
        (decodedText) => {
          handleScanResult(decodedText);
        },
        () => {
          // ignore frame errors while searching for code
        }
      );

      setScannerActive(true);
    } catch (err) {
      console.warn("Scanner initialization warning:", err);
      setErrorMessage(
        "Camera access denied or unavailable in this environment. Please allow camera permissions or upload an image file containing the QR code."
      );
      setScannerActive(false);
    }
  };

  const stopScanner = async () => {
    if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
      try {
        await html5QrCodeRef.current.stop();
        html5QrCodeRef.current.clear();
      } catch (err) {
        console.warn("Error stopping scanner:", err);
      }
    }
    setScannerActive(false);
  };

  // Fallback: Scan QR from an image file
  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setErrorMessage("");
    setIsProcessing(true);

    try {
      const scanner = new Html5Qrcode("file-scan-temp");
      const decodedText = await scanner.scanFile(file, true);
      scanner.clear();
      handleScanResult(decodedText);
    } catch (err) {
      setErrorMessage("No valid QR code found in the selected image. Please try another clear photo.");
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
        html5QrCodeRef.current.stop().catch(() => {});
      }
    };
  }, []);

  return (
    <div className="card flex flex-col items-center" style={{ maxWidth: "560px", margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: "1rem" }}>
        <h3 className="card-title" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
          <Camera size={20} color="#0284c7" />
          Optical QR Code Scanner
        </h3>
        <p style={{ fontSize: "0.86rem", color: "#64748b", marginTop: "0.25rem" }}>
          Point your device camera directly at the medicine packaging QR code
        </p>
      </div>

      {/* Scanner Viewport */}
      <div style={{ position: "relative", width: "100%", maxWidth: "360px", minHeight: "280px", margin: "0 auto" }}>
        <div
          id={scannerRegionId}
          style={{
            width: "100%",
            height: "100%",
            minHeight: "280px",
            backgroundColor: "#0f172a",
            borderRadius: "12px",
            overflow: "hidden",
            border: "2px dashed #38bdf8"
          }}
        ></div>
        {!scannerActive && (
          <div style={{ 
            position: "absolute", 
            top: 0, left: 0, right: 0, bottom: 0, 
            display: "flex", 
            flexDirection: "column",
            alignItems: "center", 
            justifyContent: "center",
            color: "#94a3b8", 
            padding: "1.5rem",
            pointerEvents: "none"
          }}>
            <Camera size={44} color="#38bdf8" style={{ margin: "0 auto 0.75rem auto", opacity: 0.8 }} />
            <p style={{ fontSize: "0.88rem", fontWeight: 500 }}>Camera currently standby</p>
            <p style={{ fontSize: "0.76rem", marginTop: "0.25rem" }}>Click Start Camera to initialize live video stream</p>
          </div>
        )}
      </div>

      {/* Invisible element for file scanning */}
      <div id="file-scan-temp" style={{ display: "none" }}></div>

      {/* Error Message */}
      {errorMessage && (
        <div style={{ marginTop: "1rem", width: "100%", padding: "0.75rem", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "8px", display: "flex", gap: "0.5rem", alignItems: "flex-start", color: "#991b1b", fontSize: "0.85rem" }}>
          <AlertCircle size={18} style={{ flexShrink: 0, marginTop: "2px" }} />
          <div>{errorMessage}</div>
        </div>
      )}

      {/* Scanner Controls */}
      <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.25rem", flexWrap: "wrap", justifyContent: "center", width: "100%" }}>
        {!scannerActive ? (
          <button
            type="button"
            onClick={startScanner}
            className="btn btn-primary"
            disabled={isProcessing}
          >
            <Camera size={16} /> Start Camera
          </button>
        ) : (
          <button
            type="button"
            onClick={stopScanner}
            className="btn btn-danger"
          >
            Stop Camera
          </button>
        )}

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="btn btn-secondary"
          disabled={isProcessing}
        >
          <Upload size={16} /> Upload QR Image
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleFileUpload}
        />
      </div>

      {isProcessing && (
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "1rem", color: "#0284c7", fontSize: "0.88rem" }}>
          <RefreshCw size={16} className="spin" />
          <span>Decoding QR barcode & querying blockchain...</span>
        </div>
      )}
    </div>
  );
};

export default QRScanner;
