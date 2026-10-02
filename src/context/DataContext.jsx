import React, { createContext, useContext, useCallback } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import {
  INITIAL_USERS,
  INITIAL_PRODUCTS,
  INITIAL_BATCHES,
  INITIAL_PACKAGES,
  INITIAL_VERIFICATIONS,
  INITIAL_SUPPLY_CHAIN_EVENTS
} from '../data/mockData';
import { generatePackageId } from '../utils/packageId';

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [users, setUsers] = useLocalStorage('pharmachain_users_v1', INITIAL_USERS);
  const [products, setProducts] = useLocalStorage('pharmachain_products_v1', INITIAL_PRODUCTS);
  const [batches, setBatches] = useLocalStorage('pharmachain_batches_v1', INITIAL_BATCHES);
  const [packages, setPackages] = useLocalStorage('pharmachain_packages_v1', INITIAL_PACKAGES);
  const [verifications, setVerifications] = useLocalStorage('pharmachain_verifications_v1', INITIAL_VERIFICATIONS);
  const [supplyChainEvents, setSupplyChainEvents] = useLocalStorage('pharmachain_supply_chain_v1', INITIAL_SUPPLY_CHAIN_EVENTS);

  // Add Product
  const addProduct = useCallback((productData) => {
    const newProduct = {
      id: `PROD-${String(products.length + 1).padStart(3, '0')}`,
      name: productData.name.trim(),
      genericName: productData.genericName.trim(),
      dosage: productData.dosage.trim(),
      manufacturer: productData.manufacturer || 'ABC Pharma Ltd.',
      description: productData.description || 'Pharmaceutical formulation.',
      category: productData.category || 'General Therapeutics',
      batchCount: 0,
      status: 'Active',
      createdDate: new Date().toISOString().split('T')[0],
      ...productData
    };
    setProducts(prev => [newProduct, ...prev]);
    return newProduct;
  }, [products.length, setProducts]);

  // Add Batch
  const addBatch = useCallback((batchData) => {
    const today = new Date();
    const expiry = new Date(batchData.expiryDate);
    const autoStatus = expiry > today ? 'ACTIVE' : 'EXPIRED';

    const newBatch = {
      id: `BAT-${batchData.batchNumber.replace(/[^A-Z0-9]/gi, '')}-${Date.now().toString().slice(-3)}`,
      batchNumber: batchData.batchNumber.trim().toUpperCase(),
      productId: batchData.productId,
      productName: batchData.productName,
      manufacturingDate: batchData.manufacturingDate,
      expiryDate: batchData.expiryDate,
      mrp: Number(batchData.mrp) || 0,
      quantity: Number(batchData.quantity) || 100,
      packageCount: 0,
      manufacturer: batchData.manufacturer || 'ABC Pharma Ltd.',
      status: autoStatus,
      createdAt: new Date().toISOString()
    };

    setBatches(prev => [newBatch, ...prev]);

    // Increment batchCount in products
    setProducts(prev => prev.map(p => {
      if (p.id === batchData.productId || p.name === batchData.productName) {
        return { ...p, batchCount: (p.batchCount || 0) + 1 };
      }
      return p;
    }));

    return newBatch;
  }, [setBatches, setProducts]);

  // Generate Packages for Batch
  const generatePackagesForBatch = useCallback((batchNumber, count = 10) => {
    const batch = batches.find(b => b.batchNumber === batchNumber);
    if (!batch) throw new Error(`Batch ${batchNumber} not found.`);

    const existingForBatch = packages.filter(p => p.batchNumber === batchNumber);
    const startIndex = existingForBatch.length + 1;

    const newPackages = [];
    for (let i = 0; i < count; i++) {
      const seqIndex = startIndex + i;
      const pkgId = generatePackageId(batchNumber, seqIndex);
      newPackages.push({
        packageId: pkgId,
        productId: batch.productId,
        productName: batch.productName,
        genericName: batch.productName.split(' ')[0] || 'Pharmaceutical',
        dosage: batch.productName.match(/\d+\s*(mg|g|ml)/i)?.[0] || 'Standard',
        batchNumber: batch.batchNumber,
        batchId: batch.id,
        manufacturer: batch.manufacturer,
        manufacturingDate: batch.manufacturingDate,
        expiryDate: batch.expiryDate,
        mrp: batch.mrp,
        status: batch.status === 'EXPIRED' ? 'Expired' : 'Active',
        scanCount: 0,
        lastScannedLocation: null,
        lastScannedDate: null,
        createdDate: new Date().toISOString().split('T')[0],
        flagReason: null,
        isFlagged: false
      });
    }

    setPackages(prev => [...newPackages, ...prev]);

    // Update batch package count
    setBatches(prev => prev.map(b => {
      if (b.batchNumber === batchNumber) {
        return { ...b, packageCount: (b.packageCount || 0) + count };
      }
      return b;
    }));

    // Auto-create initial supply chain event for generated packages
    setSupplyChainEvents(prev => {
      const updated = { ...prev };
      newPackages.forEach(p => {
        if (!updated[p.packageId]) {
          updated[p.packageId] = [
            {
              step: 1,
              title: 'Batch Serialized & Packages Created',
              organization: p.manufacturer,
              actorRole: 'Manufacturer',
              location: 'Production Facility',
              date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
              status: 'Completed',
              txHash: `0x${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 6)} (Prototype Hash)`,
              notes: `Package ${p.packageId} generated with high-density anti-counterfeit QR.`
            }
          ];
        }
      });
      return updated;
    });

    return newPackages;
  }, [batches, packages, setPackages, setBatches, setSupplyChainEvents]);

  // Update Package Status (Flag / Deactivate / Review)
  const updatePackageStatus = useCallback((packageId, newStatus, reason = null) => {
    setPackages(prev => prev.map(p => {
      if (p.packageId.toUpperCase() === packageId.toUpperCase()) {
        return {
          ...p,
          status: newStatus,
          isFlagged: newStatus === 'Suspicious' || newStatus === 'Deactivated',
          flagReason: reason || p.flagReason
        };
      }
      return p;
    }));
  }, [setPackages]);

  // Record Verification Result & update scan telemetry
  const recordVerification = useCallback((verificationData) => {
    const newRecord = {
      id: `VER-${Date.now().toString().slice(-4)}`,
      packageId: verificationData.packageId,
      productName: verificationData.productName || 'Unknown Product',
      batchNumber: verificationData.batchNumber || 'N/A',
      result: verificationData.result,
      riskScore: verificationData.riskAnalysis?.riskScore || 0,
      riskLevel: verificationData.riskAnalysis?.riskLevel || 'LOW',
      location: verificationData.location || 'Online Verification Portal',
      method: verificationData.method || 'Manual Entry',
      timestamp: new Date().toISOString(),
      details: verificationData.statusMessage || 'Verification request processed.'
    };

    setVerifications(prev => [newRecord, ...prev]);

    // Increment package scan telemetry
    if (verificationData.isValid && verificationData.packageId) {
      setPackages(prev => prev.map(p => {
        if (p.packageId.toUpperCase() === verificationData.packageId.toUpperCase()) {
          const nextCount = (p.scanCount || 0) + 1;
          const isSuspicious = nextCount > 10 || p.status === 'Suspicious';
          return {
            ...p,
            scanCount: nextCount,
            lastScannedLocation: verificationData.location,
            lastScannedDate: new Date().toISOString(),
            status: isSuspicious ? 'Suspicious' : p.status
          };
        }
        return p;
      }));
    }

    return newRecord;
  }, [setVerifications, setPackages]);

  // User status updates
  const updateUserStatus = useCallback((userId, newStatus) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: newStatus } : u));
  }, [setUsers]);

  // Reset all to clean demo state
  const resetAllData = useCallback(() => {
    setUsers(INITIAL_USERS);
    setProducts(INITIAL_PRODUCTS);
    setBatches(INITIAL_BATCHES);
    setPackages(INITIAL_PACKAGES);
    setVerifications(INITIAL_VERIFICATIONS);
    setSupplyChainEvents(INITIAL_SUPPLY_CHAIN_EVENTS);
  }, [setUsers, setProducts, setBatches, setPackages, setVerifications, setSupplyChainEvents]);

  const value = {
    users,
    products,
    batches,
    packages,
    verifications,
    supplyChainEvents,
    addProduct,
    addBatch,
    generatePackagesForBatch,
    updatePackageStatus,
    recordVerification,
    updateUserStatus,
    resetAllData
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
