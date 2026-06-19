const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const db = new sqlite3.Database(path.join(__dirname, 'payments.db'));

const setVotingCode = (userId, code) => {
  return new Promise((resolve, reject) => {
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

async function test() {
  try {
    console.log('Testing setVotingCode...');
    const result = await setVotingCode(1, '123456');
    console.log('Result:', result);
    
    // Now let's test nodemailer configuration
    const nodemailer = require('nodemailer');
    const dotenv = require('dotenv');
    dotenv.config();
    
    console.log('EMAIL_USER:', process.env.EMAIL_USER);
    console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? 'SET (hidden)' : 'NOT SET');
    
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
    
    console.log('Transporter created successfully.');
  } catch (error) {
    console.error('Test failed with error:', error);
  } finally {
    db.close();
  }
}

test();
