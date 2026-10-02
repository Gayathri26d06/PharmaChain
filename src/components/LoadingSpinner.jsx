import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingSpinner({ label = 'Loading PharmaChain data...' }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-slate-500">
      <Loader2 className="h-8 w-8 animate-spin text-medblue-600 mb-3" />
      <p className="text-xs font-medium text-slate-600">{label}</p>
    </div>
  );
}
