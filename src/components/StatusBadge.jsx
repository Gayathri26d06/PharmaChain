import React from 'react';

export default function StatusBadge({ status, size = 'md' }) {
  if (!status) return null;

  const normalized = status.toString().toUpperCase();

  let styles = 'bg-slate-100 text-slate-700 border-slate-200';
  let dotColor = 'bg-slate-400';

  switch (normalized) {
    case 'ACTIVE':
    case 'GENUINE':
    case 'APPROVED':
    case 'COMPLETED':
    case 'LOW':
      styles = 'bg-emerald-50 text-emerald-700 border-emerald-200';
      dotColor = 'bg-emerald-500';
      break;

    case 'SUSPICIOUS':
    case 'HIGH':
    case 'FLAGGED':
    case 'WARNING':
      styles = 'bg-amber-50 text-amber-700 border-amber-200';
      dotColor = 'bg-amber-500';
      break;

    case 'EXPIRED':
    case 'INVALID':
    case 'DEACTIVATED':
    case 'SUSPENDED':
    case 'VERY HIGH':
      styles = 'bg-rose-50 text-rose-700 border-rose-200';
      dotColor = 'bg-rose-500';
      break;

    case 'MEDIUM':
    case 'PENDING':
    case 'IN_TRANSIT':
      styles = 'bg-blue-50 text-blue-700 border-blue-200';
      dotColor = 'bg-blue-500';
      break;

    default:
      styles = 'bg-slate-100 text-slate-700 border-slate-200';
      dotColor = 'bg-slate-400';
  }

  const sizeClasses = size === 'sm'
    ? 'px-2 py-0.5 text-xs'
    : size === 'lg'
    ? 'px-3.5 py-1.5 text-sm font-semibold'
    : 'px-2.5 py-1 text-xs font-medium';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border shadow-sm ${sizeClasses} ${styles}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${dotColor}`} />
      {status}
    </span>
  );
}
