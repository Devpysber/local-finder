import React, { useState, useRef } from 'react';
import { ScreenType, Business } from '../types';
import { ArrowLeft, MapPin, Search, Navigation, Star, X } from 'lucide-react';

export const MapScreen = ({ 
  onNavigate, 
  onSelectBusiness,
  businesses
}: { 
  onNavigate: (s: ScreenType) => void,
  onSelectBusiness: (b: Business) => void,
  businesses: Business[]
}) => {
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showSearchArea, setShowSearchArea] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      setShowSearchArea(true);
    }
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && mapRef.current) {
      // Simulate map dragging visually
      mapRef.current.style.backgroundPosition = `${e.movementX}px ${e.movementY}px`;
    }
  };

  const handleSearchArea = () => {
    setShowSearchArea(false);
    // Simulate loading new businesses
  };

  return (
    <div className="flex flex-col h-full bg-gray-100 relative overflow-hidden">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 bg-white/90 backdrop-blur-md px-4 pt-safe pb-3 shadow-sm z-10 flex items-center gap-3">
        <button onClick={() => onNavigate('home')} className="p-2 -ml-2 text-gray-700 bg-white rounded-full shadow-sm">
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1 bg-white rounded-xl p-2.5 flex items-center gap-2 shadow-sm border border-gray-100">
          <MapPin size={18} className="text-blue-600" />
          <span className="text-sm font-bold text-gray-900">Map View</span>
        </div>
      </div>

      {/* Search this area button */}
      {showSearchArea && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-20 animate-in fade-in slide-in-from-top-4">
          <button 
            onClick={handleSearchArea}
            className="bg-white text-blue-600 px-4 py-2 rounded-full font-bold shadow-md flex items-center gap-2 border border-blue-100"
          >
            <Search size={16} /> Search this area
          </button>
        </div>
      )}

      {/* Simulated Map Background */}
      <div 
        ref={mapRef}
        className="absolute inset-0 bg-[#e5e3df] cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        {/* Grid lines to simulate map tiles */}
        <div className="w-full h-full pointer-events-none" style={{ 
          backgroundImage: 'linear-gradient(#d5d3cf 1px, transparent 1px), linear-gradient(90deg, #d5d3cf 1px, transparent 1px)',
          backgroundSize: '100px 100px'
        }}></div>
        
        {/* Simulated Roads */}
        <div className="absolute top-1/3 left-0 right-0 h-4 bg-white/60 transform -rotate-12 pointer-events-none"></div>
        <div className="absolute top-0 bottom-0 left-1/2 w-6 bg-white/60 transform rotate-12 pointer-events-none"></div>
        
        {/* Map Pins */}
        {businesses.map((business, idx) => {
          // Generate pseudo-random positions for the demo
          const top = `${20 + (idx * 15)}%`;
          const left = `${20 + ((idx % 3) * 25)}%`;
          const isSelected = selectedBusiness?.id === business.id;
          
          return (
            <div 
              key={business.id}
              className={`absolute transform -translate-x-1/2 -translate-y-full cursor-pointer group transition-transform ${isSelected ? 'scale-110 z-30' : 'z-20 hover:scale-110'}`}
              style={{ top, left }}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedBusiness(business);
              }}
            >
              {/* Tooltip */}
              <div className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-white px-3 py-2 rounded-xl shadow-lg whitespace-nowrap pointer-events-none transition-opacity ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                <p className="font-bold text-gray-900 text-sm">{business.name}</p>
                <p className="text-xs text-gray-500">{business.category} • {business.rating}★</p>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-white"></div>
              </div>
              
              {/* Pin */}
              <div className="relative">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md border-2 border-white relative z-10 transition-colors ${isSelected ? 'bg-red-500' : 'bg-blue-600'}`}>
                  <MapPin size={20} className="text-white" />
                </div>
                <div className={`absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-4 h-4 rotate-45 z-0 transition-colors ${isSelected ? 'bg-red-500' : 'bg-blue-600'}`}></div>
                {/* Shadow */}
                <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-6 h-2 bg-black/20 rounded-full blur-[2px]"></div>
              </div>
            </div>
          );
        })}
        
        {/* User Location Pin */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <div className="w-16 h-16 bg-blue-500/20 rounded-full animate-ping absolute -inset-3"></div>
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-blue-100 relative z-10">
            <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
          </div>
        </div>
      </div>
      
      {/* Bottom Action / Selected Business Card */}
      <div className="absolute bottom-6 left-0 right-0 px-4 z-40 flex flex-col items-center">
        {selectedBusiness ? (
          <div className="bg-white rounded-2xl shadow-xl w-full overflow-hidden animate-in slide-in-from-bottom-8">
            <div className="relative h-32 w-full">
              <img src={selectedBusiness.image} alt={selectedBusiness.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              <button 
                onClick={(e) => { e.stopPropagation(); setSelectedBusiness(null); }}
                className="absolute top-2 right-2 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center text-white"
              >
                <X size={16} />
              </button>
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-bold text-gray-900 text-lg truncate">{selectedBusiness.name}</h3>
                <div className="flex items-center bg-green-100 text-green-700 px-1.5 py-0.5 rounded text-xs font-bold shrink-0">
                  {selectedBusiness.rating.toFixed(1)} <Star size={10} className="ml-0.5 fill-green-700" />
                </div>
              </div>
              <p className="text-sm text-gray-500 mb-3">{selectedBusiness.category} • {selectedBusiness.distance}</p>
              
              <div className="flex gap-2">
                <button 
                  onClick={() => onSelectBusiness(selectedBusiness)}
                  className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl font-bold text-sm shadow-sm"
                >
                  View Details
                </button>
                <button className="w-10 h-10 bg-gray-100 text-gray-700 rounded-xl flex items-center justify-center">
                  <Navigation size={18} />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <button 
            onClick={() => onNavigate('home')}
            className="bg-gray-900 text-white px-6 py-3 rounded-full font-bold shadow-lg flex items-center gap-2"
          >
            View List
          </button>
        )}
      </div>
    </div>
  );
};
