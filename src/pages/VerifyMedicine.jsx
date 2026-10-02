import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams, useParams, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  QrCode,
  Search,
  Camera,
  Upload,
  RefreshCw,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Clock,
  XCircle,
  HelpCircle
} from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';
import { useData } from '../context/DataContext';
import { useToast } from '../components/Toast';
import { verifyPackageId } from '../utils/verification';
import VerificationResult from '../components/VerificationResult';
import Button from '../components/Button';
import Input from '../components/Input';

export default function VerifyMedicine() {
  const { packages, batches, recordVerification } = useData();
  const toast = useToast();
  const [searchParams] = useSearchParams();
  const { packageId: urlPackageId } = useParams();
  const navigate = useNavigate();

  // React Hook: useRef to auto-focus the package input on page load
  const inputRef = useRef(null);
  const qrReaderRef = useRef(null);

  const [packageInput, setPackageInput] = useState('');
  const [verificationResult, setVerificationResult] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [activeTab, setActiveTab] = useState('input'); // 'input' | 'scanner'
  const [isScannerActive, setIsScannerActive] = useState(false);
  const [scannerError, setScannerError] = useState(null);

  // Auto-focus input on mount using useRef
  useEffect(() => {
    if (inputRef.current && activeTab === 'input' && !verificationResult) {
      inputRef.current.focus();
    }
  }, [activeTab, verificationResult]);

  // React Hook: useCallback for the verification handler
  const handleVerify = useCallback((pkgIdToVerify, method = 'Manual Entry') => {
    const targetId = (pkgIdToVerify || packageInput).trim();
    if (!targetId) {
      toast.error('Please enter a Package ID');
      return;
    }

    setIsVerifying(true);

    // Simulate verification processing delay
    setTimeout(() => {
      const result = verifyPackageId(targetId, packages, batches, 'Public Consumer Portal', method);
      setVerificationResult(result);
      recordVerification(result);
      setIsVerifying(false);

      if (result.result === 'GENUINE') {
        toast.success('Medicine authenticated: Genuine Package');
      } else if (result.result === 'SUSPICIOUS') {
        toast.warning('Warning: Suspicious scan anomaly detected');
      } else if (result.result === 'EXPIRED') {
        toast.warning('Alert: Medicine is expired');
      } else {
        toast.error('Verification failed: Package ID not found');
      }
    }, 450);
  }, [packageInput, packages, batches, recordVerification, toast]);

  // Check URL params on initial mount
  useEffect(() => {
    const queryPkg = searchParams.get('pkg') || urlPackageId;
    if (queryPkg) {
      setPackageInput(queryPkg);
      handleVerify(queryPkg, 'Direct URL / QR Scan');
    }
  }, [searchParams, urlPackageId, handleVerify]);

  // Handle QR Camera Scanner Start/Stop
  const startScanner = async () => {
    setScannerError(null);
    setIsScannerActive(true);

    try {
      // Small delay to ensure DOM element is mounted
      setTimeout(async () => {
        try {
          const html5QrCode = new Html5Qrcode('reader');
          qrReaderRef.current = html5QrCode;

          const config = { fps: 10, qrbox: { width: 250, height: 250 } };
          await html5QrCode.start(
            { facingMode: 'environment' },
            config,
            (decodedText) => {
              // Extract package ID from url or raw string
              let matchedId = decodedText;
              if (decodedText.includes('/verify/')) {
                matchedId = decodedText.split('/verify/')[1]?.split('?')[0];
              } else if (decodedText.includes('pkg=')) {
                matchedId = decodedText.split('pkg=')[1]?.split('&')[0];
              }

              html5QrCode.stop().then(() => {
                setIsScannerActive(false);
                setPackageInput(matchedId);
                handleVerify(matchedId, 'Camera QR Scanner');
              });
            },
            (errorMessage) => {
              // frame parse error, ignorable
            }
          );
        } catch (err) {
          setScannerError('Camera access not granted or no webcam found. You can use manual input or upload an image.');
          setIsScannerActive(false);
        }
      }, 200);
    } catch (e) {
      setScannerError('Unable to initialize scanner.');
      setIsScannerActive(false);
    }
  };

  const stopScanner = () => {
    if (qrReaderRef.current && isScannerActive) {
      qrReaderRef.current.stop().then(() => {
        setIsScannerActive(false);
      }).catch(() => {
        setIsScannerActive(false);
      });
    } else {
      setIsScannerActive(false);
    }
  };

  // Image file QR scanner
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const html5QrCode = new Html5Qrcode('file-qr-reader-hidden');
      const decodedText = await html5QrCode.scanFile(file, true);
      let matchedId = decodedText;
      if (decodedText.includes('/verify/')) {
        matchedId = decodedText.split('/verify/')[1]?.split('?')[0];
      }
      setPackageInput(matchedId);
      handleVerify(matchedId, 'Image QR Upload');
    } catch (err) {
      toast.error('Could not decode QR code from the uploaded image.');
    }
  };

  const handleResetVerification = () => {
    setVerificationResult(null);
    setPackageInput('');
    stopScanner();
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const quickDemos = [
    {
      id: 'PKG-PCM001-00001',
      label: 'Genuine Medicine',
      type: 'genuine',
      badge: '✓ Genuine',
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
    },
    {
      id: 'PKG-PCM001-00002',
      label: 'Expired Medicine',
      type: 'expired',
      badge: '⚠ Expired',
      color: 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
    },
    {
      id: 'PKG-PCM001-00003',
      label: 'Suspicious Anomaly',
      type: 'suspicious',
      badge: '⚠ Suspicious (Risk 82)',
      color: 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
    },
    {
      id: 'PKG-FAKE-99999',
      label: 'Invalid / Counterfeit',
      type: 'invalid',
      badge: '✕ Invalid ID',
      color: 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Hidden container for image decoding */}
      <div id="file-qr-reader-hidden" className="hidden" />

      {/* Header Banner */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-tr from-medblue-600 to-teal-500 text-white shadow-lg shadow-medblue-500/20 mb-1">
          <ShieldCheck className="h-8 w-8" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Verify Medicine Authenticity
        </h1>
      </div>

      {/* Main Verification Card / Result View */}
      {verificationResult ? (
        <VerificationResult
          result={verificationResult}
          onReset={handleResetVerification}
        />
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden p-6 sm:p-8">
          {/* Method Tabs */}
          <div className="flex items-center justify-center p-1 bg-slate-100 rounded-2xl max-w-sm mx-auto mb-6">
            <button
              onClick={() => { setActiveTab('input'); stopScanner(); }}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'input'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Search className="h-3.5 w-3.5" />
              <span>Enter Package ID</span>
            </button>
            <button
              onClick={() => { setActiveTab('scanner'); }}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'scanner'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <QrCode className="h-3.5 w-3.5" />
              <span>Scan QR Code</span>
            </button>
          </div>

          {/* Tab 1: Manual Package ID Input */}
          {activeTab === 'input' && (
            <div className="space-y-6 max-w-xl mx-auto">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleVerify(packageInput, 'Manual Entry');
                }}
                className="space-y-4"
              >
                <div>
                  <Input
                    ref={inputRef}
                    label="Enter Package Identifier"
                    placeholder="e.g. PKG-PCM001-00001"
                    value={packageInput}
                    onChange={(e) => setPackageInput(e.target.value)}
                    icon={Search}
                    required
                    helperText="Unique serialization code printed on the medicine box"
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  loading={isVerifying}
                  className="w-full font-bold shadow-md"
                  icon={ShieldCheck}
                >
                  Verify Medicine
                </Button>
              </form>

              {/* Quick Demo Test Buttons */}
              <div className="pt-6 border-t border-slate-100">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    1-Click Presentation Demos:
                  </span>
                  <span className="text-[11px] text-slate-400">Click to instantly test</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {quickDemos.map((demo) => (
                    <button
                      key={demo.id}
                      type="button"
                      onClick={() => {
                        setPackageInput(demo.id);
                        handleVerify(demo.id, 'Demo Fast Track');
                      }}
                      className={`p-3 rounded-2xl border text-left flex items-center justify-between transition-all duration-150 ${demo.color}`}
                    >
                      <div>
                        <span className="text-xs font-bold block">{demo.label}</span>
                        <code className="text-[11px] font-mono opacity-80">{demo.id}</code>
                      </div>
                      <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-white/70 shadow-2xs">
                        {demo.badge}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: QR Scanner Camera / Image Upload */}
          {activeTab === 'scanner' && (
            <div className="space-y-6 max-w-md mx-auto text-center">
              {!isScannerActive ? (
                <div className="p-8 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/60 flex flex-col items-center">
                  <div className="p-4 bg-medblue-100 text-medblue-700 rounded-2xl mb-4">
                    <Camera className="h-8 w-8" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-800">Camera QR Scanner</h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-xs leading-relaxed">
                    Point your webcam or mobile camera at a serialized PharmaChain QR code.
                  </p>

                  <div className="mt-6 flex flex-col sm:flex-row gap-3 w-full">
                    <Button
                      variant="primary"
                      size="md"
                      icon={Camera}
                      onClick={startScanner}
                      className="w-full"
                    >
                      Start Camera Scanner
                    </Button>

                    <label className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 cursor-pointer shadow-sm">
                      <Upload className="h-4 w-4" />
                      <span>Upload QR Image</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {scannerError && (
                    <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 text-left">
                      {scannerError}
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Active Camera Viewfinder */}
                  <div className="relative rounded-3xl overflow-hidden border-2 border-medblue-500 shadow-xl bg-black">
                    <div id="reader" className="w-full aspect-square" />
                    <div className="absolute inset-0 pointer-events-none border-4 border-medblue-400/50 m-6 rounded-2xl">
                      <div className="w-full h-1 bg-medblue-400 scanner-laser absolute" />
                    </div>
                  </div>

                  <p className="text-xs text-slate-500">
                    Align the package QR code within the scanning frame...
                  </p>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={stopScanner}
                    className="mx-auto"
                  >
                    Cancel Camera
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
