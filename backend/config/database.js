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

  // SSL configuration: required in production, optional in development
  const isProduction = process.env.NODE_ENV === 'production';
  const sslConfig = isProduction 
    ? { rejectUnauthorized: true }
    : { rejectUnauthorized: false };

  const pool = new Pool({
    connectionString,
    max: isProduction ? 20 : 10,
    min: isProduction ? 2 : 1,
    idleTimeoutMillis: isProduction ? 30000 : 10000,
    connectionTimeoutMillis: 5000,
    ssl: sslConfig
  });

  // Test a simple query to fail fast if connection invalid
  try {
    await pool.query('SELECT 1');
    console.log(`[${new Date().toISOString()}] Database connection successful`);
  } catch (err) {
    const errorMsg = err && err.code ? err.code : String(err);
    console.error(`[${new Date().toISOString()}] Database connection failed:`, errorMsg);
    if (isProduction) {
      throw new Error(`Failed to connect to database: ${errorMsg}`);
    }
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
