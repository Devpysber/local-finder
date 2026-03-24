import React from 'react';
import { XCircle, CheckCircle, FileText } from 'lucide-react';
import { Business, ClaimRequest, User } from '../../types';

interface BusinessDetailsModalProps {
  viewingBusiness: Business;
  setViewingBusiness: (business: Business | null) => void;
  claimRequests: ClaimRequest[];
  users: User[];
  getClaimAgeTag: (businessId: string) => { label: string; color: string } | null;
  handleUpdateClaimStatus: (id: string, name: string, status: 'claimed' | 'unclaimed') => void;
}

export const BusinessDetailsModal: React.FC<BusinessDetailsModalProps> = ({
  viewingBusiness,
  setViewingBusiness,
  claimRequests,
  users,
  getClaimAgeTag,
  handleUpdateClaimStatus,
}) => {
  return (
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
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Claim Status Details</h4>
            <div className="grid grid-cols-2 gap-y-3 text-sm">
              <div className="text-gray-500">Status:</div>
              <div className={`font-medium ${
                viewingBusiness.claimStatus === 'claimed' ? 'text-green-600' :
                viewingBusiness.claimStatus === 'pending' ? 'text-amber-600' :
                'text-gray-600'
              }`}>
                {viewingBusiness.claimStatus === 'claimed' ? 'Claimed' :
                 viewingBusiness.claimStatus === 'pending' ? 'Pending Verification' :
                 'Unclaimed'}
              </div>
              {(viewingBusiness.claimStatus === 'pending' ? claimRequests.find(req => req.businessId === viewingBusiness.id && req.status === 'pending')?.userId : viewingBusiness.ownerId) && (
                <>
                  <div className="text-gray-500">{viewingBusiness.claimStatus === 'pending' ? 'Requested By:' : 'Owner ID:'}</div>
                  <div className="font-medium text-gray-900">
                    {(() => {
                      const userId = viewingBusiness.claimStatus === 'pending' 
                        ? claimRequests.find(req => req.businessId === viewingBusiness.id && req.status === 'pending')?.userId 
                        : viewingBusiness.ownerId;
                      const user = users.find(u => u.id === userId);
                      return user ? `${user.name} (${userId})` : userId;
                    })()}
                  </div>
                </>
              )}
              {viewingBusiness.claimStatus === 'pending' && claimRequests.find(req => req.businessId === viewingBusiness.id && req.status === 'pending')?.date && (
                <>
                  <div className="text-gray-500">Request Date:</div>
                  <div className="font-medium text-gray-900">{claimRequests.find(req => req.businessId === viewingBusiness.id && req.status === 'pending')?.date}</div>
                  <div className="text-gray-500">Time in Queue:</div>
                  <div className="font-medium text-gray-900">
                    {getClaimAgeTag(viewingBusiness.id)?.label || 'Standard'}
                  </div>
                </>
              )}
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

          {viewingBusiness.claimStatus === 'pending' && (
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Verification Documents</h4>
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                      <FileText size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Business_License.pdf</p>
                      <p className="text-xs text-gray-500">Uploaded {claimRequests.find(req => req.businessId === viewingBusiness.id && req.status === 'pending')?.date || 'recently'}</p>
                    </div>
                  </div>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">View</button>
                </div>
                <div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                      <FileText size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Utility_Bill.jpg</p>
                      <p className="text-xs text-gray-500">Uploaded {claimRequests.find(req => req.businessId === viewingBusiness.id && req.status === 'pending')?.date || 'recently'}</p>
                    </div>
                  </div>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">View</button>
                </div>
              </div>
            </div>
          )}
        </div>

        {viewingBusiness.claimStatus === 'pending' && (
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
        )}
      </div>
    </div>
  );
};
