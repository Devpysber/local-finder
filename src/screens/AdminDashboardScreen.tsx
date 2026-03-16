import React, { useState } from 'react';
import { ScreenType, AdCreative, Business, User, ClaimRequest, AdminNotification } from '../types';
import { USERS } from '../data';
import { 
  ShieldCheck, 
  Users as UsersIcon, 
  Briefcase, 
  Activity, 
  AlertTriangle, 
  Settings, 
  LogOut,
  ChevronRight,
  BarChart,
  CheckCircle,
  XCircle,
  Image as ImageIcon,
  MapPin,
  Star,
  Edit2,
  Trash2,
  Plus,
  Bell
} from 'lucide-react';

export const AdminDashboardScreen = ({ 
  onNavigate,
  adCreatives,
  setAdCreatives,
  businesses,
  setBusinesses,
  claimRequests,
  setClaimRequests,
  adminNotifications,
  setAdminNotifications
}: { 
  onNavigate: (s: ScreenType) => void,
  adCreatives: AdCreative[],
  setAdCreatives: React.Dispatch<React.SetStateAction<AdCreative[]>>,
  businesses: Business[],
  setBusinesses: React.Dispatch<React.SetStateAction<Business[]>>,
  claimRequests: ClaimRequest[],
  setClaimRequests: React.Dispatch<React.SetStateAction<ClaimRequest[]>>,
  adminNotifications: AdminNotification[],
  setAdminNotifications: React.Dispatch<React.SetStateAction<AdminNotification[]>>
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'creatives' | 'listings' | 'users' | 'history'>('overview');
  const [showBusinessModal, setShowBusinessModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [editingBusiness, setEditingBusiness] = useState<Business | null>(null);
  const [businessFormData, setBusinessFormData] = useState<Partial<Business>>({
    name: '',
    category: '',
    address: '',
    phone: '',
    website: '',
    description: '',
    image: 'https://picsum.photos/seed/newbiz/400/300'
  });

  const handleUpdateAdStatus = (id: string, status: 'approved' | 'rejected') => {
    setAdCreatives(prev => prev.map(c => c.id === id ? { ...c, status } : c));
  };

  const handleUpdateClaimStatus = (id: string, status: 'claimed' | 'unclaimed') => {
    setBusinesses(prev => prev.map(b => b.id === id ? { ...b, claimStatus: status } : b));
    
    // Update claim request status if it exists
    setClaimRequests(prev => prev.map(req => 
      req.businessId === id && req.status === 'pending' 
        ? { ...req, status: status === 'claimed' ? 'approved' : 'rejected' } 
        : req
    ));
  };

  const pendingCreatives = adCreatives.filter(c => c.status === 'pending');
  const pendingClaims = businesses.filter(b => b.claimStatus === 'pending');

  const handleOpenAddBusiness = () => {
    setEditingBusiness(null);
    setBusinessFormData({
      name: '',
      category: '',
      address: '',
      phone: '',
      website: '',
      description: '',
      image: `https://picsum.photos/seed/${Date.now()}/400/300`
    });
    setShowBusinessModal(true);
  };

  const handleOpenEditBusiness = (business: Business) => {
    setEditingBusiness(business);
    setBusinessFormData(business);
    setShowBusinessModal(true);
  };

  const handleDeleteBusiness = (id: string) => {
    if (window.confirm('Are you sure you want to delete this listing?')) {
      setBusinesses(prev => prev.filter(b => b.id !== id));
    }
  };

  const handleSaveBusiness = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingBusiness) {
      setBusinesses(prev => prev.map(b => b.id === editingBusiness.id ? { ...b, ...businessFormData } as Business : b));
    } else {
      const newBusiness: Business = {
        ...(businessFormData as Business),
        id: `b_${Date.now()}`,
        rating: 0,
        reviewsCount: 0,
        services: [],
        images: [businessFormData.image || ''],
        reviews: [],
        claimStatus: 'unclaimed'
      };
      setBusinesses([newBusiness, ...businesses]);
    }
    setShowBusinessModal(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBusinessFormData({ ...businessFormData, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const unreadNotificationsCount = adminNotifications.filter(n => !n.read).length;

  const markNotificationsAsRead = () => {
    setAdminNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 overflow-y-auto scrollbar-hide pb-20">
      {/* Header */}
      <div className="bg-gray-900 px-6 pt-12 pb-6 rounded-b-3xl shadow-md">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Admin Portal</h1>
            <p className="text-gray-400 text-sm">System overview & management</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <button 
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  if (!showNotifications) markNotificationsAsRead();
                }}
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white backdrop-blur-sm relative"
              >
                <Bell size={18} />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-gray-900"></span>
                )}
              </button>
              
              {showNotifications && (
                <div className="absolute top-12 right-0 w-64 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="p-3 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                    <h3 className="font-bold text-gray-900 text-sm">Notifications</h3>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {adminNotifications.length === 0 ? (
                      <p className="text-xs text-gray-500 text-center py-4">No notifications</p>
                    ) : (
                      adminNotifications.map(notif => (
                        <div key={notif.id} className="p-3 border-b border-gray-50 hover:bg-gray-50 transition-colors">
                          <p className="text-xs text-gray-800">{notif.message}</p>
                          <p className="text-[10px] text-gray-400 mt-1">{notif.date}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
            <button 
              onClick={() => onNavigate('login')}
              className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white backdrop-blur-sm"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-400 text-xs font-medium">Total Users</p>
              <UsersIcon size={14} className="text-blue-400" />
            </div>
            <p className="text-2xl font-bold text-white">{USERS.length}</p>
            <p className="text-green-400 text-[10px] mt-1">Active accounts</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-400 text-xs font-medium">Pending Actions</p>
              <AlertTriangle size={14} className="text-amber-400" />
            </div>
            <p className="text-2xl font-bold text-white">{pendingCreatives.length + pendingClaims.length}</p>
            <p className="text-amber-400 text-[10px] mt-1">Requires review</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex px-4 mt-4 gap-2 overflow-x-auto scrollbar-hide pb-2">
        <button 
          onClick={() => setActiveTab('overview')}
          className={`shrink-0 px-4 py-2.5 rounded-xl text-sm font-bold transition-colors ${activeTab === 'overview' ? 'bg-gray-900 text-white shadow-sm' : 'bg-white text-gray-600 border border-gray-200'}`}
        >
          Overview
        </button>
        <button 
          onClick={() => setActiveTab('listings')}
          className={`shrink-0 px-4 py-2.5 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2 ${activeTab === 'listings' ? 'bg-gray-900 text-white shadow-sm' : 'bg-white text-gray-600 border border-gray-200'}`}
        >
          Listings
          {pendingClaims.length > 0 && (
            <span className="bg-amber-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
              {pendingClaims.length}
            </span>
          )}
        </button>
        <button 
          onClick={() => setActiveTab('creatives')}
          className={`shrink-0 px-4 py-2.5 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2 ${activeTab === 'creatives' ? 'bg-gray-900 text-white shadow-sm' : 'bg-white text-gray-600 border border-gray-200'}`}
        >
          Ads
          {pendingCreatives.length > 0 && (
            <span className="bg-amber-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
              {pendingCreatives.length}
            </span>
          )}
        </button>
        <button 
          onClick={() => setActiveTab('users')}
          className={`shrink-0 px-4 py-2.5 rounded-xl text-sm font-bold transition-colors ${activeTab === 'users' ? 'bg-gray-900 text-white shadow-sm' : 'bg-white text-gray-600 border border-gray-200'}`}
        >
          Users
        </button>
        <button 
          onClick={() => setActiveTab('history')}
          className={`shrink-0 px-4 py-2.5 rounded-xl text-sm font-bold transition-colors ${activeTab === 'history' ? 'bg-gray-900 text-white shadow-sm' : 'bg-white text-gray-600 border border-gray-200'}`}
        >
          History
        </button>
      </div>

      <div className="px-4 py-4 flex flex-col gap-4">
        {activeTab === 'overview' ? (
          <>
            <h2 className="text-lg font-bold text-gray-900 px-2">AI Ads Platform</h2>

            {/* Global AI Performance */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-start gap-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center shrink-0">
                <BarChart size={24} className="text-indigo-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 mb-1">Global AI Performance</h3>
                <p className="text-xs text-gray-500 mb-3 leading-relaxed">
                  Monitor the overall performance of Creative, Targeting, and Optimizing AI across all business accounts.
                </p>
                <button className="text-indigo-600 text-xs font-bold flex items-center gap-1">
                  View Metrics <ChevronRight size={14} />
                </button>
              </div>
            </div>

            {/* Platform Integrations */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                <Activity size={24} className="text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 mb-1">Platform Integrations</h3>
                <p className="text-xs text-gray-500 mb-3 leading-relaxed">
                  Manage API connections for Facebook, Instagram, and Google Ads publishing.
                </p>
                <button className="text-blue-600 text-xs font-bold flex items-center gap-1">
                  Manage APIs <ChevronRight size={14} />
                </button>
              </div>
            </div>

            <h2 className="text-lg font-bold text-gray-900 px-2 mt-4">System Health</h2>

            <div className="grid grid-cols-2 gap-4">
              {/* Moderation Queue */}
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col items-center text-center">
                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center mb-3">
                  <AlertTriangle size={20} className="text-amber-600" />
                </div>
                <h3 className="font-bold text-gray-900 text-sm mb-1">Moderation</h3>
                <p className="text-[10px] text-gray-500">{pendingCreatives.length + pendingClaims.length} items pending review</p>
              </div>

              {/* System Settings */}
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col items-center text-center">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                  <Settings size={20} className="text-gray-600" />
                </div>
                <h3 className="font-bold text-gray-900 text-sm mb-1">Settings</h3>
                <p className="text-[10px] text-gray-500">Configure global app parameters</p>
              </div>
            </div>
          </>
        ) : activeTab === 'creatives' ? (
          <>
            <div className="flex justify-between items-center px-2">
              <h2 className="text-lg font-bold text-gray-900">AI Creatives Review</h2>
              <span className="text-xs text-gray-500">{adCreatives.length} Total</span>
            </div>

            {adCreatives.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center border border-gray-100 shadow-sm">
                <ImageIcon size={48} className="text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 font-medium">No AI creatives generated yet.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {adCreatives.map(creative => (
                  <div key={creative.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                    <div className="h-48 w-full bg-gray-200 relative">
                      <img src={creative.imageUrl} alt="Ad Creative" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      <div className="absolute top-3 right-3">
                        <span className={`text-xs font-bold px-3 py-1.5 rounded-full shadow-md text-white ${
                          creative.status === 'approved' ? 'bg-green-500' : 
                          creative.status === 'rejected' ? 'bg-red-500' : 'bg-amber-500'
                        }`}>
                          {creative.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-bold text-gray-900">{creative.businessName}</h3>
                          <p className="text-xs text-gray-500">Promoting: {creative.productOrService}</p>
                        </div>
                        <span className="text-[10px] text-gray-400">{creative.date}</span>
                      </div>
                      
                      <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 mb-4">
                        <p className="text-sm text-gray-700 font-medium italic">"{creative.copy}"</p>
                      </div>

                      {creative.status === 'pending' && (
                        <div className="flex gap-3">
                          <button 
                            onClick={() => handleUpdateAdStatus(creative.id, 'rejected')}
                            className="flex-1 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 text-red-600 bg-red-50 border border-red-100 active:scale-[0.98] transition-transform"
                          >
                            <XCircle size={18} /> Reject
                          </button>
                          <button 
                            onClick={() => handleUpdateAdStatus(creative.id, 'approved')}
                            className="flex-1 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 text-green-600 bg-green-50 border border-green-100 active:scale-[0.98] transition-transform"
                          >
                            <CheckCircle size={18} /> Approve
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : activeTab === 'listings' ? (
          <>
            <div className="flex justify-between items-center px-2">
              <h2 className="text-lg font-bold text-gray-900">Listings Management</h2>
              <button 
                onClick={handleOpenAddBusiness}
                className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm"
              >
                <Plus size={14} /> Add Listing
              </button>
            </div>

            <div className="flex flex-col gap-4">
              {businesses.map(business => (
                <div key={business.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col gap-3">
                  <div className="flex items-start gap-3">
                    <img src={business.image} alt={business.name} className="w-16 h-16 rounded-xl object-cover" referrerPolicy="no-referrer" />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold text-gray-900">{business.name}</h3>
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider ${
                            business.claimStatus === 'claimed' ? 'bg-green-100 text-green-700' :
                            business.claimStatus === 'pending' ? 'bg-amber-100 text-amber-700' :
                            'bg-gray-100 text-gray-600'
                          }`}>
                            {business.claimStatus || 'unclaimed'}
                          </span>
                          <button onClick={() => handleOpenEditBusiness(business)} className="text-gray-400 hover:text-blue-600">
                            <Edit2 size={14} />
                          </button>
                          <button onClick={() => handleDeleteBusiness(business.id)} className="text-gray-400 hover:text-red-600">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                        <MapPin size={12} /> {business.address}
                      </p>
                    </div>
                  </div>

                  {business.claimStatus === 'pending' && (
                    <div className="flex gap-2 pt-2 border-t border-gray-100">
                      <button 
                        onClick={() => handleUpdateClaimStatus(business.id, 'unclaimed')}
                        className="flex-1 py-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1 text-red-600 bg-red-50 border border-red-100"
                      >
                        <XCircle size={14} /> Reject Claim
                      </button>
                      <button 
                        onClick={() => handleUpdateClaimStatus(business.id, 'claimed')}
                        className="flex-1 py-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1 text-green-600 bg-green-50 border border-green-100"
                      >
                        <CheckCircle size={14} /> Approve Claim
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        ) : activeTab === 'users' ? (
          <>
            <div className="flex justify-between items-center px-2">
              <h2 className="text-lg font-bold text-gray-900">User Management</h2>
              <span className="text-xs text-gray-500">{USERS.length} Total</span>
            </div>

            <div className="flex flex-col gap-3">
              {USERS.map(user => (
                <div key={user.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-sm">{user.name}</h3>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      user.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                      user.role === 'business' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {user.role}
                    </span>
                    <span className="text-[10px] text-green-600 font-medium">{user.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="flex justify-between items-center px-2">
              <h2 className="text-lg font-bold text-gray-900">Claim History</h2>
              <span className="text-xs text-gray-500">{claimRequests.length} Total</span>
            </div>

            <div className="flex flex-col gap-3">
              {claimRequests.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No claim requests history.</p>
              ) : (
                claimRequests.map(request => (
                  <div key={request.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-gray-900 text-sm">{request.businessName}</h3>
                      <p className="text-xs text-gray-500">Requested by User ID: {request.userId}</p>
                      <p className="text-[10px] text-gray-400 mt-1">{request.date}</p>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider ${
                      request.status === 'approved' ? 'bg-green-100 text-green-700' :
                      request.status === 'rejected' ? 'bg-red-100 text-red-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {request.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>

      {/* Business Modal */}
      {showBusinessModal && (
        <div className="absolute inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowBusinessModal(false)}></div>
          <div className="bg-white rounded-t-3xl p-6 flex flex-col relative z-10 animate-in slide-in-from-bottom-full duration-300 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Briefcase size={20} className="text-blue-600" /> 
                {editingBusiness ? 'Edit Listing' : 'Add New Listing'}
              </h2>
              <button 
                onClick={() => setShowBusinessModal(false)} 
                className="p-2 text-gray-500 bg-gray-100 rounded-full"
              >
                <XCircle size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveBusiness} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Business Image</label>
                <div className="flex items-center gap-4">
                  {businessFormData.image && (
                    <img src={businessFormData.image} alt="Preview" className="w-16 h-16 rounded-xl object-cover border border-gray-200" />
                  )}
                  <div className="flex-1">
                    <input 
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 outline-none"
                    />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Business Name</label>
                <input 
                  required
                  type="text"
                  value={businessFormData.name || ''}
                  onChange={e => setBusinessFormData({...businessFormData, name: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Category</label>
                <input 
                  required
                  type="text"
                  value={businessFormData.category || ''}
                  onChange={e => setBusinessFormData({...businessFormData, category: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Address</label>
                <input 
                  required
                  type="text"
                  value={businessFormData.address || ''}
                  onChange={e => setBusinessFormData({...businessFormData, address: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Phone</label>
                  <input 
                    required
                    type="text"
                    value={businessFormData.phone || ''}
                    onChange={e => setBusinessFormData({...businessFormData, phone: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Website</label>
                  <input 
                    type="text"
                    value={businessFormData.website || ''}
                    onChange={e => setBusinessFormData({...businessFormData, website: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                <textarea 
                  required
                  rows={3}
                  value={businessFormData.description || ''}
                  onChange={e => setBusinessFormData({...businessFormData, description: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold shadow-sm mt-2"
              >
                {editingBusiness ? 'Save Changes' : 'Create Listing'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
