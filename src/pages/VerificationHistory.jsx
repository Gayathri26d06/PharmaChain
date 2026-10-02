import React, { useState, useMemo } from 'react';
import { History, ShieldCheck, Filter, Search, Calendar, MapPin, QrCode } from 'lucide-react';
import { useData } from '../context/DataContext';
import DataTable from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';

export default function VerificationHistory() {
  const { verifications } = useData();
  const navigate = useNavigate();

  const [activeFilter, setActiveFilter] = useState('ALL');

  const filteredVerifications = useMemo(() => {
    if (activeFilter === 'ALL') return verifications;
    return verifications.filter(v => v.result?.toUpperCase() === activeFilter.toUpperCase());
  }, [verifications, activeFilter]);

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
      header: 'Product Name',
      key: 'productName',
      sortable: true,
      render: (row) => <span className="font-semibold text-slate-800 text-xs">{row.productName}</span>
    },
    {
      header: 'Batch',
      key: 'batchNumber',
      sortable: true,
      render: (row) => (
        <span className="font-mono text-xs font-semibold text-slate-600">{row.batchNumber}</span>
      )
    },
    {
      header: 'Verification Result',
      key: 'result',
      render: (row) => <StatusBadge status={row.result} size="sm" />
    },
    {
      header: 'Risk Score',
      key: 'riskScore',
      sortable: true,
      render: (row) => {
        const score = row.riskScore || 0;
        return (
          <div className="flex items-center gap-2">
            <div className="w-12 bg-slate-200 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full ${
                  score > 60 ? 'bg-rose-500' : score > 30 ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${Math.max(10, score)}%` }}
              />
            </div>
            <span className={`font-mono text-xs font-bold ${
              score > 60 ? 'text-rose-600' : score > 30 ? 'text-amber-600' : 'text-emerald-600'
            }`}>
              {score}
            </span>
          </div>
        );
      }
    },
    {
      header: 'Location / Terminal',
      key: 'location',
      render: (row) => (
        <div className="flex items-center gap-1.5 text-xs text-slate-600">
          <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          <span className="truncate max-w-[160px]">{row.location}</span>
        </div>
      )
    },
    {
      header: 'Date & Time',
      key: 'timestamp',
      sortable: true,
      render: (row) => (
        <span className="text-xs text-slate-500">
          {new Date(row.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
        </span>
      )
    },
    {
      header: 'Method',
      key: 'method',
      render: (row) => (
        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-[11px] font-medium text-slate-600 flex items-center gap-1 w-fit">
          <QrCode className="h-3 w-3 text-slate-400" />
          {row.method || 'Manual'}
        </span>
      )
    },
    {
      header: 'Action',
      key: 'actions',
      render: (row) => (
        <button
          onClick={() => navigate(`/verify?pkg=${row.packageId}`)}
          className="text-xs font-bold text-medblue-600 hover:text-medblue-700 hover:underline"
        >
          Re-Verify
        </button>
      )
    }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Verification Audit History</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Chronological audit trail of all mobile scans, pharmacy checks, and consumer verification queries.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          icon={ShieldCheck}
          onClick={() => navigate('/verify')}
        >
          New Verification
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {['ALL', 'GENUINE', 'SUSPICIOUS', 'EXPIRED', 'INVALID'].map((filter) => {
          const count = filter === 'ALL'
            ? verifications.length
            : verifications.filter(v => v.result?.toUpperCase() === filter).length;

          return (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                activeFilter === filter
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {filter === 'ALL' ? 'All Records' : filter}
              <span className="ml-1.5 opacity-70">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={filteredVerifications}
        searchPlaceholder="Search audit log by Package ID, product name, batch, or location..."
        searchKeys={['packageId', 'productName', 'batchNumber', 'location', 'result']}
      />
    </div>
  );
}
