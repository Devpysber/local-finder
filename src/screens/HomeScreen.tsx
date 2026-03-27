import React, { useState, useEffect } from 'react';
import { 
  Search, MapPin, Bell, ChevronRight, Mic, Star, 
  TrendingUp, ShieldCheck, Briefcase, User,
  Utensils, Bed, Wrench, Zap, Stethoscope, Scissors, Dumbbell, Grid,
  Clock, X, ArrowLeft, Loader2
} from 'lucide-react';
import { ScreenType, Business } from '../types';
import { CATEGORIES, TRENDING_SEARCHES } from '../data';
import { BusinessCard } from '../components';

const getCategoryIcon = (name: string) => {
  switch(name.toLowerCase()) {
    case 'restaurants': return <Utensils size={24} className="text-orange-500" />;
    case 'hotels': return <Bed size={24} className="text-indigo-500" />;
    case 'plumbers': return <Wrench size={24} className="text-blue-500" />;
    case 'electricians': return <Zap size={24} className="text-amber-500" />;
    case 'doctors': return <Stethoscope size={24} className="text-emerald-500" />;
    case 'salons': return <Scissors size={24} className="text-pink-500" />;
    case 'gyms': return <Dumbbell size={24} className="text-cyan-500" />;
    default: return <Grid size={24} className="text-gray-500" />;
  }
};

const getCategoryBg = (name: string) => {
  switch(name.toLowerCase()) {
    case 'restaurants': return 'bg-orange-50';
    case 'hotels': return 'bg-indigo-50';
    case 'plumbers': return 'bg-blue-50';
    case 'electricians': return 'bg-amber-50';
    case 'doctors': return 'bg-emerald-50';
    case 'salons': return 'bg-pink-50';
    case 'gyms': return 'bg-cyan-50';
    default: return 'bg-gray-50';
  }
};

export const HomeScreen = ({ 
  onNavigate, 
  onSelectBusiness,
  favorites,
  onToggleFavorite,
  businesses,
  isLoading
}: { 
  onNavigate: (s: ScreenType, query?: string) => void,
  onSelectBusiness: (b: Business) => void,
  favorites: string[],
  onToggleFavorite: (id: string) => void,
  businesses: Business[],
  isLoading: boolean
}) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>(['Plumbers near me', 'Best pizza', 'Hair salon']);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      // Simple mock auto-suggestions based on businesses and categories
      const allKeywords = [
        ...CATEGORIES.map(c => c.name),
        ...businesses.map(b => b.name),
        ...businesses.flatMap(b => b.services || [])
      ];
      
      const filtered = Array.from(new Set(
        allKeywords.filter(k => k.toLowerCase().includes(searchQuery.toLowerCase()))
      )).slice(0, 5);
      
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [searchQuery, businesses]);

  const handleSearchSubmit = (query: string) => {
    if (query.trim()) {
      // Add to recent searches if not already there
      if (!recentSearches.includes(query)) {
        setRecentSearches([query, ...recentSearches].slice(0, 5));
      }
      setIsSearchFocused(false);
      onNavigate('search', query);
    }
  };

  const removeRecentSearch = (e: React.MouseEvent, searchToRemove: string) => {
    e.stopPropagation();
    setRecentSearches(recentSearches.filter(s => s !== searchToRemove));
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 pb-20 overflow-y-auto scrollbar-hide">
      {/* Premium Header */}
      <div className="bg-white px-4 pt-6 pb-4 shadow-sm sticky top-0 z-20">
        <div className="flex justify-between items-center mb-5">
          <div className="flex items-center gap-3">
            <div className="bg-gray-100 p-2.5 rounded-full">
              <MapPin size={20} className="text-gray-800" />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Current Location</p>
              <div className="flex items-center cursor-pointer">
                <p className="text-sm font-bold text-gray-900">Downtown, LA</p>
                <ChevronRight size={16} className="text-gray-400 ml-0.5" />
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => onNavigate('login')} 
              className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
            >
              <User size={18} />
            </button>
            <button className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center relative text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
              <Bell size={18} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div 
          onClick={() => setIsSearchFocused(true)}
          className="bg-gray-50 border border-gray-200 rounded-2xl p-3.5 flex items-center gap-3 shadow-sm cursor-text hover:border-blue-300 transition-colors"
        >
          <Search size={22} className="text-gray-400" />
          <span className="text-gray-400 text-base flex-1 font-medium">Search for anything...</span>
          <div className="w-px h-6 bg-gray-300 mx-1"></div>
          <Mic size={20} className="text-blue-600" />
        </div>
      </div>

      {/* Search Overlay */}
      {isSearchFocused && (
        <div className="absolute inset-0 z-50 bg-white flex flex-col animate-in fade-in duration-200">
          <div className="px-4 pt-6 pb-4 shadow-sm flex items-center gap-3">
            <button onClick={() => setIsSearchFocused(false)} className="p-2 -ml-2 text-gray-700">
              <ArrowLeft size={24} />
            </button>
            <div className="flex-1 bg-gray-100 rounded-xl p-2.5 flex items-center gap-2">
              <Search size={20} className="text-gray-400" />
              <input 
                type="text" 
                placeholder="Search for anything..." 
                className="bg-transparent flex-1 outline-none text-sm text-gray-900"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit(searchQuery)}
                autoFocus
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="p-1 text-gray-400 hover:text-gray-600">
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {searchQuery.trim().length > 0 ? (
              <div className="p-4">
                {suggestions.length > 0 ? (
                  <div className="flex flex-col">
                    {suggestions.map((suggestion, idx) => (
                      <button 
                        key={idx}
                        onClick={() => handleSearchSubmit(suggestion)}
                        className="flex items-center gap-3 py-3 border-b border-gray-100 text-left"
                      >
                        <Search size={18} className="text-gray-400" />
                        <span className="text-gray-800 font-medium">{suggestion}</span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No suggestions found</p>
                )}
              </div>
            ) : (
              <div className="p-4">
                {recentSearches.length > 0 && (
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-bold text-gray-900">Recent Searches</h3>
                      <button onClick={() => setRecentSearches([])} className="text-xs text-blue-600 font-medium">Clear All</button>
                    </div>
                    <div className="flex flex-col">
                      {recentSearches.map((search, idx) => (
                        <button 
                          key={idx}
                          onClick={() => handleSearchSubmit(search)}
                          className="flex items-center justify-between py-3 border-b border-gray-100 text-left group"
                        >
                          <div className="flex items-center gap-3">
                            <Clock size={18} className="text-gray-400" />
                            <span className="text-gray-700">{search}</span>
                          </div>
                          <div 
                            onClick={(e) => removeRecentSearch(e, search)}
                            className="p-1 text-gray-300 hover:text-gray-500"
                          >
                            <X size={16} />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="font-bold text-gray-900 mb-3">Trending Now</h3>
                  <div className="flex flex-wrap gap-2">
                    {TRENDING_SEARCHES.map((search, idx) => (
                      <button 
                        key={idx}
                        onClick={() => handleSearchSubmit(search)}
                        className="bg-gray-50 border border-gray-200 px-4 py-2 rounded-full text-sm text-gray-700 font-medium flex items-center gap-2"
                      >
                        <TrendingUp size={14} className="text-blue-600" />
                        {search}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Quick Links */}
      <div className="bg-white px-4 py-4 flex gap-3 overflow-x-auto scrollbar-hide border-b border-gray-100 mb-2">
        <button className="flex items-center gap-1.5 bg-amber-50 text-amber-700 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap border border-amber-100 transition-transform active:scale-95">
          <Star size={14} /> Top Rated
        </button>
        <button className="flex items-center gap-1.5 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap border border-blue-100 transition-transform active:scale-95">
          <TrendingUp size={14} /> Trending
        </button>
        <button className="flex items-center gap-1.5 bg-green-50 text-green-700 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap border border-green-100 transition-transform active:scale-95">
          <MapPin size={14} /> Near Me
        </button>
      </div>

      {/* Categories Grid */}
      <div className="bg-white px-4 py-6 mb-2">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-lg font-bold text-gray-900 tracking-tight">Explore Categories</h2>
          <button className="text-blue-600 text-sm font-semibold hover:underline">See All</button>
        </div>
        <div className="grid grid-cols-4 gap-y-6 gap-x-3">
          {CATEGORIES.map((cat) => (
            <div key={cat.id} className="flex flex-col items-center gap-2 cursor-pointer group" onClick={() => onNavigate('search')}>
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105 ${getCategoryBg(cat.name)}`}>
                {getCategoryIcon(cat.name)}
              </div>
              <span className="text-[11px] font-semibold text-gray-700 text-center leading-tight">{cat.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Promotional Banner */}
      <div className="px-4 py-2 mb-2">
        <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden flex items-center justify-between">
          <div className="relative z-10 w-2/3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 mb-1 block">For Businesses</span>
            <h3 className="text-xl font-bold mb-2 leading-tight">List Your Business</h3>
            <p className="text-xs text-gray-400 mb-4">Get discovered by thousands of local customers daily.</p>
            <button onClick={() => onNavigate('login')} className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-5 py-2.5 rounded-full transition-colors">
              Start Free
            </button>
          </div>
          <div className="relative z-10">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md border border-white/10">
              <TrendingUp size={32} className="text-blue-400" />
            </div>
          </div>
          {/* Decorative background elements */}
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-600/20 rounded-full blur-3xl"></div>
          <div className="absolute right-20 -bottom-10 w-32 h-32 bg-purple-600/20 rounded-full blur-3xl"></div>
        </div>
      </div>

      {/* Trending Searches */}
      <div className="bg-white px-4 py-6 mb-2">
        <h2 className="text-lg font-bold text-gray-900 mb-4 tracking-tight flex items-center gap-2">
          <TrendingUp size={18} className="text-blue-600" /> Trending Now
        </h2>
        <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide">
          {TRENDING_SEARCHES.map((search, idx) => (
            <button 
              key={idx}
              onClick={() => onNavigate('search', search)}
              className="bg-gray-50 hover:bg-gray-100 border border-gray-200 px-4 py-2 rounded-xl text-sm text-gray-700 font-medium whitespace-nowrap transition-colors flex items-center gap-2"
            >
              <Search size={14} className="text-gray-400" />
              {search}
            </button>
          ))}
        </div>
      </div>

      {/* Featured Businesses */}
      <div className="bg-white px-4 py-6 pb-8">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-lg font-bold text-gray-900 tracking-tight">Popular Near You</h2>
          <button className="text-blue-600 text-sm font-semibold hover:underline">View All</button>
        </div>
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-10">
            <Loader2 size={32} className="text-blue-500 animate-spin mb-4" />
            <p className="text-gray-500 font-medium">Finding local businesses...</p>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {businesses.filter(b => b.isFeatured).length > 0 ? (
              businesses.filter(b => b.isFeatured).map(business => (
                <BusinessCard 
                  key={business.id} 
                  business={business} 
                  onClick={() => onSelectBusiness(business)}
                  isFavorite={favorites.includes(business.id)}
                  onToggleFavorite={onToggleFavorite}
                />
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No featured businesses found.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
