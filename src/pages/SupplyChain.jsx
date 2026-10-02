import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Truck, Search, ShieldCheck, Plus, ArrowRight, Building2, Store, UserCheck, CheckCircle2 } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useToast } from '../components/Toast';
import SupplyChainTimeline from '../components/SupplyChainTimeline';
import PhaseBanner from '../components/PhaseBanner';
import Button from '../components/Button';
import Input from '../components/Input';
import Modal from '../components/Modal';
import Select from '../components/Select';

export default function SupplyChain() {
  const { packages, supplyChainEvents } = useData();
  const toast = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  const initialPkgId = searchParams.get('packageId') || packages[0]?.packageId || 'PKG-PCM001-00001';
  const [selectedPackageId, setSelectedPackageId] = useState(initialPkgId);
  const [searchInput, setSearchInput] = useState(initialPkgId);
  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false);

  useEffect(() => {
    const q = searchParams.get('packageId');
    if (q) {
      setSelectedPackageId(q);
      setSearchInput(q);
    }
  }, [searchParams]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSelectedPackageId(searchInput.trim().toUpperCase());
      setSearchParams({ packageId: searchInput.trim().toUpperCase() });
    }
  };

  const matchedEvents = supplyChainEvents[selectedPackageId] || [
    {
      step: 1,
      title: 'Batch Serialized & Packages Created',
      organization: 'ABC Pharma Ltd.',
      actorRole: 'Manufacturer',
      location: 'Production Facility',
      date: '10 Jan 2026, 09:30 AM',
      status: 'Completed',
      txHash: '0x8f72a4...3b91 (Simulated Hash)',
      notes: `Package ${selectedPackageId} generated with high-density anti-counterfeit QR.`
    },
    {
      step: 2,
      title: 'Transferred to Wholesale Logistics',
      organization: 'Apex Global Logistics',
      actorRole: 'Distributor',
      location: 'Central Distribution Hub, New York',
      date: '12 Jan 2026, 02:15 PM',
      status: 'Completed',
      txHash: '0x3c99e1...7a04 (Simulated Hash)',
      notes: 'Cold chain & tamper seals inspected. Stored in climate-controlled bay.'
    },
    {
      step: 3,
      title: 'Received by Authorized Dispensary',
      organization: 'CareMed Community Chemist',
      actorRole: 'Pharmacy',
      location: 'Main St Branch, New York',
      date: '15 Jan 2026, 11:00 AM',
      status: 'Completed',
      txHash: '0x11ab44...90ff (Simulated Hash)',
      notes: 'Inventory scanned and verified at intake terminal.'
    },
    {
      step: 4,
      title: 'Dispensed / Customer Verification',
      organization: 'Public Verification Portal',
      actorRole: 'Customer',
      location: 'New York, USA',
      date: '18 Feb 2026, 02:32 PM',
      status: 'Completed',
      txHash: '0x6e55cd...11aa (Simulated Hash)',
      notes: 'End consumer scanned QR code. Anti-counterfeit check passed.'
    }
  ];

  return (
    <div className="space-y-6 sm:space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Supply Chain Custody Tracker</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time multi-echelon medicine transit tracking from manufacturing plant to retail pharmacy.
          </p>
        </div>
      </div>

      {/* Package Lookup Search Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-sm">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Enter Package ID to inspect custody trail (e.g. PKG-PCM001-00001)..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-medblue-500 focus:bg-white"
            />
          </div>

          <Button type="submit" variant="primary" size="md" icon={Truck} className="w-full sm:w-auto">
            Track Package
          </Button>
        </form>

        {/* Quick Suggestion Pills */}
        <div className="mt-3 flex items-center gap-2 overflow-x-auto text-xs text-slate-500">
          <span className="shrink-0 font-medium">Quick Packages:</span>
          {packages.slice(0, 4).map((p) => (
            <button
              key={p.packageId}
              type="button"
              onClick={() => {
                setSelectedPackageId(p.packageId);
                setSearchInput(p.packageId);
                setSearchParams({ packageId: p.packageId });
              }}
              className={`px-2.5 py-1 rounded-lg border font-mono transition-colors shrink-0 ${
                selectedPackageId === p.packageId
                  ? 'bg-medblue-50 border-medblue-300 text-medblue-700 font-bold'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {p.packageId}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline Component */}
      <SupplyChainTimeline events={matchedEvents} packageId={selectedPackageId} />
    </div>
  );
}
