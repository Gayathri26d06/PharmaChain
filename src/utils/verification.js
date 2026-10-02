/**
 * PharmaChain Verification Service (Frontend Prototype)
 *
 * Verification Pipeline:
 * Package ID -> Find Package -> Lookup Batch -> Date Validation -> Anomaly Risk Engine -> Determine Result
 */

import { calculateRiskScore } from './riskEngine';

export function verifyPackageId(packageId, allPackages = [], allBatches = [], location = 'Public Verification Terminal', method = 'Manual Entry') {
  const cleanId = (packageId || '').trim().toUpperCase();

  if (!cleanId) {
    return {
      isValid: false,
      result: 'INVALID',
      packageId: cleanId,
      message: 'Package ID was not provided.',
      timestamp: new Date().toISOString()
    };
  }

  // 1. Lookup Package in mock registry
  const pkg = allPackages.find(p => p.packageId.toUpperCase() === cleanId);

  if (!pkg) {
    return {
      isValid: false,
      result: 'INVALID',
      packageId: cleanId,
      productName: 'Unknown / Unregistered Medicine',
      batchNumber: 'N/A',
      title: '✕ VERIFICATION FAILED',
      statusMessage: 'Package ID was not found in the PharmaChain registry. This medicine may be counterfeit or unregistered.',
      riskAnalysis: calculateRiskScore(null),
      blockchainNotice: 'Blockchain verification: Not connected — Phase 2',
      timestamp: new Date().toISOString(),
      location,
      method
    };
  }

  // 2. Lookup corresponding Batch
  const batch = allBatches.find(b => b.batchNumber === pkg.batchNumber || b.id === pkg.batchId);

  // 3. Expiry Check
  const today = new Date();
  const expiryDate = pkg.expiryDate ? new Date(pkg.expiryDate) : (batch?.expiryDate ? new Date(batch.expiryDate) : null);
  const isExpired = (expiryDate && expiryDate < today) || pkg.status === 'Expired' || batch?.status === 'EXPIRED';

  // 4. Anomaly Risk Scoring
  const riskAnalysis = calculateRiskScore(pkg, {
    location,
    rapidScansDetected: pkg.scanCount > 10
  });

  // 5. Determine Outcome Category
  let result = 'GENUINE';
  let title = '✓ MEDICINE VERIFIED';
  let statusMessage = 'Genuine Package: Registered manufacturer and authentic batch verified.';

  if (pkg.status === 'Deactivated') {
    result = 'SUSPICIOUS';
    title = '⚠ PACKAGE DEACTIVATED';
    statusMessage = 'This package has been recalled or deactivated by the manufacturer / regulator.';
  } else if (pkg.status === 'Suspicious' || riskAnalysis.riskScore >= 61) {
    result = 'SUSPICIOUS';
    title = '⚠ SUSPICIOUS PACKAGE';
    statusMessage = 'Anomalous verification pattern detected. Package is flagged for inspection.';
  } else if (isExpired) {
    result = 'EXPIRED';
    title = '⚠ MEDICINE EXPIRED';
    statusMessage = 'This package has passed its registered expiration date and is unsafe for consumption.';
  }

  return {
    isValid: true,
    result,
    title,
    statusMessage,
    packageId: pkg.packageId,
    productId: pkg.productId,
    productName: pkg.productName,
    genericName: pkg.genericName,
    dosage: pkg.dosage,
    batchNumber: pkg.batchNumber,
    manufacturer: pkg.manufacturer,
    manufacturingDate: pkg.manufacturingDate,
    expiryDate: pkg.expiryDate,
    mrp: pkg.mrp,
    packageStatus: pkg.status,
    scanCount: (pkg.scanCount || 0) + 1,
    lastScannedLocation: location,
    riskAnalysis,
    blockchainNotice: 'Blockchain verification: Not connected — Phase 2',
    timestamp: new Date().toISOString(),
    location,
    method
  };
}
