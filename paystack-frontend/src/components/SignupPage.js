import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import studentLogo from '../assets/student-logo.jpeg';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    matric: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Please enter your full name');
      return false;
    }
    if (!formData.matric.trim()) {
      setError('Please enter your matric number');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Please enter your email address');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await signup(
        formData.name,
        formData.matric,
        formData.email,
        formData.password
      );
      
      if (result.success) {
        navigate('/pay');
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans flex flex-col justify-center items-center py-12 px-6 relative overflow-hidden">
      
      {/* Background Ornaments */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3 pointer-events-none"></div>
      
      <div className="w-full max-w-lg relative z-10 my-8">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block group mb-4">
            <img 
              src={studentLogo} 
              alt="Logo" 
              className="w-14 h-14 mx-auto rounded-full border-2 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)] group-hover:scale-110 transition-transform duration-300"
            />
          </Link>
          <h2 className="text-3xl font-bold font-serif mb-2">Create Account</h2>
          <p className="text-gray-400">Join the NUESA ACU Portal</p>
        </div>

        <div className="bg-gray-800/60 backdrop-blur-md border border-gray-700/50 p-8 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
          <form onSubmit={handleSubmit} className="space-y-5">
            
            <div>
              <label htmlFor="name" className="block text-gray-400 text-sm font-bold mb-2">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                disabled={loading}
                required
                className="w-full bg-gray-900/80 border border-gray-700 text-white rounded-lg py-3 px-4 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label htmlFor="matric" className="block text-gray-400 text-sm font-bold mb-2">Matric Number</label>
                <input
                  type="text"
                  id="matric"
                  name="matric"
                  value={formData.matric}
                  onChange={handleChange}
                  placeholder="e.g. 21ENG000"
                  disabled={loading}
                  required
                  className="w-full bg-gray-900/80 border border-gray-700 text-white rounded-lg py-3 px-4 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-gray-400 text-sm font-bold mb-2">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@email.com"
                  disabled={loading}
                  required
                  className="w-full bg-gray-900/80 border border-gray-700 text-white rounded-lg py-3 px-4 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label htmlFor="password" className="block text-gray-400 text-sm font-bold mb-2">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Min. 6 characters"
                  disabled={loading}
                  required
                  className="w-full bg-gray-900/80 border border-gray-700 text-white rounded-lg py-3 px-4 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-gray-400 text-sm font-bold mb-2">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repeat password"
                  disabled={loading}
                  required
                  className="w-full bg-gray-900/80 border border-gray-700 text-white rounded-lg py-3 px-4 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg text-sm flex items-center gap-2">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                {error}
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className={`w-full font-bold py-3.5 px-4 rounded-lg mt-4 transition-all shadow-lg ${
                loading 
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                  : 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-emerald-500/20 hover:-translate-y-0.5'
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Creating Account...
                </span>
              ) : 'Create Account'}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-gray-400 border-t border-gray-700/50 pt-6">
            <p className="mb-4">
              Already have an account?{' '}
              <Link to="/login" className="text-emerald-400 hover:text-emerald-300 font-bold transition-colors">
                Sign in here
              </Link>
            </p>
            <Link to="/" className="text-gray-500 hover:text-white transition-colors flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
