import { exec } from 'child_process';
import { promisify } from 'util';
import dotenv from 'dotenv';

dotenv.config();

const execPromise = promisify(exec);

async function setup() {
  try {
    console.log('🔧 Running database migrations...');
    
    // Run migrations
    const { stdout, stderr } = await execPromise('npx node-pg-migrate up');
    
    if (stdout) console.log(stdout);
    if (stderr) console.error(stderr);
    
    console.log('✅ Database setup complete!');
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    // Don't exit - let the server start anyway
  }
}

setup();