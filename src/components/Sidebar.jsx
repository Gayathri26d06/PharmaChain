import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ShieldCheck,
  Package,
  Layers,
  Boxes,
  Truck,
  History,
  AlertTriangle,
  Users,
  User,
  LogOut,
  X,
  Sparkles,
  QrCode,
  Pill
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ isOpen, onClose }) {
  const { currentUser, role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Define role-specific navigation menus
  const getNavItems = () => {
    const common = [
      { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
      { name: 'Verify Medicine', path: '/verify', icon: ShieldCheck, highlight: true }
    ];

    if (role === 'Manufacturer') {
      return [
        ...common,
        { name: 'Products', path: '/products', icon: Pill },
        { name: 'Batches', path: '/batches', icon: Layers },
        { name: 'Packages', path: '/packages', icon: Boxes },
        { name: 'Supply Chain', path: '/supply-chain', icon: Truck },
        { name: 'Verification History', path: '/verification-history', icon: History },
        { name: 'Profile', path: '/profile', icon: User }
      ];
    }

    if (role === 'Distributor') {
      return [
        ...common,
        { name: 'Batches & Packages', path: '/packages', icon: Boxes },
        { name: 'Supply Chain Tracker', path: '/supply-chain', icon: Truck },
        { name: 'Verification History', path: '/verification-history', icon: History },
        { name: 'Profile', path: '/profile', icon: User }
      ];
    }

    if (role === 'Pharmacy') {
      return [
        ...common,
        { name: 'Medicines Inventory', path: '/products', icon: Pill },
        { name: 'Package Catalog', path: '/packages', icon: Boxes },
        { name: 'Supply Chain', path: '/supply-chain', icon: Truck },
        { name: 'Verification History', path: '/verification-history', icon: History },
        { name: 'Profile', path: '/profile', icon: User }
      ];
    }

    // Default / Admin view
    return [
      { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
      { name: 'Verify Medicine', path: '/verify', icon: ShieldCheck, highlight: true },
      { name: 'Products', path: '/products', icon: Pill },
      { name: 'Batches', path: '/batches', icon: Layers },
      { name: 'Packages & QR', path: '/packages', icon: Boxes },
      { name: 'Supply Chain', path: '/supply-chain', icon: Truck },
      { name: 'Verification History', path: '/verification-history', icon: History },
      { name: 'Suspicious Activity', path: '/admin/suspicious', icon: AlertTriangle, alert: true },
      { name: 'User Management', path: '/admin/users', icon: Users },
      { name: 'Profile', path: '/profile', icon: User }
    ];
  };

  const navItems = getNavItems();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-white border-r border-slate-200/80 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-medblue-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-medblue-500/20">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-lg font-extrabold text-slate-900 tracking-tight flex items-center gap-1.5">
                PharmaChain
              </h1>
              <p className="text-[11px] font-semibold text-emerald-600 uppercase tracking-wider">
                Verify • Track • Trust
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* User Role Badge Card */}
        {currentUser && (
          <div className="mx-4 my-4 p-3.5 bg-slate-50 border border-slate-200/60 rounded-2xl flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-medblue-100 text-medblue-700 font-bold flex items-center justify-center text-sm shrink-0">
              {currentUser.name ? currentUser.name.slice(0, 2).toUpperCase() : 'PC'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-900 truncate">{currentUser.name}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span className="text-[11px] font-medium text-slate-500 truncate">{currentUser.role}</span>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                    isActive
                      ? item.highlight
                        ? 'bg-gradient-to-r from-medblue-600 to-teal-600 text-white shadow-sm'
                        : 'bg-medblue-50 text-medblue-700 font-bold'
                      : item.highlight
                      ? 'bg-medblue-50/70 text-medblue-700 hover:bg-medblue-100/70'
                      : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{item.name}</span>
                </div>
                {item.alert && (
                  <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-md bg-rose-100 text-rose-700">
                    Flagged
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer with Logout */}
        <div className="p-4 border-t border-slate-100 space-y-2">

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
