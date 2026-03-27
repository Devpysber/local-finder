import React, { useState, useEffect } from 'react';
import { ScreenType, Business, AdCreative, Campaign, ClaimRequest, AdminNotification, UserNotification } from './types';
import { BottomNav } from './components';
import { api } from './services/api';

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
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [claimRequests, setClaimRequests] = useState<ClaimRequest[]>([]);
  const [adminNotifications, setAdminNotifications] = useState<AdminNotification[]>([]);
  const [userNotifications, setUserNotifications] = useState<UserNotification[]>([]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const { data } = await api.getBusinesses(1, 20);
        setBusinesses(data);
      } catch (err: any) {
        console.error('Failed to load businesses:', err);
        setError(err.message || 'Failed to connect to the server.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  if (error && businesses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50 p-6 text-center">
        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Connection Error</h1>
        <p className="text-gray-600 mb-6 max-w-md">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

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
            businesses={businesses}
            isLoading={isLoading}
          />
        )}
        
        {currentScreen === 'search' && (
          <SearchScreen 
            onNavigate={handleNavigate} 
            onSelectBusiness={handleSelectBusiness}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            initialQuery={searchQuery}
            businesses={businesses}
          />
        )}
        
        {currentScreen === 'details' && selectedBusiness && (
          <BusinessDetailsScreen 
            business={selectedBusiness} 
            onBack={() => handleNavigate('home')}
            isFavorite={favorites.includes(selectedBusiness.id)}
            onToggleFavorite={toggleFavorite}
            setClaimRequests={setClaimRequests}
            setAdminNotifications={setAdminNotifications}
            setBusinesses={setBusinesses}
          />
        )}
        
        {currentScreen === 'favorites' && (
          <FavoritesScreen 
            onNavigate={handleNavigate} 
            onSelectBusiness={handleSelectBusiness}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            businesses={businesses}
          />
        )}
        
        {currentScreen === 'profile' && <ProfileScreen onNavigate={handleNavigate} />}
        
        {currentScreen === 'register' && <RegisterBusinessScreen onNavigate={handleNavigate} />}
        
        {currentScreen === 'map' && (
          <MapScreen 
            onNavigate={handleNavigate} 
            onSelectBusiness={handleSelectBusiness} 
            businesses={businesses}
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
            userNotifications={userNotifications}
            setUserNotifications={setUserNotifications}
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
            userNotifications={userNotifications}
            setUserNotifications={setUserNotifications}
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
