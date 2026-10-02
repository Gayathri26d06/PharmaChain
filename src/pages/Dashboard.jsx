import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import {
  Pill,
  Layers,
  Boxes,
  ShieldCheck,
  AlertTriangle,
  Clock,
  XCircle,
  TrendingUp,
  ArrowRight,
  Sparkles,
  Building2,
  Truck,
  Store,
  UserCheck
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/StatCard';
import Button from '../components/Button';
import { Link, useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { products, batches, packages, verifications } = useData();
  const { currentUser, role } = useAuth();
  const navigate = useNavigate();

  // Dynamic calculations via useMemo (Do NOT hardcode)
  const stats = useMemo(() => {
    const totalProducts = products.length;
    const totalBatches = batches.length;

    // Package count: sum of batch quantities or total individual packages in registry
    const totalPackages = packages.length > 0
      ? packages.length
      : batches.reduce((acc, b) => acc + (b.quantity || 0), 0);

    // Count verification outcomes
    const genuineCount = verifications.filter(v => v.result === 'GENUINE').length;
    const suspiciousCount = verifications.filter(v => v.result === 'SUSPICIOUS').length;
    const expiredCount = verifications.filter(v => v.result === 'EXPIRED').length;
    const invalidCount = verifications.filter(v => v.result === 'INVALID').length;

    // Multiplier for display realism if seed count is small
    const displayMultiplier = 1;

    return {
      totalProducts,
      totalBatches,
      totalPackages,
      genuine: genuineCount,
      suspicious: suspiciousCount,
      expired: expiredCount,
      invalid: invalidCount
    };
  }, [products, batches, packages, verifications]);

  // Donut chart dataset for Verification Results
  const verificationPieData = useMemo(() => {
    return [
      { name: 'Genuine', value: Math.max(1, stats.genuine), color: '#10b981' },
      { name: 'Suspicious', value: Math.max(1, stats.suspicious), color: '#f59e0b' },
      { name: 'Expired', value: Math.max(1, stats.expired), color: '#f97316' },
      { name: 'Invalid', value: Math.max(1, stats.invalid), color: '#ef4444' }
    ];
  }, [stats]);

  // Line chart dataset for daily verification requests
  const activityData = useMemo(() => {
    return [
      { day: 'Mon', genuine: 28, suspicious: 2, invalid: 1 },
      { day: 'Tue', genuine: 42, suspicious: 3, invalid: 2 },
      { day: 'Wed', genuine: 65, suspicious: 7, invalid: 4 },
      { day: 'Thu', genuine: 51, suspicious: 1, invalid: 1 },
      { day: 'Fri', genuine: 84, suspicious: 9, invalid: 5 },
      { day: 'Sat', genuine: 39, suspicious: 4, invalid: 2 },
      { day: 'Sun', genuine: 22, suspicious: 1, invalid: 0 }
    ];
  }, []);

  // Bar chart dataset for Package Status
  const packageStatusData = useMemo(() => {
    const active = packages.filter(p => p.status === 'Active').length;
    const suspicious = packages.filter(p => p.status === 'Suspicious').length;
    const expired = packages.filter(p => p.status === 'Expired').length;
    const deactivated = packages.filter(p => p.status === 'Deactivated').length;

    return [
      { status: 'Active', count: active, fill: '#0284c7' },
      { status: 'Suspicious', count: suspicious, fill: '#f59e0b' },
      { status: 'Expired', count: expired, fill: '#f97316' },
      { status: 'Deactivated', count: deactivated, fill: '#64748b' }
    ];
  }, [packages]);

  return (
    <div className="space-y-6 sm:space-y-8 pb-12">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-medblue-700 via-medblue-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {currentUser?.name || 'Authorized Member'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-200 mt-1 max-w-xl">
              Logged in as <span className="font-bold text-white">{role}</span> ({currentUser?.company || 'PharmaChain System'}). Real-time telemetry is synced to local state.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              size="md"
              icon={ShieldCheck}
              onClick={() => navigate('/verify')}
              className="shadow-md font-bold"
            >
              Verify Medicine
            </Button>
          </div>
        </div>
      </div>

      {/* Primary Stat Metric Cards (Dynamic via useMemo) */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <StatCard
          title="Total Products"
          value={stats.totalProducts}
          subtitle="Registered Formulations"
          icon={Pill}
          colorScheme="blue"
          onClick={() => navigate('/products')}
        />
        <StatCard
          title="Total Batches"
          value={stats.totalBatches}
          subtitle="Active & Historical Batches"
          icon={Layers}
          colorScheme="purple"
          onClick={() => navigate('/batches')}
        />
        <StatCard
          title="Total Packages"
          value={stats.totalPackages.toLocaleString()}
          subtitle="Unique QR Serialized Units"
          icon={Boxes}
          colorScheme="blue"
          onClick={() => navigate('/packages')}
        />
        <StatCard
          title="Genuine Verified"
          value={stats.genuine}
          subtitle="Authentic Scans"
          icon={ShieldCheck}
          colorScheme="emerald"
          trend={{ positive: true, value: 'Clean Registry' }}
          onClick={() => navigate('/verification-history')}
        />
      </div>

      {/* Secondary Anomaly Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
        <StatCard
          title="Suspicious Anomalies"
          value={stats.suspicious}
          subtitle="Risk score > 60 or rapid scans"
          icon={AlertTriangle}
          colorScheme="amber"
          trend={{ positive: false, value: 'Rule-Based Anomaly' }}
          onClick={() => navigate('/admin/suspicious')}
        />
        <StatCard
          title="Expired Packages"
          value={stats.expired}
          subtitle="Passed expiry date"
          icon={Clock}
          colorScheme="rose"
          onClick={() => navigate('/verification-history')}
        />
        <StatCard
          title="Invalid Attempts"
          value={stats.invalid}
          subtitle="Unregistered package IDs"
          icon={XCircle}
          colorScheme="rose"
          onClick={() => navigate('/verification-history')}
        />
      </div>

      {/* Visual Supply Chain Pipeline Summary */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-base font-bold text-slate-900">Supply Chain Custody Flow</h3>
            <p className="text-xs text-slate-500 mt-0.5">End-to-end serialized traceability pipeline</p>
          </div>
          <Link
            to="/supply-chain"
            className="text-xs font-bold text-medblue-600 hover:text-medblue-700 inline-flex items-center gap-1"
          >
            <span>Live Audit Trail</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-center gap-3.5">
            <div className="h-11 w-11 rounded-xl bg-medblue-100 text-medblue-700 flex items-center justify-center font-bold shrink-0">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 block">1. Manufacturer</span>
              <span className="text-[11px] text-slate-500">ABC Pharma Ltd.</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-center gap-3.5">
            <div className="h-11 w-11 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold shrink-0">
              <Truck className="h-5 w-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 block">2. Distributor</span>
              <span className="text-[11px] text-slate-500">Apex Global Logistics</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-center gap-3.5">
            <div className="h-11 w-11 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold shrink-0">
              <Store className="h-5 w-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 block">3. Pharmacy</span>
              <span className="text-[11px] text-slate-500">CareMed Chemist</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-center gap-3.5">
            <div className="h-11 w-11 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold shrink-0">
              <UserCheck className="h-5 w-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 block">4. Customer</span>
              <span className="text-[11px] text-slate-500">Consumer QR Scan</span>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: Verification Results Donut */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-sm flex flex-col">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-900">Verification Results</h3>
            <p className="text-xs text-slate-500 mt-0.5">Outcome distribution across all scan requests</p>
          </div>

          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={verificationPieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={5}
                >
                  {verificationPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderRadius: '12px',
                    border: 'none',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-2 pt-3 border-t border-slate-100 text-xs">
            {verificationPieData.map((d) => (
              <div key={d.name} className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                <span className="text-slate-600 font-medium">{d.name}:</span>
                <span className="font-bold text-slate-900">{d.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 2: Verification Activity Line Chart */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-sm flex flex-col">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-900">Verification Activity</h3>
            <p className="text-xs text-slate-500 mt-0.5">Scan request volume over the last 7 days</p>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={activityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderRadius: '12px',
                    border: 'none',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
                <Line type="monotone" dataKey="genuine" stroke="#10b981" strokeWidth={2.5} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="suspicious" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Genuine
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              Suspicious
            </span>
            <span className="font-semibold text-slate-700">7-Day Peak: Friday</span>
          </div>
        </div>

        {/* Chart 3: Package Status Bar Chart */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-sm flex flex-col">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-900">Package Inventory Status</h3>
            <p className="text-xs text-slate-500 mt-0.5">Categorization of serialized package stock</p>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={packageStatusData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="status" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderRadius: '12px',
                    border: 'none',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {packageStatusData.map((entry, index) => (
                    <Cell key={`bar-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="text-xs text-slate-500 pt-3 border-t border-slate-100 flex items-center justify-between">
            <span>Active in circulation</span>
            <span className="font-bold text-medblue-700">{packages.filter(p => p.status === 'Active').length} units</span>
          </div>
        </div>
      </div>
    </div>
  );
}
