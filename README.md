# PharmaChain — Blockchain-Based Medicine Authentication System

An enterprise-grade decentralized pharmaceutical authentication and anti-counterfeiting platform built with Ethereum Solidity smart contracts, Node.js & Express REST API, MongoDB Mongoose ODM, and React Vite frontend with real-time QR code generation and optical camera scanning.

---

## 1. System Architecture

```
                                  +----------------------------------------------------+
                                  |                 React Frontend                     |
                                  |    (Vite + React Router + Axios + Tailwind CSS)    |
                                  +---------+------------------------------+-----------+
                                            |                              |
                                (REST API / JWT Auth)              (Read-Only Web3 /
                                            |                       MetaMask Optional)
                                            v                              |
                                  +---------+-----------+                  |
                                  |   Express Backend   |                  |
                                  |  (Node.js + Mongoose|                  |
                                  |   + Ethers.js Relayer                  |
                                  +----+-----------+----+                  |
                                       |           |                       |
                 (Data Persistence /   |           | (Signed Transactions  |
                  Search / Audit Logs) |           |  via Backend Relayer) |
                                       v           v                       v
                         +-------------+---+   +---+-----------------------+---+
                         | MongoDB Storage |   |     PharmaChain.sol           |
                         | (Users, Meds,   |   | (Hardhat Local Node /         |
                         |  Scan History)  |   |  Ethereum Blockchain Network) |
                         +-----------------+   +-------------------------------+
```

### Architecture Rule: Secure Relayer Signing
The frontend **never contains blockchain private keys**. State mutations (such as minting new medicines on the ledger) are dispatched securely through the Express backend relayer using an operator wallet private key in `backend/.env`. Read-only verification queries can be cross-verified directly via JSON-RPC.

---

## 2. Data Partitioning: Blockchain vs MongoDB

| Attribute / Field | Stored on Blockchain (`PharmaChain.sol`) | Stored in MongoDB (`pharmachain`) | Architectural Rationale |
| :--- | :---: | :---: | :--- |
| **Medicine ID** (`MED-2026-XXXXXX`) | **Yes** | **Yes** | Primary key for cryptographic verification & index lookup |
| **Medicine Name** | **Yes** | **Yes** | Core product formulation identifier |
| **Batch Number** | **Yes** | **Yes** | Production lot code for batch recalls |
| **Manufacturer Name** | **Yes** | **Yes** | Non-repudiation of originating facility |
| **Manufacturing & Expiry Dates** | **Yes** | **Yes** | Immutable timestamp baseline preventing label falsification |
| **Lifecycle Status** (`GENUINE`, `EXPIRED`, `SUSPICIOUS`, `RECALLED`) | **Yes** | **Yes** | Cryptographic ground-truth state |
| **Registering Wallet Address** | **Yes** | **No** | Cryptographic proof of origin signer |
| **Transaction Hash & Block Number** | **Blockchain Generated** | **Yes** | Quick indexing to load block explorer receipts |
| **User Credentials (bcrypt/JWT)** | **No** | **Yes** | Sensitive authentication data must never reside on public chain |
| **Operational Descriptions & Quota** | **No** | **Yes** | Logistics attributes subject to operational revisions |
| **Verification & Telemetry Logs** | **No** | **Yes** | High-volume read logging (IPs, scan timestamps, anomaly detection) |

---

## 3. Project Directory Structure

```
pharmachain/
├── blockchain/                     # Ethereum Smart Contracts & Hardhat
│   ├── contracts/
│   │   └── PharmaChain.sol         # Solidity smart contract
│   ├── scripts/
│   │   └── deploy.cjs              # Automated deployment & config syncer
│   ├── test/
│   │   └── PharmaChain.test.cjs    # Smart contract unit tests
│   ├── hardhat.config.cjs          # Hardhat EVM configuration
│   └── package.json
│
├── backend/                        # Node.js & Express REST API
│   ├── config/
│   │   ├── db.js                   # Mongoose MongoDB connection
│   │   ├── blockchain.js           # Ethers.js provider and contract instance
│   │   └── contractData.json       # Auto-synced contract address and ABI
│   ├── controllers/
│   │   ├── authController.js       # Register, Login, Profile
│   │   ├── medicineController.js   # Add medicine, Verify, Dashboard stats
│   │   └── blockchainController.js # Ledger records, RPC status
│   ├── middleware/
│   │   ├── authMiddleware.js       # JWT validation & role authorization
│   │   └── errorMiddleware.js      # Global error handler
│   ├── models/
│   │   ├── User.js                 # User schema (Manufacturer / Customer)
│   │   ├── Medicine.js             # Medicine schema with tx hash
│   │   └── VerificationLog.js      # Audit trails & scan velocity tracker
│   ├── routes/
│   │   ├── authRoutes.js           # /api/auth
│   │   ├── medicineRoutes.js       # /api/medicines
│   │   └── blockchainRoutes.js     # /api/blockchain
│   ├── services/
│   │   └── blockchainService.js    # Smart contract interaction relayer
│   ├── seed.js                     # Demo database seeder
│   ├── server.js                   # Express server entry point
│   └── package.json
│
└── frontend/                       # React 18 + Vite SPA (JavaScript)
    ├── public/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx          # Header with role badge and Web3 wallet button
    │   │   ├── Sidebar.jsx         # Dashboard navigation
    │   │   ├── Footer.jsx          # Institutional footer
    │   │   ├── ProtectedRoute.jsx  # JWT & role route guard
    │   │   ├── MedicineCard.jsx    # Medicine summary card
    │   │   ├── StatusBadge.jsx     # Color-coded status badge
    │   │   ├── QRCodeDisplay.jsx   # QR generator with Download & Copy
    │   │   ├── QRScanner.jsx       # Real camera scanner with image upload
    │   │   └── BlockchainRecord.jsx# On-chain explorer transaction card
    │   ├── pages/
    │   │   ├── Home.jsx            # Landing page with quick verify
    │   │   ├── Login.jsx           # Sign in with one-click demo credentials
    │   │   ├── Register.jsx        # Account creation with role selection
    │   │   ├── Dashboard.jsx       # Analytics cards and activity streams
    │   │   ├── AddMedicine.jsx     # Registration form with instant QR modal
    │   │   ├── MyMedicines.jsx     # Manufacturer batch manager
    │   │   ├── VerifyMedicine.jsx  # Optical camera & manual verification
    │   │   ├── BlockchainRecords.jsx # Live blockchain ledger viewer
    │   │   └── Profile.jsx         # User profile and session details
    │   ├── context/
    │   │   └── AuthContext.jsx     # User authentication state
    │   ├── services/
    │   │   ├── api.js              # Axios instance with auth interceptor
    │   │   ├── authService.js      # Auth API calls
    │   │   ├── medicineService.js  # Medicine API calls
    │   │   └── blockchainService.js# Blockchain API calls
    │   ├── App.jsx                 # Route declarations
    │   ├── main.jsx                # DOM mounting
    │   └── index.css               # Healthcare & Blockchain UI design system
    ├── index.html
    ├── vite.config.js
    └── package.json
```

---

## 4. Setup & Running Instructions

### Prerequisites
- **Node.js**: v18+ (tested with v24)
- **npm**: v9+
- **MongoDB**: Local MongoDB instance (`mongodb://127.0.0.1:27017`) or free MongoDB Atlas cluster.

---

### Step 1: Blockchain Smart Contract (Terminal 1)

```powershell
cd C:\Users\K.Balaji\.gemini\antigravity\scratch\pharmachain\blockchain

# Install dependencies
npm install

# Run unit tests
npm test

# Start the local Hardhat blockchain node (produces 20 test accounts with 10,000 ETH each)
npm run node
```

In a new terminal window, deploy the contract to your running local node:

```powershell
cd C:\Users\K.Balaji\.gemini\antigravity\scratch\pharmachain\blockchain
npm run deploy:local
```

> The deploy script will automatically write the deployed contract address and ABI to both `backend/config/contractData.json` and `frontend/src/config/contractData.json`.

---

### Step 2: Backend REST API & Relayer (Terminal 2)

```powershell
cd C:\Users\K.Balaji\.gemini\antigravity\scratch\pharmachain\backend

# Install dependencies
npm install

# (Optional) Seed demo users and baseline medicines
npm run seed

# Start the backend server
npm run dev
```

Backend will run on: **`http://localhost:5000`**  
Health check: **`http://localhost:5000/api/health`**

---

### Step 3: Frontend User Interface (Terminal 3)

```powershell
cd C:\Users\K.Balaji\.gemini\antigravity\scratch\pharmachain\frontend

# Install dependencies
npm install

# Start Vite development server
npm run dev
```

Frontend will run on: **`http://localhost:5173`**

---

## 5. Demo Accounts & Testing Guide

### Pre-configured Test Accounts

| Role | Email | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Manufacturer** | `manufacturer@pharmachain.com` | `Password123` | Register medicines, mint blockchain tokens, download QR codes |
| **Customer** | `customer@pharmachain.com` | `Password123` | Verify medicines, scan QR codes, view blockchain provenance |

*(You can also use the "One-Click Demo Accounts" buttons on the Login page).*

---

### Verification Scenarios to Test

1. **Genuine Medicine Verification**:
   - Medicine ID: `MED-2026-A8F92K`
   - Result: **GENUINE** (Green badge, manufacturer details, blockchain transaction hash, block number).

2. **Expired Medicine Verification**:
   - Medicine ID: `MED-2024-EXP01X`
   - Result: **EXPIRED** (Amber warning, expiry date passed warning).

3. **Suspicious Medicine Verification**:
   - Medicine ID: `MED-2026-SUSP99`
   - Result: **SUSPICIOUS** (Orange alert, anomaly flag).

4. **Counterfeit / Non-existent Medicine Verification**:
   - Medicine ID: `MED-FAKE-999999`
   - Result: **INVALID / COUNTERFEIT** (Red alert: *"Invalid or counterfeit medicine. This Medicine ID was never registered on the blockchain ledger."*).

---

## 6. Smart Contract Specifications (`PharmaChain.sol`)

### Methods
- `registerMedicine(string medicineId, string name, string batchNumber, string manufacturer, uint256 manufacturingDate, uint256 expiryDate)`: Mints a new medicine record on-chain. Only authorized manufacturers or owner.
- `getMedicine(string medicineId)`: Returns complete medicine tuple.
- `medicineExists(string medicineId)`: Returns boolean existence check.
- `updateMedicineStatus(string medicineId, uint8 newStatus)`: Updates status (0: GENUINE, 1: EXPIRED, 2: SUSPICIOUS, 3: RECALLED).
- `getAllMedicineIds()`: Returns array of all registered medicine IDs.
- `authorizeManufacturer(address)` & `revokeManufacturer(address)`: Access control.

### Events
- `event MedicineRegistered(string indexed medicineId, string name, string batchNumber, string manufacturer, address indexed registeredBy, uint256 timestamp)`
- `event MedicineStatusUpdated(string indexed medicineId, uint8 oldStatus, uint8 newStatus, address indexed updatedBy, uint256 timestamp)`
