import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { INITIAL_USERS } from '../data/mockData';

const AuthContext = createContext(null);

const AUTH_STORAGE_KEY = 'pharmachain_auth_user';

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading auth from localStorage:', e);
    }
    // Default initial session: Logged in as Admin for convenience, or null
    return INITIAL_USERS[0];
  });

  const login = useCallback((email, role, customUser = null) => {
    let matchedUser = customUser;
    if (!matchedUser) {
      matchedUser = INITIAL_USERS.find(
        u => u.email.toLowerCase() === email.toLowerCase() || u.role.toLowerCase() === role?.toLowerCase()
      );
    }

    const userData = matchedUser || {
      id: `USR-${Date.now().toString().slice(-4)}`,
      name: role === 'Admin' ? 'System Administrator' : `${role} Representative`,
      email: email || `${role.toLowerCase()}@pharmachain.demo`,
      role: role || 'Manufacturer',
      company: role === 'Admin' ? 'PharmaChain Authority' : 'ABC Pharma Ltd.',
      phone: '+1 (555) 010-0000',
      status: 'Active'
    };

    setCurrentUser(userData);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userData));
    return userData;
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }, []);

  const updateProfile = useCallback((updatedFields) => {
    setCurrentUser(prev => {
      if (!prev) return null;
      const updated = { ...prev, ...updatedFields };
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const value = {
    currentUser,
    user: currentUser,
    role: currentUser?.role || 'Guest',
    isAuthenticated: Boolean(currentUser),
    isAdmin: currentUser?.role === 'Admin',
    isManufacturer: currentUser?.role === 'Manufacturer',
    isDistributor: currentUser?.role === 'Distributor',
    isPharmacy: currentUser?.role === 'Pharmacy',
    login,
    logout,
    updateProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
