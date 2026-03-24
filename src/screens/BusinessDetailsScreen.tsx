import React, { useState } from 'react';
import { ArrowLeft, Share2, Heart, MapPin, Phone, Clock, Star, MessageCircle, CheckCircle2, X, Mail } from 'lucide-react';
import { ScreenType, Business, Review, ClaimRequest, AdminNotification } from '../types';
import { RatingStars } from '../components';

export const BusinessDetailsScreen = ({ 
  business, 
  onBack,
  isFavorite,
  onToggleFavorite,
  setClaimRequests,
  setAdminNotifications,
  setBusinesses
}: { 
  business: Business, 
  onBack: () => void,
  isFavorite: boolean,
  onToggleFavorite: (id: string) => void,
  setClaimRequests?: React.Dispatch<React.SetStateAction<ClaimRequest[]>>,
  setAdminNotifications?: React.Dispatch<React.SetStateAction<AdminNotification[]>>,
  setBusinesses?: React.Dispatch<React.SetStateAction<Business[]>>
}) => {
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [newReviewRating, setNewReviewRating] = useState(0);
  const [newReviewText, setNewReviewText] = useState('');
  
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactMessage, setContactMessage] = useState('');
  
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [claimForm, setClaimForm] = useState({ name: '', phone: '', email: '', role: '' });
  const [claimSubmitted, setClaimSubmitted] = useState(false);
  
  // Local state for reviews to simulate adding a new one
  const [localReviews, setLocalReviews] = useState<Review[]>(business.reviews || []);

  if (!business) return null;

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (newReviewRating === 0) return;
    
    const newReview: Review = {
      id: `r${Date.now()}`,
      userName: 'Alex Johnson', // Current user
      rating: newReviewRating,
      text: newReviewText,
      date: 'Just now'
    };
    
    setLocalReviews([newReview, ...localReviews]);
    setShowReviewModal(false);
    setNewReviewRating(0);
    setNewReviewText('');
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: business.name,
          text: `Check out ${business.name} on our app!`,
          url: window.location.href,
        });
      } else {
        alert(`Share this link: ${window.location.href}`);
      }
    } catch (error) {
      console.log('Error sharing', error);
    }
  };

  const handleGetDirections = () => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(business.address)}`, '_blank');
  };

  const images = business.images && business.images.length > 0 ? business.images : [business.image];

  return (
    <div className="flex flex-col h-full bg-gray-50 pb-20 overflow-y-auto scrollbar-hide relative">
      {/* Hero Image Carousel */}
      <div className="relative h-64 w-full bg-gray-900">
        <div className="flex overflow-x-auto snap-x snap-mandatory h-full scrollbar-hide">
          {images.map((img, idx) => (
            <img 
              key={idx} 
              src={img} 
              alt={`${business.name} ${idx + 1}`} 
              className="w-full h-full object-cover snap-center shrink-0" 
              referrerPolicy="no-referrer" 
            />
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40 pointer-events-none"></div>
        
        {/* Image Indicators */}
        {images.length > 1 && (
          <div className="absolute bottom-24 left-0 right-0 flex justify-center gap-1.5 z-10">
            {images.map((_, idx) => (
              <div key={idx} className="w-1.5 h-1.5 rounded-full bg-white/50"></div>
            ))}
          </div>
        )}
        
        {/* Top Actions */}
        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10 pt-safe">
          <button onClick={onBack} className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white">
            <ArrowLeft size={24} />
          </button>
          <div className="flex gap-3">
            <button onClick={handleShare} className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white">
              <Share2 size={20} />
            </button>
            <button 
              onClick={() => onToggleFavorite(business.id)}
              className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white"
            >
              <Heart size={20} className={isFavorite ? 'fill-red-500 text-red-500' : ''} />
            </button>
          </div>
        </div>

        {/* Title Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white pointer-events-none">
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm uppercase tracking-wider">
              {business.category}
            </span>
            {business.priceRange && (
              <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm">
                {business.priceRange}
              </span>
            )}
            {business.isFeatured && (
              <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm uppercase tracking-wider">
                Featured
              </span>
            )}
          </div>
          <h1 className="text-2xl font-bold leading-tight mb-2">{business.name}</h1>
          <div className="flex items-center gap-3 text-sm">
            <RatingStars rating={business.rating} count={business.reviewsCount + (localReviews.length - (business.reviews?.length || 0))} />
            <span className="flex items-center gap-1"><MapPin size={14} /> {business.distance}</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white px-4 py-4 flex gap-3 shadow-sm mb-2">
        <button 
          onClick={() => window.location.href = `tel:${business.phone}`}
          className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-sm shadow-blue-200 active:scale-[0.98] transition-transform"
        >
          <Phone size={18} /> Call Now
        </button>
        <button 
          className="flex-1 bg-green-500 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-sm shadow-green-200 active:scale-[0.98] transition-transform"
        >
          <MessageCircle size={18} /> WhatsApp
        </button>
        <button 
          onClick={() => setShowContactModal(true)}
          className="flex-1 bg-gray-900 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-sm shadow-gray-200 active:scale-[0.98] transition-transform"
        >
          <Mail size={18} /> Contact Us
        </button>
      </div>

      {/* Claim Business Banner */}
      {business.claimStatus === 'unclaimed' && (
        <div className="bg-amber-50 px-4 py-4 mb-2 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 shrink-0">
              <CheckCircle2 size={20} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-amber-900">Is this your business?</h3>
              <p className="text-xs text-amber-700">Claim it now to manage your listing.</p>
            </div>
          </div>
          <button 
            onClick={() => setShowClaimModal(true)}
            className="bg-amber-600 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-sm whitespace-nowrap active:scale-95 transition-transform"
          >
            Claim Now
          </button>
        </div>
      )}

      {/* Info Section */}
      <div className="bg-white p-4 mb-2 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4">About</h2>
        <p className="text-gray-600 text-sm leading-relaxed mb-4">{business.description}</p>
        
        <div className="flex flex-col gap-3">
          <div className="flex items-start gap-3">
            <MapPin size={20} className="text-gray-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-900">{business.address}</p>
              <button onClick={handleGetDirections} className="text-blue-600 text-xs font-bold mt-1">Get Directions</button>
            </div>
          </div>
        </div>
      </div>

      {/* Hours Section */}
      <div className="bg-white p-4 mb-2 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Opening Hours</h2>
        <div className="flex items-center gap-3">
          <Clock size={20} className="text-gray-400 shrink-0" />
          <p className="text-sm font-medium text-gray-900">{business.hours}</p>
        </div>
      </div>

      {/* Amenities (if available) */}
      {business.amenities && business.amenities.length > 0 && (
        <div className="bg-white p-4 mb-2 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Amenities</h2>
          <div className="flex flex-wrap gap-2">
            {business.amenities.map((amenity, idx) => (
              <span key={idx} className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg text-sm font-medium">
                {amenity}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Services */}
      <div className="bg-white p-4 mb-2 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Services</h2>
        <div className="flex flex-col gap-2">
          {business.services.map((service, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <CheckCircle2 size={18} className="text-green-500 shrink-0" />
              <span className="text-sm text-gray-700 font-medium">{service}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews Section */}
      <div className="bg-white p-4 shadow-sm mb-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-900">Reviews</h2>
          <button 
            onClick={() => setShowReviewModal(true)}
            className="text-blue-600 text-sm font-bold bg-blue-50 px-3 py-1.5 rounded-lg"
          >
            Write a Review
          </button>
        </div>
        
        <div className="flex items-center gap-4 mb-6">
          <div className="text-center">
            <p className="text-4xl font-bold text-gray-900">{business.rating.toFixed(1)}</p>
            <RatingStars rating={business.rating} />
            <p className="text-xs text-gray-500 mt-1">{business.reviewsCount + (localReviews.length - (business.reviews?.length || 0))} reviews</p>
          </div>
          <div className="flex-1 flex flex-col gap-1">
            {[5, 4, 3, 2, 1].map((star) => (
              <div key={star} className="flex items-center gap-2 text-xs text-gray-500">
                <span className="w-2">{star}</span>
                <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-yellow-400 rounded-full" 
                    style={{ width: `${star === 5 ? 70 : star === 4 ? 20 : star === 3 ? 5 : 2}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Review List */}
        <div className="flex flex-col gap-4">
          {localReviews.length > 0 ? (
            localReviews.map((review) => (
              <div key={review.id} className="border-t border-gray-100 pt-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">
                      {review.userName.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{review.userName}</p>
                      <p className="text-[10px] text-gray-500">{review.date}</p>
                    </div>
                  </div>
                  <RatingStars rating={review.rating} />
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {review.text}
                </p>
              </div>
            ))
          ) : (
            <div className="text-center py-6 border-t border-gray-100">
              <p className="text-gray-500 text-sm">No reviews yet. Be the first to review!</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Review Modal */}
      {showReviewModal && (
        <div className="absolute inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowReviewModal(false)}></div>
          <div className="bg-white rounded-t-3xl p-4 flex flex-col relative z-10 animate-in slide-in-from-bottom-full duration-300">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Write a Review</h2>
              <button onClick={() => setShowReviewModal(false)} className="p-2 text-gray-500 bg-gray-100 rounded-full">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmitReview}>
              <div className="mb-6 flex flex-col items-center">
                <p className="text-sm font-bold text-gray-700 mb-2">Tap to Rate</p>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewReviewRating(star)}
                      className="p-1"
                    >
                      <Star 
                        size={32} 
                        className={star <= newReviewRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} 
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 mb-2">Your Review</label>
                <textarea 
                  required
                  rows={4}
                  value={newReviewText}
                  onChange={(e) => setNewReviewText(e.target.value)}
                  placeholder="Share your experience..." 
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none"
                ></textarea>
              </div>

              <button 
                type="submit"
                disabled={newReviewRating === 0 || newReviewText.trim() === ''}
                className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg shadow-sm active:scale-[0.98] transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit Review
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Contact Us Modal */}
      {showContactModal && (
        <div className="absolute inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowContactModal(false)}></div>
          <div className="bg-white rounded-t-3xl p-4 flex flex-col relative z-10 animate-in slide-in-from-bottom-full duration-300">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Contact {business.name}</h2>
              <button onClick={() => setShowContactModal(false)} className="p-2 text-gray-500 bg-gray-100 rounded-full">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              // In a real app, this would send the message to the backend
              alert('Message sent successfully!');
              setShowContactModal(false);
              setContactMessage('');
            }}>
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 mb-2">Your Message</label>
                <textarea 
                  required
                  rows={5}
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  placeholder="How can we help you?" 
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none"
                ></textarea>
              </div>

              <button 
                type="submit"
                disabled={contactMessage.trim() === ''}
                className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold text-lg shadow-sm active:scale-[0.98] transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Claim Business Modal */}
      {showClaimModal && (
        <div className="absolute inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowClaimModal(false)}></div>
          <div className="bg-white rounded-t-3xl p-6 flex flex-col relative z-10 animate-in slide-in-from-bottom-full duration-300 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Claim Business</h2>
              <button onClick={() => setShowClaimModal(false)} className="p-2 text-gray-500 bg-gray-100 rounded-full">
                <X size={20} />
              </button>
            </div>

            {claimSubmitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto mb-4">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Claim Request Submitted!</h3>
                <p className="text-gray-600 mb-6">We will review your request and get back to you within 24-48 hours.</p>
                <button 
                  onClick={() => setShowClaimModal(false)}
                  className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold shadow-sm"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={(e) => {
                e.preventDefault();
                
                if (setClaimRequests && setAdminNotifications && setBusinesses) {
                  const newClaim: ClaimRequest = {
                    id: `cr${Date.now()}`,
                    businessId: business.id,
                    businessName: business.name,
                    userId: 'u1', // Assuming current user
                    status: 'pending',
                    date: new Date().toISOString().split('T')[0]
                  };
                  
                  setClaimRequests(prev => [newClaim, ...prev]);
                  
                  setAdminNotifications(prev => [{
                    id: `an${Date.now()}`,
                    message: `New claim request for ${business.name}`,
                    date: 'Just now',
                    read: false,
                    type: 'claim'
                  }, ...prev]);
                  
                  setBusinesses(prev => prev.map(b => 
                    b.id === business.id ? { ...b, claimStatus: 'pending' } : b
                  ));
                }
                
                setClaimSubmitted(true);
              }}>
                <div className="bg-blue-50 p-4 rounded-xl mb-6">
                  <p className="text-sm text-blue-800">
                    <strong>{business.name}</strong> is currently unclaimed. Provide your details below to verify ownership and take control of this listing.
                  </p>
                </div>
                
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Full Name</label>
                    <input 
                      type="text" 
                      required
                      value={claimForm.name}
                      onChange={(e) => setClaimForm({...claimForm, name: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      placeholder="John Doe"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Business Email</label>
                    <input 
                      type="email" 
                      required
                      value={claimForm.email}
                      onChange={(e) => setClaimForm({...claimForm, email: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      placeholder="john@example.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Phone Number</label>
                    <input 
                      type="tel" 
                      required
                      value={claimForm.phone}
                      onChange={(e) => setClaimForm({...claimForm, phone: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Your Role</label>
                    <select 
                      required
                      value={claimForm.role}
                      onChange={(e) => setClaimForm({...claimForm, role: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="">Select your role</option>
                      <option value="owner">Owner</option>
                      <option value="manager">Manager</option>
                      <option value="employee">Employee</option>
                      <option value="agency">Marketing Agency</option>
                    </select>
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg shadow-sm active:scale-[0.98] transition-transform"
                >
                  Submit Claim Request
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
