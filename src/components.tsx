import React from 'react';
import { Home, Search, Heart, User, Star, MapPin, Phone, Heart as HeartSolid } from 'lucide-react';
import { Business, ScreenType } from './types';

export const BottomNav = ({ currentScreen, onNavigate }: { currentScreen: ScreenType, onNavigate: (s: ScreenType) => void }) => {
  const tabs = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'search', icon: Search, label: 'Search' },
    { id: 'favorites', icon: Heart, label: 'Favorites' },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="bg-white border-t border-gray-200 flex justify-around items-center pb-safe pt-2 px-2 absolute bottom-0 w-full z-40 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = currentScreen === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onNavigate(tab.id as ScreenType)}
            className={`flex flex-col items-center justify-center w-16 h-14 transition-colors ${
              isActive ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <Icon size={24} className={isActive ? 'fill-blue-50' : ''} strokeWidth={isActive ? 2.5 : 2} />
            <span className={`text-[10px] mt-1 ${isActive ? 'font-semibold' : 'font-medium'}`}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export const RatingStars = ({ rating, count }: { rating: number, count?: number }) => {
  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center bg-green-600 text-white px-1.5 py-0.5 rounded text-xs font-bold">
        {rating.toFixed(1)} <Star size={10} className="ml-0.5 fill-white" />
      </div>
      {count !== undefined && (
        <span className="text-xs text-gray-500 ml-1">({count} Ratings)</span>
      )}
    </div>
  );
};

export const BusinessCard: React.FC<{ 
  business: Business, 
  onClick: () => void,
  isFavorite: boolean,
  onToggleFavorite: (id: string) => void
}> = ({ 
  business, 
  onClick, 
  isFavorite, 
  onToggleFavorite 
}) => {
  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-4 cursor-pointer active:scale-[0.98] transition-transform"
    >
      <div className="relative h-40 w-full">
        <img src={business.image} alt={business.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        <button 
          onClick={(e) => { e.stopPropagation(); onToggleFavorite(business.id); }}
          className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm"
        >
          <Heart size={18} className={isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'} />
        </button>
        {business.isFeatured && (
          <div className="absolute top-3 left-3 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm uppercase tracking-wider">
            Featured
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-bold text-gray-900 text-lg leading-tight truncate pr-2">{business.name}</h3>
        </div>
        
        <div className="flex items-center gap-2 mb-2">
          <RatingStars rating={business.rating} count={business.reviewsCount} />
          <span className="text-gray-300">•</span>
          <span className="text-xs text-gray-600 font-medium">{business.category}</span>
        </div>

        <div className="flex items-center text-gray-500 text-xs mb-3">
          <MapPin size={12} className="mr-1 shrink-0" />
          <span className="truncate">{business.address}</span>
          <span className="mx-1">•</span>
          <span className="font-medium text-gray-700">{business.distance}</span>
        </div>

        <div className="flex gap-2 mt-3 pt-3 border-t border-gray-50">
          <button 
            onClick={(e) => { e.stopPropagation(); window.location.href = `tel:${business.phone}`; }}
            className="flex-1 bg-blue-50 text-blue-600 py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2"
          >
            <Phone size={16} /> Call Now
          </button>
        </div>
      </div>
    </div>
  );
};
