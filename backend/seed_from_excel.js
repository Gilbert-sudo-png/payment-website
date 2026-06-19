/**
 * seed_from_excel.js
 * Reads new_voters.json (generated from the Google Form Excel by Python),
 * clears old voter records, and inserts all new users into the SQLite DB.
 *
 * Run with: node seed_from_excel.js
 */

const path    = require('path');
const fs      = require('fs');
const sqlite3 = require('sqlite3').verbose();
const bcrypt  = require('bcryptjs');

const JSON_PATH = path.join(__dirname, 'new_voters.json');
const DB_PATH   = path.join(__dirname, 'payments.db');

async function seed() {
  // ── 1. Read JSON ──────────────────────────────────────────────────────────
  if (!fs.existsSync(JSON_PATH)) {
    console.error('ERROR: new_voters.json not found. Run the Python export first.');
    process.exit(1);
  }

  const users = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));
  console.log(`Loaded ${users.length} users from new_voters.json`);

  // ── 2. Open DB ────────────────────────────────────────────────────────────
  const db = new sqlite3.Database(DB_PATH);
  const run = (sql, params = []) =>
    new Promise((res, rej) =>
      db.run(sql, params, function (err) { err ? rej(err) : res(this); })
    );

  // ── 3. Ensure tables exist ────────────────────────────────────────────────
  await run(`
    CREATE TABLE IF NOT EXISTS users (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      name          TEXT    NOT NULL,
      matric        TEXT    UNIQUE NOT NULL,
      email         TEXT    UNIQUE NOT NULL,
      password_hash TEXT    NOT NULL,
      created_at    DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // ── 4. Clear old voter data ───────────────────────────────────────────────
  console.log('Removing old voter records (keeping admin accounts)...');
  await run(`DELETE FROM users WHERE matric NOT LIKE 'ADMIN%'`);
  await run(`DELETE FROM votes`).catch(() => {});
  await run(`DELETE FROM voting_sessions`).catch(() => {});
  console.log('Old records cleared.');

  // ── 5. Hash a default password once ──────────────────────────────────────
  const DEFAULT_PASSWORD = 'password123';
  const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, 10);

  // ── 6. Insert new users ───────────────────────────────────────────────────
  let inserted = 0, skipped = 0;

  for (const u of users) {
    try {
      await run(
        `INSERT INTO users (name, matric, email, password_hash) VALUES (?, ?, ?, ?)`,
        [u.name, u.matric, u.email, passwordHash]
      );
      inserted++;
    } catch (err) {
      if (err.message.includes('UNIQUE')) {
        skipped++;
        console.warn(`  Duplicate skipped: ${u.matric} / ${u.email}`);
      } else {
        console.error(`  Error inserting ${u.name}:`, err.message);
        skipped++;
      }
    }
  }

  console.log('\n✅ Seeding complete!');
  console.log(`   Inserted : ${inserted}`);
  console.log(`   Skipped  : ${skipped}`);
  console.log(`   Default login password: "${DEFAULT_PASSWORD}"`);
  console.log('   Users log in with their EMAIL + password123');

  db.close();
}

seed().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
