import { query } from '../config/db.js';

export const getBusinesses = async (limit: number, offset: number) => {
  const sql = `
    SELECT 
      b.id,
      b.name,
      b.description,
      b.phone,
      b.whatsapp,
      b.address,
      b.city,
      b.latitude,
      b.longitude,
      b.rating,
      b.total_reviews,
      b.is_featured,
      b.created_at,
      c.name as category_name,
      COALESCE(json_agg(bi.image_url) FILTER (WHERE bi.image_url IS NOT NULL), '[]') as images
    FROM businesses b
    LEFT JOIN categories c ON b.category_id = c.id
    LEFT JOIN business_images bi ON b.id = bi.business_id
    GROUP BY b.id, c.name
    ORDER BY b.is_featured DESC, b.rating DESC, b.created_at DESC
    LIMIT $1 OFFSET $2;
  `;
  
  const result = await query(sql, [limit, offset]);
  return result.rows;
};

export const getTotalBusinessesCount = async () => {
  const sql = `SELECT COUNT(*) FROM businesses;`;
  const result = await query(sql);
  return parseInt(result.rows[0].count, 10);
};

export const searchBusinesses = async (
  searchQuery: string | undefined,
  city: string | undefined,
  category: string | undefined,
  limit: number,
  offset: number
) => {
  let sql = `
    SELECT 
      b.id, b.name, b.description, b.phone, b.whatsapp, b.address, b.city,
      b.latitude, b.longitude, b.rating, b.total_reviews, b.is_featured, b.created_at,
      c.name as category_name,
      COALESCE(json_agg(bi.image_url) FILTER (WHERE bi.image_url IS NOT NULL), '[]') as images
    FROM businesses b
    LEFT JOIN categories c ON b.category_id = c.id
    LEFT JOIN business_images bi ON b.id = bi.business_id
    WHERE 1=1
  `;
  
  const params: any[] = [];
  let paramIndex = 1;

  if (searchQuery) {
    sql += ` AND b.name ILIKE $${paramIndex}`;
    params.push(`%${searchQuery}%`);
    paramIndex++;
  }

  if (city) {
    sql += ` AND b.city ILIKE $${paramIndex}`;
    params.push(`%${city}%`);
    paramIndex++;
  }

  if (category) {
    sql += ` AND c.name ILIKE $${paramIndex}`;
    params.push(`%${category}%`);
    paramIndex++;
  }

  sql += ` GROUP BY b.id, c.name`;
  
  // Ranked results: Featured first, then highest rating, then most reviews
  sql += ` ORDER BY b.is_featured DESC, b.rating DESC, b.total_reviews DESC`;
  
  sql += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1};`;
  params.push(limit, offset);

  const result = await query(sql, params);
  return result.rows;
};

export const getTotalSearchCount = async (
  searchQuery: string | undefined,
  city: string | undefined,
  category: string | undefined
) => {
  let sql = `
    SELECT COUNT(DISTINCT b.id) 
    FROM businesses b
    LEFT JOIN categories c ON b.category_id = c.id
    WHERE 1=1
  `;
  
  const params: any[] = [];
  let paramIndex = 1;

  if (searchQuery) {
    sql += ` AND b.name ILIKE $${paramIndex}`;
    params.push(`%${searchQuery}%`);
    paramIndex++;
  }

  if (city) {
    sql += ` AND b.city ILIKE $${paramIndex}`;
    params.push(`%${city}%`);
    paramIndex++;
  }

  if (category) {
    sql += ` AND c.name ILIKE $${paramIndex}`;
    params.push(`%${category}%`);
    paramIndex++;
  }

  const result = await query(sql, params);
  return parseInt(result.rows[0].count, 10);
};

export const getBusinessById = async (id: string) => {
  const sql = `
    SELECT 
      b.id, b.name, b.description, b.phone, b.whatsapp, b.address, b.city,
      b.latitude, b.longitude, b.rating, b.total_reviews, b.is_featured, b.created_at,
      b.owner_id,
      c.id as category_id, c.name as category_name, c.icon as category_icon,
      COALESCE(json_agg(bi.image_url) FILTER (WHERE bi.image_url IS NOT NULL), '[]') as images
    FROM businesses b
    LEFT JOIN categories c ON b.category_id = c.id
    LEFT JOIN business_images bi ON b.id = bi.business_id
    WHERE b.id = $1
    GROUP BY b.id, c.id;
  `;
  
  const result = await query(sql, [id]);
  return result.rows[0] || null;
};
