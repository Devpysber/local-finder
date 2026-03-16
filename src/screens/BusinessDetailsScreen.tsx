import React, { useState } from 'react';
import { ArrowLeft, Share2, Heart, MapPin, Phone, Clock, Star, MessageCircle, CheckCircle2, X } from 'lucide-react';
import { ScreenType, Business, Review } from '../types';
import { RatingStars } from '../components';

export const BusinessDetailsScreen = ({ 
  business, 
  onBack,
  isFavorite,
  onToggleFavorite
}: { 
  business: Business, 
  onBack: () => void,
  isFavorite: boolean,
  onToggleFavorite: (id: string) => void
}) => {
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [newReviewRating, setNewReviewRating] = useState(0);
  const [newReviewText, setNewReviewText] = useState('');
  
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
            <button className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white">
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
      </div>

      {/* Info Section */}
      <div className="bg-white p-4 mb-2 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4">About</h2>
        <p className="text-gray-600 text-sm leading-relaxed mb-4">{business.description}</p>
        
        <div className="flex flex-col gap-3">
          <div className="flex items-start gap-3">
            <MapPin size={20} className="text-gray-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-900">{business.address}</p>
              <button className="text-blue-600 text-xs font-bold mt-1">Get Directions</button>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Clock size={20} className="text-gray-400 shrink-0" />
            <p className="text-sm font-medium text-gray-900">{business.hours}</p>
          </div>
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
    </div>
  );
};
