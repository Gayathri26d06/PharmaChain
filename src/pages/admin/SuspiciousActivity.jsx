import React, { useState, useMemo } from 'react';
import {
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
  Ban,
  CheckCircle,
  Eye,
  Activity,
  MapPin,
  Clock,
  Sparkles,
  Cpu
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useToast } from '../../components/Toast';
import DataTable from '../../components/DataTable';
import StatusBadge from '../../components/StatusBadge';
import Modal from '../../components/Modal';
import Button from '../../components/Button';
import PhaseBanner from '../../components/PhaseBanner';
import { calculateRiskScore } from '../../utils/riskEngine';

export default function SuspiciousActivity() {
  const { packages, updatePackageStatus } = useData();
  const toast = useToast();

  const [selectedPkgForReview, setSelectedPkgForReview] = useState(null);

  // Filter packages that have scans > 10, are flagged, or status is Suspicious/Deactivated
  const suspiciousPackages = useMemo(() => {
    return packages.filter(
      p => p.status === 'Suspicious' || p.status === 'Deactivated' || p.isFlagged || (p.scanCount && p.scanCount > 3)
    ).map(p => {
      const riskAnalysis = calculateRiskScore(p, {
        rapidScansDetected: (p.scanCount || 0) > 10
      });
      return {
        ...p,
        riskScore: riskAnalysis.riskScore,
        riskLevel: riskAnalysis.riskLevel,
        anomalyReasons: riskAnalysis.reasons
      };
    });
  }, [packages]);

  const handleFlagPackage = (pkg) => {
    updatePackageStatus(pkg.packageId, 'Suspicious', 'Flagged as anomalous by system administrator');
    toast.warning(`Package ${pkg.packageId} flagged as Suspicious.`);
    if (selectedPkgForReview?.packageId === pkg.packageId) {
      setSelectedPkgForReview(null);
    }
  };

  const handleDeactivatePackage = (pkg) => {
    updatePackageStatus(pkg.packageId, 'Deactivated', 'Deactivated & blacklisted by regulatory authority');
    toast.error(`Package ${pkg.packageId} has been DEACTIVATED.`);
    if (selectedPkgForReview?.packageId === pkg.packageId) {
      setSelectedPkgForReview(null);
    }
  };

  const handleMarkInvestigated = (pkg) => {
    updatePackageStatus(pkg.packageId, 'Active', null);
    toast.success(`Package ${pkg.packageId} cleared and marked Active.`);
    if (selectedPkgForReview?.packageId === pkg.packageId) {
      setSelectedPkgForReview(null);
    }
  };

  const columns = [
    {
      header: 'Package ID',
      key: 'packageId',
      sortable: true,
      render: (row) => (
        <span className="font-mono font-bold text-medblue-700 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
          {row.packageId}
        </span>
      )
    },
    {
      header: 'Product / Batch',
      key: 'productName',
      sortable: true,
      render: (row) => (
        <div>
          <span className="font-bold text-slate-800 text-xs block">{row.productName}</span>
          <span className="font-mono text-[11px] text-slate-500">Batch: {row.batchNumber}</span>
        </div>
      )
    },
    {
      header: 'Risk Score',
      key: 'riskScore',
      sortable: true,
      render: (row) => {
        const score = row.riskScore || 82;
        return (
          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded-md font-mono text-xs font-bold ${
              score > 60
                ? 'bg-rose-100 text-rose-700 border border-rose-200'
                : 'bg-amber-100 text-amber-700 border border-amber-200'
            }`}>
              {score}/100
            </span>
          </div>
        );
      }
    },
    {
      header: 'Anomaly Indicator',
      key: 'flagReason',
      render: (row) => (
        <span className="text-xs text-slate-700 truncate max-w-[200px] block" title={row.flagReason || row.anomalyReasons?.[0]}>
          {row.flagReason || row.anomalyReasons?.[0] || 'Unusual scan frequency pattern'}
        </span>
      )
    },
    {
      header: 'Total Scans',
      key: 'scanCount',
      sortable: true,
      render: (row) => (
        <span className="font-mono text-xs font-bold text-slate-800">
          {row.scanCount || 1} scans
        </span>
      )
    },
    {
      header: 'Last Location',
      key: 'lastScannedLocation',
      render: (row) => (
        <div className="flex items-center gap-1 text-xs text-slate-600">
          <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
          <span className="truncate max-w-[140px]">{row.lastScannedLocation || 'New York, USA'}</span>
        </div>
      )
    },
    {
      header: 'Status',
      key: 'status',
      render: (row) => <StatusBadge status={row.status} size="sm" />
    },
    {
      header: 'Actions',
      key: 'actions',
      render: (row) => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setSelectedPkgForReview(row)}
            className="p-1.5 rounded-lg text-medblue-600 hover:bg-medblue-50 transition-colors"
            title="Review Anomaly Dossier"
          >
            <Eye className="h-4 w-4" />
          </button>

          {row.status !== 'Deactivated' ? (
            <button
              onClick={() => handleDeactivatePackage(row)}
              className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
              title="Deactivate / Recall Package"
            >
              <Ban className="h-4 w-4" />
            </button>
          ) : null}

          {row.status === 'Suspicious' || row.status === 'Deactivated' ? (
            <button
              onClick={() => handleMarkInvestigated(row)}
              className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors"
              title="Mark Investigated & Clear Flag"
            >
              <CheckCircle className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={() => handleFlagPackage(row)}
              className="p-1.5 rounded-lg text-amber-600 hover:bg-amber-50 transition-colors"
              title="Flag as Suspicious"
            >
              <AlertTriangle className="h-4 w-4" />
            </button>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 sm:space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Suspicious Activity & Anomaly Desk</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-700 text-xs font-bold border border-rose-200">
              Admin Governance
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            Real-time heuristic anomaly detection flagging cloned packaging, rapid repeated verifications, and geographic hops.
          </p>
        </div>
      </div>

      {/* Suspicious Table */}
      <DataTable
        columns={columns}
        data={suspiciousPackages}
        emptyTitle="No suspicious packages detected"
        emptyDescription="All scanned packages are currently operating within safe baseline parameters."
        searchPlaceholder="Search anomalies by Package ID, product, or reason..."
        searchKeys={['packageId', 'productName', 'batchNumber', 'flagReason', 'lastScannedLocation']}
      />

      {/* Review Modal */}
      {selectedPkgForReview && (
        <Modal
          isOpen={Boolean(selectedPkgForReview)}
          onClose={() => setSelectedPkgForReview(null)}
          title={`Anomaly Dossier: ${selectedPkgForReview.packageId}`}
          subtitle={`Product: ${selectedPkgForReview.productName}`}
          maxWidth="max-w-lg"
        >
          <div className="space-y-4 text-xs">
            {/* Risk Banner */}
            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <ShieldAlert className="h-6 w-6 text-rose-600 shrink-0" />
                <div>
                  <span className="font-bold text-rose-900 block text-sm">
                    Risk Assessment: {selectedPkgForReview.riskLevel}
                  </span>
                  <span className="text-rose-700">Prototype Heuristic Engine Score</span>
                </div>
              </div>
              <span className="font-mono text-xl font-extrabold text-rose-700">
                {selectedPkgForReview.riskScore}/100
              </span>
            </div>

            {/* Evaluation Factors */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
              <span className="font-bold text-slate-800 block">Triggered Heuristic Anomalies:</span>
              <ul className="list-disc list-inside space-y-1.5 text-slate-700">
                {selectedPkgForReview.anomalyReasons?.map((r, i) => (
                  <li key={i} className="text-rose-700 font-medium">{r}</li>
                )) || <li>Multiple rapid scans recorded across short intervals.</li>}
              </ul>
            </div>

            {/* Telemetry Details */}
            <div className="grid grid-cols-2 gap-2.5 text-slate-600">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-slate-400 block text-[10px]">Total Scans</span>
                <span className="font-mono font-bold text-slate-900">{selectedPkgForReview.scanCount || 1} requests</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-slate-400 block text-[10px]">Current Status</span>
                <StatusBadge status={selectedPkgForReview.status} size="sm" />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-end gap-2.5">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedPkgForReview(null)}
              >
                Close
              </Button>

              <Button
                variant="danger"
                size="sm"
                icon={Ban}
                onClick={() => handleDeactivatePackage(selectedPkgForReview)}
              >
                Deactivate & Recall
              </Button>

              <Button
                variant="secondary"
                size="sm"
                icon={CheckCircle}
                onClick={() => handleMarkInvestigated(selectedPkgForReview)}
              >
                Clear & Mark Active
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
