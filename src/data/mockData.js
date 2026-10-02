/**
 * PharmaChain Demo Mock Data Store
 * All records are strictly for academic demonstration and prototyping.
 */

export const INITIAL_USERS = [
  {
    id: 'USR-001',
    name: 'Dr. Alexander Wright',
    email: 'admin@pharmachain.demo',
    role: 'Admin',
    company: 'PharmaChain Regulatory Board',
    status: 'Active',
    phone: '+1 (555) 019-2834',
    joinedDate: '2025-11-10'
  },
  {
    id: 'USR-002',
    name: 'Sarah Jenkins',
    email: 'manufacturer@pharmachain.demo',
    role: 'Manufacturer',
    company: 'ABC Pharma Ltd.',
    status: 'Active',
    phone: '+1 (555) 014-9921',
    joinedDate: '2025-12-01'
  },
  {
    id: 'USR-003',
    name: 'Marcus Vance',
    email: 'distributor@pharmachain.demo',
    role: 'Distributor',
    company: 'Apex Global Logistics',
    status: 'Active',
    phone: '+1 (555) 018-7712',
    joinedDate: '2026-01-05'
  },
  {
    id: 'USR-004',
    name: 'Emily Chen, RPh',
    email: 'pharmacy@pharmachain.demo',
    role: 'Pharmacy',
    company: 'CareMed Community Chemist',
    status: 'Active',
    phone: '+1 (555) 012-4433',
    joinedDate: '2026-01-18'
  },
  {
    id: 'USR-005',
    name: 'Robert Thorne',
    email: 'robert.thorne@synthmed.demo',
    role: 'Manufacturer',
    company: 'SynthMed Global',
    status: 'Pending',
    phone: '+1 (555) 020-8811',
    joinedDate: '2026-02-20'
  }
];

export const INITIAL_PRODUCTS = [
  {
    id: 'PROD-001',
    name: 'Paracetamol 500 mg',
    genericName: 'Paracetamol',
    dosage: '500 mg',
    manufacturer: 'ABC Pharma Ltd.',
    description: 'Analgesic and antipyretic tablets for pain relief and fever management.',
    category: 'Analgesics',
    batchCount: 3,
    status: 'Active',
    createdDate: '2026-01-02'
  },
  {
    id: 'PROD-002',
    name: 'Amoxicillin 250 mg',
    genericName: 'Amoxicillin Trihydrate',
    dosage: '250 mg',
    manufacturer: 'ABC Pharma Ltd.',
    description: 'Broad-spectrum beta-lactam antibiotic used to treat bacterial infections.',
    category: 'Antibiotics',
    batchCount: 1,
    status: 'Active',
    createdDate: '2026-01-08'
  },
  {
    id: 'PROD-003',
    name: 'Cetirizine 10 mg',
    genericName: 'Cetirizine Hydrochloride',
    dosage: '10 mg',
    manufacturer: 'ABC Pharma Ltd.',
    description: 'Second-generation antihistamine for seasonal allergy symptoms and urticaria.',
    category: 'Antihistamines',
    batchCount: 1,
    status: 'Active',
    createdDate: '2026-01-15'
  },
  {
    id: 'PROD-004',
    name: 'Ibuprofen 400 mg',
    genericName: 'Ibuprofen',
    dosage: '400 mg',
    manufacturer: 'ABC Pharma Ltd.',
    description: 'Non-steroidal anti-inflammatory drug (NSAID) for inflammation and dental pain.',
    category: 'NSAIDs',
    batchCount: 1,
    status: 'Active',
    createdDate: '2026-01-20'
  },
  {
    id: 'PROD-005',
    name: 'Vitamin C 500 mg',
    genericName: 'Ascorbic Acid',
    dosage: '500 mg',
    manufacturer: 'ABC Pharma Ltd.',
    description: 'Essential dietary supplement and antioxidant support for immune defense.',
    category: 'Supplements',
    batchCount: 1,
    status: 'Active',
    createdDate: '2026-02-01'
  }
];

export const INITIAL_BATCHES = [
  {
    id: 'BAT-PCM-001',
    batchNumber: 'PCM001',
    productId: 'PROD-001',
    productName: 'Paracetamol 500 mg',
    manufacturingDate: '2026-01-10',
    expiryDate: '2028-01-09',
    mrp: 45.00,
    quantity: 1000,
    packageCount: 10,
    manufacturer: 'ABC Pharma Ltd.',
    status: 'ACTIVE',
    createdAt: '2026-01-10T09:00:00Z'
  },
  {
    id: 'BAT-PCM-002',
    batchNumber: 'PCM002',
    productId: 'PROD-001',
    productName: 'Paracetamol 500 mg',
    manufacturingDate: '2023-01-10',
    expiryDate: '2024-06-15',
    mrp: 42.00,
    quantity: 500,
    packageCount: 5,
    manufacturer: 'ABC Pharma Ltd.',
    status: 'EXPIRED',
    createdAt: '2023-01-10T11:30:00Z'
  },
  {
    id: 'BAT-PCM-003',
    batchNumber: 'PCM003',
    productId: 'PROD-001',
    productName: 'Paracetamol 500 mg',
    manufacturingDate: '2026-02-01',
    expiryDate: '2028-02-01',
    mrp: 45.00,
    quantity: 800,
    packageCount: 5,
    manufacturer: 'ABC Pharma Ltd.',
    status: 'ACTIVE',
    createdAt: '2026-02-01T08:15:00Z'
  },
  {
    id: 'BAT-AMX-001',
    batchNumber: 'AMX001',
    productId: 'PROD-002',
    productName: 'Amoxicillin 250 mg',
    manufacturingDate: '2026-01-15',
    expiryDate: '2027-07-15',
    mrp: 110.00,
    quantity: 600,
    packageCount: 5,
    manufacturer: 'ABC Pharma Ltd.',
    status: 'ACTIVE',
    createdAt: '2026-01-15T14:20:00Z'
  },
  {
    id: 'BAT-CTZ-001',
    batchNumber: 'CTZ001',
    productId: 'PROD-003',
    productName: 'Cetirizine 10 mg',
    manufacturingDate: '2026-02-10',
    expiryDate: '2028-02-10',
    mrp: 35.00,
    quantity: 1200,
    packageCount: 5,
    manufacturer: 'ABC Pharma Ltd.',
    status: 'ACTIVE',
    createdAt: '2026-02-10T10:00:00Z'
  },
  {
    id: 'BAT-IBU-001',
    batchNumber: 'IBU001',
    productId: 'PROD-004',
    productName: 'Ibuprofen 400 mg',
    manufacturingDate: '2026-01-20',
    expiryDate: '2027-12-31',
    mrp: 60.00,
    quantity: 900,
    packageCount: 5,
    manufacturer: 'ABC Pharma Ltd.',
    status: 'ACTIVE',
    createdAt: '2026-01-20T16:45:00Z'
  }
];

export const INITIAL_PACKAGES = [
  // PCM001 Packages (Active / Genuine)
  {
    packageId: 'PKG-PCM001-00001',
    productId: 'PROD-001',
    productName: 'Paracetamol 500 mg',
    genericName: 'Paracetamol',
    dosage: '500 mg',
    batchNumber: 'PCM001',
    batchId: 'BAT-PCM-001',
    manufacturer: 'ABC Pharma Ltd.',
    manufacturingDate: '2026-01-10',
    expiryDate: '2028-01-09',
    mrp: 45.00,
    status: 'Active',
    scanCount: 1,
    lastScannedLocation: 'New York, USA',
    lastScannedDate: '2026-02-18T14:32:00Z',
    createdDate: '2026-01-10',
    flagReason: null,
    isFlagged: false
  },
  // PCM002 Packages (Expired)
  {
    packageId: 'PKG-PCM001-00002',
    productId: 'PROD-001',
    productName: 'Paracetamol 500 mg',
    genericName: 'Paracetamol',
    dosage: '500 mg',
    batchNumber: 'PCM002',
    batchId: 'BAT-PCM-002',
    manufacturer: 'ABC Pharma Ltd.',
    manufacturingDate: '2023-01-10',
    expiryDate: '2024-06-15',
    mrp: 42.00,
    status: 'Expired',
    scanCount: 3,
    lastScannedLocation: 'Chicago, USA',
    lastScannedDate: '2026-02-21T09:12:00Z',
    createdDate: '2023-01-10',
    flagReason: 'Expired Batch',
    isFlagged: false
  },
  // PCM001 Suspicious Package (Simulated clone / rapid multi-geo scan anomaly)
  {
    packageId: 'PKG-PCM001-00003',
    productId: 'PROD-001',
    productName: 'Paracetamol 500 mg',
    genericName: 'Paracetamol',
    dosage: '500 mg',
    batchNumber: 'PCM001',
    batchId: 'BAT-PCM-001',
    manufacturer: 'ABC Pharma Ltd.',
    manufacturingDate: '2026-01-10',
    expiryDate: '2028-01-09',
    mrp: 45.00,
    status: 'Suspicious',
    scanCount: 14,
    lastScannedLocation: 'London, UK (Conflicting Geo)',
    lastScannedDate: '2026-02-24T18:40:00Z',
    createdDate: '2026-01-10',
    flagReason: 'Rapid repeated scans across contradictory physical locations within 10 minutes',
    isFlagged: true
  },
  {
    packageId: 'PKG-PCM001-00004',
    productId: 'PROD-001',
    productName: 'Paracetamol 500 mg',
    genericName: 'Paracetamol',
    dosage: '500 mg',
    batchNumber: 'PCM001',
    batchId: 'BAT-PCM-001',
    manufacturer: 'ABC Pharma Ltd.',
    manufacturingDate: '2026-01-10',
    expiryDate: '2028-01-09',
    mrp: 45.00,
    status: 'Active',
    scanCount: 0,
    lastScannedLocation: null,
    lastScannedDate: null,
    createdDate: '2026-01-10',
    flagReason: null,
    isFlagged: false
  },
  {
    packageId: 'PKG-PCM001-00005',
    productId: 'PROD-001',
    productName: 'Paracetamol 500 mg',
    genericName: 'Paracetamol',
    dosage: '500 mg',
    batchNumber: 'PCM001',
    batchId: 'BAT-PCM-001',
    manufacturer: 'ABC Pharma Ltd.',
    manufacturingDate: '2026-01-10',
    expiryDate: '2028-01-09',
    mrp: 45.00,
    status: 'Active',
    scanCount: 2,
    lastScannedLocation: 'Boston, USA',
    lastScannedDate: '2026-02-20T11:00:00Z',
    createdDate: '2026-01-10',
    flagReason: null,
    isFlagged: false
  },
  {
    packageId: 'PKG-AMX001-00001',
    productId: 'PROD-002',
    productName: 'Amoxicillin 250 mg',
    genericName: 'Amoxicillin Trihydrate',
    dosage: '250 mg',
    batchNumber: 'AMX001',
    batchId: 'BAT-AMX-001',
    manufacturer: 'ABC Pharma Ltd.',
    manufacturingDate: '2026-01-15',
    expiryDate: '2027-07-15',
    mrp: 110.00,
    status: 'Active',
    scanCount: 1,
    lastScannedLocation: 'San Francisco, USA',
    lastScannedDate: '2026-02-15T10:15:00Z',
    createdDate: '2026-01-15',
    flagReason: null,
    isFlagged: false
  },
  {
    packageId: 'PKG-CTZ001-00001',
    productId: 'PROD-003',
    productName: 'Cetirizine 10 mg',
    genericName: 'Cetirizine Hydrochloride',
    dosage: '10 mg',
    batchNumber: 'CTZ001',
    batchId: 'BAT-CTZ-001',
    manufacturer: 'ABC Pharma Ltd.',
    manufacturingDate: '2026-02-10',
    expiryDate: '2028-02-10',
    mrp: 35.00,
    status: 'Active',
    scanCount: 0,
    lastScannedLocation: null,
    lastScannedDate: null,
    createdDate: '2026-02-10',
    flagReason: null,
    isFlagged: false
  },
  {
    packageId: 'PKG-IBU001-00001',
    productId: 'PROD-004',
    productName: 'Ibuprofen 400 mg',
    genericName: 'Ibuprofen',
    dosage: '400 mg',
    batchNumber: 'IBU001',
    batchId: 'BAT-IBU-001',
    manufacturer: 'ABC Pharma Ltd.',
    manufacturingDate: '2026-01-20',
    expiryDate: '2027-12-31',
    mrp: 60.00,
    status: 'Active',
    scanCount: 1,
    lastScannedLocation: 'Seattle, USA',
    lastScannedDate: '2026-02-19T13:45:00Z',
    createdDate: '2026-01-20',
    flagReason: null,
    isFlagged: false
  }
];

export const INITIAL_VERIFICATIONS = [
  {
    id: 'VER-901',
    packageId: 'PKG-PCM001-00001',
    productName: 'Paracetamol 500 mg',
    batchNumber: 'PCM001',
    result: 'GENUINE',
    riskScore: 5,
    riskLevel: 'LOW',
    location: 'New York, USA (Retail Pharmacy)',
    method: 'QR Scan',
    timestamp: '2026-02-25T14:10:00Z',
    details: 'Medicine verified authentic against registered batch specifications.'
  },
  {
    id: 'VER-902',
    packageId: 'PKG-PCM001-00003',
    productName: 'Paracetamol 500 mg',
    batchNumber: 'PCM001',
    result: 'SUSPICIOUS',
    riskScore: 82,
    riskLevel: 'HIGH',
    location: 'London, UK (Public Consumer scan)',
    method: 'QR Scan',
    timestamp: '2026-02-25T11:45:00Z',
    details: 'Rule-based anomaly detected: rapid multi-city verification frequency.'
  },
  {
    id: 'VER-903',
    packageId: 'PKG-PCM001-00002',
    productName: 'Paracetamol 500 mg',
    batchNumber: 'PCM002',
    result: 'EXPIRED',
    riskScore: 40,
    riskLevel: 'MEDIUM',
    location: 'Chicago, USA (Dispensary check)',
    method: 'Manual Entry',
    timestamp: '2026-02-24T16:20:00Z',
    details: 'Package belongs to batch expired on 15 Jun 2024.'
  },
  {
    id: 'VER-904',
    packageId: 'PKG-FAKE-99999',
    productName: 'Unknown Product',
    batchNumber: 'N/A',
    result: 'INVALID',
    riskScore: 100,
    riskLevel: 'VERY HIGH',
    location: 'Miami, USA (Hospital triage)',
    method: 'Manual Entry',
    timestamp: '2026-02-24T09:05:00Z',
    details: 'Package ID not found in PharmaChain registered mock database.'
  },
  {
    id: 'VER-905',
    packageId: 'PKG-AMX001-00001',
    productName: 'Amoxicillin 250 mg',
    batchNumber: 'AMX001',
    result: 'GENUINE',
    riskScore: 10,
    riskLevel: 'LOW',
    location: 'San Francisco, USA',
    method: 'QR Scan',
    timestamp: '2026-02-23T18:00:00Z',
    details: 'Medicine verified authentic.'
  },
  {
    id: 'VER-906',
    packageId: 'PKG-IBU001-00001',
    productName: 'Ibuprofen 400 mg',
    batchNumber: 'IBU001',
    result: 'GENUINE',
    riskScore: 5,
    riskLevel: 'LOW',
    location: 'Seattle, USA',
    method: 'QR Scan',
    timestamp: '2026-02-22T12:30:00Z',
    details: 'Medicine verified authentic.'
  }
];

export const INITIAL_SUPPLY_CHAIN_EVENTS = {
  'PKG-PCM001-00001': [
    {
      step: 1,
      title: 'Batch Manufactured & Serialized',
      organization: 'ABC Pharma Ltd.',
      actorRole: 'Manufacturer',
      location: 'Production Plant 4, New Jersey',
      date: '10 Jan 2026, 09:30 AM',
      status: 'Completed',
      txHash: '0x8f72a4...3b91 (Simulated Hash)',
      notes: 'Quality control certified. Unit assigned unique package ID PKG-PCM001-00001.'
    },
    {
      step: 2,
      title: 'Transferred to Wholesale Logistics',
      organization: 'Apex Global Logistics',
      actorRole: 'Distributor',
      location: 'Central Distribution Hub, Philadelphia',
      date: '12 Jan 2026, 02:15 PM',
      status: 'Completed',
      txHash: '0x3c99e1...7a04 (Simulated Hash)',
      notes: 'Cold chain & tamper seals inspected. Stored in climate-controlled bay.'
    },
    {
      step: 3,
      title: 'Received by Authorized Dispensary',
      organization: 'CareMed Community Chemist',
      actorRole: 'Pharmacy',
      location: 'Main St Branch, New York',
      date: '15 Jan 2026, 11:00 AM',
      status: 'Completed',
      txHash: '0x11ab44...90ff (Simulated Hash)',
      notes: 'Inventory scanned and verified at intake terminal.'
    },
    {
      step: 4,
      title: 'Dispensed / Customer Verification',
      organization: 'Public Verification Portal',
      actorRole: 'Consumer / Patient',
      location: 'New York, USA',
      date: '18 Feb 2026, 02:32 PM',
      status: 'Completed',
      txHash: '0x6e55cd...11aa (Simulated Hash)',
      notes: 'End consumer scanned QR code. Anti-counterfeit check passed.'
    }
  ]
};
