import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { ToastProvider } from './components/Toast';

import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Batches from './pages/Batches';
import Packages from './pages/Packages';
import VerifyMedicine from './pages/VerifyMedicine';
import VerificationHistory from './pages/VerificationHistory';
import SupplyChain from './pages/SupplyChain';
import Profile from './pages/Profile';
import SuspiciousActivity from './pages/admin/SuspiciousActivity';
import Users from './pages/admin/Users';

// Layout with Sidebar and Navbar for authenticated views
function AppLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const getPageTitle = (pathname) => {
    if (pathname.startsWith('/dashboard')) return 'System Dashboard';
    if (pathname.startsWith('/products')) return 'Medicine Formulations';
    if (pathname.startsWith('/batches')) return 'Manufacturing Batches';
    if (pathname.startsWith('/packages')) return 'Serialized Packages & QRs';
    if (pathname.startsWith('/verify')) return 'Medicine Authentication';
    if (pathname.startsWith('/verification-history')) return 'Audit Verification Trail';
    if (pathname.startsWith('/supply-chain')) return 'Custody & Supply Chain';
    if (pathname.startsWith('/admin/suspicious')) return 'Anomaly Governance';
    if (pathname.startsWith('/admin/users')) return 'Stakeholder Management';
    if (pathname.startsWith('/profile')) return 'Participant Profile';
    return 'PharmaChain';
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar navigation */}
      <Sidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-72">
        <Navbar
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          pageTitle={getPageTitle(location.pathname)}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

// Protected Route Guard
function ProtectedRoute({ children, adminOnly = false }) {
  const { isAuthenticated, isAdmin } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

// Standalone Public Layout for Consumer Verification
function PublicVerificationLayout() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-3.5 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-medblue-600 to-teal-500 flex items-center justify-center text-white shadow-md">
            <span className="font-extrabold text-sm">PC</span>
          </div>
          <div>
            <h1 className="text-base font-extrabold text-slate-900 tracking-tight">PharmaChain</h1>
            <p className="text-[10px] font-semibold text-emerald-600 uppercase">Public Verification Portal</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/dashboard"
            className="text-xs font-semibold text-slate-600 hover:text-medblue-600 transition-colors"
          >
            Stakeholder Portal
          </a>
          <a
            href="/login"
            className="px-3 py-1.5 rounded-xl bg-medblue-600 hover:bg-medblue-700 text-white text-xs font-bold shadow-sm transition-colors"
          >
            Sign In
          </a>
        </div>
      </header>

      <main className="flex-1 p-4 sm:p-8 max-w-5xl w-full mx-auto">
        <Outlet />
      </main>

      <footer className="py-6 border-t border-slate-200 text-center text-xs text-slate-400 bg-white">
        PharmaChain Prototype • AI & Blockchain Multi-Layer Medicine Security System
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DataProvider>
          <ToastProvider>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />

              {/* Public Verification (Accessible directly without login) */}
              <Route element={<PublicVerificationLayout />}>
                <Route path="/public-verify" element={<VerifyMedicine />} />
                <Route path="/public-verify/:packageId" element={<VerifyMedicine />} />
              </Route>

              {/* Authenticated Application Shell */}
              <Route
                element={
                  <ProtectedRoute>
                    <AppLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/products" element={<Products />} />
                <Route path="/batches" element={<Batches />} />
                <Route path="/packages" element={<Packages />} />
                <Route path="/verify" element={<VerifyMedicine />} />
                <Route path="/verify/:packageId" element={<VerifyMedicine />} />
                <Route path="/verification-history" element={<VerificationHistory />} />
                <Route path="/supply-chain" element={<SupplyChain />} />
                <Route path="/profile" element={<Profile />} />

                {/* Admin Exclusive Routes */}
                <Route
                  path="/admin/suspicious"
                  element={
                    <ProtectedRoute adminOnly>
                      <SuspiciousActivity />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/users"
                  element={
                    <ProtectedRoute adminOnly>
                      <Users />
                    </ProtectedRoute>
                  }
                />
              </Route>

              {/* Catch-all redirect */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </ToastProvider>
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
