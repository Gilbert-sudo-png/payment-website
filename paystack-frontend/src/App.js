import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { AdminAuthProvider } from './contexts/AdminAuthContext';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import PaymentForm from './components/PaymentForm';
import SuccessPage from './components/SuccessPage';
import AdminPayments from './components/AdminPayments';
import AdminLogin from './components/AdminLogin';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import './App.css';

function App() {
  const [paymentData, setPaymentData] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const appRole = (process.env.REACT_APP_APP_ROLE || 'combined').toLowerCase();
  const allowStudentView = appRole === 'student' || appRole === 'combined';
  const allowAdminView = appRole === 'admin' || appRole === 'combined';

  const handlePaymentSuccess = (data) => {
    setPaymentData(data);
    setShowSuccess(true);
  };

  const handleBackToPayment = () => {
    setShowSuccess(false);
    setPaymentData(null);
  };

  // Admin-only build
  if (!allowStudentView && allowAdminView) {
    return (
      <AdminAuthProvider>
        <Router>
          <Routes>
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route 
              path="/admin" 
              element={
                <AdminProtectedRoute>
      <div className="App admin-only">
        <header className="admin-header">
          <h1>Faculty Admin Dashboard</h1>
          <p>Manage payments and users</p>
        </header>
        <main className="admin-content">
          <AdminPayments />
        </main>
      </div>
                </AdminProtectedRoute>
              } 
            />
            <Route path="*" element={<Navigate to="/admin/login" replace />} />
          </Routes>
        </Router>
      </AdminAuthProvider>
    );
  }

  // Student build with routing
  return (
    <AuthProvider>
      <AdminAuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <main className="app-content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route 
                path="/pay" 
                element={
                  <ProtectedRoute>
                    {!showSuccess ? (
                      <PaymentForm onPaymentSuccess={handlePaymentSuccess} />
                    ) : (
                      <SuccessPage 
                        paymentData={paymentData} 
                        onBackToPayment={handleBackToPayment}
                      />
                    )}
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/success" 
                element={
                  <ProtectedRoute>
                    <SuccessPage 
                      paymentData={paymentData} 
                      onBackToPayment={handleBackToPayment}
                    />
                  </ProtectedRoute>
                } 
              />
              {allowAdminView && (
                  <>
                    <Route path="/admin/login" element={<AdminLogin />} />
                    <Route 
                      path="/admin" 
                      element={
                        <AdminProtectedRoute>
                          <AdminPayments />
                        </AdminProtectedRoute>
                      } 
                    />
                  </>
              )}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
      </AdminAuthProvider>
    </AuthProvider>
  );
}

export default App;
