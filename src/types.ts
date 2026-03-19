export type ScreenType = 'splash' | 'login' | 'home' | 'search' | 'details' | 'map' | 'favorites' | 'profile' | 'register' | 'businessDashboard' | 'adminDashboard';

export interface Review {
  id: string;
  userName: string;
  userImage?: string;
  rating: number;
  text: string;
  date: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'business' | 'admin';
  status: 'active' | 'suspended';
}

export interface Campaign {
  id: string;
  creativeId: string;
  name: string;
  platforms: string[];
  dailyBudget: number;
  status: 'active' | 'paused' | 'completed';
  startDate: string;
  spend: number;
  clicks: number;
  impressions: number;
}

export interface AdCreative {
  id: string;
  businessName: string;
  productOrService: string;
  imageUrl: string;
  copy: string;
  status: 'pending' | 'approved' | 'rejected';
  date: string;
}

export interface ClaimRequest {
  id: string;
  businessId: string;
  businessName: string;
  userId: string;
  status: 'pending' | 'approved' | 'rejected';
  date: string;
}

export interface AdminNotification {
  id: string;
  message: string;
  date: string;
  read: boolean;
  type: 'claim' | 'system';
}

export interface UserNotification {
  id: string;
  userId: string;
  message: string;
  date: string;
  read: boolean;
  type: 'claim_approved' | 'claim_rejected' | 'system';
}

export interface Business {
  id: string;
  name: string;
  category: string;
  rating: number;
  reviewsCount: number;
  distance: string;
  address: string;
  image: string;
  phone: string;
  description: string;
  services: string[];
  hours: string;
  isFeatured: boolean;
  lat: number;
  lng: number;
  priceRange?: string;
  amenities?: string[];
  images?: string[];
  reviews?: Review[];
  claimStatus?: 'unclaimed' | 'pending' | 'claimed';
  ownerId?: string;
  dateAdded?: string;
}
