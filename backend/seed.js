const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.join(__dirname, 'payments.db');
const db = new sqlite3.Database(dbPath);

const text = fs.readFileSync(path.join(__dirname, 'extracted_users.txt'), 'utf8');

async function seed() {
  await new Promise((resolve, reject) => {
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        matric TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => err ? reject(err) : resolve());
  });

  const lines = text.split('\n');
  let users = [];
  let currentUser = { name: '', matric: '', email: '' };

  const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/i;
  // Match things like 25EG04002, Acu20230976, etc. Or 25EGO4011 (sometimes people type O instead of 0)
  const matricRegex = /([0-9]{2}[A-Z]{2}[O0-9]+|ACU[0-9]+)/i;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].replace(/\u200B/g, '').trim(); // clear invisible chars
    if (!line || line.length < 3) continue;

    let matched = false;
    
    // Check for email
    if (emailRegex.test(line)) {
      currentUser.email = line.match(emailRegex)[1].toLowerCase().trim();
      matched = true;
    }
    
    // Check for matric
    if (matricRegex.test(line)) {
      let m = line.match(matricRegex)[1].toUpperCase().trim();
      // fix accidental 'O' instead of '0' in matric
      m = m.replace(/O/g, '0');
      currentUser.matric = m;
      matched = true;
    }

    // Check for name
    if (line.toLowerCase().includes('name:')) {
      currentUser.name = line.split(/name\s*[:.-]*\s*/i)[1].trim();
      matched = true;
    } else if (/^\d+\.\s*[A-Za-z]/.test(line)) {
      // Like "1. ADEFILA SAMUEL"
      currentUser.name = line.replace(/^\d+\.\s*/, '').trim();
      matched = true;
    } else if (!matched && line.split(' ').length >= 2 && !currentUser.name) {
      // Possible fallback for name if it's just lying around without a clear prefix
      // assuming names don't have numbers
      if (!/\d/.test(line)) {
        currentUser.name = line;
      }
    }

    // If we have both email and matric, the user record is complete enough to save
    if (currentUser.email && currentUser.matric) {
      if (!currentUser.name) currentUser.name = 'Student ' + currentUser.matric;
      
      // Clean name up
      currentUser.name = currentUser.name.replace(/Matric.*$/i, '').trim();

      users.push({...currentUser});
      currentUser = { name: '', matric: '', email: '' }; // reset
    }
  }

  console.log(`Parsed ${users.length} users. Hashing dummy password and inserting...`);
  
  const dummyPasswordHash = await bcrypt.hash('password123', 10);

  let insertedCount = 0;
  let errorCount = 0;

  for (const user of users) {
    await new Promise((resolve) => {
      db.run(
        `INSERT INTO users (name, matric, email, password_hash) VALUES (?, ?, ?, ?)`,
        [user.name, user.matric, user.email, dummyPasswordHash],
        function (err) {
          if (err) {
            // Ignore unique constraint errors
            if (!err.message.includes('UNIQUE')) {
              console.error('Error inserting user:', err.message);
            }
            errorCount++;
          } else {
            insertedCount++;
          }
          resolve();
        }
      );
    });
  }

  console.log(`Done! Inserted: ${insertedCount}. Skipped/Errors: ${errorCount}`);
  
  // Create an explicit admin user to make sure we have a fallback just in case
  db.run(`INSERT OR IGNORE INTO users (name, matric, email, password_hash) VALUES ('Admin', 'ADMIN001', 'admin@nuesa.com', ?)`, [dummyPasswordHash]);

  db.close();
}

seed().catch(console.error);
