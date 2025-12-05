const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

// Database file path
const dbPath = path.join(__dirname, 'payments.db');

// Create database connection
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database.');
  }
});

// Initialize database tables
const initializeDatabase = () => {
  return new Promise((resolve, reject) => {
    // Create payments table
    db.run(`
      CREATE TABLE IF NOT EXISTS payments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        reference TEXT UNIQUE NOT NULL,
        amount REAL NOT NULL,
        currency TEXT NOT NULL,
        status TEXT NOT NULL,
        name TEXT,
        email TEXT,
        matric TEXT,
        reason TEXT,
        transaction_date TEXT,
        paystack_response TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => {
      if (err) {
        console.error('Error creating payments table:', err.message);
        reject(err);
        return;
      }
      console.log('Payments table ready.');
    });

    // Create users table
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        matric TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => {
      if (err) {
        console.error('Error creating users table:', err.message);
        reject(err);
        return;
      }
      console.log('Users table ready.');
    });

    // Create sessions table
    db.run(`
      CREATE TABLE IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY,
        user_id INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
      )
    `, (err) => {
      if (err) {
        console.error('Error creating sessions table:', err.message);
        reject(err);
        return;
      }
      console.log('Sessions table ready.');
    });

    // Create admins table
    db.run(`
      CREATE TABLE IF NOT EXISTS admins (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        name TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => {
      if (err) {
        console.error('Error creating admins table:', err.message);
        reject(err);
        return;
      }
      console.log('Admins table ready.');
    });

    // Create admin_sessions table
    db.run(`
      CREATE TABLE IF NOT EXISTS admin_sessions (
        id TEXT PRIMARY KEY,
        admin_id INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (admin_id) REFERENCES admins (id)
      )
    `, (err) => {
      if (err) {
        console.error('Error creating admin_sessions table:', err.message);
        reject(err);
        return;
      }
      console.log('Admin sessions table ready.');
      resolve();
    });

    // Add matric column to payments table if it doesn't exist (for backward compatibility)
    db.run(`
      ALTER TABLE payments ADD COLUMN matric TEXT
    `, (err) => {
      // Ignore error if column already exists
      if (err && !err.message.includes('duplicate column')) {
        console.error('Error adding matric column:', err.message);
      }
    });
  });
};

// Payment functions
const savePayment = (paymentData) => {
  return new Promise((resolve, reject) => {
    const {
      reference,
      amount,
      currency,
      status,
      name,
      email,
      matric,
      reason,
      transaction_date,
      paystack_response
    } = paymentData;

    db.run(
      `INSERT INTO payments (
        reference, amount, currency, status, name, email, matric, reason,
        transaction_date, paystack_response
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [reference, amount, currency, status, name, email, matric, reason, transaction_date, paystack_response],
      function(err) {
        if (err) {
          console.error('Error saving payment:', err.message);
          reject(err);
        } else {
          console.log('Payment saved with ID:', this.lastID);
          resolve({ id: this.lastID, ...paymentData });
        }
      }
    );
  });
};

const getPaymentByReference = (reference) => {
  return new Promise((resolve, reject) => {
    db.get(
      'SELECT * FROM payments WHERE reference = ?',
      [reference],
      (err, row) => {
        if (err) {
          console.error('Error fetching payment:', err.message);
          reject(err);
        } else {
          resolve(row);
        }
      }
    );
  });
};

const getAllPayments = () => {
  return new Promise((resolve, reject) => {
    db.all(
      'SELECT * FROM payments ORDER BY created_at DESC',
      [],
      (err, rows) => {
        if (err) {
          console.error('Error fetching payments:', err.message);
          reject(err);
        } else {
          resolve(rows);
        }
      }
    );
  });
};

// User functions
const createUser = async (userData) => {
  const { name, matric, email, password } = userData;
  
  return new Promise(async (resolve, reject) => {
    try {
      // Hash password
      const saltRounds = 10;
      const password_hash = await bcrypt.hash(password, saltRounds);
      
      db.run(
        `INSERT INTO users (name, matric, email, password_hash) VALUES (?, ?, ?, ?)`,
        [name, matric, email, password_hash],
        function(err) {
          if (err) {
            console.error('Error creating user:', err.message);
            if (err.message.includes('UNIQUE constraint failed')) {
              reject(new Error('Matric number or email already exists'));
            } else {
              reject(err);
            }
          } else {
            console.log('User created with ID:', this.lastID);
            resolve({ id: this.lastID, name, matric, email });
          }
        }
      );
    } catch (error) {
      reject(error);
    }
  });
};

const getUserByMatric = (matric) => {
  return new Promise((resolve, reject) => {
    db.get(
      'SELECT * FROM users WHERE matric = ?',
      [matric],
      (err, row) => {
        if (err) {
          console.error('Error fetching user by matric:', err.message);
          reject(err);
        } else {
          resolve(row);
        }
      }
    );
  });
};

const getUserById = (id) => {
  return new Promise((resolve, reject) => {
    db.get(
      'SELECT id, name, matric, email, created_at FROM users WHERE id = ?',
      [id],
      (err, row) => {
        if (err) {
          console.error('Error fetching user by ID:', err.message);
          reject(err);
        } else {
          resolve(row);
        }
      }
    );
  });
};

const getAllUsers = () => {
  return new Promise((resolve, reject) => {
    db.all(
      'SELECT id, name, matric, email, created_at FROM users ORDER BY created_at DESC',
      [],
      (err, rows) => {
        if (err) {
          console.error('Error fetching users:', err.message);
          reject(err);
        } else {
          resolve(rows);
        }
      }
    );
  });
};

const verifyPassword = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

// Session functions
const createSession = (userId) => {
  return new Promise((resolve, reject) => {
    const sessionId = uuidv4();
    
    db.run(
      'INSERT INTO sessions (id, user_id) VALUES (?, ?)',
      [sessionId, userId],
      function(err) {
        if (err) {
          console.error('Error creating session:', err.message);
          reject(err);
        } else {
          resolve(sessionId);
        }
      }
    );
  });
};

const getSession = (sessionId) => {
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT s.*, u.id as user_id, u.name, u.matric, u.email 
       FROM sessions s 
       JOIN users u ON s.user_id = u.id 
       WHERE s.id = ?`,
      [sessionId],
      (err, row) => {
        if (err) {
          console.error('Error fetching session:', err.message);
          reject(err);
        } else {
          resolve(row);
        }
      }
    );
  });
};

const deleteSession = (sessionId) => {
  return new Promise((resolve, reject) => {
    db.run(
      'DELETE FROM sessions WHERE id = ?',
      [sessionId],
      function(err) {
        if (err) {
          console.error('Error deleting session:', err.message);
          reject(err);
        } else {
          resolve(this.changes > 0);
        }
      }
    );
  });
};

// Clean up old sessions (optional - call periodically)
const cleanupOldSessions = (daysOld = 30) => {
  return new Promise((resolve, reject) => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);
    
    db.run(
      'DELETE FROM sessions WHERE created_at < ?',
      [cutoffDate.toISOString()],
      function(err) {
        if (err) {
          console.error('Error cleaning up sessions:', err.message);
          reject(err);
        } else {
          console.log(`Cleaned up ${this.changes} old sessions`);
          resolve(this.changes);
        }
      }
    );
  });
};

// Admin functions
const getAdminByEmail = (email) => {
  return new Promise((resolve, reject) => {
    db.get(
      'SELECT * FROM admins WHERE email = ?',
      [email],
      (err, row) => {
        if (err) {
          console.error('Error fetching admin by email:', err.message);
          reject(err);
        } else {
          resolve(row);
        }
      }
    );
  });
};

const createAdminSession = (adminId) => {
  return new Promise((resolve, reject) => {
    const sessionId = uuidv4();
    
    db.run(
      'INSERT INTO admin_sessions (id, admin_id) VALUES (?, ?)',
      [sessionId, adminId],
      function(err) {
        if (err) {
          console.error('Error creating admin session:', err.message);
          reject(err);
        } else {
          resolve(sessionId);
        }
      }
    );
  });
};

const getAdminSession = (sessionId) => {
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT s.*, a.id as admin_id, a.name, a.email 
       FROM admin_sessions s 
       JOIN admins a ON s.admin_id = a.id 
       WHERE s.id = ?`,
      [sessionId],
      (err, row) => {
        if (err) {
          console.error('Error fetching admin session:', err.message);
          reject(err);
        } else {
          resolve(row);
        }
      }
    );
  });
};

const deleteAdminSession = (sessionId) => {
  return new Promise((resolve, reject) => {
    db.run(
      'DELETE FROM admin_sessions WHERE id = ?',
      [sessionId],
      function(err) {
        if (err) {
          console.error('Error deleting admin session:', err.message);
          reject(err);
        } else {
          resolve(this.changes > 0);
        }
      }
    );
  });
};

module.exports = {
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
  cleanupOldSessions,
  getAdminByEmail,
  createAdminSession,
  getAdminSession,
  deleteAdminSession
};
