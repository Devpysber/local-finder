import React, { useState } from 'react';
import { ScreenType, AdCreative, Business, Campaign, ClaimRequest, AdminNotification } from '../types';
import { GoogleGenAI } from '@google/genai';
import { 
  BarChart3, 
  Users, 
  Wand2, 
  Target, 
  TrendingUp, 
  MessageSquare, 
  Share2, 
  LogOut,
  ChevronRight,
  X,
  Loader2,
  Plus,
  Phone,
  Mail,
  Calendar,
  Filter,
  ArrowUpDown,
  Store,
  MapPin,
  CheckCircle,
  AlertCircle,
  PieChart,
  Facebook,
  Instagram,
  Search,
  Download
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from 'recharts';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'new' | 'contacted' | 'converted';
  date: string;
  createdAt: number;
  source: string;
  notes?: string;
}

const MOCK_LEADS: Lead[] = [
  { id: 'l1', name: 'Alice Smith', email: 'alice@example.com', phone: '+1 234-567-8901', status: 'new', date: 'Today, 10:30 AM', createdAt: Date.now(), source: 'Spring Sale Ad', notes: 'Interested in a full home plumbing inspection. Mentioned a leak in the guest bathroom.' },
  { id: 'l2', name: 'Bob Jones', email: 'bob@example.com', phone: '+1 234-567-8902', status: 'contacted', date: 'Yesterday, 2:15 PM', createdAt: Date.now() - 86400000, source: 'Google Search', notes: 'Left a voicemail. Needs callback after 5 PM.' },
  { id: 'l3', name: 'Charlie Brown', email: 'charlie@example.com', phone: '+1 234-567-8903', status: 'converted', date: 'Mar 12, 9:00 AM', createdAt: Date.now() - 86400000 * 4, source: 'Facebook Ad' },
  { id: 'l4', name: 'Diana Prince', email: 'diana@example.com', phone: '+1 234-567-8904', status: 'new', date: 'Mar 10, 4:45 PM', createdAt: Date.now() - 86400000 * 6, source: 'Instagram Promo', notes: 'Looking for a quote on electrical rewiring for a kitchen remodel.' },
];

const PERFORMANCE_DATA = [
  { name: 'Mon', clicks: 400, impressions: 2400, spend: 120, goalClicks: 350, goalSpend: 100 },
  { name: 'Tue', clicks: 300, impressions: 1398, spend: 90, goalClicks: 350, goalSpend: 100 },
  { name: 'Wed', clicks: 200, impressions: 9800, spend: 200, goalClicks: 350, goalSpend: 100 },
  { name: 'Thu', clicks: 278, impressions: 3908, spend: 150, goalClicks: 350, goalSpend: 100 },
  { name: 'Fri', clicks: 189, impressions: 4800, spend: 110, goalClicks: 350, goalSpend: 100 },
  { name: 'Sat', clicks: 239, impressions: 3800, spend: 130, goalClicks: 350, goalSpend: 100 },
  { name: 'Sun', clicks: 349, impressions: 4300, spend: 170, goalClicks: 350, goalSpend: 100 },
];

const PLATFORM_DATA = [
  { name: 'Google Ads', conversions: 45, spend: 300, goalConversions: 50 },
  { name: 'Meta Ads', conversions: 30, spend: 200, goalConversions: 40 },
  { name: 'LocalFinder', conversions: 60, spend: 150, goalConversions: 55 },
];

export const BusinessDashboardScreen = ({ 
  onNavigate,
  adCreatives,
  setAdCreatives,
  businesses,
  setBusinesses,
  campaigns,
  setCampaigns,
  setClaimRequests,
  setAdminNotifications
}: { 
  onNavigate: (s: ScreenType) => void,
  adCreatives: AdCreative[],
  setAdCreatives: React.Dispatch<React.SetStateAction<AdCreative[]>>,
  businesses: Business[],
  setBusinesses: React.Dispatch<React.SetStateAction<Business[]>>,
  campaigns: Campaign[],
  setCampaigns: React.Dispatch<React.SetStateAction<Campaign[]>>,
  setClaimRequests: React.Dispatch<React.SetStateAction<ClaimRequest[]>>,
  setAdminNotifications: React.Dispatch<React.SetStateAction<AdminNotification[]>>
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'leads' | 'listings' | 'reports'>('overview');
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [productOrService, setProductOrService] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [leads, setLeads] = useState<Lead[]>(MOCK_LEADS);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('date-desc');
  const [expandedLeadId, setExpandedLeadId] = useState<string | null>(null);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editNoteText, setEditNoteText] = useState<string>('');

  const [connectedPlatforms, setConnectedPlatforms] = useState<string[]>([]);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [selectedCreativeForPublish, setSelectedCreativeForPublish] = useState<AdCreative | null>(null);
  const [publishConfig, setPublishConfig] = useState({
    platforms: [] as string[],
    budget: 10
  });

  const [showTargetingModal, setShowTargetingModal] = useState(false);
  const [isSuggestingTargeting, setIsSuggestingTargeting] = useState(false);
  const [isSuggestingBudget, setIsSuggestingBudget] = useState(false);
  const [targetingData, setTargetingData] = useState({
    demographics: '',
    interests: '',
    location: '',
    budget: 50
  });
  
  const [reportDateRange, setReportDateRange] = useState('7days');
  const [showGoals, setShowGoals] = useState(false);

  // Mock current user ID
  const CURRENT_USER_ID = 'u2';

  const myBusinesses = businesses.filter(b => b.ownerId === CURRENT_USER_ID);
  const hasClaimedBusiness = myBusinesses.some(b => b.claimStatus === 'claimed');
  const unclaimedBusinesses = businesses.filter(b => !b.claimStatus || b.claimStatus === 'unclaimed');

  const handleClaimBusiness = (id: string) => {
    const businessToClaim = businesses.find(b => b.id === id);
    if (!businessToClaim) return;

    setBusinesses(prev => prev.map(b => b.id === id ? { ...b, claimStatus: 'pending', ownerId: CURRENT_USER_ID } : b));
    
    // Create claim request
    const newClaimRequest: ClaimRequest = {
      id: `claim_${Date.now()}`,
      businessId: id,
      businessName: businessToClaim.name,
      userId: CURRENT_USER_ID,
      status: 'pending',
      date: new Date().toLocaleDateString()
    };
    setClaimRequests(prev => [newClaimRequest, ...prev]);

    // Create admin notification
    const newNotification: AdminNotification = {
      id: `notif_${Date.now()}`,
      message: `User ${CURRENT_USER_ID} requested to claim business "${businessToClaim.name}"`,
      date: new Date().toLocaleDateString(),
      read: false,
      type: 'claim'
    };
    setAdminNotifications(prev => [newNotification, ...prev]);

    setShowClaimModal(false);
    setActiveTab('listings');
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productOrService.trim()) return;

    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      // Generate Ad Copy
      const copyResponse = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Write a short, catchy ad copy (max 2 sentences) for a local business promoting: ${productOrService}. Include a call to action.`,
      });
      const generatedCopy = copyResponse.text || 'Discover our amazing offerings today!';

      // Generate Ad Image
      const imageResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            { text: `A high-quality, professional advertisement image for: ${productOrService}. Clean, modern, vibrant.` }
          ]
        }
      });

      let imageUrl = 'https://picsum.photos/seed/ad/800/600'; // Fallback
      if (imageResponse.candidates && imageResponse.candidates[0]?.content?.parts) {
        for (const part of imageResponse.candidates[0].content.parts) {
          if (part.inlineData) {
            imageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
            break;
          }
        }
      }

      const newCreative: AdCreative = {
        id: `ad_${Date.now()}`,
        businessName: 'My Business', // In a real app, this would be the logged-in business name
        productOrService,
        imageUrl,
        copy: generatedCopy,
        status: 'pending',
        date: new Date().toLocaleDateString()
      };

      setAdCreatives([newCreative, ...adCreatives]);
      setShowGenerateModal(false);
      setProductOrService('');
    } catch (error) {
      console.error("Error generating creative:", error);
      alert("Failed to generate creative. Please check your API key.");
    } finally {
      setIsGenerating(false);
    }
  };

  const updateLeadStatus = (id: string, newStatus: Lead['status']) => {
    setLeads(leads.map(lead => lead.id === id ? { ...lead, status: newStatus } : lead));
  };

  const updateLeadNotes = (id: string, newNotes: string) => {
    setLeads(leads.map(lead => lead.id === id ? { ...lead, notes: newNotes } : lead));
  };

  const handleEditNote = (lead: Lead) => {
    setEditingNoteId(lead.id);
    setEditNoteText(lead.notes || '');
  };

  const handleSaveNote = (id: string) => {
    updateLeadNotes(id, editNoteText);
    setEditingNoteId(null);
  };

  const toggleConnection = (platform: string) => {
    if (connectedPlatforms.includes(platform)) {
      setConnectedPlatforms(connectedPlatforms.filter(p => p !== platform));
    } else {
      setConnectedPlatforms([...connectedPlatforms, platform]);
    }
  };

  const openPublishModal = (creative: AdCreative) => {
    setSelectedCreativeForPublish(creative);
    setPublishConfig({ platforms: [], budget: 10 });
    setShowPublishModal(true);
  };

  const handlePublishCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCreativeForPublish || publishConfig.platforms.length === 0) return;

    const newCampaign: Campaign = {
      id: `camp_${Date.now()}`,
      creativeId: selectedCreativeForPublish.id,
      name: `${selectedCreativeForPublish.productOrService} Campaign`,
      platforms: publishConfig.platforms,
      dailyBudget: publishConfig.budget,
      status: 'active',
      startDate: new Date().toLocaleDateString(),
      spend: 0,
      clicks: 0,
      impressions: 0
    };

    setCampaigns([newCampaign, ...campaigns]);
    setShowPublishModal(false);
    setActiveTab('reports');
  };

  const handleSuggestTargeting = async () => {
    setIsSuggestingTargeting(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Suggest optimal ad targeting parameters for a local business. Return ONLY a JSON object with keys: demographics (string), interests (string), location (string), budget (number).`,
        config: { responseMimeType: "application/json" }
      });
      const data = JSON.parse(response.text || '{}');
      setTargetingData({
        demographics: data.demographics || 'Ages 25-45, Homeowners',
        interests: data.interests || 'Home Improvement, Local Services',
        location: data.location || '10 mile radius',
        budget: data.budget || 50
      });
    } catch (error) {
      console.error("Error suggesting targeting:", error);
      // Fallback
      setTargetingData({
        demographics: 'Ages 25-55, Homeowners',
        interests: 'Home Services, Renovation, Real Estate',
        location: '15 mile radius from city center',
        budget: 100
      });
    } finally {
      setIsSuggestingTargeting(false);
    }
  };

  const handleSuggestBudget = async () => {
    setIsSuggestingBudget(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Suggest an optimal daily budget for a local business ad campaign based on average market data. Return ONLY a JSON object with a single key: budget (number).`,
        config: { responseMimeType: "application/json" }
      });
      const data = JSON.parse(response.text || '{}');
      setTargetingData(prev => ({
        ...prev,
        budget: data.budget || 50
      }));
      setShowTargetingModal(true);
    } catch (error) {
      console.error("Error suggesting budget:", error);
      setTargetingData(prev => ({
        ...prev,
        budget: 75
      }));
      setShowTargetingModal(true);
    } finally {
      setIsSuggestingBudget(false);
    }
  };

  const handleSaveTargeting = (e: React.FormEvent) => {
    e.preventDefault();
    setShowTargetingModal(false);
    alert('Targeting configuration saved successfully!');
  };

  const handleExportReport = (format: 'csv' | 'pdf') => {
    alert(`Exporting report as ${format.toUpperCase()}...`);
  };

  const toggleCampaignStatus = (id: string) => {
    setCampaigns(campaigns.map(c => {
      if (c.id === id) {
        return { ...c, status: c.status === 'active' ? 'paused' : 'active' };
      }
      return c;
    }));
  };

  // Filter creatives for this business (mocking it by just showing all for now, or we could filter by businessName)
  const myCreatives = adCreatives.filter(c => c.businessName === 'My Business');

  const processedLeads = leads
    .filter(lead => filterStatus === 'all' || lead.status === filterStatus)
    .sort((a, b) => {
      if (sortBy === 'date-desc') return b.createdAt - a.createdAt;
      if (sortBy === 'date-asc') return a.createdAt - b.createdAt;
      if (sortBy === 'status') return a.status.localeCompare(b.status);
      if (sortBy === 'source') return a.source.localeCompare(b.source);
      return 0;
    });

  return (
    <div className="flex flex-col h-full bg-gray-50 overflow-y-auto scrollbar-hide pb-20 relative">
      {/* Header */}
      <div className="bg-blue-600 px-6 pt-12 pb-6 rounded-b-3xl shadow-md">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Business Portal</h1>
            <p className="text-blue-100 text-sm">Manage your AI-powered growth</p>
          </div>
          <button 
            onClick={() => onNavigate('login')}
            className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white backdrop-blur-sm"
          >
            <LogOut size={18} />
          </button>
        </div>
        
        {/* Quick Stats */}
        <div className="flex gap-4">
          <div className="flex-1 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
            <p className="text-blue-100 text-xs font-medium mb-1">Active Leads</p>
            <p className="text-2xl font-bold text-white">{leads.length}</p>
            <div className="flex items-center gap-1 mt-1 text-green-300 text-xs">
              <TrendingUp size={12} />
              <span>+12%</span>
            </div>
          </div>
          <div className="flex-1 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
            <p className="text-blue-100 text-xs font-medium mb-1">Ad Spend</p>
            <p className="text-2xl font-bold text-white">$450</p>
            <div className="flex items-center gap-1 mt-1 text-green-300 text-xs">
              <TrendingUp size={12} />
              <span>Opt. Score 98%</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex bg-blue-700/50 p-1 rounded-xl mt-6 overflow-x-auto scrollbar-hide">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`shrink-0 px-4 py-2 text-sm font-bold rounded-lg transition-colors ${activeTab === 'overview' ? 'bg-white text-blue-600 shadow-sm' : 'text-blue-100 hover:text-white'}`}
          >
            Grow
          </button>
          <button 
            onClick={() => setActiveTab('listings')}
            className={`shrink-0 px-4 py-2 text-sm font-bold rounded-lg transition-colors ${activeTab === 'listings' ? 'bg-white text-blue-600 shadow-sm' : 'text-blue-100 hover:text-white'}`}
          >
            My Listings
          </button>
          <button 
            onClick={() => setActiveTab('leads')}
            className={`shrink-0 px-4 py-2 text-sm font-bold rounded-lg transition-colors ${activeTab === 'leads' ? 'bg-white text-blue-600 shadow-sm' : 'text-blue-100 hover:text-white'}`}
          >
            Leads CRM
          </button>
          <button 
            onClick={() => setActiveTab('reports')}
            className={`shrink-0 px-4 py-2 text-sm font-bold rounded-lg transition-colors ${activeTab === 'reports' ? 'bg-white text-blue-600 shadow-sm' : 'text-blue-100 hover:text-white'}`}
          >
            Reports & Ads
          </button>
        </div>
      </div>

      {activeTab === 'overview' ? (
        <div className="px-4 py-6 flex flex-col gap-4 animate-in fade-in duration-300">
          {!hasClaimedBusiness && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-2 flex items-start gap-3">
              <AlertCircle className="text-amber-600 shrink-0 mt-0.5" size={20} />
              <div>
                <h3 className="text-amber-800 font-bold text-sm mb-1">Claim a listing to start growing</h3>
                <p className="text-amber-700 text-xs mb-3">You need an active, claimed listing to use the AI Marketing Suite and run ads.</p>
                <button 
                  onClick={() => setActiveTab('listings')}
                  className="bg-amber-600 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-sm"
                >
                  Go to My Listings
                </button>
              </div>
            </div>
          )}

          <div className="flex justify-between items-center px-2">
            <h2 className="text-lg font-bold text-gray-900">AI Marketing Suite</h2>
          </div>

          {/* Creative AI */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center shrink-0">
                <Wand2 size={24} className="text-purple-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 mb-1">Creative AI</h3>
                <p className="text-xs text-gray-500 mb-3 leading-relaxed">
                  Generate impactful ad creatives (image & copy) instantly using AI.
                </p>
                <button 
                  onClick={() => setShowGenerateModal(true)}
                  disabled={!hasClaimedBusiness}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus size={16} /> Generate Ad
                </button>
              </div>
            </div>

            {/* Display Generated Creatives */}
            {myCreatives.length > 0 && (
              <div className="mt-4 border-t border-gray-100 pt-4">
                <h4 className="text-sm font-bold text-gray-900 mb-3">Your Recent Creatives</h4>
                <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-hide">
                  {myCreatives.map(creative => (
                    <div key={creative.id} className="w-48 shrink-0 bg-gray-50 rounded-xl overflow-hidden border border-gray-200">
                      <div className="h-32 w-full bg-gray-200 relative">
                        <img src={creative.imageUrl} alt="Ad Creative" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        <div className="absolute top-2 right-2">
                          <span className={`text-[10px] font-bold px-2 py-1 rounded shadow-sm text-white ${
                            creative.status === 'approved' ? 'bg-green-500' : 
                            creative.status === 'rejected' ? 'bg-red-500' : 'bg-amber-500'
                          }`}>
                            {creative.status.toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="p-3">
                        <p className="text-xs text-gray-700 line-clamp-3 leading-relaxed font-medium mb-3">"{creative.copy}"</p>
                        {creative.status === 'approved' && (
                          <button 
                            onClick={() => openPublishModal(creative)}
                            className="w-full bg-blue-600 text-white py-2 rounded-lg text-xs font-bold shadow-sm"
                          >
                            Publish Ad
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Targeting AI */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
              <Target size={24} className="text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 mb-1">Targeting AI</h3>
              <p className="text-xs text-gray-500 mb-3 leading-relaxed">
                AI to decide the right budget on right channels with right targeting for better conversion.
              </p>
              <div className="flex gap-2">
                <button 
                  onClick={() => setShowTargetingModal(true)}
                  className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 shadow-sm"
                >
                  Configure Targeting <ChevronRight size={16} />
                </button>
                <button 
                  onClick={handleSuggestBudget}
                  disabled={isSuggestingBudget}
                  className="bg-purple-50 text-purple-600 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 shadow-sm disabled:opacity-50"
                >
                  {isSuggestingBudget ? <Loader2 size={16} className="animate-spin" /> : <Wand2 size={16} />} Suggest Budget
                </button>
              </div>
            </div>
          </div>

          {/* Optimizing & Reporting AI */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-start gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center shrink-0">
              <BarChart3 size={24} className="text-green-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 mb-1">Optimizing & Reporting AI</h3>
              <p className="text-xs text-gray-500 mb-3 leading-relaxed">
                AI to optimize your ad campaigns based on data. Plus, insightful reporting & CRM tools.
              </p>
              <button 
                onClick={() => setActiveTab('reports')}
                className="text-green-600 text-xs font-bold flex items-center gap-1"
              >
                View Reports <ChevronRight size={14} />
              </button>
            </div>
          </div>

          <h2 className="text-lg font-bold text-gray-900 px-2 mt-4">Growth Tools</h2>

          <div className="grid grid-cols-2 gap-4">
            {/* CRM Support */}
            <div 
              onClick={() => setActiveTab('leads')}
              className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col items-center text-center cursor-pointer hover:border-orange-300 transition-colors"
            >
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mb-3">
                <Users size={20} className="text-orange-600" />
              </div>
              <h3 className="font-bold text-gray-900 text-sm mb-1">CRM Support</h3>
              <p className="text-[10px] text-gray-500">Track all potential leads at one place</p>
            </div>

            {/* Multi-platform Ads */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col items-center text-center">
              <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center mb-3">
                <Share2 size={20} className="text-pink-600" />
              </div>
              <h3 className="font-bold text-gray-900 text-sm mb-1">Multi-Platform</h3>
              <p className="text-[10px] text-gray-500">Run ads on FB, IG & Google from one place</p>
            </div>
          </div>
        </div>
      ) : activeTab === 'listings' ? (
        <div className="px-4 py-6 flex flex-col gap-4 animate-in fade-in duration-300">
          <div className="flex justify-between items-center px-2 mb-2">
            <h2 className="text-lg font-bold text-gray-900">My Listings</h2>
            <button 
              onClick={() => setShowClaimModal(true)}
              className="text-sm font-bold text-blue-600 flex items-center gap-1"
            >
              <Plus size={16} /> Claim Listing
            </button>
          </div>

          {myBusinesses.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center border border-gray-100 shadow-sm">
              <Store size={48} className="text-gray-300 mx-auto mb-4" />
              <h3 className="text-gray-900 font-bold mb-2">No Listings Yet</h3>
              <p className="text-gray-500 text-sm mb-4">Claim your business listing to manage your profile, run ads, and get more customers.</p>
              <button 
                onClick={() => setShowClaimModal(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold shadow-sm"
              >
                Claim a Listing
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {myBusinesses.map(business => (
                <div key={business.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col gap-4">
                  <div className="flex items-start gap-3">
                    <img src={business.image} alt={business.name} className="w-20 h-20 rounded-xl object-cover" referrerPolicy="no-referrer" />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold text-gray-900 text-lg leading-tight">{business.name}</h3>
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider ${
                          business.claimStatus === 'claimed' ? 'bg-green-100 text-green-700' :
                          business.claimStatus === 'pending' ? 'bg-amber-100 text-amber-700' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {business.claimStatus}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-1 mb-2">
                        <MapPin size={12} /> {business.address}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {business.services.slice(0, 2).map(s => (
                          <span key={s} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-3 border-t border-gray-100">
                    <button 
                      disabled={business.claimStatus !== 'claimed'}
                      className="flex-1 py-2 rounded-xl font-bold text-sm bg-gray-50 text-gray-700 border border-gray-200 disabled:opacity-50"
                    >
                      Edit Profile
                    </button>
                    <button 
                      disabled={business.claimStatus !== 'claimed'}
                      onClick={() => setActiveTab('overview')}
                      className="flex-1 py-2 rounded-xl font-bold text-sm bg-blue-50 text-blue-600 border border-blue-100 disabled:opacity-50"
                    >
                      Run Ads
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : activeTab === 'reports' ? (
        <div className="px-4 py-6 flex flex-col gap-4 animate-in fade-in duration-300">
          <div className="flex justify-between items-center px-2 mb-2">
            <h2 className="text-lg font-bold text-gray-900">Campaigns & Reporting</h2>
            <div className="flex items-center gap-2">
              <select 
                value={reportDateRange}
                onChange={(e) => setReportDateRange(e.target.value)}
                className="bg-white border border-gray-200 text-gray-700 text-xs rounded-lg p-1.5 outline-none font-medium shadow-sm"
              >
                <option value="7days">Last 7 Days</option>
                <option value="30days">Last 30 Days</option>
                <option value="custom">Custom Range</option>
              </select>
              <div className="relative group">
                <button className="bg-white border border-gray-200 text-gray-700 p-1.5 rounded-lg shadow-sm hover:bg-gray-50 flex items-center justify-center">
                  <Download size={16} />
                </button>
                <div className="absolute right-0 mt-1 w-32 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden hidden group-hover:block z-10">
                  <button onClick={() => handleExportReport('csv')} className="w-full text-left px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50">Export as CSV</button>
                  <button onClick={() => handleExportReport('pdf')} className="w-full text-left px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50">Export as PDF</button>
                </div>
              </div>
            </div>
          </div>

          {/* Connected Platforms */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col gap-4">
            <h3 className="font-bold text-gray-900 text-sm">Ad Platform Integrations</h3>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                  <Search size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">Google Ads</h4>
                  <p className="text-[10px] text-gray-500">Search & Display Network</p>
                </div>
              </div>
              <button 
                onClick={() => toggleConnection('google')}
                className={`text-xs font-bold px-3 py-1.5 rounded-lg border ${
                  connectedPlatforms.includes('google') 
                    ? 'text-gray-600 bg-gray-100 border-gray-200' 
                    : 'text-blue-600 bg-blue-50 border-blue-100'
                }`}
              >
                {connectedPlatforms.includes('google') ? 'Connected' : 'Connect'}
              </button>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center">
                  <Facebook size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">Meta Ads</h4>
                  <p className="text-[10px] text-gray-500">Facebook & Instagram</p>
                </div>
              </div>
              <button 
                onClick={() => toggleConnection('meta')}
                className={`text-xs font-bold px-3 py-1.5 rounded-lg border ${
                  connectedPlatforms.includes('meta') 
                    ? 'text-gray-600 bg-gray-100 border-gray-200' 
                    : 'text-indigo-600 bg-indigo-50 border-indigo-100'
                }`}
              >
                {connectedPlatforms.includes('meta') ? 'Connected' : 'Connect'}
              </button>
            </div>
          </div>

          {/* Active Campaigns List */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col gap-4">
            <h3 className="font-bold text-gray-900 text-sm">Active Campaigns</h3>
            {campaigns.length === 0 ? (
              <p className="text-xs text-gray-500 text-center py-4">No active campaigns. Generate and publish an ad from the Grow tab.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {campaigns.map(campaign => {
                  const creative = adCreatives.find(c => c.id === campaign.creativeId);
                  return (
                    <div key={campaign.id} className="border border-gray-100 rounded-xl p-3 flex flex-col gap-3">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          {creative && (
                            <img src={creative.imageUrl} alt="Ad" className="w-10 h-10 rounded-lg object-cover" referrerPolicy="no-referrer" />
                          )}
                          <div>
                            <h4 className="font-bold text-gray-900 text-sm">{campaign.name}</h4>
                            <div className="flex items-center gap-1 mt-1">
                              {campaign.platforms.map(p => (
                                <span key={p} className="text-[9px] font-bold uppercase bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                                  {p}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider ${
                          campaign.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {campaign.status}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-2 border-t border-gray-50 pt-3">
                        <div>
                          <p className="text-[10px] text-gray-500">Spend</p>
                          <p className="text-xs font-bold text-gray-900">${campaign.spend}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-500">Clicks</p>
                          <p className="text-xs font-bold text-gray-900">{campaign.clicks}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-500">Budget</p>
                          <p className="text-xs font-bold text-gray-900">${campaign.dailyBudget}/day</p>
                        </div>
                      </div>

                      <button 
                        onClick={() => toggleCampaignStatus(campaign.id)}
                        className={`w-full py-2 rounded-lg text-xs font-bold mt-1 ${
                          campaign.status === 'active' 
                            ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                            : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                        }`}
                      >
                        {campaign.status === 'active' ? 'Pause Campaign' : 'Resume Campaign'}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Performance Overview Chart */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-gray-900 text-sm">Performance Overview</h3>
              <button 
                onClick={() => setShowGoals(!showGoals)}
                className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-colors ${
                  showGoals ? 'bg-purple-50 text-purple-600 border-purple-200' : 'bg-gray-50 text-gray-600 border-gray-200'
                }`}
              >
                {showGoals ? 'Hide Goals' : 'Show Goals'}
              </button>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={PERFORMANCE_DATA} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} />
                  <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} />
                  <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Legend wrapperStyle={{ fontSize: '10px' }} />
                  <Line yAxisId="left" type="monotone" dataKey="clicks" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                  <Line yAxisId="left" type="monotone" dataKey="spend" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
                  <Line yAxisId="right" type="monotone" dataKey="impressions" stroke="#8b5cf6" strokeWidth={2} dot={false} />
                  {showGoals && (
                    <>
                      <Line yAxisId="left" type="monotone" dataKey="goalClicks" name="Goal Clicks" stroke="#3b82f6" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                      <Line yAxisId="left" type="monotone" dataKey="goalSpend" name="Goal Spend" stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                    </>
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Platform Breakdown Chart */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-gray-900 text-sm">Conversions by Platform</h3>
              <button 
                onClick={() => setShowGoals(!showGoals)}
                className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-colors ${
                  showGoals ? 'bg-purple-50 text-purple-600 border-purple-200' : 'bg-gray-50 text-gray-600 border-gray-200'
                }`}
              >
                {showGoals ? 'Hide Goals' : 'Show Goals'}
              </button>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={PLATFORM_DATA} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} />
                  <Tooltip cursor={{ fill: '#f3f4f6' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Legend wrapperStyle={{ fontSize: '10px' }} />
                  <Bar dataKey="conversions" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="spend" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  {showGoals && (
                    <Bar dataKey="goalConversions" name="Goal Conversions" fill="#10b981" fillOpacity={0.3} stroke="#10b981" strokeDasharray="3 3" radius={[4, 4, 0, 0]} />
                  )}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      ) : (
        <div className="px-4 py-6 flex flex-col gap-4 animate-in fade-in duration-300">
          <div className="flex justify-between items-center px-2 mb-2">
            <h2 className="text-lg font-bold text-gray-900">Lead Pipeline</h2>
            <span className="text-sm font-medium text-gray-500">{processedLeads.length} Total Leads</span>
          </div>

          <div className="flex gap-2 mb-2 px-2">
            <div className="flex-1 bg-white border border-gray-200 rounded-xl px-3 py-2 flex items-center gap-2 shadow-sm">
              <Filter size={16} className="text-gray-400 shrink-0" />
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-transparent text-sm text-gray-700 outline-none w-full font-medium"
              >
                <option value="all">All Status</option>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="converted">Converted</option>
              </select>
            </div>
            <div className="flex-1 bg-white border border-gray-200 rounded-xl px-3 py-2 flex items-center gap-2 shadow-sm">
              <ArrowUpDown size={16} className="text-gray-400 shrink-0" />
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-sm text-gray-700 outline-none w-full font-medium"
              >
                <option value="date-desc">Newest</option>
                <option value="date-asc">Oldest</option>
                <option value="status">By Status</option>
                <option value="source">By Source</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {processedLeads.map(lead => (
              <div key={lead.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{lead.name}</h3>
                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                      <Calendar size={12} /> {lead.date}
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                    lead.status === 'new' ? 'bg-blue-100 text-blue-700' :
                    lead.status === 'contacted' ? 'bg-amber-100 text-amber-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {lead.status}
                  </span>
                </div>

                <div className="flex flex-col gap-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail size={14} className="text-gray-400" />
                    <a href={`mailto:${lead.email}`} className="hover:text-blue-600">{lead.email}</a>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone size={14} className="text-gray-400" />
                    <a href={`tel:${lead.phone}`} className="hover:text-blue-600">{lead.phone}</a>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Target size={14} className="text-gray-400" />
                    <span className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-600 font-medium">Source: {lead.source}</span>
                  </div>
                </div>

                <div className="flex gap-2 border-t border-gray-100 pt-4">
                  <select 
                    value={lead.status}
                    onChange={(e) => updateLeadStatus(lead.id, e.target.value as Lead['status'])}
                    className="flex-1 bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 outline-none font-medium"
                  >
                    <option value="new">Mark as New</option>
                    <option value="contacted">Mark as Contacted</option>
                    <option value="converted">Mark as Converted</option>
                  </select>
                  <button 
                    onClick={() => window.location.href = `tel:${lead.phone}`}
                    className="bg-blue-50 text-blue-600 p-2 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <Phone size={20} />
                  </button>
                  <button 
                    onClick={() => window.location.href = `mailto:${lead.email}`}
                    className="bg-blue-50 text-blue-600 p-2 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <Mail size={20} />
                  </button>
                  <button
                    onClick={() => setExpandedLeadId(expandedLeadId === lead.id ? null : lead.id)}
                    className="bg-gray-50 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-sm font-bold ml-auto"
                  >
                    {expandedLeadId === lead.id ? 'Hide Details' : 'View Details'}
                  </button>
                </div>

                {expandedLeadId === lead.id && (
                  <div className="mt-4 pt-4 border-t border-dashed border-gray-200 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Lead Notes & Details</h4>
                      {editingNoteId !== lead.id && (
                        <button 
                          onClick={() => handleEditNote(lead)}
                          className="text-xs font-bold text-blue-600 hover:text-blue-800"
                        >
                          Edit Note
                        </button>
                      )}
                    </div>
                    <div className="bg-yellow-50/50 border border-yellow-100 rounded-xl p-3">
                      {editingNoteId === lead.id ? (
                        <div className="flex flex-col gap-2">
                          <textarea
                            value={editNoteText}
                            onChange={(e) => setEditNoteText(e.target.value)}
                            className="w-full bg-white border border-yellow-200 rounded-lg p-2 text-sm text-gray-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
                            rows={3}
                            placeholder="Add notes about this lead..."
                          />
                          <div className="flex justify-end gap-2">
                            <button 
                              onClick={() => setEditingNoteId(null)}
                              className="px-3 py-1.5 text-xs font-bold text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
                            >
                              Cancel
                            </button>
                            <button 
                              onClick={() => handleSaveNote(lead.id)}
                              className="px-3 py-1.5 text-xs font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                            >
                              Save Note
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {lead.notes ? lead.notes : <span className="text-gray-400 italic">No notes available for this lead.</span>}
                        </p>
                      )}
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-gray-50 p-2 rounded-lg">
                        <span className="text-gray-500 block mb-0.5">Created At</span>
                        <span className="font-medium text-gray-900">{new Date(lead.createdAt).toLocaleString()}</span>
                      </div>
                      <div className="bg-gray-50 p-2 rounded-lg">
                        <span className="text-gray-500 block mb-0.5">Lead ID</span>
                        <span className="font-medium text-gray-900 uppercase">{lead.id}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Generate Modal */}
      {showGenerateModal && (
        <div className="absolute inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => !isGenerating && setShowGenerateModal(false)}></div>
          <div className="bg-white rounded-t-3xl p-6 flex flex-col relative z-10 animate-in slide-in-from-bottom-full duration-300">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Wand2 size={20} className="text-purple-600" /> Generate Ad Creative
              </h2>
              <button 
                onClick={() => setShowGenerateModal(false)} 
                disabled={isGenerating}
                className="p-2 text-gray-500 bg-gray-100 rounded-full disabled:opacity-50"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleGenerate}>
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 mb-2">What are you promoting?</label>
                <textarea 
                  required
                  rows={3}
                  value={productOrService}
                  onChange={(e) => setProductOrService(e.target.value)}
                  placeholder="e.g., 50% off on all plumbing services this weekend..." 
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all resize-none"
                  disabled={isGenerating}
                ></textarea>
              </div>

              <button 
                type="submit"
                disabled={isGenerating || !productOrService.trim()}
                className="w-full bg-purple-600 text-white py-4 rounded-xl font-bold text-lg shadow-sm active:scale-[0.98] transition-transform disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <Loader2 size={20} className="animate-spin" /> Generating AI Magic...
                  </>
                ) : (
                  'Generate Creative'
                )}
              </button>
            </form>
          </div>
        </div>
      )}
      {/* Publish Modal */}
      {showPublishModal && selectedCreativeForPublish && (
        <div className="absolute inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowPublishModal(false)}></div>
          <div className="bg-white rounded-t-3xl p-6 flex flex-col relative z-10 animate-in slide-in-from-bottom-full duration-300 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Share2 size={20} className="text-blue-600" /> Publish Campaign
              </h2>
              <button 
                onClick={() => setShowPublishModal(false)} 
                className="p-2 text-gray-500 bg-gray-100 rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handlePublishCampaign} className="flex flex-col gap-4">
              <div className="flex gap-3 items-start bg-gray-50 p-3 rounded-xl border border-gray-200">
                <img src={selectedCreativeForPublish.imageUrl} alt="Ad" className="w-16 h-16 rounded-lg object-cover" referrerPolicy="no-referrer" />
                <div>
                  <p className="text-xs text-gray-700 line-clamp-2 font-medium">"{selectedCreativeForPublish.copy}"</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Select Platforms</label>
                <div className="flex flex-col gap-2">
                  <label className={`flex items-center gap-3 p-3 rounded-xl border ${connectedPlatforms.includes('meta') ? 'border-gray-200 cursor-pointer' : 'border-gray-100 opacity-50 cursor-not-allowed'} bg-white`}>
                    <input 
                      type="checkbox" 
                      disabled={!connectedPlatforms.includes('meta')}
                      checked={publishConfig.platforms.includes('facebook')}
                      onChange={(e) => {
                        const newPlatforms = e.target.checked 
                          ? [...publishConfig.platforms, 'facebook'] 
                          : publishConfig.platforms.filter(p => p !== 'facebook');
                        setPublishConfig({ ...publishConfig, platforms: newPlatforms });
                      }}
                      className="w-4 h-4 text-blue-600 rounded border-gray-300"
                    />
                    <Facebook size={18} className="text-blue-600" />
                    <span className="text-sm font-medium text-gray-900">Facebook Ads</span>
                    {!connectedPlatforms.includes('meta') && <span className="text-[10px] text-red-500 ml-auto">Not Connected</span>}
                  </label>
                  
                  <label className={`flex items-center gap-3 p-3 rounded-xl border ${connectedPlatforms.includes('meta') ? 'border-gray-200 cursor-pointer' : 'border-gray-100 opacity-50 cursor-not-allowed'} bg-white`}>
                    <input 
                      type="checkbox" 
                      disabled={!connectedPlatforms.includes('meta')}
                      checked={publishConfig.platforms.includes('instagram')}
                      onChange={(e) => {
                        const newPlatforms = e.target.checked 
                          ? [...publishConfig.platforms, 'instagram'] 
                          : publishConfig.platforms.filter(p => p !== 'instagram');
                        setPublishConfig({ ...publishConfig, platforms: newPlatforms });
                      }}
                      className="w-4 h-4 text-pink-600 rounded border-gray-300"
                    />
                    <Instagram size={18} className="text-pink-600" />
                    <span className="text-sm font-medium text-gray-900">Instagram Ads</span>
                    {!connectedPlatforms.includes('meta') && <span className="text-[10px] text-red-500 ml-auto">Not Connected</span>}
                  </label>

                  <label className={`flex items-center gap-3 p-3 rounded-xl border ${connectedPlatforms.includes('google') ? 'border-gray-200 cursor-pointer' : 'border-gray-100 opacity-50 cursor-not-allowed'} bg-white`}>
                    <input 
                      type="checkbox" 
                      disabled={!connectedPlatforms.includes('google')}
                      checked={publishConfig.platforms.includes('google')}
                      onChange={(e) => {
                        const newPlatforms = e.target.checked 
                          ? [...publishConfig.platforms, 'google'] 
                          : publishConfig.platforms.filter(p => p !== 'google');
                        setPublishConfig({ ...publishConfig, platforms: newPlatforms });
                      }}
                      className="w-4 h-4 text-green-600 rounded border-gray-300"
                    />
                    <Search size={18} className="text-green-600" />
                    <span className="text-sm font-medium text-gray-900">Google Ads</span>
                    {!connectedPlatforms.includes('google') && <span className="text-[10px] text-red-500 ml-auto">Not Connected</span>}
                  </label>
                </div>
                {(!connectedPlatforms.includes('meta') || !connectedPlatforms.includes('google')) && (
                  <p className="text-xs text-amber-600 mt-2 flex items-center gap-1">
                    <AlertCircle size={12} /> Connect more platforms in the Reports tab.
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Daily Budget ($)</label>
                <input 
                  type="number" 
                  min="1"
                  required
                  value={publishConfig.budget}
                  onChange={(e) => setPublishConfig({ ...publishConfig, budget: parseInt(e.target.value) || 0 })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
              </div>

              <button 
                type="submit"
                disabled={publishConfig.platforms.length === 0 || publishConfig.budget <= 0}
                className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg shadow-sm active:scale-[0.98] transition-transform disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              >
                Launch Campaign
              </button>
            </form>
          </div>
        </div>
      )}
      {/* Claim Modal */}
      {showClaimModal && (
        <div className="absolute inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowClaimModal(false)}></div>
          <div className="bg-white rounded-t-3xl p-6 flex flex-col relative z-10 animate-in slide-in-from-bottom-full duration-300 max-h-[80vh]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Store size={20} className="text-blue-600" /> Claim a Listing
              </h2>
              <button 
                onClick={() => setShowClaimModal(false)} 
                className="p-2 text-gray-500 bg-gray-100 rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 flex flex-col gap-3">
              {unclaimedBusinesses.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No unclaimed businesses available.</p>
              ) : (
                unclaimedBusinesses.map(business => (
                  <div key={business.id} className="bg-gray-50 border border-gray-200 rounded-xl p-3 flex items-center gap-3">
                    <img src={business.image} alt={business.name} className="w-12 h-12 rounded-lg object-cover" referrerPolicy="no-referrer" />
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 text-sm">{business.name}</h3>
                      <p className="text-xs text-gray-500">{business.address}</p>
                    </div>
                    <button 
                      onClick={() => handleClaimBusiness(business.id)}
                      className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm"
                    >
                      Claim
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Targeting Modal */}
      {showTargetingModal && (
        <div className="absolute inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => !isSuggestingTargeting && setShowTargetingModal(false)}></div>
          <div className="bg-white rounded-t-3xl p-6 flex flex-col relative z-10 animate-in slide-in-from-bottom-full duration-300 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Target size={20} className="text-blue-600" /> Configure Targeting
              </h2>
              <button 
                onClick={() => setShowTargetingModal(false)} 
                disabled={isSuggestingTargeting}
                className="p-2 text-gray-500 bg-gray-100 rounded-full disabled:opacity-50"
              >
                <X size={20} />
              </button>
            </div>

            <button 
              type="button"
              onClick={handleSuggestTargeting}
              disabled={isSuggestingTargeting}
              className="w-full bg-purple-50 text-purple-700 border border-purple-200 py-3 rounded-xl font-bold text-sm shadow-sm active:scale-[0.98] transition-transform disabled:opacity-50 flex items-center justify-center gap-2 mb-6"
            >
              {isSuggestingTargeting ? (
                <><Loader2 size={18} className="animate-spin" /> AI is analyzing...</>
              ) : (
                <><Wand2 size={18} /> AI Suggest Optimal Targeting</>
              )}
            </button>

            <form onSubmit={handleSaveTargeting} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Demographics</label>
                <input 
                  required
                  type="text"
                  value={targetingData.demographics}
                  onChange={e => setTargetingData({...targetingData, demographics: e.target.value})}
                  placeholder="e.g., Ages 25-45, Homeowners"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Interests</label>
                <input 
                  required
                  type="text"
                  value={targetingData.interests}
                  onChange={e => setTargetingData({...targetingData, interests: e.target.value})}
                  placeholder="e.g., Home Improvement, Local Services"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Location / Radius</label>
                <input 
                  required
                  type="text"
                  value={targetingData.location}
                  onChange={e => setTargetingData({...targetingData, location: e.target.value})}
                  placeholder="e.g., 10 mile radius from store"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Daily Budget ($)</label>
                <input 
                  required
                  type="number"
                  min="1"
                  value={targetingData.budget}
                  onChange={e => setTargetingData({...targetingData, budget: parseInt(e.target.value) || 0})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
              
              <button 
                type="submit"
                className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold shadow-sm mt-2"
              >
                Save Targeting
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
