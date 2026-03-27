import React, { useState, useEffect } from 'react';
import { Search, ArrowLeft, Filter, SlidersHorizontal, X, Star, Check, Loader2 } from 'lucide-react';
import { ScreenType, Business } from '../types';
import { CATEGORIES } from '../data';
import { BusinessCard } from '../components';
import { api } from '../services/api';

export const SearchScreen = ({ 
  onNavigate, 
  onSelectBusiness,
  favorites,
  onToggleFavorite,
  initialQuery = '',
  businesses = []
}: { 
  onNavigate: (s: ScreenType) => void,
  onSelectBusiness: (b: Business) => void,
  favorites: string[],
  onToggleFavorite: (id: string) => void,
  initialQuery?: string,
  businesses?: Business[]
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<Business[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  // Filter state
  const [showFilters, setShowFilters] = useState(false);
  const [minRating, setMinRating] = useState<number>(0);
  const [selectedPrice, setSelectedPrice] = useState<string | null>(null);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  const allAmenities = Array.from(new Set(businesses.flatMap(b => b.amenities || [])));
  const allServices = Array.from(new Set(businesses.flatMap(b => b.services || [])));

  useEffect(() => {
    const performSearch = async () => {
      setIsSearching(true);
      try {
        const { data } = await api.searchBusinesses(query, undefined, activeCategory || undefined);
        setSearchResults(data);
      } catch (error) {
        console.error('Search failed:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      performSearch();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [query, activeCategory]);

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities(prev => 
      prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]
    );
  };

  const toggleService = (service: string) => {
    setSelectedServices(prev => 
      prev.includes(service) ? prev.filter(s => s !== service) : [...prev, service]
    );
  };

  const clearFilters = () => {
    setMinRating(0);
    setSelectedPrice(null);
    setSelectedAmenities([]);
    setSelectedServices([]);
  };

  const filteredBusinesses = searchResults.filter(b => {
    const matchesRating = b.rating >= minRating;
    const matchesPrice = selectedPrice ? b.priceRange === selectedPrice : true;
    const matchesAmenities = selectedAmenities.length === 0 || 
      selectedAmenities.every(a => b.amenities?.includes(a));
    const matchesServices = selectedServices.length === 0 || 
      selectedServices.every(s => b.services?.includes(s));

    return matchesRating && matchesPrice && matchesAmenities && matchesServices;
  });

  return (
    <div className="flex flex-col h-full bg-gray-50 pb-20 overflow-y-auto scrollbar-hide relative">
      {/* Header */}
      <div className="bg-white px-4 pt-4 pb-3 shadow-sm sticky top-0 z-10">
        <div className="flex items-center gap-3 mb-3">
          <button onClick={() => onNavigate('home')} className="p-2 -ml-2 text-gray-700">
            <ArrowLeft size={24} />
          </button>
          <div className="flex-1 bg-gray-100 rounded-xl p-2.5 flex items-center gap-2">
            <Search size={20} className="text-gray-400" />
            <input 
              type="text" 
              placeholder="Search businesses..." 
              className="bg-transparent flex-1 outline-none text-sm text-gray-900"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
          </div>
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          <button 
            onClick={() => setShowFilters(true)}
            className="flex items-center gap-1 bg-gray-100 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-700 whitespace-nowrap"
          >
            <SlidersHorizontal size={14} /> Filters
            {(minRating > 0 || selectedPrice || selectedAmenities.length > 0 || selectedServices.length > 0) && (
              <span className="w-2 h-2 rounded-full bg-blue-600 ml-1"></span>
            )}
          </button>
          <button 
            onClick={() => setActiveCategory(null)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              activeCategory === null ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            All
          </button>
          {CATEGORIES.filter(c => c.name !== 'More').map(cat => (
            <button 
              key={cat.id}
              onClick={() => setActiveCategory(cat.name)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                activeCategory === cat.name ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="p-4">
        <p className="text-sm text-gray-500 font-medium mb-4">
          {isSearching ? 'Searching...' : `${filteredBusinesses.length} results found`}
        </p>
        
        {isSearching ? (
          <div className="flex flex-col items-center justify-center py-10">
            <Loader2 size={32} className="text-blue-500 animate-spin mb-4" />
            <p className="text-gray-500 font-medium">Finding businesses...</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filteredBusinesses.map(business => (
              <BusinessCard 
                key={business.id} 
                business={business} 
                onClick={() => onSelectBusiness(business)}
                isFavorite={favorites.includes(business.id)}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
            
            {filteredBusinesses.length === 0 && (
              <div className="text-center py-10">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search size={24} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">No results found</h3>
                <p className="text-gray-500 text-sm">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Filter Modal */}
      {showFilters && (
        <div className="absolute inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowFilters(false)}></div>
          <div className="bg-white rounded-t-3xl p-4 flex flex-col max-h-[80%] relative z-10 animate-in slide-in-from-bottom-full duration-300">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Filters</h2>
              <button onClick={() => setShowFilters(false)} className="p-2 text-gray-500 bg-gray-100 rounded-full">
                <X size={20} />
              </button>
            </div>

            <div className="overflow-y-auto pb-20 scrollbar-hide flex-1">
              {/* Rating */}
              <div className="mb-6">
                <h3 className="text-sm font-bold text-gray-900 mb-3">Minimum Rating</h3>
                <div className="flex gap-2">
                  {[0, 3, 4, 4.5].map(rating => (
                    <button
                      key={rating}
                      onClick={() => setMinRating(rating)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-1 border ${
                        minRating === rating ? 'bg-blue-50 border-blue-600 text-blue-600' : 'bg-white border-gray-200 text-gray-700'
                      }`}
                    >
                      {rating === 0 ? 'Any' : `${rating}+`}
                      {rating > 0 && <Star size={14} className={minRating === rating ? 'fill-blue-600' : 'text-gray-400'} />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h3 className="text-sm font-bold text-gray-900 mb-3">Price Range</h3>
                <div className="flex gap-2">
                  {['$', '$$', '$$$'].map(price => (
                    <button
                      key={price}
                      onClick={() => setSelectedPrice(price === selectedPrice ? null : price)}
                      className={`flex-1 py-2 rounded-xl text-sm font-medium border ${
                        selectedPrice === price ? 'bg-blue-50 border-blue-600 text-blue-600' : 'bg-white border-gray-200 text-gray-700'
                      }`}
                    >
                      {price}
                    </button>
                  ))}
                </div>
              </div>

              {/* Amenities */}
              <div className="mb-6">
                <h3 className="text-sm font-bold text-gray-900 mb-3">Amenities</h3>
                <div className="flex flex-col gap-3">
                  {allAmenities.map(amenity => (
                    <label key={amenity} className="flex items-center gap-3 cursor-pointer group">
                      <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${
                        selectedAmenities.includes(amenity) ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-300 group-hover:border-blue-400'
                      }`}>
                        {selectedAmenities.includes(amenity) && <Check size={14} className="text-white" />}
                      </div>
                      <input 
                        type="checkbox" 
                        className="hidden" 
                        checked={selectedAmenities.includes(amenity)}
                        onChange={() => toggleAmenity(amenity)}
                      />
                      <span className="text-sm text-gray-700 font-medium">{amenity}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Services */}
              <div className="mb-6">
                <h3 className="text-sm font-bold text-gray-900 mb-3">Services</h3>
                <div className="flex flex-col gap-3">
                  {allServices.map(service => (
                    <label key={service} className="flex items-center gap-3 cursor-pointer group">
                      <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${
                        selectedServices.includes(service) ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-300 group-hover:border-blue-400'
                      }`}>
                        {selectedServices.includes(service) && <Check size={14} className="text-white" />}
                      </div>
                      <input 
                        type="checkbox" 
                        className="hidden" 
                        checked={selectedServices.includes(service)}
                        onChange={() => toggleService(service)}
                      />
                      <span className="text-sm text-gray-700 font-medium">{service}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Filter Actions */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 flex gap-3">
              <button 
                onClick={clearFilters}
                className="flex-1 py-3 rounded-xl font-bold text-gray-700 bg-gray-100"
              >
                Clear All
              </button>
              <button 
                onClick={() => setShowFilters(false)}
                className="flex-[2] py-3 rounded-xl font-bold text-white bg-blue-600 shadow-sm shadow-blue-200"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
