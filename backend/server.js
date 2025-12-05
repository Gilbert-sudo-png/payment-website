const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');
const cookieParser = require('cookie-parser');
const { 
  initializeDatabase, 
  savePayment, 
  getPaymentByReference, 
  getAllPayments,
  createUser,
  getUserByMatric,
  getUserById,
  getAllUsers,
  verifyPassword,
  createSession,
  getSession,
  deleteSession,
  getAdminByEmail,
  createAdminSession,
  getAdminSession,
  deleteAdminSession
} = require('./database');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Initialize database
initializeDatabase();

// Auth middleware
const requireAuth = async (req, res, next) => {
  try {
    const sessionId = req.cookies.session_id;
    
    if (!sessionId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    const session = await getSession(sessionId);
    
    if (!session) {
      return res.status(401).json({ error: 'Invalid session' });
    }
    
    req.user = {
      id: session.user_id,
      name: session.name,
      matric: session.matric,
      email: session.email
    };
    
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ error: 'Authentication error' });
  }
};

// Admin auth middleware
const requireAdminAuth = async (req, res, next) => {
  try {
    const sessionId = req.cookies.admin_session_id;
    
    if (!sessionId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    const session = await getAdminSession(sessionId);
    
    if (!session) {
      return res.status(401).json({ error: 'Invalid session' });
    }
    
    req.admin = {
      id: session.admin_id,
      name: session.name,
      email: session.email
    };
    
    next();
  } catch (error) {
    console.error('Admin auth middleware error:', error);
    res.status(500).json({ error: 'Authentication error' });
  }
};

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Verify payment endpoint
app.get('/api/verify-payment/:reference', async (req, res) => {
  try {
    const { reference } = req.params;

    if (!reference) {
      return res.status(400).json({ 
        error: 'Payment reference is required' 
      });
    }

    // Check if payment already exists in database
    const existingPayment = await getPaymentByReference(reference);
    if (existingPayment) {
      return res.json({
        success: true,
        message: 'Payment already verified',
        data: {
          reference: existingPayment.reference,
          amount: existingPayment.amount,
          currency: existingPayment.currency,
          status: existingPayment.status,
          name: existingPayment.name,
          email: existingPayment.email,
          reason: existingPayment.reason,
          matric: existingPayment.matric,
          transaction_date: existingPayment.created_at,
          paystack_response: JSON.parse(existingPayment.paystack_response)
        }
      });
    }

    // Verify payment with Paystack
    const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;
    
    if (!paystackSecretKey) {
      return res.status(500).json({ 
        error: 'Paystack secret key not configured' 
      });
    }

    const paystackResponse = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${paystackSecretKey}`
        }
      }
    );

    const { data } = paystackResponse.data;

    // Check if payment was successful
    if (data.status === 'success') {
      // Extract payment details
      const paymentData = {
        reference: data.reference,
        amount: (data.amount / 100).toFixed(2), // Convert from kobo to Naira
        currency: data.currency,
        status: data.status,
        name: data.metadata?.custom_fields?.find(f => f.variable_name === 'name')?.value || 'N/A',
        email: data.customer?.email || data.metadata?.email || 'N/A',
        matric: data.metadata?.custom_fields?.find(f => f.variable_name === 'matric')?.value || data.metadata?.matric || 'N/A',
        reason: data.metadata?.custom_fields?.find(f => f.variable_name === 'reason')?.value || 'N/A',
        transaction_date: data.paid_at || data.created_at,
        paystack_response: JSON.stringify(data)
      };

      // Save payment to database
      await savePayment(paymentData);

      return res.json({
        success: true,
        message: 'Payment verified successfully',
        data: {
          reference: paymentData.reference,
          amount: paymentData.amount,
          currency: paymentData.currency,
          status: paymentData.status,
          name: paymentData.name,
          email: paymentData.email,
          reason: paymentData.reason,
          matric: paymentData.matric,
          transaction_date: paymentData.transaction_date
        }
      });
    } else {
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed',
        data: {
          status: data.status,
          reference: data.reference
        }
      });
    }
  } catch (error) {
    console.error('Payment verification error:', error.response?.data || error.message);
    
    if (error.response?.status === 404) {
      return res.status(404).json({
        error: 'Payment reference not found',
        message: 'The payment reference does not exist in Paystack'
      });
    }

    return res.status(500).json({
      error: 'Failed to verify payment',
      message: error.message
    });
  }
});

// Auth endpoints
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, matric, email, password } = req.body;
    
    // Validate input
    if (!name || !matric || !email || !password) {
      return res.status(400).json({ 
        error: 'All fields are required' 
      });
    }
    
    if (password.length < 6) {
      return res.status(400).json({ 
        error: 'Password must be at least 6 characters long' 
      });
    }
    
    // Create user
    const user = await createUser({ name, matric, email, password });
    
    // Create session
    const sessionId = await createSession(user.id);
    
    // Set cookie
    res.cookie('session_id', sessionId, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });
    
    res.json({
      success: true,
      message: 'User created successfully',
      user: { id: user.id, name: user.name, matric: user.matric, email: user.email }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(400).json({
      error: error.message || 'Failed to create user'
    });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { matric, password } = req.body;
    
    if (!matric || !password) {
      return res.status(400).json({ 
        error: 'Matric number and password are required' 
      });
    }
    
    // Find user
    const user = await getUserByMatric(matric);
    
    if (!user) {
      return res.status(401).json({ 
        error: 'Invalid matric number or password' 
      });
    }
    
    // Verify password
    const isValidPassword = await verifyPassword(password, user.password_hash);
    
    if (!isValidPassword) {
      return res.status(401).json({ 
        error: 'Invalid matric number or password' 
      });
    }
    
    // Create session
    const sessionId = await createSession(user.id);
    
    // Set cookie
    res.cookie('session_id', sessionId, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });
    
    res.json({
      success: true,
      message: 'Login successful',
      user: { id: user.id, name: user.name, matric: user.matric, email: user.email }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Login failed'
    });
  }
});

app.post('/api/auth/logout', async (req, res) => {
  try {
    const sessionId = req.cookies.session_id;
    
    if (sessionId) {
      await deleteSession(sessionId);
    }
    
    res.clearCookie('session_id');
    
    res.json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      error: 'Logout failed'
    });
  }
});

app.get('/api/auth/me', requireAuth, (req, res) => {
  res.json({
    success: true,
    user: req.user
  });
});

// Get all payments endpoint (admin only)
app.get('/api/payments', async (req, res) => {
  try {
    const payments = await getAllPayments();
    res.json({
      success: true,
      count: payments.length,
      data: payments
    });
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({
      error: 'Failed to fetch payments',
      message: error.message
    });
  }
});

// Get all users endpoint (admin only)
app.get('/api/users', async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      error: 'Failed to fetch users',
      message: error.message
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});

