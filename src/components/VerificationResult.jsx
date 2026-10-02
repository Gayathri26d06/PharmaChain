import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ShieldAlert,
  ShieldCheck,
  Building2,
  Calendar,
  Layers,
  MapPin,
  Clock,
  Cpu,
  Blocks,
  Activity,
  ArrowRight
} from 'lucide-react';
import StatusBadge from './StatusBadge';
import Button from './Button';
import { Link } from 'react-router-dom';

export default function VerificationResult({ result, onReset }) {
  useEffect(() => {
    if (result?.result === 'GENUINE') {
      try {
        confetti({
          particleCount: 80,
          spread: 65,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // silent fail if canvas not ready
      }
    }
  }, [result]);

  if (!result) return null;

  const isGenuine = result.result === 'GENUINE';
  const isExpired = result.result === 'EXPIRED';
  const isSuspicious = result.result === 'SUSPICIOUS';
  const isInvalid = result.result === 'INVALID';

  // Card theme styling
  let headerBg = 'bg-slate-900 text-white';
  let badgeColor = 'emerald';
  let MainIcon = ShieldCheck;

  if (isGenuine) {
    headerBg = 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white';
    MainIcon = CheckCircle2;
    badgeColor = 'emerald';
  } else if (isExpired) {
    headerBg = 'bg-gradient-to-r from-amber-600 to-orange-700 text-white';
    MainIcon = AlertTriangle;
    badgeColor = 'amber';
  } else if (isSuspicious) {
    headerBg = 'bg-gradient-to-r from-rose-700 to-red-800 text-white';
    MainIcon = ShieldAlert;
    badgeColor = 'rose';
  } else if (isInvalid) {
    headerBg = 'bg-gradient-to-r from-slate-800 to-rose-950 text-white';
    MainIcon = XCircle;
    badgeColor = 'rose';
  }

  const riskScore = result.riskAnalysis?.riskScore ?? (isInvalid ? 100 : isSuspicious ? 82 : 5);
  const riskLevel = result.riskAnalysis?.riskLevel ?? (isInvalid ? 'VERY HIGH' : isSuspicious ? 'HIGH' : 'LOW');
  const reasons = result.riskAnalysis?.reasons || [];

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden transition-all duration-300">
      {/* Result Hero Header */}
      <div className={`${headerBg} p-6 sm:p-8 text-center relative overflow-hidden`}>
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
        <div className="relative z-10 flex flex-col items-center">
          <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl mb-3 shadow-inner">
            <MainIcon className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">{result.title}</h2>
          <p className="mt-1 text-sm text-white/90 max-w-md">{result.statusMessage}</p>
          <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-black/20 backdrop-blur-sm rounded-full text-xs font-medium">
            <Clock className="h-3.5 w-3.5" />
            <span>Verified on {new Date(result.timestamp).toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-6 sm:p-8 space-y-6">
        {/* Invalid ID Notice */}
        {isInvalid ? (
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5 text-center">
            <p className="text-xs font-mono font-bold text-rose-800 text-base">{result.packageId || 'UNKNOWN_ID'}</p>
            <p className="text-xs text-rose-600 mt-2">
              The entered Package ID was not found in the PharmaChain database. Do NOT dispense or consume this medicine.
              Please report this serialized packaging to quality control.
            </p>
          </div>
        ) : (
          /* Registered Package Information */
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Authentication Summary</span>
              <StatusBadge status={result.packageStatus || result.result} size="md" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <span className="text-xs text-slate-500 font-medium">Product Name</span>
                <p className="text-sm font-bold text-slate-900 mt-0.5">{result.productName}</p>
                {result.genericName && (
                  <p className="text-xs text-slate-500 mt-0.5">Generic: {result.genericName} ({result.dosage})</p>
                )}
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <span className="text-xs text-slate-500 font-medium">Package Identifier</span>
                <p className="text-sm font-mono font-bold text-medblue-700 mt-0.5">{result.packageId}</p>
                <p className="text-xs text-slate-500 mt-0.5">Batch: {result.batchNumber}</p>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <span className="text-xs text-slate-500 font-medium">Registered Manufacturer</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Building2 className="h-3.5 w-3.5 text-slate-400" />
                  <p className="text-sm font-semibold text-slate-800">{result.manufacturer || 'ABC Pharma Ltd.'}</p>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <span className="text-xs text-slate-500 font-medium">Life Cycle & Expiry</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Calendar className="h-3.5 w-3.5 text-slate-400" />
                  <p className={`text-sm font-semibold ${isExpired ? 'text-rose-600' : 'text-slate-800'}`}>
                    Exp: {result.expiryDate || 'N/A'}
                  </p>
                </div>
                {result.manufacturingDate && (
                  <p className="text-xs text-slate-500 mt-0.5">Mfg: {result.manufacturingDate}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Anomaly Detection Engine Card (Prototype) */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-medblue-100 text-medblue-700">
                <Activity className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Anomaly Risk Engine
                </h4>
                <p className="text-[11px] text-slate-500">Prototype Heuristic Anomaly Evaluation</p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs text-slate-500">Risk Score: </span>
              <span className={`text-sm font-bold font-mono ${
                riskScore > 60 ? 'text-rose-600' : riskScore > 30 ? 'text-amber-600' : 'text-emerald-600'
              }`}>
                {riskScore}/100
              </span>
            </div>
          </div>

          {/* Risk Progress Meter */}
          <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden mb-3">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                riskScore > 60 ? 'bg-rose-500' : riskScore > 30 ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${Math.max(5, riskScore)}%` }}
            />
          </div>

          {/* Reasons List */}
          <div className="space-y-1 mt-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Evaluation Factors:</span>
            <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
              {reasons.map((r, idx) => (
                <li key={idx} className={riskScore > 60 ? 'text-rose-700 font-medium' : ''}>{r}</li>
              ))}
            </ul>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-200/80 flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1">
              <Cpu className="h-3.5 w-3.5 text-slate-400" />
              Prototype Anomaly Detection (Rule-Based)
            </span>
            <span className="italic">AI/ML model in Phase 2</span>
          </div>
        </div>

        {/* Blockchain Notice Card */}
        <div className="bg-indigo-50/60 border border-indigo-100 rounded-2xl p-4 flex items-start gap-3">
          <div className="p-2 bg-indigo-100 text-indigo-700 rounded-xl shrink-0 mt-0.5">
            <Blocks className="h-4 w-4" />
          </div>
          <div className="text-xs">
            <h5 className="font-bold text-indigo-900">Blockchain Verification: Not connected — Phase 2</h5>
            <p className="text-indigo-800/80 mt-0.5 leading-relaxed">
              In Phase 2, this package state will be cryptographically anchored to an immutable smart contract ledger.
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
          {result.isValid && (
            <Link
              to={`/supply-chain?packageId=${result.packageId}`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-medblue-600 hover:text-medblue-700 py-2"
            >
              <span>View Supply Chain Movement</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          )}

          <Button
            variant="outline"
            size="md"
            className="w-full sm:w-auto sm:ml-auto"
            onClick={onReset}
          >
            Verify Another Medicine
          </Button>
        </div>
      </div>
    </div>
  );
}
