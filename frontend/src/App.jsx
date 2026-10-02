import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AddMedicine from "./pages/AddMedicine";
import MyMedicines from "./pages/MyMedicines";
import VerifyMedicine from "./pages/VerifyMedicine";
import BlockchainRecords from "./pages/BlockchainRecords";
import Profile from "./pages/Profile";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Navbar />
          <div className="main-content">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/verify" element={<VerifyMedicine />} />
              <Route path="/verify/:id" element={<VerifyMedicine />} />
              <Route path="/blockchain" element={<BlockchainRecords />} />

              {/* Protected Routes (Any Authenticated User) */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />

              {/* Protected Routes (Manufacturer Only) */}
              <Route
                path="/add-medicine"
                element={
                  <ProtectedRoute allowedRoles={["manufacturer"]}>
                    <AddMedicine />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/medicines"
                element={
                  <ProtectedRoute allowedRoles={["manufacturer"]}>
                    <MyMedicines />
                  </ProtectedRoute>
                }
              />

              {/* Catch-all */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
