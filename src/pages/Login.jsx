import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  Sparkles,
  Building2,
  Truck,
  Store,
  UserCheck,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import Button from '../components/Button';
import Input from '../components/Input';

export default function Login() {
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState('admin@pharmachain.demo');
  const [password, setPassword] = useState('password123');
  const [role, setRole] = useState('Admin');
  const [isLoading, setIsLoading] = useState(false);

  const demoAccounts = [
    {
      role: 'Admin',
      email: 'admin@pharmachain.demo',
      label: 'Admin Portal',
      desc: 'System monitoring & anomaly governance',
      icon: ShieldCheck
    },
    {
      role: 'Manufacturer',
      email: 'manufacturer@pharmachain.demo',
      label: 'ABC Pharma',
      desc: 'Serialize batches & generate package QRs',
      icon: Building2
    },
    {
      role: 'Distributor',
      email: 'distributor@pharmachain.demo',
      label: 'Apex Logistics',
      desc: 'Shipment tracking & intake verification',
      icon: Truck
    },
    {
      role: 'Pharmacy',
      email: 'pharmacy@pharmachain.demo',
      label: 'CareMed Chemist',
      desc: 'Point-of-dispense retail verification',
      icon: Store
    }
  ];

  const handleSelectDemoAccount = (acc) => {
    setEmail(acc.email);
    setRole(acc.role);
    setPassword('password123');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter an email address');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      login(email, role);
      setIsLoading(false);
      toast.success(`Logged in successfully as ${role}`);
      navigate('/dashboard');
    }, 400);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-medblue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center">
        {/* PharmaChain Logo */}
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-3xl bg-gradient-to-tr from-medblue-600 to-teal-500 text-white shadow-xl shadow-medblue-500/25 mb-4">
          <ShieldCheck className="h-9 w-9" />
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          PharmaChain
        </h1>
        <p className="mt-1 text-sm font-semibold text-emerald-400 uppercase tracking-wider">
          Verify • Track • Trust
        </p>
        <p className="mt-2 text-xs text-slate-400 max-w-sm mx-auto">
          AI + Blockchain Multi-Layer Medicine Authentication & Traceability Platform
        </p>
      </div>

      {/* Main Login Card */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl relative z-10">
        <div className="bg-slate-800/90 backdrop-blur-xl border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-100">
          {/* Quick Demo Credential Pickers */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-medblue-400" />
                Select Demo Role
              </span>
              <span className="text-[11px] text-slate-400">Password: <code className="text-emerald-400 bg-slate-900/60 px-1.5 py-0.5 rounded">password123</code></span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {demoAccounts.map((acc) => {
                const isSelected = role === acc.role;
                const Icon = acc.icon;
                return (
                  <button
                    key={acc.role}
                    type="button"
                    onClick={() => handleSelectDemoAccount(acc)}
                    className={`p-2.5 rounded-2xl border text-left flex flex-col justify-between transition-all duration-150 ${
                      isSelected
                        ? 'bg-medblue-600/20 border-medblue-500 text-white ring-1 ring-medblue-500/50'
                        : 'bg-slate-900/50 border-slate-700/60 text-slate-400 hover:bg-slate-700/40 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <Icon className={`h-4 w-4 ${isSelected ? 'text-medblue-400' : 'text-slate-400'}`} />
                      {isSelected && <CheckCircle2 className="h-3 w-3 text-medblue-400" />}
                    </div>
                    <span className="text-xs font-bold truncate">{acc.role}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="name@pharmachain.demo"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-medblue-500 focus:border-medblue-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-medblue-500 focus:border-medblue-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Active Organization Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-medblue-500 transition-colors"
              >
                <option value="Admin">Admin (Regulatory Authority)</option>
                <option value="Manufacturer">Manufacturer (ABC Pharma)</option>
                <option value="Distributor">Distributor (Apex Logistics)</option>
                <option value="Pharmacy">Pharmacy (CareMed Chemist)</option>
              </select>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={isLoading}
              className="w-full mt-2"
              icon={ArrowRight}
            >
              Sign In to {role} Portal
            </Button>
          </form>

          {/* Public Customer Verification Link */}
          <div className="mt-6 pt-5 border-t border-slate-700/80 text-center">
            <p className="text-xs text-slate-400 mb-2">
              Are you a consumer or patient checking a medicine package?
            </p>
            <Link
              to="/verify"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 hover:underline"
            >
              <UserCheck className="h-4 w-4" />
              <span>Open Public Medicine Verification (No Login Required)</span>
            </Link>
          </div>
        </div>

        {/* Prototype Academic Footer */}
        <p className="mt-4 text-center text-[11px] text-slate-500">
          Academic Frontend Prototype • Blockchain (Phase 2) & AI (Phase 2)
        </p>
      </div>
    </div>
  );
}
