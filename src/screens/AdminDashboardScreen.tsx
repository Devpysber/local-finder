import React, { useState } from 'react';
import { LineChart, Line, BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ScreenType, AdCreative, Business, User, ClaimRequest, AdminNotification, UserNotification } from '../types';
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
  Bell,
  Search,
  AlertCircle
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
  setAdminNotifications,
  setUserNotifications
}: { 
  onNavigate: (s: ScreenType) => void,
  adCreatives: AdCreative[],
  setAdCreatives: React.Dispatch<React.SetStateAction<AdCreative[]>>,
  businesses: Business[],
  setBusinesses: React.Dispatch<React.SetStateAction<Business[]>>,
  claimRequests: ClaimRequest[],
  setClaimRequests: React.Dispatch<React.SetStateAction<ClaimRequest[]>>,
  adminNotifications: AdminNotification[],
  setAdminNotifications: React.Dispatch<React.SetStateAction<AdminNotification[]>>,
  setUserNotifications: React.Dispatch<React.SetStateAction<UserNotification[]>>
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'creatives' | 'listings' | 'users' | 'history' | 'verification' | 'analytics'>('overview');
  const [showBusinessModal, setShowBusinessModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [editingBusiness, setEditingBusiness] = useState<Business | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Modals state
  const [claimAction, setClaimAction] = useState<{ id: string, name: string, status: 'claimed' | 'unclaimed' } | null>(null);
  const [userAction, setUserAction] = useState<{ type: 'role' | 'status', id: string, name: string, value: string } | null>(null);
  const [viewingBusiness, setViewingBusiness] = useState<Business | null>(null);

  const [users, setUsers] = useState<User[]>(USERS);
  const [businessFormData, setBusinessFormData] = useState<Partial<Business>>({
    name: '',
    category: '',
    address: '',
    phone: '',
    website: '',
    description: '',
    image: 'https://picsum.photos/seed/newbiz/400/300'
  });

  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState<'all' | 'user' | 'business' | 'admin'>('all');
  const [userStatusFilter, setUserStatusFilter] = useState<'all' | 'active' | 'suspended'>('all');
  const [businessSearchQuery, setBusinessSearchQuery] = useState('');
  const [businessStatusFilter, setBusinessStatusFilter] = useState<'all' | 'claimed' | 'unclaimed' | 'pending'>('all');
  const [businessCategoryFilter, setBusinessCategoryFilter] = useState('all');
  const [businessDateFilter, setBusinessDateFilter] = useState<'all' | 'last7days' | 'last30days' | 'older'>('all');
  const [creativeSearchQuery, setCreativeSearchQuery] = useState('');
  const [creativeStatusFilter, setCreativeStatusFilter] = useState<'all' | 'approved' | 'rejected' | 'pending'>('all');
  const [verificationSearchQuery, setVerificationSearchQuery] = useState('');
  const [historySearchQuery, setHistorySearchQuery] = useState('');
  const [historyStatusFilter, setHistoryStatusFilter] = useState<'all' | 'approved' | 'rejected' | 'pending'>('all');
  const [historySortBy, setHistorySortBy] = useState<'date' | 'businessName' | 'status'>('date');
  const [historySortOrder, setHistorySortOrder] = useState<'asc' | 'desc'>('desc');

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(userSearchQuery.toLowerCase()) || 
                          user.email.toLowerCase().includes(userSearchQuery.toLowerCase());
    const matchesRole = userRoleFilter === 'all' || user.role === userRoleFilter;
    const matchesStatus = userStatusFilter === 'all' || user.status === userStatusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const filteredBusinesses = businesses.filter(business => {
    const matchesSearch = business.name.toLowerCase().includes(businessSearchQuery.toLowerCase()) ||
                          business.address.toLowerCase().includes(businessSearchQuery.toLowerCase());
    const matchesStatus = businessStatusFilter === 'all' || business.claimStatus === businessStatusFilter;
    const matchesCategory = businessCategoryFilter === 'all' || business.category === businessCategoryFilter;
    
    let matchesDate = true;
    if (businessDateFilter !== 'all' && business.dateAdded) {
      const addedDate = new Date(business.dateAdded);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - addedDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (businessDateFilter === 'last7days') matchesDate = diffDays <= 7;
      else if (businessDateFilter === 'last30days') matchesDate = diffDays <= 30;
      else if (businessDateFilter === 'older') matchesDate = diffDays > 30;
    }

    return matchesSearch && matchesStatus && matchesCategory && matchesDate;
  });

  const filteredCreatives = adCreatives.filter(creative => {
    const matchesSearch = creative.businessName.toLowerCase().includes(creativeSearchQuery.toLowerCase()) ||
                          creative.productOrService.toLowerCase().includes(creativeSearchQuery.toLowerCase()) ||
                          creative.copy.toLowerCase().includes(creativeSearchQuery.toLowerCase());
    const matchesStatus = creativeStatusFilter === 'all' || creative.status === creativeStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const pendingCreatives = adCreatives.filter(c => c.status === 'pending');
  const pendingClaims = businesses.filter(b => b.claimStatus === 'pending');

  const filteredPendingClaims = pendingClaims.filter(business => {
    return business.name.toLowerCase().includes(verificationSearchQuery.toLowerCase()) ||
           business.address.toLowerCase().includes(verificationSearchQuery.toLowerCase());
  });

  const filteredHistory = claimRequests.filter(request => {
    const matchesSearch = request.businessName.toLowerCase().includes(historySearchQuery.toLowerCase()) ||
                          request.userId.toLowerCase().includes(historySearchQuery.toLowerCase());
    const matchesStatus = historyStatusFilter === 'all' || request.status === historyStatusFilter;
    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
    let comparison = 0;
    if (historySortBy === 'date') {
      comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
    } else if (historySortBy === 'businessName') {
      comparison = a.businessName.localeCompare(b.businessName);
    } else if (historySortBy === 'status') {
      comparison = a.status.localeCompare(b.status);
    }
    return historySortOrder === 'asc' ? comparison : -comparison;
  });

  const handleUpdateAdStatus = (id: string, status: 'approved' | 'rejected') => {
    setAdCreatives(prev => prev.map(c => c.id === id ? { ...c, status } : c));
  };

  const handleUpdateClaimStatus = (id: string, name: string, status: 'claimed' | 'unclaimed') => {
    setClaimAction({ id, name, status });
  };

  const executeClaimUpdate = () => {
    if (!claimAction) return;
    const { id, status } = claimAction;

    setBusinesses(prev => prev.map(b => b.id === id ? { ...b, claimStatus: status } : b));
    
    // Find the claim request to get the user ID
    const request = claimRequests.find(req => req.businessId === id && req.status === 'pending');
    
    // Update claim request status if it exists
    if (request) {
      setClaimRequests(prev => prev.map(req => 
        req.id === request.id
          ? { ...req, status: status === 'claimed' ? 'approved' : 'rejected' } 
          : req
      ));

      // Notify the user
      const newNotification: UserNotification = {
        id: `unotif_${Date.now()}`,
        userId: request.userId,
        message: status === 'claimed' 
          ? `Your claim for ${request.businessName} has been approved.` 
          : `Your claim for ${request.businessName} has been rejected.`,
        date: new Date().toISOString().split('T')[0],
        read: false,
        type: status === 'claimed' ? 'claim_approved' : 'claim_rejected'
      };
      setUserNotifications(prev => [newNotification, ...prev]);
    }

    setClaimAction(null);
  };

  const handleUpdateUserRole = (id: string, name: string, role: 'admin' | 'business' | 'user') => {
    setUserAction({ type: 'role', id, name, value: role });
  };

  const handleUpdateUserStatus = (id: string, name: string, status: 'active' | 'suspended') => {
    setUserAction({ type: 'status', id, name, value: status });
  };

  const executeUserUpdate = () => {
    if (!userAction) return;
    const { type, id, value } = userAction;
    if (type === 'role') {
      setUsers(prev => prev.map(u => u.id === id ? { ...u, role: value as any } : u));
    } else {
      setUsers(prev => prev.map(u => u.id === id ? { ...u, status: value as any } : u));
    }
    setUserAction(null);
  };

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

  const getClaimAgeTag = (businessId: string) => {
    const request = claimRequests.find(req => req.businessId === businessId && req.status === 'pending');
    if (!request || !request.date) return null;
    
    const requestDate = new Date(request.date).getTime();
    if (isNaN(requestDate)) return null;
    
    const daysOld = (Date.now() - requestDate) / (1000 * 60 * 60 * 24);
    
    if (daysOld < 1) return { label: 'New', color: 'bg-blue-100 text-blue-700' };
    if (daysOld > 3) return { label: 'Urgent', color: 'bg-red-100 text-red-700' };
    return null;
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
          User Profiles
        </button>
        <button 
          onClick={() => setActiveTab('verification')}
          className={`shrink-0 px-4 py-2.5 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2 ${activeTab === 'verification' ? 'bg-gray-900 text-white shadow-sm' : 'bg-white text-gray-600 border border-gray-200'}`}
        >
          Verification
          {pendingClaims.length > 0 && (
            <span className="bg-amber-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
              {pendingClaims.length}
            </span>
          )}
        </button>
        <button 
          onClick={() => setActiveTab('history')}
          className={`shrink-0 px-4 py-2.5 rounded-xl text-sm font-bold transition-colors ${activeTab === 'history' ? 'bg-gray-900 text-white shadow-sm' : 'bg-white text-gray-600 border border-gray-200'}`}
        >
          History
        </button>
        <button 
          onClick={() => setActiveTab('analytics')}
          className={`shrink-0 px-4 py-2.5 rounded-xl text-sm font-bold transition-colors ${activeTab === 'analytics' ? 'bg-gray-900 text-white shadow-sm' : 'bg-white text-gray-600 border border-gray-200'}`}
        >
          Analytics
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
            <div className="flex flex-col gap-3 px-2 mb-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold text-gray-900">AI Creatives Review</h2>
                <span className="text-xs text-gray-500">{adCreatives.length} Total</span>
              </div>

              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Search creatives..."
                    value={creativeSearchQuery}
                    onChange={(e) => setCreativeSearchQuery(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-4 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
                <select
                  value={creativeStatusFilter}
                  onChange={(e) => setCreativeStatusFilter(e.target.value as any)}
                  className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  <option value="all">All Statuses</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </div>

            {filteredCreatives.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center border border-gray-100 shadow-sm">
                <ImageIcon size={48} className="text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 font-medium">No AI creatives found.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {filteredCreatives.map(creative => (
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
            <div className="flex flex-col gap-3 px-2 mb-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold text-gray-900">Listings Management</h2>
                <button 
                  onClick={handleOpenAddBusiness}
                  className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm"
                >
                  <Plus size={14} /> Add Listing
                </button>
              </div>

              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Search businesses..."
                    value={businessSearchQuery}
                    onChange={(e) => setBusinessSearchQuery(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-4 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
                <select
                  value={businessStatusFilter}
                  onChange={(e) => setBusinessStatusFilter(e.target.value as any)}
                  className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  <option value="all">All Statuses</option>
                  <option value="claimed">Claimed</option>
                  <option value="unclaimed">Unclaimed</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
              <div className="flex gap-2">
                <select
                  value={businessCategoryFilter}
                  onChange={(e) => setBusinessCategoryFilter(e.target.value)}
                  className="flex-1 bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  <option value="all">All Categories</option>
                  <option value="Restaurants">Restaurants</option>
                  <option value="Gyms">Gyms</option>
                  <option value="Plumbers">Plumbers</option>
                  <option value="Salons">Salons</option>
                  <option value="Hotels">Hotels</option>
                </select>
                <select
                  value={businessDateFilter}
                  onChange={(e) => setBusinessDateFilter(e.target.value as any)}
                  className="flex-1 bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  <option value="all">All Dates</option>
                  <option value="last7days">Last 7 Days</option>
                  <option value="last30days">Last 30 Days</option>
                  <option value="older">Older</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {filteredBusinesses.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No businesses found.</p>
              ) : (
                filteredBusinesses.map(business => (
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
                </div>
                ))
              )}
            </div>
          </>
        ) : activeTab === 'users' ? (
          <>
            <div className="flex flex-col gap-3 px-2 mb-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold text-gray-900">User Profiles</h2>
                <span className="text-xs text-gray-500">{users.length} Total</span>
              </div>
              
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={userSearchQuery}
                    onChange={(e) => setUserSearchQuery(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-4 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
                <select
                  value={userRoleFilter}
                  onChange={(e) => setUserRoleFilter(e.target.value as any)}
                  className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  <option value="all">All Roles</option>
                  <option value="user">User</option>
                  <option value="business">Business</option>
                  <option value="admin">Admin</option>
                </select>
                <select
                  value={userStatusFilter}
                  onChange={(e) => setUserStatusFilter(e.target.value as any)}
                  className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  <option value="all">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {filteredUsers.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No users found.</p>
              ) : (
                filteredUsers.map(user => (
                <div key={user.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold shrink-0">
                      {user.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 text-sm truncate">{user.name}</h3>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                    <button 
                      onClick={() => setEditingUser(user)}
                      className="p-2 text-gray-400 hover:text-blue-600 bg-gray-50 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit2 size={16} />
                    </button>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <select
                      value={user.role}
                      onChange={(e) => handleUpdateUserRole(user.id, user.name, e.target.value as any)}
                      className={`text-xs font-bold px-2 py-1 rounded-lg border outline-none ${
                        user.role === 'admin' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                        user.role === 'business' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                        'bg-gray-50 text-gray-700 border-gray-200'
                      }`}
                    >
                      <option value="user">User</option>
                      <option value="business">Business</option>
                      <option value="admin">Admin</option>
                    </select>
                    
                    <select
                      value={user.status}
                      onChange={(e) => handleUpdateUserStatus(user.id, user.name, e.target.value as any)}
                      className={`text-xs font-bold px-2 py-1 rounded-lg border outline-none ${
                        user.status === 'active' ? 'bg-green-50 text-green-700 border-green-200' :
                        'bg-red-50 text-red-700 border-red-200'
                      }`}
                    >
                      <option value="active">Active</option>
                      <option value="suspended">Suspended</option>
                    </select>
                  </div>
                </div>
                ))
              )}
            </div>
          </>
        ) : activeTab === 'verification' ? (
          <>
            <div className="flex flex-col gap-3 px-2 mb-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold text-gray-900">Business Verification</h2>
                <span className="text-xs text-gray-500">{pendingClaims.length} Pending</span>
              </div>

              <div className="relative">
                <input
                  type="text"
                  placeholder="Search pending verifications..."
                  value={verificationSearchQuery}
                  onChange={(e) => setVerificationSearchQuery(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-4 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {filteredPendingClaims.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No pending business verifications found.</p>
              ) : (
                filteredPendingClaims.map(business => {
                  const ageTag = getClaimAgeTag(business.id);
                  return (
                    <div key={business.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col gap-3">
                      <div className="flex items-start gap-3">
                        <img src={business.image} alt={business.name} className="w-16 h-16 rounded-xl object-cover" referrerPolicy="no-referrer" />
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <h3 className="font-bold text-gray-900">{business.name}</h3>
                            <div className="flex items-center gap-2">
                              {ageTag && (
                                <span className={`${ageTag.color} text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider`}>
                                  {ageTag.label}
                                </span>
                              )}
                              <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                                Pending
                              </span>
                            </div>
                          </div>
                          <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                            <MapPin size={12} /> {business.address}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">Requested by: {business.ownerId || 'Unknown User'}</p>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2 border-t border-gray-100">
                        <button 
                          onClick={() => setViewingBusiness(business)}
                          className="flex-1 py-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1 text-gray-700 bg-gray-50 border border-gray-200"
                        >
                          View Details
                        </button>
                        <button 
                          onClick={() => handleUpdateClaimStatus(business.id, business.name, 'unclaimed')}
                          className="flex-1 py-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1 text-red-600 bg-red-50 border border-red-100"
                        >
                          <XCircle size={14} /> Reject
                        </button>
                        <button 
                          onClick={() => handleUpdateClaimStatus(business.id, business.name, 'claimed')}
                          className="flex-1 py-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1 text-green-600 bg-green-50 border border-green-100"
                        >
                          <CheckCircle size={14} /> Approve
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </>
        ) : activeTab === 'history' ? (
          <>
            <div className="flex flex-col gap-3 px-2 mb-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold text-gray-900">Claim History</h2>
                <span className="text-xs text-gray-500">{claimRequests.length} Total</span>
              </div>

              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Search history..."
                    value={historySearchQuery}
                    onChange={(e) => setHistorySearchQuery(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-4 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
                <select
                  value={historyStatusFilter}
                  onChange={(e) => setHistoryStatusFilter(e.target.value as any)}
                  className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  <option value="all">All Statuses</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
              <div className="flex gap-2">
                <select
                  value={historySortBy}
                  onChange={(e) => setHistorySortBy(e.target.value as any)}
                  className="flex-1 bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  <option value="date">Sort by Date</option>
                  <option value="businessName">Sort by Business Name</option>
                  <option value="status">Sort by Status</option>
                </select>
                <select
                  value={historySortOrder}
                  onChange={(e) => setHistorySortOrder(e.target.value as any)}
                  className="flex-1 bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  <option value="desc">Descending</option>
                  <option value="asc">Ascending</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {filteredHistory.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No claim requests history found.</p>
              ) : (
                filteredHistory.map(request => (
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
        ) : activeTab === 'analytics' ? (
          <>
            <div className="flex flex-col gap-3 px-2 mb-4">
              <h2 className="text-lg font-bold text-gray-900">Analytics Dashboard</h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col">
                <span className="text-xs text-gray-500 font-medium mb-1">Total Users</span>
                <span className="text-2xl font-bold text-gray-900">{users.length}</span>
              </div>
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col">
                <span className="text-xs text-gray-500 font-medium mb-1">Active Businesses</span>
                <span className="text-2xl font-bold text-gray-900">{businesses.filter(b => b.claimStatus === 'claimed').length}</span>
              </div>
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col">
                <span className="text-xs text-gray-500 font-medium mb-1">New Registrations</span>
                <span className="text-2xl font-bold text-gray-900">124</span>
              </div>
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col">
                <span className="text-xs text-gray-500 font-medium mb-1">Revenue</span>
                <span className="text-2xl font-bold text-gray-900">$12,450</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mt-2">
              <h3 className="text-sm font-bold text-gray-900 mb-4">User Growth</h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={[
                    { name: 'Jan', users: 400 },
                    { name: 'Feb', users: 600 },
                    { name: 'Mar', users: 800 },
                    { name: 'Apr', users: 1200 },
                    { name: 'May', users: 1500 },
                    { name: 'Jun', users: 2100 },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Line type="monotone" dataKey="users" stroke="#4f46e5" strokeWidth={3} dot={{ r: 4, fill: '#4f46e5', strokeWidth: 0 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mt-2">
              <h3 className="text-sm font-bold text-gray-900 mb-4">Revenue by Month</h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart data={[
                    { name: 'Jan', revenue: 4000 },
                    { name: 'Feb', revenue: 3000 },
                    { name: 'Mar', revenue: 5000 },
                    { name: 'Apr', revenue: 8000 },
                    { name: 'May', revenue: 6000 },
                    { name: 'Jun', revenue: 9000 },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                    <Tooltip cursor={{ fill: '#f3f4f6' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Bar dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        ) : null}
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

      {/* Claim Action Confirmation Modal */}
      {claimAction && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setClaimAction(null)}></div>
          <div className="bg-white rounded-2xl p-6 flex flex-col relative z-10 w-full max-w-sm animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-3 rounded-full ${claimAction.status === 'claimed' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                <AlertCircle size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Confirm Action</h3>
                <p className="text-sm text-gray-500">
                  Are you sure you want to {claimAction.status === 'claimed' ? 'approve' : 'reject'} the claim for <span className="font-bold text-gray-900">{claimAction.businessName}</span>?
                </p>
              </div>
            </div>
            <div className="flex gap-3 mt-2">
              <button 
                onClick={() => setClaimAction(null)}
                className="flex-1 py-2.5 rounded-xl font-bold text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={executeClaimUpdate}
                className={`flex-1 py-2.5 rounded-xl font-bold text-sm text-white transition-colors ${
                  claimAction.status === 'claimed' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Action Confirmation Modal */}
      {userAction && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setUserAction(null)}></div>
          <div className="bg-white rounded-2xl p-6 flex flex-col relative z-10 w-full max-w-sm animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-full bg-amber-100 text-amber-600">
                <AlertCircle size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Confirm Change</h3>
                <p className="text-sm text-gray-500">
                  Are you sure you want to change {userAction.userName}'s {userAction.type} to <span className="font-bold text-gray-900">{userAction.newValue}</span>?
                </p>
              </div>
            </div>
            <div className="flex gap-3 mt-2">
              <button 
                onClick={() => setUserAction(null)}
                className="flex-1 py-2.5 rounded-xl font-bold text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={executeUserUpdate}
                className="flex-1 py-2.5 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Business Details Modal */}
      {viewingBusiness && (
        <div className="absolute inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setViewingBusiness(null)}></div>
          <div className="bg-white rounded-t-3xl p-6 flex flex-col relative z-10 animate-in slide-in-from-bottom-full duration-300 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <img src={viewingBusiness.image} alt={viewingBusiness.name} className="w-16 h-16 rounded-xl object-cover" referrerPolicy="no-referrer" />
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{viewingBusiness.name}</h2>
                  <p className="text-sm text-gray-500">{viewingBusiness.category}</p>
                </div>
              </div>
              <button 
                onClick={() => setViewingBusiness(null)} 
                className="p-2 text-gray-500 bg-gray-100 rounded-full"
              >
                <XCircle size={20} />
              </button>
            </div>

            <div className="flex flex-col gap-4 mt-2">
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Claim Request Details</h4>
                <div className="grid grid-cols-2 gap-y-3 text-sm">
                  <div className="text-gray-500">Requested By:</div>
                  <div className="font-medium text-gray-900">{viewingBusiness.ownerId || 'Unknown User'}</div>
                  <div className="text-gray-500">Status:</div>
                  <div className="font-medium text-amber-600">Pending Verification</div>
                  <div className="text-gray-500">Time in Queue:</div>
                  <div className="font-medium text-gray-900">
                    {getClaimAgeTag(viewingBusiness.id)?.label || 'Standard'}
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Business Information</h4>
                <div className="grid grid-cols-1 gap-y-3 text-sm">
                  <div>
                    <span className="text-gray-500 block text-xs mb-0.5">Address</span>
                    <span className="font-medium text-gray-900">{viewingBusiness.address}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-gray-500 block text-xs mb-0.5">Phone</span>
                      <span className="font-medium text-gray-900">{viewingBusiness.phone}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block text-xs mb-0.5">Website</span>
                      <span className="font-medium text-blue-600 truncate block">{viewingBusiness.website}</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-xs mb-0.5">Description</span>
                    <span className="text-gray-900 text-sm leading-relaxed">{viewingBusiness.description}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
              <button 
                onClick={() => {
                  handleUpdateClaimStatus(viewingBusiness.id, viewingBusiness.name, 'unclaimed');
                  setViewingBusiness(null);
                }}
                className="flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 text-red-600 bg-red-50 border border-red-100"
              >
                <XCircle size={18} /> Reject Claim
              </button>
              <button 
                onClick={() => {
                  handleUpdateClaimStatus(viewingBusiness.id, viewingBusiness.name, 'claimed');
                  setViewingBusiness(null);
                }}
                className="flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 text-green-600 bg-green-50 border border-green-100"
              >
                <CheckCircle size={18} /> Approve Claim
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Edit Modal */}
      {editingUser && (
        <div className="absolute inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setEditingUser(null)}></div>
          <div className="bg-white rounded-t-3xl p-6 flex flex-col relative z-10 animate-in slide-in-from-bottom-full duration-300">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <UsersIcon size={20} className="text-blue-600" /> 
                Edit User Profile
              </h2>
              <button 
                onClick={() => setEditingUser(null)} 
                className="p-2 text-gray-500 bg-gray-100 rounded-full"
              >
                <XCircle size={20} />
              </button>
            </div>

            <form 
              onSubmit={(e) => {
                e.preventDefault();
                setUsers(prev => prev.map(u => u.id === editingUser.id ? editingUser : u));
                setEditingUser(null);
              }} 
              className="flex flex-col gap-4"
            >
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Name</label>
                <input 
                  type="text" 
                  required
                  value={editingUser.name}
                  onChange={e => setEditingUser({...editingUser, name: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
                <input 
                  type="email" 
                  required
                  value={editingUser.email}
                  onChange={e => setEditingUser({...editingUser, email: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-3 mt-4 pt-4 border-t border-gray-100">
                <button 
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="flex-1 py-3 rounded-xl font-bold text-sm text-gray-700 bg-gray-100"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3 rounded-xl font-bold text-sm text-white bg-blue-600 shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
