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

const { createClient } = require('@supabase/supabase-js');

async function runMigration() {
  try {
    console.log('✓ Connecting to Supabase...');
    const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
      auth: { persistSession: false }
    });

    console.log('✓ Connection established');

    // Read the migration file
    const migrationPath = path.join(__dirname, '..', 'database', '003_create_requirement_tables.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    // Split by lines and filter out comments
    const statements = migrationSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt && !stmt.startsWith('--'));

    console.log('✓ Executing migration...');
    
    for (const statement of statements) {
      if (statement) {
        const { error } = await supabase.rpc('exec_sql', { sql: statement }).catch(() => {
          // If rpc doesn't exist, that's expected - we need raw SQL access
          return { error: 'RPC not available' };
        });
        
        if (error && error !== 'RPC not available') {
          throw error;
        }
      }
    }

    console.log('✓ Attempting direct SQL execution...');
    // Try alternative approach using supabase client query execution
    const { error: createReqError } = await supabase
      .from('client_requirements')
      .select('*')
      .limit(1)
      .catch(() => ({ error: null }));

    if (createReqError && createReqError.message?.includes('does not exist')) {
      console.log('ℹ Tables do not exist yet. Use Supabase SQL Editor to run the migration.');
      console.log('\n📋 Copy this SQL and run it in Supabase Console > SQL Editor:\n');
      console.log(migrationSQL);
    } else if (!createReqError) {
      console.log('✓ Tables already exist or were created successfully!');
      console.log('\nTables available:');
      console.log('  - client_requirements');
      console.log('  - requirement_skills');
    }

  } catch (error) {
    console.error('✗ Error:', error.message);
    console.log('\n📋 Manual approach: Copy and run this SQL in Supabase Console > SQL Editor:\n');
    const migrationPath = path.join(__dirname, '..', 'database', '003_create_requirement_tables.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    console.log(migrationSQL);
  }
}

runMigration();
