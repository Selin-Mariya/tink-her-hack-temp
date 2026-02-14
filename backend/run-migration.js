const fs = require('fs');
const path = require('path');

// Load env manually
const envFile = path.join(__dirname, '.env');
const envContent = fs.readFileSync(envFile, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  if (line && !line.startsWith('#')) {
    const [key, value] = line.split('=');
    if (key && value) {
      env[key.trim()] = value.trim();
    }
  }
});

const { Pool } = require('pg');

async function runMigration() {
  const pool = new Pool({
    connectionString: env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('✓ Connecting to database...');
    const client = await pool.connect();
    
    console.log('✓ Connection established');

    // Read the migration file
    const migrationPath = path.join(__dirname, '..', 'database', '003_create_requirement_tables.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

    console.log('✓ Executing migration...');
    await client.query(migrationSQL);

    console.log('✓ Migration completed successfully!');
    console.log('\nTables created:');
    console.log('  - client_requirements');
    console.log('  - requirement_skills');
    console.log('  - idx_requirement_skills_req_id (index)');

    client.release();
  } catch (error) {
    console.error('✗ Migration failed:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runMigration();
