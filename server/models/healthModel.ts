import { query } from '../config/db.js';

export const getDbTime = async () => {
  try {
    const res = await query('SELECT NOW()');
    return res.rows[0];
  } catch (error) {
    console.error('Database connection error:', error);
    return null;
  }
};
