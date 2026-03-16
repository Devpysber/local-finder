import React, { useState } from 'react';
import { ScreenType } from '../types';
import { ArrowLeft, Upload, MapPin, CheckCircle2 } from 'lucide-react';

export const RegisterBusinessScreen = ({ onNavigate }: { onNavigate: (s: ScreenType) => void }) => {
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      onNavigate('profile');
    }, 2000);
  };

  if (isSubmitted) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-white px-6 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 size={40} className="text-green-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Registration Successful!</h2>
        <p className="text-gray-500 mb-8 max-w-xs">
          Your business has been submitted for review. We'll notify you once it's approved.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-50 overflow-y-auto scrollbar-hide">
      {/* Header */}
      <div className="bg-white px-4 pt-safe pb-4 shadow-sm sticky top-0 z-10 flex items-center gap-3">
        <button onClick={() => onNavigate('profile')} className="p-2 -ml-2 text-gray-700">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold text-gray-900">Add Business</h1>
      </div>

      {/* Progress */}
      <div className="bg-white px-4 py-3 border-t border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-blue-600">Step {step} of 2</span>
          <span className="text-xs font-medium text-gray-500">{step === 1 ? 'Basic Info' : 'Details & Photos'}</span>
        </div>
        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-600 rounded-full transition-all duration-300" 
            style={{ width: step === 1 ? '50%' : '100%' }}
          ></div>
        </div>
      </div>

      {/* Form */}
      <div className="p-4">
        <form onSubmit={step === 2 ? handleSubmit : (e) => { e.preventDefault(); setStep(2); }}>
          {step === 1 ? (
            <div className="flex flex-col gap-4">
              <div className="bg-white p-4 rounded-2xl shadow-sm">
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Business Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Joe's Coffee Shop" 
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
              </div>

              <div className="bg-white p-4 rounded-2xl shadow-sm">
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Category</label>
                <select 
                  required
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all appearance-none"
                >
                  <option value="" disabled selected>Select a category</option>
                  <option value="restaurants">Restaurants</option>
                  <option value="hotels">Hotels</option>
                  <option value="plumbers">Plumbers</option>
                  <option value="electricians">Electricians</option>
                  <option value="doctors">Doctors</option>
                  <option value="salons">Salons</option>
                  <option value="gyms">Gyms</option>
                </select>
              </div>

              <div className="bg-white p-4 rounded-2xl shadow-sm">
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Phone Number</label>
                <input 
                  type="tel" 
                  required
                  placeholder="+1 (234) 567-8900" 
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
              </div>

              <div className="bg-white p-4 rounded-2xl shadow-sm">
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Address</label>
                <div className="relative">
                  <input 
                    type="text" 
                    required
                    placeholder="Enter full address" 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  />
                  <MapPin size={18} className="absolute left-3 top-3.5 text-gray-400" />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="bg-white p-4 rounded-2xl shadow-sm">
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Description</label>
                <textarea 
                  required
                  rows={4}
                  placeholder="Tell customers about your business..." 
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none"
                ></textarea>
              </div>

              <div className="bg-white p-4 rounded-2xl shadow-sm">
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Opening Hours</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Mon-Fri: 9AM - 5PM" 
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
              </div>

              <div className="bg-white p-4 rounded-2xl shadow-sm">
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Photos</label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                    <Upload size={24} className="text-blue-600" />
                  </div>
                  <p className="text-sm font-bold text-gray-900 mb-1">Upload Photos</p>
                  <p className="text-xs text-gray-500 text-center">PNG, JPG up to 5MB</p>
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 mb-8">
            <button 
              type="submit"
              className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg shadow-sm active:scale-[0.98] transition-transform"
            >
              {step === 1 ? 'Continue' : 'Submit Registration'}
            </button>
            {step === 2 && (
              <button 
                type="button"
                onClick={() => setStep(1)}
                className="w-full bg-white text-gray-700 py-4 rounded-xl font-bold text-lg mt-3 active:scale-[0.98] transition-transform"
              >
                Back
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
