import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { AdminAuthProvider } from './contexts/AdminAuthContext';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import AboutPage from './components/AboutPage';
import ExecutivesPage from './components/ExecutivesPage';
import ProjectsPage from './components/ProjectsPage';
import ContactPage from './components/ContactPage';
import VotingPage from './components/VotingPage';
import PaymentForm from './components/PaymentForm';
import SuccessPage from './components/SuccessPage';
import AdminPayments from './components/AdminPayments';
import AdminLogin from './components/AdminLogin';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import './App.css';

const StudentLayout = () => {
  return (
    <>
      <Navbar />
      <main className="app-content">
        <Outlet />
      </main>
    </>
  );
};

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
                  <div className="App admin-only h-screen bg-gray-900 text-white">
                    <header className="admin-header py-6 bg-gray-800 border-b border-gray-700 text-center">
                      <h1 className="text-2xl font-bold">Faculty Admin Dashboard</h1>
                      <p className="text-gray-400 text-sm">Manage payments and users</p>
                    </header>
                    <main className="admin-content p-6 max-h-full overflow-auto">
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
        <div className="App bg-gray-900 min-h-screen text-white font-sans">
          <Routes>
            
            {/* Standalone Login Page */}
            <Route path="/login" element={<LoginPage />} />
            
            {/* Student Pages with Navbar */}
            <Route element={<StudentLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/home" element={<Navigate to="/" replace />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/executives" element={<ExecutivesPage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/voting" element={<VotingPage />} />
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
            </Route>

            {/* Admin Pages without Navbar */}
            {allowAdminView && (
              <>
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route 
                  path="/admin" 
                  element={
                    <AdminProtectedRoute>
                      <div className="min-h-screen bg-gray-900 text-white">
                        <header className="py-6 bg-gray-800 border-b border-gray-700 text-center">
                          <h1 className="text-2xl font-bold">Faculty Admin Dashboard</h1>
                          <p className="text-gray-400 text-sm">Manage payments and users</p>
                        </header>
                        <main className="p-6">
                          <AdminPayments />
                        </main>
                      </div>
                    </AdminProtectedRoute>
                  } 
                />
              </>
            )}
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
      </AdminAuthProvider>
    </AuthProvider>
  );
}

export default App;
