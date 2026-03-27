import { query } from '../config/db.js';

export const createLead = async (
  businessId: string,
  userName: string,
  userPhone: string,
  message: string
) => {
  const sql = `
    INSERT INTO leads (business_id, user_name, user_phone, message, status, created_at)
    VALUES ($1, $2, $3, $4, 'new', CURRENT_TIMESTAMP)
    RETURNING id, business_id, user_name, user_phone, message, status, created_at;
  `;
  
  const result = await query(sql, [businessId, userName, userPhone, message]);
  return result.rows[0];
};
