import React, { useState } from 'react';
import { ScreenType, Business, AdCreative, Campaign, ClaimRequest, AdminNotification } from './types';
import { BottomNav } from './components';
import { BUSINESSES } from './data';

// Screens
import { SplashScreen } from './screens/SplashScreen';
import { LoginScreen } from './screens/LoginScreen';
import { HomeScreen } from './screens/HomeScreen';
import { SearchScreen } from './screens/SearchScreen';
import { BusinessDetailsScreen } from './screens/BusinessDetailsScreen';
import { FavoritesScreen } from './screens/FavoritesScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { RegisterBusinessScreen } from './screens/RegisterBusinessScreen';
import { MapScreen } from './screens/MapScreen';
import { BusinessDashboardScreen } from './screens/BusinessDashboardScreen';
import { AdminDashboardScreen } from './screens/AdminDashboardScreen';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('splash');
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [adCreatives, setAdCreatives] = useState<AdCreative[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [businesses, setBusinesses] = useState<Business[]>(BUSINESSES);
  const [claimRequests, setClaimRequests] = useState<ClaimRequest[]>([]);
  const [adminNotifications, setAdminNotifications] = useState<AdminNotification[]>([]);

  const handleNavigate = (screen: ScreenType, query?: string) => {
    setCurrentScreen(screen);
    if (query !== undefined) {
      setSearchQuery(query);
    }
    if (screen !== 'details') {
      setSelectedBusiness(null);
    }
  };

  const handleSelectBusiness = (business: Business) => {
    setSelectedBusiness(business);
    setCurrentScreen('details');
  };

  const toggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(fId => fId !== id) : [...prev, id]
    );
  };

  // Determine if we should show the bottom navigation
  const showBottomNav = ['home', 'search', 'favorites', 'profile'].includes(currentScreen);

  return (
    <div className="flex justify-center bg-gray-100 min-h-screen">
      {/* Mobile App Container */}
      <div className="w-full max-w-md bg-white h-screen relative overflow-hidden shadow-2xl sm:rounded-[2.5rem] sm:h-[850px] sm:my-auto sm:border-[8px] sm:border-gray-900">
        
        {/* Dynamic Screen Rendering */}
        {currentScreen === 'splash' && <SplashScreen onNavigate={handleNavigate} />}
        {currentScreen === 'login' && <LoginScreen onNavigate={handleNavigate} />}
        
        {currentScreen === 'home' && (
          <HomeScreen 
            onNavigate={handleNavigate} 
            onSelectBusiness={handleSelectBusiness}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
          />
        )}
        
        {currentScreen === 'search' && (
          <SearchScreen 
            onNavigate={handleNavigate} 
            onSelectBusiness={handleSelectBusiness}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            initialQuery={searchQuery}
          />
        )}
        
        {currentScreen === 'details' && selectedBusiness && (
          <BusinessDetailsScreen 
            business={selectedBusiness} 
            onBack={() => handleNavigate('home')}
            isFavorite={favorites.includes(selectedBusiness.id)}
            onToggleFavorite={toggleFavorite}
          />
        )}
        
        {currentScreen === 'favorites' && (
          <FavoritesScreen 
            onNavigate={handleNavigate} 
            onSelectBusiness={handleSelectBusiness}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
          />
        )}
        
        {currentScreen === 'profile' && <ProfileScreen onNavigate={handleNavigate} />}
        
        {currentScreen === 'register' && <RegisterBusinessScreen onNavigate={handleNavigate} />}
        
        {currentScreen === 'map' && (
          <MapScreen 
            onNavigate={handleNavigate} 
            onSelectBusiness={handleSelectBusiness} 
          />
        )}

        {currentScreen === 'businessDashboard' && (
          <BusinessDashboardScreen 
            onNavigate={handleNavigate} 
            adCreatives={adCreatives}
            setAdCreatives={setAdCreatives}
            businesses={businesses}
            setBusinesses={setBusinesses}
            campaigns={campaigns}
            setCampaigns={setCampaigns}
            setClaimRequests={setClaimRequests}
            setAdminNotifications={setAdminNotifications}
          />
        )}

        {currentScreen === 'adminDashboard' && (
          <AdminDashboardScreen 
            onNavigate={handleNavigate} 
            adCreatives={adCreatives}
            setAdCreatives={setAdCreatives}
            businesses={businesses}
            setBusinesses={setBusinesses}
            claimRequests={claimRequests}
            setClaimRequests={setClaimRequests}
            adminNotifications={adminNotifications}
            setAdminNotifications={setAdminNotifications}
          />
        )}

        {/* Bottom Navigation */}
        {showBottomNav && (
          <BottomNav currentScreen={currentScreen} onNavigate={handleNavigate} />
        )}
      </div>
    </div>
  );
}
