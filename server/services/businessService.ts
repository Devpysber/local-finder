import * as businessModel from '../models/businessModel.js';

export const fetchBusinesses = async (page: number, limit: number) => {
  // Calculate offset for pagination
  const offset = (page - 1) * limit;

  // Fetch data and total count in parallel for performance
  const [businesses, totalCount] = await Promise.all([
    businessModel.getBusinesses(limit, offset),
    businessModel.getTotalBusinessesCount()
  ]);

  // Calculate total pages
  const totalPages = Math.ceil(totalCount / limit);

  return {
    data: businesses,
    pagination: {
      total: totalCount,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    }
  };
};

export const searchBusinesses = async (
  searchQuery: string | undefined,
  city: string | undefined,
  category: string | undefined,
  page: number,
  limit: number
) => {
  const offset = (page - 1) * limit;

  const [businesses, totalCount] = await Promise.all([
    businessModel.searchBusinesses(searchQuery, city, category, limit, offset),
    businessModel.getTotalSearchCount(searchQuery, city, category)
  ]);

  const totalPages = Math.ceil(totalCount / limit);

  return {
    data: businesses,
    pagination: {
      total: totalCount,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    }
  };
};

export const fetchBusinessById = async (id: string) => {
  const business = await businessModel.getBusinessById(id);
  return business;
};
