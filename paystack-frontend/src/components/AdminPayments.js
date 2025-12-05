import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../contexts/AdminAuthContext';
import './AdminPayments.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

const paymentHeaders = [
  { key: 'reference', label: 'Reference' },
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'matric', label: 'Matric No.' },
  { key: 'amount', label: 'Amount (₦)' },
  { key: 'status', label: 'Status' },
  { key: 'reason', label: 'Reason' },
  { key: 'transaction_date', label: 'Paid At' }
];

const userHeaders = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Name' },
  { key: 'matric', label: 'Matric No.' },
  { key: 'email', label: 'Email' },
  { key: 'created_at', label: 'Registered At' }
];

const AdminPayments = () => {
  const [payments, setPayments] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('payments');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);
  const { logout } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const fetchPayments = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/payments`);
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to load payments');
      }

      setPayments(result.data || []);
    } catch (err) {
      setError(err.message || 'Unable to load payments');
      throw err;
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users`);
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to load users');
      }

      setUsers(result.data || []);
    } catch (err) {
      setError(err.message || 'Unable to load users');
      throw err;
    }
  };

  const fetchAllData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      await Promise.all([fetchPayments(), fetchUsers()]);
      setLastUpdated(new Date().toLocaleString());
    } catch (err) {
      // Error already set in individual fetch functions
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const totalAmount = useMemo(() => {
    return payments.reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
  }, [payments]);

  const renderPaymentsTable = () => (
    <div className="table-wrapper">
      <table className="admin-table">
        <thead>
          <tr>
            {paymentHeaders.map(header => (
              <th key={header.key}>{header.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={paymentHeaders.length}>Loading payments...</td>
            </tr>
          ) : payments.length === 0 ? (
            <tr>
              <td colSpan={paymentHeaders.length}>No payments found</td>
            </tr>
          ) : (
            payments.map(payment => (
              <tr key={payment.reference}>
                <td>{payment.reference}</td>
                <td>{payment.name || 'N/A'}</td>
                <td>{payment.email || 'N/A'}</td>
                <td>{payment.matric || 'N/A'}</td>
                <td>₦{Number(payment.amount).toLocaleString()}</td>
                <td className={`status ${payment.status}`}>{payment.status}</td>
                <td>{payment.reason || 'N/A'}</td>
                <td>{new Date(payment.transaction_date || payment.created_at).toLocaleString()}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  const renderUsersTable = () => (
    <div className="table-wrapper">
      <table className="admin-table">
        <thead>
          <tr>
            {userHeaders.map(header => (
              <th key={header.key}>{header.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={userHeaders.length}>Loading users...</td>
            </tr>
          ) : users.length === 0 ? (
            <tr>
              <td colSpan={userHeaders.length}>No users found</td>
            </tr>
          ) : (
            users.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.matric}</td>
                <td>{user.email}</td>
                <td>{new Date(user.created_at).toLocaleString()}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="admin-page">
      <div className="admin-card">
        <div className="admin-header">
          <div>
            <h2>Admin Dashboard</h2>
            <p>Manage payments and registered users</p>
          </div>
          <div className="admin-actions">
            <button onClick={fetchAllData} disabled={loading}>
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
            {lastUpdated && <span className="last-updated">Last updated: {lastUpdated}</span>}
          </div>
        </div>

        {error && <div className="error-banner">{error}</div>}

        <div className="admin-tabs">
          <button 
            className={`tab-button ${activeTab === 'payments' ? 'active' : ''}`}
            onClick={() => setActiveTab('payments')}
          >
            Payments ({payments.length})
          </button>
          <button 
            className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            Users ({users.length})
          </button>
        </div>

        {activeTab === 'payments' && (
          <>
            <div className="admin-stats">
              <div className="stat-card">
                <strong>Total Payments</strong>
                <span>{payments.length}</span>
              </div>
              <div className="stat-card">
                <strong>Total Amount</strong>
                <span>₦{totalAmount.toLocaleString()}</span>
              </div>
            </div>
            {renderPaymentsTable()}
          </>
        )}

        {activeTab === 'users' && (
          <>
            <div className="admin-stats">
              <div className="stat-card">
                <strong>Registered Users</strong>
                <span>{users.length}</span>
              </div>
              <div className="stat-card">
                <strong>Recent Signups</strong>
                <span>{users.filter(u => new Date(u.created_at) > new Date(Date.now() - 7*24*60*60*1000)).length} this week</span>
              </div>
            </div>
            {renderUsersTable()}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminPayments;