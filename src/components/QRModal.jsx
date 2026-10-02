import React, { useRef } from 'react';
import { QRCodeSVG, QRCodeCanvas } from 'qrcode.react';
import { Download, Printer, Copy, Check, ExternalLink, ShieldCheck } from 'lucide-react';
import Modal from './Modal';
import Button from './Button';
import { useToast } from './Toast';

export default function QRModal({ isOpen, onClose, pkg }) {
  const canvasRef = useRef(null);
  const toast = useToast();
  const [copied, setCopied] = React.useState(false);

  if (!pkg) return null;

  // Conceptual verification URL
  const verifyUrl = `${window.location.origin}/verify/${pkg.packageId}`;

  const handleDownloadQR = () => {
    try {
      const canvas = document.getElementById(`qr-canvas-${pkg.packageId}`);
      if (canvas) {
        const pngUrl = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.href = pngUrl;
        downloadLink.download = `QR_${pkg.packageId}.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        toast.success(`QR Code downloaded for ${pkg.packageId}`);
      }
    } catch (err) {
      toast.error('Failed to download QR image');
    }
  };

  const handlePrintQR = () => {
    window.print();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(verifyUrl);
    setCopied(true);
    toast.info('Verification link copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Serialized Package QR Code"
      subtitle="Cryptographic unit verification token"
      maxWidth="max-w-md"
    >
      <div className="flex flex-col items-center text-center">
        {/* Printable Card Area */}
        <div id="printable-qr-area" className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-6 flex flex-col items-center">
          {/* Logo & Header */}
          <div className="flex items-center gap-2 mb-3">
            <div className="h-6 w-6 rounded-lg bg-medblue-600 flex items-center justify-center text-white">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <span className="text-sm font-bold text-slate-900 tracking-tight">PharmaChain Security Seal</span>
          </div>

          {/* QR Code Container */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-center my-2">
            <QRCodeSVG
              value={verifyUrl}
              size={180}
              level="H"
              includeMargin={false}
              className="w-44 h-44"
            />
            {/* Hidden canvas used for PNG generation */}
            <div className="hidden">
              <QRCodeCanvas
                id={`qr-canvas-${pkg.packageId}`}
                value={verifyUrl}
                size={512}
                level="H"
                includeMargin={true}
              />
            </div>
          </div>

          {/* Package Details */}
          <div className="mt-3 w-full bg-white rounded-xl p-3.5 border border-slate-200/70 text-left space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500">Package ID:</span>
              <span className="font-mono font-bold text-medblue-700">{pkg.packageId}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500">Product:</span>
              <span className="font-semibold text-slate-800 truncate max-w-[200px]">{pkg.productName}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500">Batch Number:</span>
              <span className="font-mono font-medium text-slate-700">{pkg.batchNumber}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500">Manufacturer:</span>
              <span className="text-slate-700">{pkg.manufacturer}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500">Expiry Date:</span>
              <span className="font-medium text-slate-700">{pkg.expiryDate}</span>
            </div>
          </div>

          <p className="mt-3 text-[11px] text-slate-500">
            Scan this code with a mobile camera to check authenticity in the PharmaChain registry.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-5 w-full grid grid-cols-2 gap-2.5">
          <Button
            variant="outline"
            size="sm"
            icon={Download}
            onClick={handleDownloadQR}
          >
            Download PNG
          </Button>

          <Button
            variant="outline"
            size="sm"
            icon={Printer}
            onClick={handlePrintQR}
          >
            Print QR
          </Button>
        </div>

        <div className="mt-2.5 w-full">
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-xs text-slate-600"
            icon={copied ? Check : Copy}
            onClick={handleCopyLink}
          >
            {copied ? 'Link Copied!' : 'Copy Verification URL'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
