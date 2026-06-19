import React, { createContext, useContext, useState, useEffect } from 'react';

const AdminAuthContext = createContext();

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};

const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:5000'
  : (process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000');

// Admin credentials - you can move these to environment variables for production
const ADMIN_EMAIL = process.env.REACT_APP_ADMIN_EMAIL || 'admin@nuesa.acu.edu.ng';
const ADMIN_PASSWORD = process.env.REACT_APP_ADMIN_PASSWORD || 'admin123';

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if admin is logged in on app start
  useEffect(() => {
    checkAdminAuth();
  }, []);

  const checkAdminAuth = () => {
    try {
      const storedAdmin = localStorage.getItem('adminAuth');
      if (storedAdmin) {
        const adminData = JSON.parse(storedAdmin);
        // Check if session is still valid (24 hours)
        if (adminData.timestamp && Date.now() - adminData.timestamp < 24 * 60 * 60 * 1000) {
          setAdmin(adminData);
        } else {
          localStorage.removeItem('adminAuth');
        }
      }
    } catch (error) {
      console.error('Admin auth check failed:', error);
      localStorage.removeItem('adminAuth');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      // First call backend to set authentication cookies
      const response = await fetch(`${API_BASE_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
      });
      const data = await response.json();

      if (response.ok && data.success) {
        const adminData = {
          email: data.admin.email,
          name: data.admin.name,
          timestamp: Date.now()
        };
        setAdmin(adminData);
        localStorage.setItem('adminAuth', JSON.stringify(adminData));
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Invalid email or password' };
      }
    } catch (error) {
      console.error('Admin backend login failed, falling back to local auth:', error);
      // Fallback to local authentication for robustness
      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        const adminData = {
          email: ADMIN_EMAIL,
          timestamp: Date.now()
        };
        setAdmin(adminData);
        localStorage.setItem('adminAuth', JSON.stringify(adminData));
        return { success: true };
      } else {
        return { success: false, error: 'Invalid email or password' };
      }
    }
  };

  const logout = () => {
    setAdmin(null);
    localStorage.removeItem('adminAuth');
  };

  const value = {
    admin,
    loading,
    login,
    logout,
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};

