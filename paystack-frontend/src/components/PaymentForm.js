import React, { useState } from 'react';

const PaymentForm = ({ onPaymentSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    matric: '',
    amount: '13500',
    reason: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const validateForm = () => {
    if (!formData.name.trim()) return setError('Please enter your name'), false;
    if (!formData.email.trim()) return setError('Please enter your email'), false;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return setError('Please enter a valid email address'), false;
    if (!formData.matric.trim()) return setError('Please enter your matric number'), false;
    if (!formData.amount || parseFloat(formData.amount) !== 13500) return setError('Amount must be 13,500 NGN'), false;
    if (!formData.reason.trim()) return setError('Please enter a payment reason'), false;
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      const amountInKobo = Math.round(parseFloat(formData.amount) * 100);

      const handler = window.PaystackPop.setup({
        key: process.env.REACT_APP_PAYSTACK_PUBLIC_KEY || 'pk_test_YOUR_PUBLIC_KEY',
        email: formData.email,
        amount: amountInKobo,
        currency: 'NGN',
        ref: `ref_${Date.now()}`,
        metadata: {
          custom_fields: [
            { display_name: 'Name', variable_name: 'name', value: formData.name },
            { display_name: 'Matric Number', variable_name: 'matric', value: formData.matric },
            { display_name: 'Payment Reason', variable_name: 'reason', value: formData.reason }
          ]
        },
        callback: function(response) {
          onPaymentSuccess({
            reference: response.reference,
            ...formData,
            amount: formData.amount
          });
        },
        onClose: function() {
          setLoading(false);
          setError('Payment was cancelled');
        }
      });

      handler.openIframe();
    } catch (err) {
      setError('An error occurred. Please try again.');
      setLoading(false);
      console.error('Payment error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 pt-28 pb-20 px-6 flex justify-center object-cover relative overflow-hidden">
      
      {/* Background Orbs */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-emerald-600/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-20 right-20 w-72 h-72 bg-cyan-600/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-xl">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold font-serif text-white mb-3">Make a Payment</h1>
          <p className="text-gray-400">Securely pay your NUESA ACU dues via Paystack.</p>
        </div>

        <div className="bg-gray-800/80 backdrop-blur-xl border border-gray-700/50 p-8 md:p-10 rounded-3xl shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-bold text-gray-300 uppercase tracking-widest mb-2">Full Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  disabled={loading}
                  required
                  className="w-full bg-gray-900 border border-gray-700 text-white placeholder-gray-500 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-medium"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-bold text-gray-300 uppercase tracking-widest mb-2">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  disabled={loading}
                  required
                  className="w-full bg-gray-900 border border-gray-700 text-white placeholder-gray-500 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-medium"
                />
              </div>

              <div>
                <label htmlFor="matric" className="block text-sm font-bold text-gray-300 uppercase tracking-widest mb-2">Matric Number *</label>
                <input
                  type="text"
                  id="matric"
                  name="matric"
                  value={formData.matric}
                  onChange={handleChange}
                  placeholder="Enter your matric number"
                  disabled={loading}
                  required
                  className="w-full bg-gray-900 border border-gray-700 text-white placeholder-gray-500 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-medium uppercase"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-1">
                <label htmlFor="amount" className="block text-sm font-bold text-gray-300 uppercase tracking-widest mb-2">Amount (NGN) *</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500 font-bold">₦</span>
                  <input
                    type="number"
                    id="amount"
                    name="amount"
                    value={formData.amount}
                    readOnly
                    disabled
                    className="w-full bg-gray-900 border border-gray-700 text-emerald-400 font-bold placeholder-gray-500 rounded-xl px-4 py-3 pl-10 focus:outline-none opacity-80"
                  />
                </div>
              </div>

              <div className="md:col-span-1">
                <label htmlFor="reason" className="block text-sm font-bold text-gray-300 uppercase tracking-widest mb-2">Reason</label>
                <select
                  id="reason"
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  disabled={loading}
                  required
                  className="w-full bg-gray-900 border border-gray-700 text-white placeholder-gray-500 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-medium appearance-none"
                >
                  <option value="" disabled>Select payment type</option>
                  <option value="Departmental Dues">Departmental Dues</option>
                  <option value="Faculty Dues">Faculty Dues</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-2">
                <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                {error}
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-gray-900 font-extrabold text-lg tracking-widest uppercase py-4 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transition-all flex justify-center items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Processing...
                </>
              ) : (
                <>
                  Secure Checkout
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                </>
              )}
            </button>

            <div className="flex justify-center items-center gap-2 text-gray-500 text-xs font-bold uppercase tracking-widest mt-6">
              <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              Protected by Paystack
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PaymentForm;
