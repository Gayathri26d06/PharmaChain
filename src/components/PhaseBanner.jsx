import React from 'react';
import { Blocks, Cpu, ShieldCheck, Sparkles } from 'lucide-react';

export default function PhaseBanner({ type = 'blockchain', compact = false }) {
  if (type === 'blockchain') {
    return (
      <div className={`bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-2xl border border-indigo-800/40 p-4 shadow-sm ${compact ? 'text-xs' : ''}`}>
        <div className="flex items-start gap-3">
          <div className="p-2 bg-indigo-500/20 text-indigo-300 rounded-xl shrink-0 mt-0.5">
            <Blocks className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="text-sm font-bold text-indigo-100">Blockchain Verification</h4>
              <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-indigo-500/30 text-indigo-300 rounded-full border border-indigo-400/30">
                Coming in Phase 2
              </span>
            </div>
            <p className="text-xs text-indigo-200/80 mt-1 leading-relaxed">
              Medicine registration hashes and custody transitions will later be recorded on an immutable distributed ledger to provide cryptographic tamper-evident verification.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'ai') {
    return (
      <div className={`bg-gradient-to-r from-slate-900 to-emerald-950 text-white rounded-2xl border border-emerald-800/40 p-4 shadow-sm ${compact ? 'text-xs' : ''}`}>
        <div className="flex items-start gap-3">
          <div className="p-2 bg-emerald-500/20 text-emerald-300 rounded-xl shrink-0 mt-0.5">
            <Cpu className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="text-sm font-bold text-emerald-100">AI Anomaly Detection</h4>
              <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-emerald-500/30 text-emerald-300 rounded-full border border-emerald-400/30">
                Rule-Based Prototype
              </span>
            </div>
            <p className="text-xs text-emerald-200/80 mt-1 leading-relaxed">
              Current risk scoring uses explainable heuristic rules (rapid scans, geo hops, status flags). A machine-learning model will be integrated in the next development phase.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
