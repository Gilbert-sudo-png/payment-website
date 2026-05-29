import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../contexts/AdminAuthContext';

const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:5000'
  : (process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000');

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

// Embedded candidate mapper to convert IDs back to names for Admin context
const candidateMap = {
  1: { name: 'Michael Osei', position: 'President' },
  2: { name: 'Sarah Ade', position: 'President' },
  3: { name: 'Daniel Chuks', position: 'Vice President' }
};

const AdminPayments = () => {
  const [payments, setPayments] = useState([]);
  const [users, setUsers] = useState([]);
  const [voteResults, setVoteResults] = useState([]);
  const [resultsReleased, setResultsReleased] = useState(false);
  const [totalVotes, setTotalVotes] = useState(0);

  const [activeTab, setActiveTab] = useState('payments');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);
  
  // Add Student form state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStudent, setNewStudent] = useState({ name: '', matric: '', email: '' });
  const [isAdding, setIsAdding] = useState(false);
  const [isReleasing, setIsReleasing] = useState(false);

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
      if (!response.ok || !result.success) throw new Error(result.message || 'Failed to load payments');
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
      if (!response.ok || !result.success) throw new Error(result.message || 'Failed to load users');
      setUsers(result.data || []);
    } catch (err) {
      setError(err.message || 'Unable to load users');
      throw err;
    }
  };

  const fetchVotes = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/votes`, { credentials: 'include' });
      const result = await response.json();
      if (!response.ok || !result.success) return; // Silent fail if not available
      
      setVoteResults(result.results || []);
      setTotalVotes(result.total_votes || 0);
      setResultsReleased(result.results_released || false);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAllData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      await Promise.all([fetchPayments(), fetchUsers(), fetchVotes()]);
      setLastUpdated(new Date().toLocaleString());
    } catch (err) {
      // Error already set
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const handleAddStudent = async (e) => {
    e.preventDefault();
    setIsAdding(true);
    setError('');
    setSuccessMsg('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStudent),
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to add student');
      }

      setSuccessMsg('Student added successfully!');
      setShowAddModal(false);
      setNewStudent({ name: '', matric: '', email: '' });
      fetchUsers(); // Refresh users
    } catch (err) {
      setError(err.message);
    } finally {
      setIsAdding(false);
      setTimeout(() => setSuccessMsg(''), 3000);
    }
  };

  const handleToggleRelease = async () => {
    setIsReleasing(true);
    setError('');
    try {
      const newStatus = !resultsReleased;
      const response = await fetch(`${API_BASE_URL}/api/admin/votes/release`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ released: newStatus }),
      });
      const result = await response.json();

      if (response.ok) {
        setResultsReleased(newStatus);
        setSuccessMsg(result.message);
        setTimeout(() => setSuccessMsg(''), 3000);
      } else {
        throw new Error('Failed to update release setting');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsReleasing(false);
    }
  };

  const totalAmount = useMemo(() => {
    return payments.reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
  }, [payments]);

  const renderPaymentsTable = () => (
    <div className="overflow-x-auto bg-gray-800 rounded-xl border border-gray-700 shadow-xl mt-6">
      <table className="w-full text-left text-sm text-gray-300">
        <thead className="text-xs text-gray-400 uppercase bg-gray-900 border-b border-gray-700">
          <tr>
            {paymentHeaders.map(header => (
              <th key={header.key} className="px-6 py-4 font-bold tracking-wider">{header.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan={paymentHeaders.length} className="px-6 py-8 text-center text-gray-500">Loading payments...</td></tr>
          ) : payments.length === 0 ? (
            <tr><td colSpan={paymentHeaders.length} className="px-6 py-8 text-center text-gray-500">No payments found</td></tr>
          ) : (
            payments.map((payment, idx) => (
              <tr key={payment.reference} className={`border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors ${idx % 2 === 0 ? 'bg-gray-800' : 'bg-gray-800/80'}`}>
                <td className="px-6 py-4 font-mono text-emerald-400">{payment.reference}</td>
                <td className="px-6 py-4 font-medium text-white">{payment.name || 'N/A'}</td>
                <td className="px-6 py-4">{payment.email || 'N/A'}</td>
                <td className="px-6 py-4 font-mono text-gray-400">{payment.matric || 'N/A'}</td>
                <td className="px-6 py-4 font-bold text-white">₦{Number(payment.amount).toLocaleString()}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    payment.status === 'success' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 
                    payment.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' : 
                    'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}>
                    {payment.status}
                  </span>
                </td>
                <td className="px-6 py-4">{payment.reason || 'N/A'}</td>
                <td className="px-6 py-4 text-gray-500">{new Date(payment.transaction_date || payment.created_at).toLocaleString()}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  const renderUsersTable = () => (
    <div className="overflow-x-auto bg-gray-800 rounded-xl border border-gray-700 shadow-xl mt-6">
      <table className="w-full text-left text-sm text-gray-300">
        <thead className="text-xs text-gray-400 uppercase bg-gray-900 border-b border-gray-700">
          <tr>
            {userHeaders.map(header => (
              <th key={header.key} className="px-6 py-4 font-bold tracking-wider">{header.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan={userHeaders.length} className="px-6 py-8 text-center text-gray-500">Loading users...</td></tr>
          ) : users.length === 0 ? (
            <tr><td colSpan={userHeaders.length} className="px-6 py-8 text-center text-gray-500">No users found</td></tr>
          ) : (
            users.map((user, idx) => (
              <tr key={user.id} className={`border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors ${idx % 2 === 0 ? 'bg-gray-800' : 'bg-gray-800/80'}`}>
                <td className="px-6 py-4 font-mono text-gray-500">#{user.id}</td>
                <td className="px-6 py-4 font-medium text-white">{user.name}</td>
                <td className="px-6 py-4 font-mono text-cyan-400">{user.matric}</td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4 text-gray-500">{new Date(user.created_at).toLocaleString()}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  const renderVotingResults = () => {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2 overflow-x-auto bg-gray-800 rounded-xl border border-gray-700 shadow-xl h-fit">
          <div className="p-6 border-b border-gray-700 font-bold tracking-widest uppercase text-sm text-gray-400 flex justify-between">
            <span>Election Standings</span>
            <span>Total Checked Votes: {totalVotes}</span>
          </div>
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="text-xs text-gray-400 uppercase bg-gray-900 border-b border-gray-700">
              <tr>
                <th className="px-6 py-4 font-bold tracking-wider">Candidate</th>
                <th className="px-6 py-4 font-bold tracking-wider">Position</th>
                <th className="px-6 py-4 font-bold tracking-wider">Votes</th>
                <th className="px-6 py-4 font-bold tracking-wider">% Share</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">Calculating results...</td></tr>
              ) : voteResults.length === 0 ? (
                <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">No votes cast yet.</td></tr>
              ) : (
                Object.keys(candidateMap).map((id, idx) => {
                  const candidateInfo = candidateMap[id];
                  const resultRecord = voteResults.find(r => r.candidate_id === parseInt(id));
                  const votes = resultRecord ? resultRecord.vote_count : 0;
                  const percent = totalVotes > 0 ? ((votes / totalVotes) * 100).toFixed(1) : 0;
                  
                  return (
                    <tr key={id} className={`border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors ${idx % 2 === 0 ? 'bg-gray-800' : 'bg-gray-800/80'}`}>
                      <td className="px-6 py-5 font-bold text-white text-base">{candidateInfo.name}</td>
                      <td className="px-6 py-5 text-gray-400">{candidateInfo.position}</td>
                      <td className="px-6 py-5 text-emerald-400 font-bold">{votes}</td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3 w-full">
                          <span className="w-12 text-right">{percent}%</span>
                          <div className="w-32 bg-gray-700 h-2 rounded-full overflow-hidden shrink-0">
                            <div className="bg-emerald-500 h-full" style={{ width: `${percent}%` }}></div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-800 border bg-gradient-to-br from-indigo-900/40 to-gray-800 border-indigo-800/50 p-6 rounded-2xl flex flex-col justify-between">
            <h3 className="text-white font-bold text-xl mb-2">Publish Results</h3>
            <p className="text-gray-400 text-sm mb-6 flex-1">
              Currently, results are <strong className={resultsReleased ? 'text-emerald-400' : 'text-yellow-400'}>{resultsReleased ? 'PUBLIC' : 'HIDDEN'}</strong> from the student portal. 
              Only Admin can see the live results above.
            </p>
            <button 
              onClick={handleToggleRelease}
              disabled={isReleasing}
              className={`w-full py-4 rounded-xl font-bold uppercase tracking-wider text-white transition-all shadow-lg flex items-center justify-center gap-3 ${
                resultsReleased 
                  ? 'bg-red-500 hover:bg-red-600 shadow-red-500/20' 
                  : 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20'
              }`}
            >
              {isReleasing && <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>}
              {resultsReleased ? 'Hide Results from Portal' : 'Release Results to Portal'}
            </button>
          </div>
          
          <div className="bg-gray-800 border border-gray-700 p-6 rounded-2xl">
              <p className="text-gray-400/80 text-sm font-bold uppercase tracking-widest mb-1">Voter Turnout</p>
              <div className="text-4xl font-black text-white flex items-baseline gap-2">
                {totalVotes} <span className="text-lg font-medium text-gray-500 tracking-normal lowercase">voted</span>
              </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 flex flex-col h-full font-sans pb-10">
      
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-center bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-lg mt-6">
        <div className="flex gap-4 items-center">
          <button 
            onClick={() => setActiveTab('payments')}
            className={`px-6 py-2 rounded-full font-bold text-sm uppercase tracking-wider transition-all ${
              activeTab === 'payments' ? 'bg-red-600 text-white shadow-lg shadow-red-500/20' : 'bg-gray-900 text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            Payments ({payments.length})
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={`px-6 py-2 rounded-full font-bold text-sm uppercase tracking-wider transition-all ${
              activeTab === 'users' ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/20' : 'bg-gray-900 text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            Users ({users.length})
          </button>
          <button 
            onClick={() => setActiveTab('voting')}
            className={`px-6 py-2 rounded-full font-bold text-sm uppercase tracking-wider transition-all ${
              activeTab === 'voting' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'bg-gray-900 text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            Elections
          </button>
        </div>
        
        <div className="flex items-center gap-4 mt-6 sm:mt-0">
          {lastUpdated && <span className="text-xs text-gray-500">Updated: {lastUpdated}</span>}
          <button 
            onClick={fetchAllData} 
            disabled={loading}
            className="flex items-center gap-2 text-sm text-gray-300 hover:text-white bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition-colors"
          >
            <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            Refresh
          </button>
          <button 
            onClick={handleLogout} 
            className="text-sm font-bold text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 px-4 py-2 rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-3">
            <svg className="w-6 h-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            <span>{error}</span>
          </div>
          <button onClick={() => setError('')} className="text-red-400 hover:text-white">✕</button>
        </div>
      )}

      {successMsg && (
        <div className="bg-emerald-500/10 border border-emerald-500/50 text-emerald-400 p-4 rounded-xl flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-3">
            <svg className="w-6 h-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg('')} className="text-emerald-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-md shadow-2xl relative">
            <button onClick={() => setShowAddModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl">✕</button>
            <h2 className="text-2xl font-bold font-serif mb-6 text-cyan-400">Register New Student</h2>
            <form onSubmit={handleAddStudent} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-400 mb-1">Full Name</label>
                <input type="text" required value={newStudent.name} onChange={(e) => setNewStudent({...newStudent, name: e.target.value})} className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-cyan-500" placeholder="e.g. Jane Doe" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-400 mb-1">Email Address</label>
                <input type="email" required value={newStudent.email} onChange={(e) => setNewStudent({...newStudent, email: e.target.value})} className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-cyan-500" placeholder="student@gmail.com" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-400 mb-1">Matric Number</label>
                <input type="text" required value={newStudent.matric} onChange={(e) => setNewStudent({...newStudent, matric: e.target.value})} className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-cyan-500" placeholder="25EG00001" />
              </div>
              <button type="submit" disabled={isAdding} className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 rounded-lg mt-4 disabled:opacity-50">
                {isAdding ? 'Registering...' : 'Register Student'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      {activeTab === 'payments' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-emerald-900/50 to-gray-800 border border-emerald-800/50 p-6 rounded-2xl">
            <p className="text-emerald-400/80 text-sm font-bold uppercase tracking-widest mb-1">Total Valid Payments</p>
            <div className="text-4xl font-black text-white">{payments.length}</div>
          </div>
          <div className="bg-gradient-to-br from-blue-900/50 to-gray-800 border border-blue-800/50 p-6 rounded-2xl">
            <p className="text-blue-400/80 text-sm font-bold uppercase tracking-widest mb-1">Total Revenue</p>
            <div className="text-4xl font-black text-white">₦{totalAmount.toLocaleString()}</div>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-cyan-900/50 to-gray-800 border border-cyan-800/50 p-6 rounded-2xl flex justify-between items-center">
            <div>
              <p className="text-cyan-400/80 text-sm font-bold uppercase tracking-widest mb-1">Total Registered Students</p>
              <div className="text-4xl font-black text-white">{users.length}</div>
            </div>
            <button onClick={() => setShowAddModal(true)} className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold px-4 py-2 rounded-xl shadow-lg flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              Add Student
            </button>
          </div>
          <div className="bg-gradient-to-br from-purple-900/50 to-gray-800 border border-purple-800/50 p-6 rounded-2xl">
            <p className="text-purple-400/80 text-sm font-bold uppercase tracking-widest mb-1">Recent Signups</p>
            <div className="text-4xl font-black text-white">{users.filter(u => new Date(u.created_at) > new Date(Date.now() - 7*24*60*60*1000)).length} <span className="text-sm font-medium text-gray-400 lowercase tracking-normal">this week</span></div>
          </div>
        </div>
      )}

      {/* Main Table */}
      <div className="flex-1 mt-6">
        {activeTab === 'payments' && renderPaymentsTable()}
        {activeTab === 'users' && renderUsersTable()}
        {activeTab === 'voting' && renderVotingResults()}
      </div>

    </div>
  );
};

export default AdminPayments;