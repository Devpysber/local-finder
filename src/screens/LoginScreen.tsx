import React, { useState } from 'react';
import { ScreenType } from '../types';
import { MapPin, Phone, ArrowRight, Briefcase, ShieldCheck, User } from 'lucide-react';

export const LoginScreen = ({ onNavigate }: { onNavigate: (s: ScreenType) => void }) => {
  const [loginType, setLoginType] = useState<'user' | 'business' | 'admin'>('user');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');

  const handleContinue = () => {
    if (step === 'phone' && phone.length >= 10) {
      setStep('otp');
    } else if (step === 'otp' && otp.length === 4) {
      if (loginType === 'business') {
        onNavigate('businessDashboard');
      } else if (loginType === 'admin') {
        onNavigate('adminDashboard');
      } else {
        onNavigate('home');
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-white px-6 pt-12">
      <div className="flex items-center gap-2 mb-8">
        <MapPin size={28} className="text-blue-600" />
        <span className="text-2xl font-bold text-gray-900">LocalFinder</span>
      </div>

      <div className="flex bg-gray-100 p-1 rounded-xl mb-8">
        <button 
          onClick={() => { setLoginType('user'); setStep('phone'); setPhone(''); setOtp(''); }}
          className={`flex-1 py-2 text-sm font-bold rounded-lg flex items-center justify-center gap-2 transition-all ${loginType === 'user' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'}`}
        >
          <User size={16} /> User
        </button>
        <button 
          onClick={() => { setLoginType('business'); setStep('phone'); setPhone(''); setOtp(''); }}
          className={`flex-1 py-2 text-sm font-bold rounded-lg flex items-center justify-center gap-2 transition-all ${loginType === 'business' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'}`}
        >
          <Briefcase size={16} /> Business
        </button>
        <button 
          onClick={() => { setLoginType('admin'); setStep('phone'); setPhone(''); setOtp(''); }}
          className={`flex-1 py-2 text-sm font-bold rounded-lg flex items-center justify-center gap-2 transition-all ${loginType === 'admin' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'}`}
        >
          <ShieldCheck size={16} /> Admin
        </button>
      </div>

      <div className="flex-1">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          {step === 'phone' ? (loginType === 'user' ? 'Welcome back' : `${loginType === 'business' ? 'Business' : 'Admin'} Portal`) : 'Verify your number'}
        </h2>
        <p className="text-gray-500 mb-8">
          {step === 'phone' 
            ? 'Enter your mobile number to continue' 
            : `We've sent a 4-digit code to ${phone}`}
        </p>

        {step === 'phone' ? (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number</label>
            <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
              <div className="bg-gray-50 px-4 py-3 border-r border-gray-300 text-gray-600 font-medium">
                +1
              </div>
              <input
                type="tel"
                placeholder="Enter 10 digit number"
                className="flex-1 px-4 py-3 outline-none text-gray-900"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
              />
            </div>
          </div>
        ) : (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Enter OTP</label>
            <div className="flex gap-3 justify-between">
              {[0, 1, 2, 3].map((index) => (
                <input
                  key={index}
                  type="text"
                  maxLength={1}
                  className="w-14 h-14 text-center text-2xl font-bold border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                  value={otp[index] || ''}
                  onChange={(e) => {
                    const newOtp = otp.split('');
                    newOtp[index] = e.target.value;
                    setOtp(newOtp.join(''));
                    if (e.target.value && e.target.nextSibling) {
                      (e.target.nextSibling as HTMLInputElement).focus();
                    }
                  }}
                />
              ))}
            </div>
            <button className="text-blue-600 text-sm font-medium mt-4">Resend OTP</button>
          </div>
        )}

        <button
          onClick={handleContinue}
          disabled={step === 'phone' ? phone.length < 10 : otp.length < 4}
          className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity mt-4"
        >
          {step === 'phone' ? 'Continue' : 'Verify & Login'}
          <ArrowRight size={20} />
        </button>

        {step === 'phone' && loginType === 'user' && (
          <>
            <div className="flex items-center my-8">
              <div className="flex-1 border-t border-gray-200"></div>
              <span className="px-4 text-gray-400 text-sm">or continue with</span>
              <div className="flex-1 border-t border-gray-200"></div>
            </div>

            <button 
              onClick={() => onNavigate('home')}
              className="w-full border border-gray-300 text-gray-700 py-3.5 rounded-xl font-semibold flex justify-center items-center gap-3 hover:bg-gray-50 transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Google
            </button>
          </>
        )}
      </div>
    </div>
  );
};
