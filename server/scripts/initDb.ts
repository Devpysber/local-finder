import fs from 'fs';
import path from 'path';
import pool from '../config/db.js';

async function initDb() {
  try {
    console.log('Connecting to the database...');
    
    // Read the schema.sql file
    const schemaPath = path.join(process.cwd(), 'schema.sql');
    if (!fs.existsSync(schemaPath)) {
      console.error('schema.sql file not found in the root directory.');
      process.exit(1);
    }
    
    const schema = fs.readFileSync(schemaPath, 'utf8');

    console.log('Executing schema.sql...');
    // Execute the SQL queries
    await pool.query(schema);
    
    console.log('Database schema initialized successfully! All tables and indexes created.');

    // Check if seed.sql exists and run it
    const seedPath = path.join(process.cwd(), 'seed.sql');
    if (fs.existsSync(seedPath)) {
      console.log('Found seed.sql. Executing sample data insertion...');
      const seed = fs.readFileSync(seedPath, 'utf8');
      await pool.query(seed);
      console.log('Sample data inserted successfully!');
    }

  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    // Close the pool connection
    await pool.end();
  }
}

initDb();
