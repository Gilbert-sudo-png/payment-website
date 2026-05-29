import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../contexts/AdminAuthContext';
import studentLogo from '../assets/student-logo.jpeg';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAdminAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);

    if (result.success) {
      navigate('/admin');
    } else {
      setError(result.error || 'Login failed');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans flex flex-col justify-center items-center py-12 px-6 relative overflow-hidden">
      
      {/* Background Ornaments */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3 pointer-events-none"></div>
      
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-10">
          <div className="inline-block group mb-6">
            <img 
              src={studentLogo} 
              alt="Logo" 
              className="w-16 h-16 mx-auto rounded-full border-2 border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)]"
            />
          </div>
          <h2 className="text-3xl font-bold font-serif mb-2">Admin Portal</h2>
          <p className="text-gray-400">Secure Faculty Access</p>
        </div>

        <div className="bg-gray-800/60 backdrop-blur-md border border-gray-700/50 p-8 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div>
              <label htmlFor="email" className="block text-gray-400 text-sm font-bold mb-2">Admin Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@nuesa.com"
                disabled={loading}
                required
                className="w-full bg-gray-900/80 border border-gray-700 text-white rounded-lg py-3 px-4 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-gray-400 text-sm font-bold mb-2">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={loading}
                required
                className="w-full bg-gray-900/80 border border-gray-700 text-white rounded-lg py-3 px-4 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors"
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg text-sm flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                {error}
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className={`w-full font-bold py-3 px-4 rounded-lg transition-all shadow-lg ${
                loading 
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                  : 'bg-red-600 hover:bg-red-500 text-white shadow-red-500/20 hover:-translate-y-0.5'
              }`}
            >
              {loading ? 'Authenticating...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
