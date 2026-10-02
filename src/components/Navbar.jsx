import React, { useState } from 'react';
import {
  Menu,
  Bell,
  Search,
  RotateCcw,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useToast } from './Toast';
import { useNavigate, Link } from 'react-router-dom';

export default function Navbar({ onOpenMobileMenu, pageTitle = 'Dashboard' }) {
  const { currentUser, role } = useAuth();
  const { resetAllData } = useData();
  const toast = useToast();
  const navigate = useNavigate();

  const [showNotifications, setShowNotifications] = useState(false);
  const [searchNavInput, setSearchNavInput] = useState('');

  const handleResetData = () => {
    if (window.confirm('Reset all demo data back to clean factory state? Any custom products, batches, or packages created will be re-initialized.')) {
      resetAllData();
      toast.success('Demo data restored to initial state.');            
    }
  };
  const handleQuickVerify = (e) => {
    e.preventDefault();
    if (searchNavInput.trim()) {
      navigate(`/verify?pkg=${encodeURIComponent(searchNavInput.trim())}`);
      setSearchNavInput('');
    }
  };
  const notifications = [
    {
      id: 1,
      title: 'Suspicious scan detected',
      desc: 'Package PKG-PCM001-00003 had 14 verification requests in 1 hour.',
      time: '12m ago',
      type: 'warning'
    },
    {
      id: 2,
      title: 'Batch Serialized',
      desc: 'Batch PCM001 successfully generated 10 cryptographic package IDs.',
      time: '1h ago',
      type: 'success'
    }
  ];
  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-3.5 flex items-center justify-between">
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-3 sm:gap-4">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            {pageTitle}
          </h2>
          <p className="hidden sm:block text-[11px] text-slate-400 font-medium">
            PharmaChain • Multi-Layer Medicine Security
          </p>
        </div>
      </div>

      {/* Middle: Quick Verify Search */}
      <form onSubmit={handleQuickVerify} className="hidden md:flex items-center relative max-w-xs w-full mx-4">
        <Search className="absolute left-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
        <input
          type="text"
          value={searchNavInput}
          onChange={(e) => setSearchNavInput(e.target.value)}
          placeholder="Quick verify package ID..."
          className="w-full pl-9 pr-4 py-1.5 bg-slate-100/80 hover:bg-slate-100 border border-slate-200/60 rounded-xl text-xs placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-medblue-500 focus:bg-white transition-all"
        />
      </form>

      {/* Right: Actions, Notifications, User Avatar */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Reset Demo Data Button */}
        <button
          onClick={handleResetData}
          title="Reset all demo data to defaults"
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold shadow-2xs transition-colors"
        >
          <RotateCcw className="h-3.5 w-3.5 text-slate-500" />
          <span className="hidden sm:inline">Reset Demo Data</span>
        </button>

        {/* Public Verify Medicine Shortcut */}
        <Link
          to="/verify"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-medblue-50 hover:bg-medblue-100 text-medblue-700 border border-medblue-200/80 text-xs font-bold transition-colors"
        >
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>Verify Medicine</span>
        </Link>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors relative"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
          </button>

          {showNotifications && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowNotifications(false)}
              />
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">System Alerts</h4>
                  <span className="text-[10px] font-semibold bg-medblue-50 text-medblue-700 px-2 py-0.5 rounded-full">
                    2 New
                  </span>
                </div>
                <div className="space-y-2.5">
                  {notifications.map((n) => (
                    <div key={n.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs flex items-start gap-2.5">
                      {n.type === 'warning' ? (
                        <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                      ) : (
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <p className="font-bold text-slate-800">{n.title}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">{n.desc}</p>
                        <span className="text-[10px] text-slate-400 mt-1 block">{n.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* User Profile Avatar Link */}
        <Link
          to="/profile"
          className="flex items-center gap-2 pl-2 border-l border-slate-200 hover:opacity-80 transition-opacity"
        >
          <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-medblue-600 to-teal-500 text-white font-bold flex items-center justify-center text-xs shadow-sm">
            {currentUser?.name ? currentUser.name.slice(0, 2).toUpperCase() : 'PC'}
          </div>
          <div className="hidden xl:block text-left text-xs">
            <p className="font-bold text-slate-800 leading-none truncate max-w-[120px]">
              {currentUser?.name || 'Guest'}
            </p>
            <p className="text-[10px] text-slate-400 mt-0.5">{role}</p>
          </div>
        </Link>
      </div>
    </header>
  );
}