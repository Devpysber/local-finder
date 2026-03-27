/// <reference types="vite/client" />
import { Business } from '../types';

const API_URL = import.meta.env.VITE_API_URL || '/api';

// Helper to map backend business to frontend Business type
const mapBusiness = (b: any): Business => ({
  id: b.id,
  name: b.name,
  category: b.category_name || 'Uncategorized',
  rating: parseFloat(b.rating) || 0,
  reviewsCount: b.total_reviews || 0,
  distance: '2.5 km', // Mock distance
  address: b.address ? `${b.address}, ${b.city}` : b.city || 'Unknown Location',
  image: b.images && b.images.length > 0 ? b.images[0] : 'https://picsum.photos/seed/placeholder/400/300',
  phone: b.phone || '',
  description: b.description || '',
  services: [], // Mock services
  hours: '9:00 AM - 5:00 PM', // Mock hours
  isFeatured: b.is_featured || false,
  lat: parseFloat(b.latitude) || 0,
  lng: parseFloat(b.longitude) || 0,
  images: b.images || [],
  ownerId: b.owner_id,
  claimStatus: b.owner_id ? 'claimed' : 'unclaimed',
});

export const api = {
  async getBusinesses(page = 1, limit = 10): Promise<{ data: Business[], total: number }> {
    const res = await fetch(`${API_URL}/businesses?page=${page}&limit=${limit}`);
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to fetch businesses');
    }
    const json = await res.json();
    return {
      data: json.data.map(mapBusiness),
      total: json.pagination.total
    };
  },

  async searchBusinesses(query: string, city?: string, category?: string, page = 1, limit = 10): Promise<{ data: Business[], total: number }> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    if (query) params.append('q', query);
    if (city) params.append('city', city);
    if (category) params.append('category', category);

    const res = await fetch(`${API_URL}/search?${params.toString()}`);
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to search businesses');
    }
    const json = await res.json();
    return {
      data: json.data.map(mapBusiness),
      total: json.pagination.total
    };
  },

  async getBusinessById(id: string): Promise<Business> {
    const res = await fetch(`${API_URL}/businesses/${id}`);
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to fetch business details');
    }
    const json = await res.json();
    return mapBusiness(json.data);
  },

  async submitLead(businessId: string, userName: string, userPhone: string, message: string): Promise<any> {
    const res = await fetch(`${API_URL}/leads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        business_id: businessId,
        user_name: userName,
        user_phone: userPhone,
        message,
      }),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Failed to submit lead');
    }
    return res.json();
  }
};
