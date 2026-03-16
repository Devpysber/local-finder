import React, { useEffect } from 'react';
import { MapPin } from 'lucide-react';
import { ScreenType } from '../types';

export const SplashScreen = ({ onNavigate }: { onNavigate: (s: ScreenType) => void }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onNavigate('home');
    }, 2000);
    return () => clearTimeout(timer);
  }, [onNavigate]);

  return (
    <div className="flex flex-col items-center justify-center h-full bg-blue-600 text-white">
      <div className="animate-bounce mb-4">
        <MapPin size={64} className="text-white" />
      </div>
      <h1 className="text-4xl font-bold tracking-tight">LocalFinder</h1>
      <p className="text-blue-100 mt-2 font-medium">Find anything, anywhere</p>
      
      <div className="absolute bottom-10 flex gap-2">
        <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
        <div className="w-2 h-2 rounded-full bg-white animate-pulse delay-75"></div>
        <div className="w-2 h-2 rounded-full bg-white animate-pulse delay-150"></div>
      </div>
    </div>
  );
};
