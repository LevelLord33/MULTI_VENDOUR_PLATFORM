import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';
import { apiService } from '../services/api';

const DisputeContext = createContext(null);

// Initial Seed Disputes for comprehensive out-of-the-box demonstration
const INITIAL_SEED_DISPUTES = [
  {
    disputeId: 'DSP-742918',
    orderId: 'ord1',
    customerId: 'c1',
    customerName: 'Arun Mehta',
    customerEmail: 'arun@example.com',
    vendorId: 'v1',
    vendorName: 'TechZone Electronics',
    item: {
      productId: 'p3',
      name: 'Sony WH-1000XM5 Headphones',
      price: 29990,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop',
      sku: 'VM-ELEC-P3-SON'
    },
    category: 'Damaged product',
    description: 'The courier delivery box was severely crushed on one corner, and the headphone right ear cup hinge has visible structural cracks causing audio distortion in the right channel.',
    evidence: [
      {
        fileName: 'damaged_headphone_box.jpg',
        fileUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=400&fit=crop',
        fileType: 'image/jpeg',
        uploadedAt: '2024-08-24T14:30:00.000Z'
      }
    ],
    status: 'Vendor Responded',
    createdAt: '2024-08-24T14:30:00.000Z',
    vendorResponse: {
      explanation: 'We thoroughly inspect all audio gear prior to handing over to BlueDart. However, we acknowledge courier mishandling during transit and have initiated a replacement claim with the logistics team. We are ready to ship a brand new sealed replacement unit upon admin approval.',
      evidence: [
        {
          fileName: 'pre_dispatch_inspection_slip.jpg',
          fileUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&h=400&fit=crop',
          fileType: 'image/jpeg',
          uploadedAt: '2024-08-25T10:15:00.000Z'
        }
      ],
      respondedAt: '2024-08-25T10:15:00.000Z',
      respondedBy: 'Rajesh Kumar (TechZone Electronics)'
    },
    adminResolution: null,
    auditTrail: [
      {
        action: 'DISPUTE_RAISED',
        performedBy: { id: 'c1', name: 'Arun Mehta', role: 'customer' },
        timestamp: '2024-08-24T14:30:00.000Z',
        notes: 'Customer raised a dispute regarding physical product damage upon arrival.',
        previousStatus: null,
        newStatus: 'Open'
      },
      {
        action: 'UNDER_REVIEW',
        performedBy: { id: 'admin-1', name: 'Platform Admin', role: 'admin' },
        timestamp: '2024-08-24T16:00:00.000Z',
        notes: 'Admin flagged for immediate merchant response.',
        previousStatus: 'Open',
        newStatus: 'Under Review'
      },
      {
        action: 'VENDOR_RESPONDED',
        performedBy: { id: 'v1', name: 'TechZone Electronics', role: 'vendor' },
        timestamp: '2024-08-25T10:15:00.000Z',
        notes: 'Merchant agreed to fulfill replacement and submitted inspection proof.',
        previousStatus: 'Under Review',
        newStatus: 'Vendor Responded'
      }
    ]
  },
  {
    disputeId: 'DSP-529104',
    orderId: 'ord2',
    customerId: 'c1',
    customerName: 'Arun Mehta',
    customerEmail: 'arun@example.com',
    vendorId: 'v2',
    vendorName: 'StyleHub Fashion',
    item: {
      productId: 'p11',
      name: "Men's Slim Fit Linen Shirt",
      price: 2499,
      quantity: 2,
      image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=200&h=200&fit=crop',
      sku: 'VM-FASH-P11-ZAR'
    },
    category: 'Wrong product',
    description: 'Ordered Navy Blue Size L shirts, but the vendor package contained Size S in White color.',
    evidence: [
      {
        fileName: 'wrong_tag_received.jpg',
        fileUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=400&fit=crop',
        fileType: 'image/jpeg',
        uploadedAt: '2024-09-09T11:20:00.000Z'
      }
    ],
    status: 'Open',
    createdAt: '2024-09-09T11:20:00.000Z',
    vendorResponse: null,
    adminResolution: null,
    auditTrail: [
      {
        action: 'DISPUTE_RAISED',
        performedBy: { id: 'c1', name: 'Arun Mehta', role: 'customer' },
        timestamp: '2024-09-09T11:20:00.000Z',
        notes: 'Customer submitted dispute: Wrong size & color delivered.',
        previousStatus: null,
        newStatus: 'Open'
      }
    ]
  }
];

export function DisputeProvider({ children }) {
  const { user } = useAuth();
  const toast = useToast();
  const addToast = toast?.addToast || ((msg) => console.log(msg));

  const [disputes, setDisputes] = useState(() => {
    try {
      const stored = localStorage.getItem('vm_disputes');
      return stored ? JSON.parse(stored) : INITIAL_SEED_DISPUTES;
    } catch {
      return INITIAL_SEED_DISPUTES;
    }
  });

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('vm_disputes', JSON.stringify(disputes));
  }, [disputes]);

  // Fetch disputes from Express/MongoDB Atlas on user session change
  useEffect(() => {
    if (!user) return;

    let fetchPromise = null;
    if (user.type === 'admin') {
      fetchPromise = apiService.getAllDisputesAdmin(user);
    } else if (user.type === 'vendor') {
      fetchPromise = apiService.getVendorDisputes(user);
    } else if (user.type === 'customer') {
      fetchPromise = apiService.getCustomerDisputes(user);
    }

    if (fetchPromise) {
      fetchPromise
        .then((data) => {
          if (data && data.success && Array.isArray(data.disputes) && data.disputes.length > 0) {
            setDisputes((prev) => {
              const apiMap = new Map(data.disputes.map((d) => [d.disputeId, d]));
              const merged = prev.map((d) => apiMap.get(d.disputeId) || d);
              data.disputes.forEach((d) => {
                if (!merged.some((m) => m.disputeId === d.disputeId)) merged.unshift(d);
              });
              return merged;
            });
          }
        })
        .catch(() => {});
    }
  }, [user]);

  // Raise a new dispute
  const raiseDispute = useCallback(
    async (disputeData) => {
      const newDisputeId = `DSP-${Math.floor(100000 + Math.random() * 900000)}`;
      const now = new Date().toISOString();

      const newDispute = {
        disputeId: newDisputeId,
        orderId: disputeData.orderId,
        customerId: user?.id || 'c1',
        customerName: user?.fullName || 'Arun Mehta',
        customerEmail: user?.email || 'customer@vendour.com',
        vendorId: disputeData.vendorId,
        vendorName: disputeData.vendorName || 'Vendor Partner',
        item: disputeData.item,
        category: disputeData.category,
        description: disputeData.description,
        evidence: disputeData.evidence || [],
        status: 'Open',
        createdAt: now,
        vendorResponse: null,
        adminResolution: null,
        auditTrail: [
          {
            action: 'DISPUTE_RAISED',
            performedBy: {
              id: user?.id || 'c1',
              name: user?.fullName || 'Customer',
              role: 'customer'
            },
            timestamp: now,
            notes: `Customer created dispute under "${disputeData.category}".`,
            previousStatus: null,
            newStatus: 'Open'
          }
        ]
      };

      // Optimistic local state update
      setDisputes((prev) => [newDispute, ...prev]);
      addToast(`Dispute #${newDisputeId} raised successfully. Vendor and Admin notified!`, 'success');

      // Attempt async backend API sync
      apiService.raiseDispute(disputeData, user);

      return newDispute;
    },
    [user, addToast]
  );

  // Vendor responds to dispute
  const submitVendorResponse = useCallback(
    async (disputeId, responseData) => {
      const now = new Date().toISOString();
      const vendorName = user?.businessName || user?.name || 'Vendor Merchant';

      setDisputes((prev) =>
        prev.map((d) => {
          if (d.disputeId !== disputeId) return d;

          const prevStatus = d.status;
          const newStatus = 'Vendor Responded';

          return {
            ...d,
            status: newStatus,
            vendorResponse: {
              explanation: responseData.explanation,
              evidence: responseData.evidence || [],
              respondedAt: now,
              respondedBy: vendorName
            },
            auditTrail: [
              ...d.auditTrail,
              {
                action: 'VENDOR_RESPONDED',
                performedBy: {
                  id: user?.id || 'v1',
                  name: vendorName,
                  role: 'vendor'
                },
                timestamp: now,
                notes: responseData.explanation.slice(0, 120) + (responseData.explanation.length > 120 ? '...' : ''),
                previousStatus: prevStatus,
                newStatus
              }
            ]
          };
        })
      );

      addToast(`Response submitted for Dispute #${disputeId}!`, 'success');
      apiService.submitVendorResponse(disputeId, responseData, user);
    },
    [user, addToast]
  );

  // Admin updates status (Under Review, Resolved, Rejected)
  const updateDisputeStatusAdmin = useCallback(
    async (disputeId, newStatus, resolutionNote, refundDetails = {}) => {
      const now = new Date().toISOString();
      const adminName = user?.name || 'Marketplace Platform Admin';

      setDisputes((prev) =>
        prev.map((d) => {
          if (d.disputeId !== disputeId) return d;

          const prevStatus = d.status;
          let actionType = 'STATUS_UPDATED';
          if (newStatus === 'Resolved') actionType = 'DISPUTE_RESOLVED';
          else if (newStatus === 'Rejected') actionType = 'DISPUTE_REJECTED';
          else if (newStatus === 'Under Review') actionType = 'UNDER_REVIEW';

          return {
            ...d,
            status: newStatus,
            adminResolution: {
              adminId: user?.id || 'admin',
              adminName,
              resolutionNote: resolutionNote || `Dispute moved to ${newStatus}.`,
              decision: newStatus,
              refundAction: refundDetails.action || 'None',
              refundAmount: refundDetails.amount || 0,
              resolvedAt: now
            },
            auditTrail: [
              ...d.auditTrail,
              {
                action: actionType,
                performedBy: {
                  id: user?.id || 'admin',
                  name: adminName,
                  role: 'admin'
                },
                timestamp: now,
                notes: resolutionNote || `Admin updated status to ${newStatus}`,
                previousStatus: prevStatus,
                newStatus
              }
            ]
          };
        })
      );

      addToast(`Dispute #${disputeId} marked as ${newStatus}!`, 'success');
      apiService.updateDisputeStatusAdmin(disputeId, { status: newStatus, resolutionNote, ...refundDetails }, user);
    },
    [user, addToast]
  );

  // Helper getters for scopes
  const getDisputesByCustomer = useCallback(
    (customerId) => disputes.filter((d) => d.customerId === customerId),
    [disputes]
  );

  const getDisputesByVendor = useCallback(
    (vendorId) => disputes.filter((d) => d.vendorId === vendorId),
    [disputes]
  );

  const getDisputeById = useCallback(
    (disputeId) => disputes.find((d) => d.disputeId === disputeId),
    [disputes]
  );

  const getDisputeForOrder = useCallback(
    (orderId, productId) =>
      disputes.find((d) => {
        if (d.orderId !== orderId) return false;
        if (productId && d.item?.productId) {
          return d.item.productId === productId;
        }
        return true;
      }),
    [disputes]
  );

  const value = useMemo(
    () => ({
      disputes,
      raiseDispute,
      submitVendorResponse,
      updateDisputeStatusAdmin,
      getDisputesByCustomer,
      getDisputesByVendor,
      getDisputeById,
      getDisputeForOrder
    }),
    [
      disputes,
      raiseDispute,
      submitVendorResponse,
      updateDisputeStatusAdmin,
      getDisputesByCustomer,
      getDisputesByVendor,
      getDisputeById,
      getDisputeForOrder
    ]
  );

  return (
    <DisputeContext.Provider value={value}>
      {children}
    </DisputeContext.Provider>
  );
}

export const useDisputes = () => {
  const context = useContext(DisputeContext);
  if (!context) {
    throw new Error('useDisputes must be used within a DisputeProvider');
  }
  return context;
};
