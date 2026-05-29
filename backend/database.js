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

// Auto-seed database if empty
const autoSeedIfEmpty = () => {
  return new Promise((resolve) => {
    db.get('SELECT COUNT(*) as count FROM users', async (err, row) => {
      if (err) {
        console.error('Error checking user count:', err.message);
        return resolve();
      }
      if (row && row.count > 0) {
        console.log(`Database already has ${row.count} users. Skipping seeding.`);
        return resolve();
      }
      
      console.log('Database users table is empty. Starting auto-seeding...');
      try {
        const fs = require('fs');
        const txtPath = path.join(__dirname, 'extracted_users.txt');
        if (!fs.existsSync(txtPath)) {
          console.warn('extracted_users.txt not found. Skipping seeding.');
          return resolve();
        }
        
        const text = fs.readFileSync(txtPath, 'utf8');
        const lines = text.split('\n');
        let users = [];
        let currentUser = { name: '', matric: '', email: '' };

        const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/i;
        const matricRegex = /([0-9]{2}[A-Z]{2}[O0-9]+|ACU[0-9]+)/i;

        for (let i = 0; i < lines.length; i++) {
          const line = lines[i].replace(/\u200B/g, '').trim();
          if (!line || line.length < 3) continue;

          let matched = false;
          if (emailRegex.test(line)) {
            currentUser.email = line.match(emailRegex)[1].toLowerCase().trim();
            matched = true;
          }
          if (matricRegex.test(line)) {
            let m = line.match(matricRegex)[1].toUpperCase().trim();
            m = m.replace(/O/g, '0');
            currentUser.matric = m;
            matched = true;
          }
          if (line.toLowerCase().includes('name:')) {
            currentUser.name = line.split(/name\s*[:.-]*\s*/i)[1].trim();
            matched = true;
          } else if (/^\d+\.\s*[A-Za-z]/.test(line)) {
            currentUser.name = line.replace(/^\d+\.\s*/, '').trim();
            matched = true;
          } else if (!matched && line.split(' ').length >= 2 && !currentUser.name) {
            if (!/\d/.test(line)) {
              currentUser.name = line;
            }
          }

          if (currentUser.email && currentUser.matric) {
            if (!currentUser.name) currentUser.name = 'Student ' + currentUser.matric;
            currentUser.name = currentUser.name.replace(/Matric.*$/i, '').trim();
            users.push({...currentUser});
            currentUser = { name: '', matric: '', email: '' };
          }
        }

        console.log(`Parsed ${users.length} users. Hashing dummy password...`);
        const dummyPasswordHash = await bcrypt.hash('password123', 10);

        let insertedCount = 0;
        let errorCount = 0;

        db.serialize(() => {
          db.run('BEGIN TRANSACTION');
          const stmt = db.prepare('INSERT OR IGNORE INTO users (name, matric, email, password_hash) VALUES (?, ?, ?, ?)');
          for (const user of users) {
            stmt.run([user.name, user.matric, user.email, dummyPasswordHash], (err) => {
              if (err) errorCount++;
              else insertedCount++;
            });
          }
          // Also insert Admin
          stmt.run(['Admin', 'ADMIN001', 'admin@nuesa.com', dummyPasswordHash]);
          
          stmt.finalize();
          db.run('COMMIT', (err) => {
            if (err) {
              console.error('Error committing seed transaction:', err.message);
            } else {
              console.log(`Auto-seeding complete. Inserted ${insertedCount} users successfully.`);
            }
            resolve();
          });
        });
      } catch (error) {
        console.error('Error during auto-seeding:', error);
        resolve();
      }
    });
  });
};

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
      autoSeedIfEmpty()
        .then(() => resolve())
        .catch(() => resolve());
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

    // Voting System Additions
    db.run(`ALTER TABLE users ADD COLUMN has_voted INTEGER DEFAULT 0`, (err) => {
      if (err && !err.message.includes('duplicate column')) console.error('Error adding has_voted:', err.message);
    });
    db.run(`ALTER TABLE users ADD COLUMN voting_code TEXT`, (err) => {
      if (err && !err.message.includes('duplicate column')) console.error('Error adding voting_code:', err.message);
    });
    db.run(`ALTER TABLE users ADD COLUMN code_expires_at DATETIME`, (err) => {
      if (err && !err.message.includes('duplicate column')) console.error('Error adding code_expires_at:', err.message);
    });

    db.run(`
      CREATE TABLE IF NOT EXISTS votes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER UNIQUE NOT NULL,
        candidate_id INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
      )
    `, (err) => {
      if (err) console.error('Error creating votes table:', err.message);
      else console.log('Votes table ready.');
    });

    db.run(`
      CREATE TABLE IF NOT EXISTS system_settings (
        setting_key TEXT PRIMARY KEY,
        setting_value TEXT NOT NULL
      )
    `, (err) => {
      if (err) console.error('Error creating settings table:', err.message);
      else {
        // Initialize default setting
        db.run(`INSERT OR IGNORE INTO system_settings (setting_key, setting_value) VALUES ('results_released', 'false')`);
        console.log('System settings table ready.');
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

// Voting functions
const setVotingCode = (userId, code) => {
  return new Promise((resolve, reject) => {
    // Code expires in 15 minutes
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();
    db.run(
      'UPDATE users SET voting_code = ?, code_expires_at = ? WHERE id = ?',
      [code, expiresAt, userId],
      function(err) {
        if (err) reject(err);
        else resolve(true);
      }
    );
  });
};

const verifyVotingCode = (userId, code) => {
  return new Promise((resolve, reject) => {
    db.get(
      'SELECT voting_code, code_expires_at, has_voted FROM users WHERE id = ?',
      [userId],
      (err, user) => {
        if (err) return reject(err);
        if (!user) return resolve({ valid: false, message: 'User not found' });
        if (user.has_voted) return resolve({ valid: false, message: 'User has already voted' });
        
        if (user.voting_code !== code) {
          return resolve({ valid: false, message: 'Invalid code' });
        }
        
        if (new Date() > new Date(user.code_expires_at)) {
          return resolve({ valid: false, message: 'Code has expired' });
        }
        
        resolve({ valid: true });
      }
    );
  });
};

const castVote = (userId, candidateId) => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run('BEGIN TRANSACTION');
      db.run(
        'INSERT INTO votes (user_id, candidate_id) VALUES (?, ?)',
        [userId, candidateId],
        (err) => {
          if (err) {
            db.run('ROLLBACK');
            if (err.message.includes('UNIQUE constraint failed')) {
              return reject(new Error('User has already voted'));
            }
            return reject(err);
          }
          
          db.run(
            'UPDATE users SET has_voted = 1, voting_code = NULL, code_expires_at = NULL WHERE id = ?',
            [userId],
            (err) => {
              if (err) {
                db.run('ROLLBACK');
                return reject(err);
              }
              db.run('COMMIT');
              resolve(true);
            }
          );
        }
      );
    });
  });
};

const getVotingResults = () => {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT candidate_id, COUNT(*) as vote_count 
       FROM votes 
       GROUP BY candidate_id`,
      [],
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      }
    );
  });
};

const getSystemSetting = (key) => {
  return new Promise((resolve, reject) => {
    db.get(
      'SELECT setting_value FROM system_settings WHERE setting_key = ?',
      [key],
      (err, row) => {
        if (err) reject(err);
        else resolve(row ? row.setting_value : null);
      }
    );
  });
};

const updateSystemSetting = (key, value) => {
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT OR REPLACE INTO system_settings (setting_key, setting_value) VALUES (?, ?)',
      [key, value],
      function(err) {
        if (err) reject(err);
        else resolve(true);
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
  deleteAdminSession,
  setVotingCode,
  verifyVotingCode,
  castVote,
  getVotingResults,
  getSystemSetting,
  updateSystemSetting
};
