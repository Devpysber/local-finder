import { Business, User } from './types';

export const CATEGORIES = [
  { id: '1', name: 'Restaurants', icon: 'Utensils' },
  { id: '2', name: 'Hotels', icon: 'Bed' },
  { id: '3', name: 'Plumbers', icon: 'Wrench' },
  { id: '4', name: 'Electricians', icon: 'Zap' },
  { id: '5', name: 'Doctors', icon: 'Stethoscope' },
  { id: '6', name: 'Salons', icon: 'Scissors' },
  { id: '7', name: 'Gyms', icon: 'Dumbbell' },
  { id: '8', name: 'More', icon: 'Grid' },
];

export const BUSINESSES: Business[] = [
  {
    id: 'b1',
    name: 'Spice Route Restaurant',
    category: 'Restaurants',
    dateAdded: '2026-03-15',
    rating: 4.5,
    reviewsCount: 328,
    distance: '1.2 km',
    address: '123 Main Street, Downtown',
    image: 'https://picsum.photos/seed/spice/400/300',
    phone: '+1 234 567 8900',
    description: 'Authentic Indian cuisine with a modern twist. Experience the rich flavors of the subcontinent.',
    services: ['Dine-in', 'Takeaway', 'Delivery'],
    hours: '11:00 AM - 10:30 PM',
    isFeatured: true,
    lat: 34.0522,
    lng: -118.2437,
    priceRange: '$$',
    amenities: ['Wi-Fi', 'Parking', 'Air Conditioning'],
    images: [
      'https://picsum.photos/seed/spice1/400/300',
      'https://picsum.photos/seed/spice2/400/300',
      'https://picsum.photos/seed/spice3/400/300'
    ],
    reviews: [
      { id: 'r1', userName: 'John Doe', rating: 5, text: 'Amazing food and great service!', date: '2 days ago' },
      { id: 'r2', userName: 'Jane Smith', rating: 4, text: 'Good ambiance, but a bit crowded.', date: '1 week ago' }
    ],
    claimStatus: 'claimed',
    ownerId: 'u2'
  },
  {
    id: 'b2',
    name: 'Elite Fitness Gym',
    category: 'Gyms',
    dateAdded: '2026-03-10',
    rating: 4.8,
    reviewsCount: 156,
    distance: '2.5 km',
    address: '456 Fitness Blvd, Westside',
    image: 'https://picsum.photos/seed/gym/400/300',
    phone: '+1 234 567 8901',
    description: 'State-of-the-art equipment, personal training, and group classes to help you reach your fitness goals.',
    services: ['Personal Training', 'Group Classes', 'Sauna'],
    hours: '5:00 AM - 11:00 PM',
    isFeatured: true,
    lat: 34.0622,
    lng: -118.2537,
    priceRange: '$$$',
    amenities: ['Showers', 'Lockers', 'Water Station'],
    images: [
      'https://picsum.photos/seed/gym1/400/300',
      'https://picsum.photos/seed/gym2/400/300'
    ],
    reviews: [
      { id: 'r3', userName: 'Mike Johnson', rating: 5, text: 'Best gym in town, very clean.', date: '3 days ago' }
    ],
    claimStatus: 'pending',
    ownerId: 'u3'
  },
  {
    id: 'b3',
    name: 'QuickFix Plumbers',
    category: 'Plumbers',
    dateAdded: '2026-02-28',
    rating: 4.2,
    reviewsCount: 89,
    distance: '3.1 km',
    address: '789 Pipe Lane, Northside',
    image: 'https://picsum.photos/seed/plumber/400/300',
    phone: '+1 234 567 8902',
    description: '24/7 emergency plumbing services. Fast, reliable, and affordable.',
    services: ['Pipe Repair', 'Drain Cleaning', 'Water Heater Installation'],
    hours: 'Open 24 Hours',
    isFeatured: false,
    lat: 34.0422,
    lng: -118.2337,
    priceRange: '$$',
    amenities: ['24/7 Support', 'Free Estimates'],
    images: [
      'https://picsum.photos/seed/plumber1/400/300'
    ],
    reviews: [
      { id: 'r4', userName: 'Sarah Lee', rating: 4, text: 'Fixed my sink quickly.', date: '1 month ago' }
    ],
    claimStatus: 'unclaimed'
  },
  {
    id: 'b4',
    name: 'Glow Beauty Salon',
    category: 'Salons',
    dateAdded: '2026-03-18',
    rating: 4.6,
    reviewsCount: 210,
    distance: '0.8 km',
    address: '321 Beauty Ave, Eastside',
    image: 'https://picsum.photos/seed/salon/400/300',
    phone: '+1 234 567 8903',
    description: 'Premium hair and beauty treatments in a relaxing environment.',
    services: ['Haircut & Styling', 'Coloring', 'Manicure & Pedicure', 'Facials'],
    hours: '9:00 AM - 8:00 PM',
    isFeatured: true,
    lat: 34.0722,
    lng: -118.2637,
    priceRange: '$$',
    amenities: ['Wi-Fi', 'Air Conditioning', 'Refreshments'],
    images: [
      'https://picsum.photos/seed/salon1/400/300',
      'https://picsum.photos/seed/salon2/400/300'
    ],
    reviews: [
      { id: 'r5', userName: 'Emily Chen', rating: 5, text: 'Loved my new haircut!', date: '5 days ago' }
    ],
    claimStatus: 'unclaimed'
  },
  {
    id: 'b5',
    name: 'City Center Hotel',
    category: 'Hotels',
    dateAdded: '2026-01-15',
    rating: 4.3,
    reviewsCount: 445,
    distance: '1.5 km',
    address: '555 Center Square',
    image: 'https://picsum.photos/seed/hotel/400/300',
    phone: '+1 234 567 8904',
    description: 'Luxury accommodation in the heart of the city with stunning views.',
    services: ['Room Service', 'Pool', 'Spa', 'Free WiFi'],
    hours: 'Check-in 2:00 PM',
    isFeatured: false,
    lat: 34.0552,
    lng: -118.2487,
    priceRange: '$$$',
    amenities: ['Pool', 'Spa', 'Gym', 'Restaurant'],
    images: [
      'https://picsum.photos/seed/hotel1/400/300',
      'https://picsum.photos/seed/hotel2/400/300',
      'https://picsum.photos/seed/hotel3/400/300'
    ],
    reviews: [
      { id: 'r6', userName: 'David Wilson', rating: 4, text: 'Great location, comfortable rooms.', date: '2 weeks ago' }
    ],
    claimStatus: 'unclaimed'
  }
];

export const USERS: User[] = [
  { id: 'u1', name: 'Admin User', email: 'admin@localfinder.com', role: 'admin', status: 'active' },
  { id: 'u2', name: 'Spice Route Owner', email: 'owner@spiceroute.com', role: 'business', status: 'active' },
  { id: 'u3', name: 'Elite Gym Manager', email: 'manager@elitegym.com', role: 'business', status: 'active' },
  { id: 'u4', name: 'Regular User', email: 'user@example.com', role: 'user', status: 'active' },
];

export const TRENDING_SEARCHES = ['Restaurants near me', 'AC Repair', 'Dentists', 'Packers and Movers'];
