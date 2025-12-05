import React, { createContext, useContext, useState, useEffect } from 'react';

const AdminAuthContext = createContext();

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};

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
      // Simple authentication - check against configured credentials
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
    } catch (error) {
      return { success: false, error: 'Login failed. Please try again.' };
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

