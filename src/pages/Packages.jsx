import React, { useState } from 'react';
import {
  Boxes,
  QrCode,
  Eye,
  Download,
  Plus,
  ShieldCheck,
  Building2,
  Calendar,
  Layers,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useData } from '../context/DataContext';
import { useToast } from '../components/Toast';
import DataTable from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';
import QRModal from '../components/QRModal';
import Modal from '../components/Modal';
import Button from '../components/Button';
import Select from '../components/Select';
import Input from '../components/Input';
import { Link, useNavigate } from 'react-router-dom';

export default function Packages() {
  const { packages, batches, generatePackagesForBatch } = useData();
  const toast = useToast();
  const navigate = useNavigate();

  const [selectedQRForModal, setSelectedQRForModal] = useState(null);
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [selectedBatchNumber, setSelectedBatchNumber] = useState(batches[0]?.batchNumber || '');
  const [packageCountToGen, setPackageCountToGen] = useState(10);
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredPackages = React.useMemo(() => {
    if (statusFilter === 'ALL') return packages;
    return packages.filter(p => p.status.toUpperCase() === statusFilter.toUpperCase());
  }, [packages, statusFilter]);

  const handleGenerateSubmit = (e) => {
    e.preventDefault();
    if (!selectedBatchNumber) {
      toast.error('Please select a batch.');
      return;
    }

    try {
      const generated = generatePackagesForBatch(selectedBatchNumber, Number(packageCountToGen) || 10);
      toast.success(`Successfully generated ${generated.length} packages for batch ${selectedBatchNumber}!`);
      setIsGenerateModalOpen(false);
    } catch (err) {
      toast.error(err.message || 'Generation failed');
    }
  };

  const columns = [
    {
      header: 'Package ID',
      key: 'packageId',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-2">
          <span className="font-mono font-bold text-medblue-700 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
            {row.packageId}
          </span>
          {row.isFlagged && (
            <span title={row.flagReason || 'Flagged anomaly'}>
              <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
            </span>
          )}
        </div>
      )
    },
    {
      header: 'Product',
      key: 'productName',
      sortable: true,
      render: (row) => (
        <div>
          <span className="font-bold text-slate-800 text-xs block">{row.productName}</span>
          <span className="text-[11px] text-slate-500">Dosage: {row.dosage || 'Standard'}</span>
        </div>
      )
    },
    {
      header: 'Batch',
      key: 'batchNumber',
      sortable: true,
      render: (row) => (
        <span className="font-mono text-xs font-semibold text-slate-700">
          {row.batchNumber}
        </span>
      )
    },
    {
      header: 'Manufacturer',
      key: 'manufacturer',
      render: (row) => (
        <span className="text-xs text-slate-600 truncate max-w-[130px] block">
          {row.manufacturer}
        </span>
      )
    },
    {
      header: 'QR Preview',
      key: 'qr',
      render: (row) => (
        <button
          onClick={() => setSelectedQRForModal(row)}
          className="p-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg shadow-2xs group flex items-center gap-1.5 transition-colors"
          title="Click to expand QR Code"
        >
          <div className="w-6 h-6 flex items-center justify-center">
            <QRCodeSVG
              value={`${window.location.origin}/verify/${row.packageId}`}
              size={24}
              level="L"
            />
          </div>
          <span className="text-[11px] font-semibold text-medblue-600 group-hover:underline pr-1">
            View QR
          </span>
        </button>
      )
    },
    {
      header: 'Status',
      key: 'status',
      render: (row) => <StatusBadge status={row.status} size="sm" />
    },
    {
      header: 'Created Date',
      key: 'createdDate',
      sortable: true,
      render: (row) => <span className="text-xs text-slate-500">{row.createdDate}</span>
    },
    {
      header: 'Actions',
      key: 'actions',
      render: (row) => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => navigate(`/verify?pkg=${row.packageId}`)}
            className="p-1.5 rounded-lg text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-xs font-semibold flex items-center gap-1 transition-colors"
            title="Verify this Package"
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Verify</span>
          </button>

          <button
            onClick={() => setSelectedQRForModal(row)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title="Download / Print QR"
          >
            <QrCode className="h-4 w-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Serialized Medicine Packages</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Individual medicine packaging with cryptographic serialization IDs and 2D QR matrix tags.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <Button
            variant="primary"
            size="md"
            icon={Boxes}
            onClick={() => setIsGenerateModalOpen(true)}
          >
            + Generate Packages
          </Button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {['ALL', 'ACTIVE', 'SUSPICIOUS', 'EXPIRED', 'DEACTIVATED'].map((tab) => (
          <button
            key={tab}
            onClick={() => setStatusFilter(tab)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors shrink-0 ${
              statusFilter === tab
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {tab === 'ALL' ? 'All Packages' : tab}
            <span className="ml-1.5 opacity-70">
              ({tab === 'ALL' ? packages.length : packages.filter(p => p.status.toUpperCase() === tab).length})
            </span>
          </button>
        ))}
      </div>

      {/* Packages Data Table */}
      <DataTable
        columns={columns}
        data={filteredPackages}
        searchPlaceholder="Search by Package ID (e.g. PKG-PCM001-00001), batch, or product..."
        searchKeys={['packageId', 'productName', 'batchNumber', 'manufacturer', 'status']}
      />

      {/* View / Download QR Modal */}
      {selectedQRForModal && (
        <QRModal
          isOpen={Boolean(selectedQRForModal)}
          onClose={() => setSelectedQRForModal(null)}
          pkg={selectedQRForModal}
        />
      )}

      {/* Generate Packages Modal */}
      <Modal
        isOpen={isGenerateModalOpen}
        onClose={() => setIsGenerateModalOpen(false)}
        title="Generate Unique Medicine Packages"
        subtitle="Batch serialization engine with deterministic package IDs"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleGenerateSubmit} className="space-y-4">
          <Select
            label="Select Production Batch"
            value={selectedBatchNumber}
            onChange={(e) => setSelectedBatchNumber(e.target.value)}
            options={batches.map(b => ({
              value: b.batchNumber,
              label: `${b.batchNumber} — ${b.productName} (${b.status})`
            }))}
            required
            helperText="Packages will inherit this batch's formulation and expiry metadata"
          />

          <Input
            label="Quantity of Unique Packages"
            type="number"
            min="1"
            max="100"
            value={packageCountToGen}
            onChange={(e) => setPackageCountToGen(e.target.value)}
            required
            helperText="e.g. 10 packages will generate sequential IDs"
          />

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 text-[11px] text-slate-600 space-y-1">
            <span className="font-bold text-slate-700 block">Identifier Format:</span>
            <code className="text-medblue-700 font-mono font-bold block">
              PKG-{selectedBatchNumber || 'BATCH'}-XXXXX
            </code>
            <span className="text-slate-400 block text-[10px]">
              * Note: Prototype identifier generated for this academic project.
            </span>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <Button variant="outline" size="sm" onClick={() => setIsGenerateModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" icon={Sparkles}>
              Generate Packages
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
