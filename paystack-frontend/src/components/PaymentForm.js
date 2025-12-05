import React, { useState } from 'react';
import './PaymentForm.css';

const PaymentForm = ({ onPaymentSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    matric: '', // Added matric number
    amount: '13500', // Make amount fixed at 13,500 NGN
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
    setError(''); // Clear error on input change
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Please enter your name');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Please enter your email');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!formData.matric.trim()) {
      setError('Please enter your matric number');
      return false;
    }
    if (!formData.amount || parseFloat(formData.amount) !== 13500) {
      setError('Amount must be 13,500 NGN');
      return false;
    }
    if (!formData.reason.trim()) {
      setError('Please enter a payment reason');
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
      // Convert amount to kobo (Paystack uses kobo as the smallest currency unit)
      const amountInKobo = Math.round(parseFloat(formData.amount) * 100);

      // Initialize Paystack payment
      const handler = window.PaystackPop.setup({
        key: process.env.REACT_APP_PAYSTACK_PUBLIC_KEY || 'pk_test_YOUR_PUBLIC_KEY', // Replace with your public key
        email: formData.email,
        amount: amountInKobo,
        currency: 'NGN',
        ref: `ref_${Date.now()}`, // Generate a unique reference
        metadata: {
          custom_fields: [
            {
              display_name: 'Name',
              variable_name: 'name',
              value: formData.name
            },
            {
              display_name: 'Matric Number',
              variable_name: 'matric',
              value: formData.matric
            },
            {
              display_name: 'Payment Reason',
              variable_name: 'reason',
              value: formData.reason
            }
          ]
        },
        callback: function(response) {
          // This callback is called when payment is successful
          // The reference is in response.reference
          onPaymentSuccess({
            reference: response.reference,
            ...formData,
            amount: formData.amount
          });
        },
        onClose: function() {
          // User closed the payment modal
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
    <div className="payment-form-container">
      <div className="payment-form-card">
        <h2>Make a Payment</h2>
        <p className="form-subtitle">Fill in your details to proceed with payment</p>
        
        <form onSubmit={handleSubmit} className="payment-form">
          <div className="form-group">
            <label htmlFor="name">Full Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="matric">Matric Number *</label>
            <input
              type="text"
              id="matric"
              name="matric"
              value={formData.matric}
              onChange={handleChange}
              placeholder="Enter your matric number"
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="amount">Amount (NGN) *</label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              readOnly
              disabled
            />
          </div>

          <div className="form-group">
            <label htmlFor="reason">Payment Reason *</label>
            <textarea
              id="reason"
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              placeholder="e.g., School fees, Tuition, Registration fee"
              rows="3"
              disabled={loading}
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button 
            type="submit" 
            className="pay-button"
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Pay Now'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentForm;

