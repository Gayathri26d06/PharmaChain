/**
 * PharmaChain Package Identifier Generator & Parser
 *
 * Hierarchy:
 * Product -> Batch -> Package -> QR Code
 *
 * Example:
 * Batch: PCM001
 * Sequence: 1 -> PKG-PCM001-00001
 * Sequence: 2 -> PKG-PCM001-00002
 *
 * NOTE: Package ID is a unique prototype identifier designed for this system
 * and not an official pharmaceutical NDC/GTIN.
 */

export function generatePackageId(batchNumber, sequenceIndex) {
  if (!batchNumber) {
    throw new Error('Batch number is required to generate a Package ID');
  }
  const cleanBatch = batchNumber.trim().toUpperCase().replace(/[^A-Z0-9_-]/g, '');
  const paddedSeq = String(sequenceIndex).padStart(5, '0');
  return `PKG-${cleanBatch}-${paddedSeq}`;
}

export function parsePackageId(packageId) {
  if (!packageId || typeof packageId !== 'string') return null;
  const parts = packageId.trim().toUpperCase().split('-');
  if (parts.length >= 3 && parts[0] === 'PKG') {
    return {
      prefix: parts[0],
      batchNumber: parts.slice(1, -1).join('-'),
      sequenceNumber: parseInt(parts[parts.length - 1], 10),
      rawId: packageId.trim().toUpperCase()
    };
  }
  return null;
}

export function isValidPackageIdFormat(packageId) {
  if (!packageId) return false;
  const regex = /^PKG-[A-Z0-9_-]+-\d{5}$/i;
  return regex.test(packageId.trim());
}
