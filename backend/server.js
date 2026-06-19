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
  getAdminSession,
  deleteAdminSession,
  getAdminByEmail,
  createAdminSession,
  setVotingCode,
  verifyVotingCode,
  castVote,
  getVotingResults,
  getVoterCount,
  getSystemSetting,
  updateSystemSetting
} = require('./database');
const nodemailer = require('nodemailer');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:5000',
  'https://nuesaacu.com',
  'http://nuesaacu.com',
  'https://www.nuesaacu.com',
  'http://www.nuesaacu.com',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
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
    const isProd = process.env.NODE_ENV === 'production';
    res.cookie('session_id', sessionId, {
      httpOnly: true,
      sameSite: isProd ? 'none' : 'lax',
      secure: isProd,
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
    const rawMatric = req.body?.matric;
    const rawEmail = req.body?.email;
    const matric =
      typeof rawMatric === 'string'
        ? rawMatric.trim().toUpperCase().replace(/O/g, '0')
        : '';
    const email =
      typeof rawEmail === 'string' ? rawEmail.trim() : '';
    
    if (!matric || !email) {
      return res.status(400).json({ 
        error: 'Matric number and email are required' 
      });
    }
    
    // Find user
    const user = await getUserByMatric(matric);
    
    if (!user || user.email.toLowerCase() !== email.toLowerCase()) {
      return res.status(401).json({ 
        error: 'Invalid matric number or email address. User not found in database.' 
      });
    }
    
    // Create session
    const sessionId = await createSession(user.id);
    
    // Set cookie
    const isProd = process.env.NODE_ENV === 'production';
    res.cookie('session_id', sessionId, {
      httpOnly: true,
      sameSite: isProd ? 'none' : 'lax',
      secure: isProd,
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
    
    const isProd = process.env.NODE_ENV === 'production';
    res.clearCookie('session_id', {
      httpOnly: true,
      sameSite: isProd ? 'none' : 'lax',
      secure: isProd
    });
    
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

app.post('/api/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const admin = await getAdminByEmail(email.trim().toLowerCase());
    if (!admin) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const validPassword = await verifyPassword(password, admin.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const sessionId = await createAdminSession(admin.id);
    const isProd = process.env.NODE_ENV === 'production';
    res.cookie('admin_session_id', sessionId, {
      httpOnly: true,
      sameSite: isProd ? 'none' : 'lax',
      secure: isProd,
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    res.json({
      success: true,
      message: 'Admin login successful',
      admin: { id: admin.id, name: admin.name, email: admin.email }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ error: 'Admin login failed' });
  }
});

// Get all payments endpoint (admin only)
app.get('/api/payments', requireAdminAuth, async (req, res) => {
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
app.get('/api/users', requireAdminAuth, async (req, res) => {
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

// Add new user endpoint (admin only)
app.post('/api/admin/users', requireAdminAuth, async (req, res) => {
  try {
    const { name, matric, email } = req.body;
    
    if (!name || !matric || !email) {
      return res.status(400).json({ 
        error: 'Name, matric, and email are required' 
      });
    }
    
    // Create user with dummy password since auth is email/matric only
    const user = await createUser({ name, matric, email, password: 'password123' });
    
    res.json({
      success: true,
      message: 'Student added successfully',
      data: user
    });
  } catch (error) {
    console.error('Error adding user:', error);
    res.status(400).json({
      error: error.message || 'Failed to add student. Ensure matric or email is unique.'
    });
  }
});

// Email Transporter Config
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// =============== VOTING API ===============

// Check voting status
app.get('/api/vote/status', requireAuth, async (req, res) => {
  try {
    const user = await getUserById(req.user.id);
    const resultsReleasedStr = await getSystemSetting('results_released') || 'false';
    const resultsReleased = resultsReleasedStr === 'true';
    
    // Check if user has voted directly from the query
    const dbUser = await new Promise((resolve) => {
       const sqlite3 = require('sqlite3').verbose();
       const db = new sqlite3.Database(require('path').join(__dirname, 'payments.db'));
       db.get('SELECT has_voted FROM users WHERE id = ?', [req.user.id], (err, row) => resolve(row));
    });

    let results = [];
    if (resultsReleased) {
      results = await getVotingResults();
    }

    res.json({
      success: true,
      has_voted: dbUser.has_voted === 1,
      results_released: resultsReleased,
      results
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch voting status: ' + (error.message || error) });
  }
});

// Generate and email code
app.post('/api/vote/generate-code', requireAuth, async (req, res) => {
  try {
    // Generate 6 digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Save to db
    await setVotingCode(req.user.id, code);
    
    // Email the user
    // NOTE: To avoid crashes if email isnt setup, we catch email errors
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn("Email credentials not supplied. Code generated but not sent! Code:", code);
       // For testing fallback, return success but warn.
       return res.json({ success: true, message: 'Code generated. Check server console for code since email auth is missing.' });
    }

    const mailOptions = {
      from: `NUESA ACU Electoral Committee <${process.env.EMAIL_USER}>`,
      to: req.user.email,
      subject: 'Your Secure Voting Authorization Code',
      html: `
        <div style="font-family: sans-serif; max-width: 640px; margin: 0 auto; padding: 24px; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 12px;">
          <h2 style="color: #10b981; margin: 0 0 12px;">NUESA ACU Voting Authorization</h2>
          <p style="margin: 0 0 8px;">Hello ${req.user.name},</p>
          <p style="margin: 0 0 16px;">You requested to cast your vote. This is your one-time secure voting code.</p>
          <div style="background: #111827; color: #34d399; font-size: 32px; font-weight: 700; letter-spacing: 6px; text-align: center; padding: 20px; border-radius: 10px; margin: 16px 0;">
            ${code}
          </div>
          <p style="margin: 0;"><em>Code expires in 15 minutes. Do not share this code with anybody.</em></p>
        </div>
      `
    };

    try {
      await transporter.sendMail(mailOptions);
      res.json({ success: true, message: 'Code sent to your email successfully.' });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      console.warn('--- TEST ENVIRONMENT FALLBACK ---');
      console.warn('Email authorization code generated but failed to send.');
      console.warn('Voter Name:', req.user.name);
      console.warn('Voter Email:', req.user.email);
      console.warn('Generated OTP Code:', code);
      console.warn('--------------------------------');
      res.json({ 
        success: true, 
        message: 'OTP generated. Check server console/logs for code since email delivery failed.' 
      });
    }
  } catch (error) {
    console.error('Error generating code:', error);
    res.status(500).json({ error: 'Failed to generate code: ' + (error.message || error) });
  }
});

// Verify OTP Code
app.post('/api/vote/verify-otp', requireAuth, async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) {
      return res.status(400).json({ error: 'Code is required.' });
    }

    const verification = await verifyVotingCode(req.user.id, code.trim());
    if (!verification.valid) {
      return res.status(400).json({ error: verification.message });
    }

    res.json({ success: true, message: 'OTP code verified successfully.' });
  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({ error: 'Failed to verify OTP: ' + (error.message || error) });
  }
});

// Submit Vote
app.post('/api/vote/submit', requireAuth, async (req, res) => {
  try {
    const { candidateIds } = req.body;
    
    if (!candidateIds || !Array.isArray(candidateIds) || candidateIds.length === 0) {
      return res.status(400).json({ error: 'Candidate IDs array is required.' });
    }

    // Cast vote
    await castVote(req.user.id, candidateIds);

    res.json({ success: true, message: 'Your votes have been successfully cast!' });
  } catch (error) {
    console.error('Voting error:', error);
    res.status(500).json({ error: error.message || 'Error occurred while saving votes.' });
  }
});

// Admin Endpoint: Get Election Results
app.get('/api/admin/votes', requireAdminAuth, async (req, res) => {
  try {
    const results = await getVotingResults();
    const releasedStr = await getSystemSetting('results_released') || 'false';
    const voterCount = await getVoterCount();

    res.json({
      success: true,
      results_released: releasedStr === 'true',
      total_votes: voterCount,
      results
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch voting results.' });
  }
});

// Admin Endpoint: Toggle Result Visibility
app.post('/api/admin/votes/release', requireAdminAuth, async (req, res) => {
  try {
    const { released } = req.body;
    await updateSystemSetting('results_released', released ? 'true' : 'false');
    
    res.json({
      success: true,
      message: `Results are now ${released ? 'PUBLIC' : 'HIDDEN'}`
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update system setting.' });
  }
});

// Admin Endpoint: Reseed Voters from new_voters.json (Admin only)
app.post('/api/admin/reseed', requireAdminAuth, async (req, res) => {
  try {
    const fs = require('fs');
    const path = require('path');
    const sqlite3 = require('sqlite3').verbose();
    const bcrypt = require('bcryptjs');

    const jsonPath = path.join(__dirname, 'new_voters.json');
    if (!fs.existsSync(jsonPath)) {
      return res.status(400).json({ error: 'new_voters.json file not found on server.' });
    }

    const users = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    console.log(`Manual reseed: Loaded ${users.length} users from new_voters.json`);

    const db = new sqlite3.Database(path.join(__dirname, 'payments.db'));
    const run = (sql, params = []) =>
      new Promise((res, rej) =>
        db.run(sql, params, function (err) { err ? rej(err) : res(this); })
      );

    // 1. Clear old voter records (keeping admin accounts)
    console.log('Manual reseed: Removing old voter records...');
    await run(`DELETE FROM sessions`);
    await run(`DELETE FROM votes`);
    await run(`DELETE FROM users`);

    // 2. Hash default password
    const DEFAULT_PASSWORD = 'password123';
    const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, 10);

    // 3. Insert new users
    let inserted = 0;
    let skipped = 0;
    
    await run('BEGIN TRANSACTION');
    try {
      for (const u of users) {
        try {
          await run(
            `INSERT INTO users (name, matric, email, password_hash, has_voted) VALUES (?, ?, ?, ?, 0)`,
            [u.name, u.matric, u.email, passwordHash]
          );
          inserted++;
        } catch (err) {
          if (err.message.includes('UNIQUE')) {
            skipped++;
          } else {
            console.error(`  Error inserting ${u.name}:`, err.message);
            skipped++;
          }
        }
      }
      await run('COMMIT');
    } catch (txError) {
      await run('ROLLBACK');
      throw txError;
    }

    db.close();

    res.json({
      success: true,
      message: `Database successfully reseeded! Inserted: ${inserted}, Skipped: ${skipped}.`
    });
  } catch (error) {
    console.error('Manual reseed error:', error);
    res.status(500).json({ error: 'Reseed failed: ' + error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});

