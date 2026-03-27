import React from 'react';
import { ScreenType, Business } from '../types';
import { BusinessCard } from '../components';
import { Heart } from 'lucide-react';

export const FavoritesScreen = ({ 
  onNavigate, 
  onSelectBusiness,
  favorites,
  onToggleFavorite,
  businesses
}: { 
  onNavigate: (s: ScreenType) => void,
  onSelectBusiness: (b: Business) => void,
  favorites: string[],
  onToggleFavorite: (id: string) => void,
  businesses: Business[]
}) => {
  const favoriteBusinesses = businesses.filter(b => favorites.includes(b.id));

  return (
    <div className="flex flex-col h-full bg-gray-50 pb-20 overflow-y-auto scrollbar-hide">
      {/* Header */}
      <div className="bg-white px-4 pt-safe pb-4 shadow-sm sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-gray-900 mt-2">Favorites</h1>
        <p className="text-sm text-gray-500 mt-1">{favoriteBusinesses.length} saved businesses</p>
      </div>

      {/* Results */}
      <div className="p-4">
        {favoriteBusinesses.length > 0 ? (
          <div className="flex flex-col gap-4">
            {favoriteBusinesses.map(business => (
              <BusinessCard 
                key={business.id} 
                business={business} 
                onClick={() => onSelectBusiness(business)}
                isFavorite={true}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Heart size={32} className="text-gray-300" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">No favorites yet</h2>
            <p className="text-gray-500 mb-6 max-w-[250px]">
              Tap the heart icon on any business to save it here for later.
            </p>
            <button 
              onClick={() => onNavigate('home')}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold shadow-sm active:scale-[0.98] transition-transform"
            >
              Explore Businesses
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
