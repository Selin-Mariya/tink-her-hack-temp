const { Pool } = require('pg');
const dns = require('dns').promises;
const childProcess = require('child_process');
require('dotenv').config();

// Build connection parameters from env
const USER = process.env.DB_USER || 'postgres';
const PASSWORD = process.env.DB_PASSWORD || '';
const HOSTNAME = process.env.DB_HOST || 'localhost';
const PORT = process.env.DB_PORT || 5432;
const DATABASE = process.env.DB_NAME || 'postgres';

async function resolveHost(host) {
  // Try IPv4 first
  try {
    const v4 = await dns.resolve4(host);
    if (v4 && v4.length) return v4[0];
  } catch (e) {}

  // Try IPv6 next
  try {
    const v6 = await dns.resolve6(host);
    if (v6 && v6.length) return `[${v6[0]}]`;
  } catch (e) {}

  // As a last resort, fall back to using the hostname itself
  return host;
}

async function makePool() {
  const resolvedHost = await resolveHost(HOSTNAME);
  const encodedPassword = encodeURIComponent(PASSWORD);
  const connectionString = `postgresql://${USER}:${encodedPassword}@${resolvedHost}:${PORT}/${DATABASE}`;

  const pool = new Pool({
    connectionString,
    max: 10,
    ssl: { rejectUnauthorized: false }
  });

  // Test a simple query to fail fast if connection invalid
  try {
    await pool.query('SELECT 1');
  } catch (err) {
    // don't crash module load; surface error when used
    console.error('Postgres pool test query failed:', err && err.code ? err.code : err);
  }

  return pool;
}

const poolPromise = makePool();

// Export a lightweight wrapper that matches `mysql2` pool interface usage
module.exports = {
  query: (...args) => poolPromise.then(pool => pool.query(...args)),
  connect: () => poolPromise.then(pool => pool.connect()),
  end: () => poolPromise.then(pool => pool.end())
};
