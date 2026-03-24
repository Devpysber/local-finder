import React from 'react';
import { Search, MapPin, XCircle, CheckCircle } from 'lucide-react';
import { Business, ClaimRequest } from '../../types';

interface BusinessVerificationTabProps {
  pendingClaims: Business[];
  verificationSearchQuery: string;
  setVerificationSearchQuery: (query: string) => void;
  getClaimAgeTag: (businessId: string) => { label: string; color: string } | null;
  setViewingBusiness: (business: Business) => void;
  handleUpdateClaimStatus: (id: string, name: string, status: 'claimed' | 'unclaimed') => void;
  claimRequests: ClaimRequest[];
}

export const BusinessVerificationTab: React.FC<BusinessVerificationTabProps> = ({
  pendingClaims,
  verificationSearchQuery,
  setVerificationSearchQuery,
  getClaimAgeTag,
  setViewingBusiness,
  handleUpdateClaimStatus,
  claimRequests,
}) => {
  const filteredPendingClaims = pendingClaims.filter(business => {
    return (business.name || '').toLowerCase().includes(verificationSearchQuery.toLowerCase()) ||
           (business.address || '').toLowerCase().includes(verificationSearchQuery.toLowerCase());
  });

  return (
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
                    {claimRequests.find(req => req.businessId === business.id && req.status === 'pending')?.date && (
                      <p className="text-xs text-gray-500 mt-1">Request Date: {claimRequests.find(req => req.businessId === business.id && req.status === 'pending')?.date}</p>
                    )}
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
  );
};
