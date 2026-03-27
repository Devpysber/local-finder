import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

let poolConfig: any;

try {
  if (process.env.DATABASE_URL && process.env.DATABASE_URL.startsWith('postgres')) {
    // Validate URL
    new URL(process.env.DATABASE_URL);
    poolConfig = { 
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false } // Required for most cloud providers
    };
  } else {
    throw new Error('No valid DATABASE_URL');
  }
} catch (e) {
  poolConfig = {
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'localfinder',
    password: process.env.DB_PASSWORD || 'postgres',
    port: parseInt(process.env.DB_PORT || '5432', 10),
  };
}

const pool = new Pool(poolConfig);

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

// Test the connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection failed. Ensure DATABASE_URL is set correctly in the Secrets panel.');
    console.error(err.message);
  } else {
    console.log('Database connected successfully.');
  }
});

export const query = (text: string, params?: any[]) => pool.query(text, params);
export default pool;
