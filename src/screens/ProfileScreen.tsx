import React from 'react';
import { ScreenType } from '../types';
import { User, Settings, Star, Clock, MapPin, ChevronRight, LogOut, PlusCircle, Briefcase } from 'lucide-react';

export const ProfileScreen = ({ onNavigate }: { onNavigate: (s: ScreenType) => void }) => {
  const menuItems = [
    { icon: MapPin, label: 'Saved Addresses', value: '3', action: () => {} },
    { icon: Star, label: 'My Reviews', value: '12', action: () => {} },
    { icon: Clock, label: 'Recent Searches', value: '', action: () => {} },
    { icon: Settings, label: 'Settings', value: '', action: () => {} },
    { icon: Briefcase, label: 'B2B Portal Login', value: '', action: () => onNavigate('login') },
  ];

  return (
    <div className="flex flex-col h-full bg-gray-50 pb-20 overflow-y-auto scrollbar-hide">
      {/* Header */}
      <div className="bg-blue-600 px-4 pt-safe pb-16 relative">
        <h1 className="text-2xl font-bold text-white mt-2">Profile</h1>
      </div>

      {/* Profile Card */}
      <div className="px-4 -mt-10 relative z-10">
        <div className="bg-white rounded-2xl shadow-sm p-4 flex items-center gap-4">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 border-4 border-white shadow-sm">
            <User size={32} />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900">Alex Johnson</h2>
            <p className="text-sm text-gray-500">+1 234 567 8900</p>
          </div>
          <button className="text-blue-600 text-sm font-bold bg-blue-50 px-3 py-1.5 rounded-lg">
            Edit
          </button>
        </div>
      </div>

      {/* Register Business CTA */}
      <div className="px-4 mt-4">
        <div 
          onClick={() => onNavigate('register')}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-4 flex items-center justify-between text-white shadow-sm cursor-pointer active:scale-[0.98] transition-transform"
        >
          <div>
            <h3 className="font-bold text-lg mb-1">Add Your Business</h3>
            <p className="text-blue-100 text-sm">Reach thousands of local customers</p>
          </div>
          <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
            <PlusCircle size={24} />
          </div>
        </div>
      </div>

      {/* Menu Options */}
      <div className="px-4 mt-6">
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 px-2">Account</h3>
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div 
                key={index} 
                onClick={item.action}
                className={`flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                  index !== menuItems.length - 1 ? 'border-b border-gray-100' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-50 rounded-full flex items-center justify-center">
                    <Icon size={18} className="text-gray-600" />
                  </div>
                  <span className="font-medium text-gray-900">{item.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  {item.value && <span className="text-sm text-gray-400 font-medium">{item.value}</span>}
                  <ChevronRight size={18} className="text-gray-300" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Logout */}
      <div className="px-4 mt-6 mb-8">
        <button 
          onClick={() => onNavigate('login')}
          className="w-full bg-white border border-red-100 text-red-500 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-sm active:scale-[0.98] transition-transform"
        >
          <LogOut size={20} /> Log Out
        </button>
      </div>
    </div>
  );
};
