import React from 'react';
import {
  Factory,
  Truck,
  Store,
  UserCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import StatusBadge from './StatusBadge';

export default function SupplyChainTimeline({ events = [], packageId }) {
  const defaultFlow = [
    {
      step: 1,
      title: 'Manufactured & Serialized',
      actorRole: 'Manufacturer',
      icon: Factory,
      defaultOrg: 'ABC Pharma Ltd.',
      defaultLocation: 'Production Plant 4',
      defaultDate: '10 Jan 2026, 09:30 AM'
    },
    {
      step: 2,
      title: 'Distributor Received',
      actorRole: 'Distributor',
      icon: Truck,
      defaultOrg: 'Apex Global Logistics',
      defaultLocation: 'Central Warehouse Hub',
      defaultDate: '12 Jan 2026, 02:15 PM'
    },
    {
      step: 3,
      title: 'Pharmacy Received',
      actorRole: 'Pharmacy',
      icon: Store,
      defaultOrg: 'CareMed Community Chemist',
      defaultLocation: 'Dispensary Shelf A-12',
      defaultDate: '15 Jan 2026, 11:00 AM'
    },
    {
      step: 4,
      title: 'Customer Verification',
      actorRole: 'Customer',
      icon: UserCheck,
      defaultOrg: 'Public Verification Terminal',
      defaultLocation: 'Point of Sale / Mobile App',
      defaultDate: '18 Feb 2026, 02:32 PM'
    }
  ];

  return (
    <div className="w-full bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-slate-100 mb-8">
        <div>
          <h3 className="text-lg font-bold text-slate-900">End-to-End Custody Timeline</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Traceability history for package <span className="font-mono font-bold text-medblue-700">{packageId || 'PKG-PCM001-00001'}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status="COMPLETED" size="sm" />
          <span className="text-xs text-slate-400">4 of 4 checkpoints verified</span>
        </div>
      </div>

      {/* Horizontal Flow Preview for Large Screens */}
      <div className="hidden lg:grid grid-cols-4 gap-3 mb-10 pb-8 border-b border-slate-100">
        {defaultFlow.map((stage, idx) => {
          const Icon = stage.icon;
          return (
            <div key={idx} className="relative bg-slate-50 rounded-2xl p-4 border border-slate-200/70 flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-xl bg-medblue-100 text-medblue-700 flex items-center justify-center mb-2 font-bold">
                <Icon className="h-5 w-5" />
              </div>
              <span className="text-xs font-bold text-slate-800">{stage.actorRole}</span>
              <span className="text-[11px] text-slate-500 mt-0.5">{stage.title}</span>
              {idx < defaultFlow.length - 1 && (
                <div className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 bg-white p-1 rounded-full border border-slate-200 shadow-sm text-slate-400">
                  <ArrowRight className="h-3.5 w-3.5" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Detailed Vertical Timeline */}
      <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
        {events && events.length > 0 ? (
          events.map((evt, idx) => (
            <div key={idx} className="relative group">
              {/* Checkpoint Dot */}
              <div className="absolute -left-6 sm:-left-8 top-1.5 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-emerald-100 border-2 border-emerald-500 text-emerald-700 flex items-center justify-center shadow-sm">
                <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </div>

              {/* Event Card */}
              <div className="bg-slate-50/80 hover:bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-sm font-bold text-slate-900">{evt.title}</h4>
                    <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-md bg-medblue-100 text-medblue-700 border border-medblue-200">
                      {evt.actorRole}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{evt.date}</span>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
                  <div>
                    <span className="text-slate-400 font-medium">Organization:</span>{' '}
                    <span className="font-semibold text-slate-800">{evt.organization}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium">Location:</span>{' '}
                    <span className="text-slate-700">{evt.location}</span>
                  </div>
                </div>

                {evt.notes && (
                  <p className="mt-2.5 text-xs text-slate-600 bg-white p-2.5 rounded-xl border border-slate-200/60 leading-relaxed">
                    {evt.notes}
                  </p>
                )}

                {evt.txHash && (
                  <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 font-mono pt-2 border-t border-slate-200/60">
                    <span>Audit Proof: {evt.txHash}</span>
                    <span className="text-slate-500 font-sans">Simulated Ledger Proof</span>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          defaultFlow.map((stage, idx) => (
            <div key={idx} className="relative group">
              <div className="absolute -left-6 sm:-left-8 top-1.5 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-emerald-100 border-2 border-emerald-500 text-emerald-700 flex items-center justify-center shadow-sm">
                <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </div>
              <div className="bg-slate-50/80 rounded-2xl p-4 sm:p-5 border border-slate-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900">{stage.title}</h4>
                    <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-md bg-medblue-100 text-medblue-700 border border-medblue-200">
                      {stage.actorRole}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500">{stage.defaultDate}</span>
                </div>
                <p className="mt-2 text-xs text-slate-600">
                  {stage.defaultOrg} — {stage.defaultLocation}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
