import { query } from '../config/db.js';

export const getDbTime = async () => {
  try {
    const rows = await query('SELECT NOW() as now') as any[];
    return rows[0];
  } catch (error) {
    console.error('Database connection error:', error);
    return null;
  }
};
