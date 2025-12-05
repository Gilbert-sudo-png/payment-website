import React, { useEffect, useState } from 'react';
import './SuccessPage.css';

const SuccessPage = ({ paymentData, onBackToPayment }) => {
  const [verificationStatus, setVerificationStatus] = useState('verifying');
  const [verifiedData, setVerifiedData] = useState(null);

  useEffect(() => {
    // Verify payment with backend
    if (paymentData?.reference) {
      verifyPayment(paymentData.reference);
    }
  }, [paymentData]);

  const verifyPayment = async (reference) => {
    try {
      // Call your backend API to verify the payment
      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
      const response = await fetch(`${backendUrl}/api/verify-payment/${reference}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setVerifiedData(data);
        setVerificationStatus('verified');
      } else {
        setVerificationStatus('error');
      }
    } catch (error) {
      console.error('Verification error:', error);
      setVerificationStatus('error');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="success-page-container">
      <div className="success-card">
        {verificationStatus === 'verifying' && (
          <>
            <div className="success-icon verifying">
              <div className="spinner"></div>
            </div>
            <h2>Verifying Payment...</h2>
            <p>Please wait while we verify your payment.</p>
          </>
        )}

        {verificationStatus === 'verified' && (
          <>
            <div className="success-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <h2>Payment Successful!</h2>
            <p className="success-message">Your payment has been processed successfully.</p>

            <div className="receipt">
              <h3>Payment Receipt</h3>
              <div className="receipt-details">
                <div className="receipt-row">
                  <span className="receipt-label">Reference Number:</span>
                  <span className="receipt-value">{paymentData?.reference || 'N/A'}</span>
                </div>
                <div className="receipt-row">
                  <span className="receipt-label">Name:</span>
                  <span className="receipt-value">{paymentData?.name || 'N/A'}</span>
                </div>
                <div className="receipt-row">
                  <span className="receipt-label">Email:</span>
                  <span className="receipt-value">{paymentData?.email || 'N/A'}</span>
                </div>
                <div className="receipt-row">
                  <span className="receipt-label">Amount:</span>
                  <span className="receipt-value">₦{parseFloat(paymentData?.amount || 0).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div className="receipt-row">
                  <span className="receipt-label">Payment Reason:</span>
                  <span className="receipt-value">{paymentData?.reason || 'N/A'}</span>
                </div>
                {verifiedData?.transaction_date && (
                  <div className="receipt-row">
                    <span className="receipt-label">Date:</span>
                    <span className="receipt-value">{formatDate(verifiedData.transaction_date)}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="success-actions">
              <button onClick={onBackToPayment} className="back-button">
                Make Another Payment
              </button>
              <button 
                onClick={() => window.print()} 
                className="print-button"
              >
                Print Receipt
              </button>
            </div>
          </>
        )}

        {verificationStatus === 'error' && (
          <>
            <div className="success-icon error">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v4M12 16h.01" />
              </svg>
            </div>
            <h2>Verification Error</h2>
            <p className="error-message">
              We couldn't verify your payment automatically. Please contact support with your reference number: <strong>{paymentData?.reference}</strong>
            </p>
            <button onClick={onBackToPayment} className="back-button">
              Back to Payment
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default SuccessPage;

