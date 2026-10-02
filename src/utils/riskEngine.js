/**
 * PharmaChain Anomaly / Risk Engine (Prototype)
 *
 * NOTE: This is a Rule-Based Anomaly Detection Prototype.
 * In Phase 2, this heuristic engine will be superseded by a machine-learning model
 * trained on geographical hops, scan frequency variance, and supply chain telemetry.
 */

export function calculateRiskScore(pkg, verificationContext = {}) {
  if (!pkg) {
    return {
      riskScore: 100,
      riskLevel: 'VERY HIGH',
      reasons: ['Package ID does not exist in PharmaChain registry (Counterfeit suspicion)'],
      engineType: 'Rule-Based Anomaly Detection Prototype (Phase 1)'
    };
  }

  let score = 0;
  const reasons = [];

  const scanCount = (pkg.scanCount || 0) + 1; // including current verification
  const isFlagged = Boolean(pkg.isFlagged || pkg.status === 'Suspicious');
  const hasHighFrequency = scanCount > 5;
  const hasExtremeFrequency = scanCount > 10;
  const hasUnusualLocation = Boolean(
    pkg.lastScannedLocation &&
    (pkg.lastScannedLocation.includes('Conflicting') ||
     pkg.lastScannedLocation.includes('London') && verificationContext.location?.includes('USA'))
  );

  // Factor 1: Rapid repeated scans
  if (hasExtremeFrequency || (verificationContext.rapidScansDetected)) {
    score += 30;
    reasons.push('Multiple rapid repeated scans detected across short time intervals');
  }

  // Factor 2: High scan frequency threshold
  if (hasHighFrequency) {
    score += 20;
    reasons.push(`High scan frequency count (${scanCount} historical verification requests)`);
  }

  // Factor 3: Unusual geographical / location hop pattern
  if (hasUnusualLocation || pkg.status === 'Suspicious') {
    score += 30;
    reasons.push('Unusual verification pattern: Impossible travel distance between consecutive scans');
  }

  // Factor 4: Package already flagged in registry
  if (isFlagged) {
    score += 20;
    reasons.push(pkg.flagReason || 'Package previously marked as suspicious by an authorized inspector');
  }

  // Cap score at 100
  score = Math.min(100, Math.max(0, score));

  // If score is 0 and no anomalies, set baseline safe score
  if (score === 0) {
    score = 5; // Clean baseline
  }

  let riskLevel = 'LOW';
  if (score >= 81) {
    riskLevel = 'VERY HIGH';
  } else if (score >= 61) {
    riskLevel = 'HIGH';
  } else if (score >= 31) {
    riskLevel = 'MEDIUM';
  } else {
    riskLevel = 'LOW';
  }

  return {
    riskScore: score,
    riskLevel,
    reasons: reasons.length > 0 ? reasons : ['No anomalous scan behavior detected. Normal verification pattern.'],
    engineType: 'Rule-Based Anomaly Detection Prototype (Phase 1)',
    modelNotice: 'Current risk scoring uses explainable heuristic rules. A machine-learning model will be integrated in Phase 2.'
  };
}
