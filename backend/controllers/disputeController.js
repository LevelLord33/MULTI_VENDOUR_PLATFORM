import mongoose from 'mongoose';
import Dispute from '../models/Dispute.js';
import Order from '../models/Order.js';

// Hybrid in-memory disputes store
let memDisputes = [
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
        uploadedAt: new Date('2024-08-24T14:30:00.000Z')
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
          uploadedAt: new Date('2024-08-25T10:15:00.000Z')
        }
      ],
      respondedAt: new Date('2024-08-25T10:15:00.000Z'),
      respondedBy: 'Rajesh Kumar (TechZone Electronics)'
    },
    adminResolution: null,
    auditTrail: [
      {
        action: 'DISPUTE_RAISED',
        performedBy: { id: 'c1', name: 'Arun Mehta', role: 'customer' },
        timestamp: new Date('2024-08-24T14:30:00.000Z'),
        notes: 'Customer raised a dispute regarding physical product damage upon arrival.',
        previousStatus: null,
        newStatus: 'Open'
      },
      {
        action: 'UNDER_REVIEW',
        performedBy: { id: 'admin-1', name: 'Platform Admin', role: 'admin' },
        timestamp: new Date('2024-08-24T16:00:00.000Z'),
        notes: 'Admin flagged for immediate merchant response.',
        previousStatus: 'Open',
        newStatus: 'Under Review'
      },
      {
        action: 'VENDOR_RESPONDED',
        performedBy: { id: 'v1', name: 'TechZone Electronics', role: 'vendor' },
        timestamp: new Date('2024-08-25T10:15:00.000Z'),
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
        uploadedAt: new Date('2024-09-09T11:20:00.000Z')
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
        timestamp: new Date('2024-09-09T11:20:00.000Z'),
        notes: 'Customer submitted dispute: Wrong size & color delivered.',
        previousStatus: null,
        newStatus: 'Open'
      }
    ]
  }
];

const isDbReady = () => mongoose.connection.readyState === 1;
const generateDisputeId = () => `DSP-${Math.floor(100000 + Math.random() * 900000)}`;

/**
 * 1. CUSTOMER: Raise a new dispute
 * POST /api/disputes
 */
export const raiseDispute = async (req, res) => {
  try {
    const {
      orderId,
      item,
      category,
      description,
      evidence = [],
      vendorId,
      vendorName
    } = req.body;

    const customerId = req.user?.id || 'c1';
    const customerName = req.user?.name || 'Customer';

    if (!orderId || !category || !description) {
      return res.status(400).json({
        success: false,
        message: 'Order ID, category, and description are required.'
      });
    }

    const disputeId = generateDisputeId();
    const now = new Date().toISOString();

    const newDispute = {
      disputeId,
      orderId,
      customerId,
      customerName,
      customerEmail: req.user?.email || 'customer@vendour.com',
      vendorId: vendorId || item?.vendorId || 'v1',
      vendorName: vendorName || item?.vendorName || 'Vendor Partner',
      item: {
        productId: item?.productId || 'p-gen',
        name: item?.name || 'Order Item',
        price: item?.price || 0,
        quantity: item?.quantity || 1,
        image: item?.image || '',
        sku: item?.sku || ''
      },
      category,
      description: description.trim(),
      evidence: evidence.map((e) => ({
        fileName: e.fileName || 'evidence.jpg',
        fileUrl: e.fileUrl || '',
        fileType: e.fileType || 'image/jpeg',
        fileSize: e.fileSize || 0
      })),
      status: 'Open',
      createdAt: now,
      vendorResponse: null,
      adminResolution: null,
      auditTrail: [
        {
          action: 'DISPUTE_RAISED',
          performedBy: { id: customerId, name: customerName, role: 'customer' },
          timestamp: new Date(),
          notes: `Customer opened dispute under category: "${category}".`,
          previousStatus: null,
          newStatus: 'Open'
        }
      ]
    };

    if (isDbReady()) {
      try {
        const doc = new Dispute(newDispute);
        await doc.save();
        await Order.findOneAndUpdate({ id: orderId }, { hasActiveDispute: true, activeDisputeId: disputeId });
      } catch (err) {
        console.warn('DB dispute save note:', err.message);
      }
    }

    memDisputes.unshift(newDispute);

    return res.status(201).json({
      success: true,
      message: 'Dispute raised successfully. Platform admin and vendor have been notified.',
      dispute: newDispute
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to raise dispute.',
      error: error.message
    });
  }
};

/**
 * 2. CUSTOMER: Get customer's own disputes
 * GET /api/disputes/my-disputes
 */
export const getCustomerDisputes = async (req, res) => {
  try {
    const customerId = req.user?.id;
    let disputes = [];

    if (isDbReady()) {
      try {
        disputes = await Dispute.find({ customerId }).sort({ createdAt: -1 });
        disputes = disputes.map((d) => (d.toJSON ? d.toJSON() : d));
      } catch {
        disputes = [];
      }
    }

    if (!disputes || disputes.length === 0) {
      disputes = memDisputes.filter((d) => d.customerId === customerId);
    }

    return res.json({
      success: true,
      count: disputes.length,
      disputes
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch customer disputes.',
      error: error.message
    });
  }
};

/**
 * 3. VENDOR: Get disputes for authenticated vendor
 * GET /api/disputes/vendor
 */
export const getVendorDisputes = async (req, res) => {
  try {
    const vendorId = req.user?.id;
    let disputes = [];

    if (isDbReady()) {
      try {
        disputes = await Dispute.find({ vendorId }).sort({ createdAt: -1 });
        disputes = disputes.map((d) => (d.toJSON ? d.toJSON() : d));
      } catch {
        disputes = [];
      }
    }

    if (!disputes || disputes.length === 0) {
      disputes = memDisputes.filter((d) => d.vendorId === vendorId);
    }

    return res.json({
      success: true,
      count: disputes.length,
      disputes
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch vendor disputes.',
      error: error.message
    });
  }
};

/**
 * 4. VENDOR: Submit explanation and evidence
 * POST /api/disputes/:id/vendor-response
 */
export const submitVendorResponse = async (req, res) => {
  try {
    const { id } = req.params;
    const { explanation, evidence = [] } = req.body;
    const vendorId = req.user?.id || 'v1';
    const vendorName = req.user?.name || 'Vendor Merchant';

    if (!explanation || explanation.trim().length < 5) {
      return res.status(400).json({
        success: false,
        message: 'A valid explanation is required from the vendor.'
      });
    }

    const responseObj = {
      explanation: explanation.trim(),
      evidence: evidence.map((e) => ({
        fileName: e.fileName || 'merchant_evidence.jpg',
        fileUrl: e.fileUrl || '',
        fileType: e.fileType || 'image/jpeg',
        fileSize: e.fileSize || 0
      })),
      respondedAt: new Date(),
      respondedBy: vendorName
    };

    let updated = null;

    if (isDbReady()) {
      try {
        const dispute = await Dispute.findOne({ $or: [{ disputeId: id }, { _id: id }] });
        if (dispute) {
          dispute.vendorResponse = responseObj;
          dispute.status = 'Vendor Responded';
          dispute.auditTrail.push({
            action: 'VENDOR_RESPONDED',
            performedBy: { id: vendorId, name: vendorName, role: 'vendor' },
            timestamp: new Date(),
            notes: 'Vendor submitted explanation and fulfillment evidence.',
            previousStatus: dispute.status,
            newStatus: 'Vendor Responded'
          });
          await dispute.save();
          updated = dispute.toJSON();
        }
      } catch {}
    }

    const idx = memDisputes.findIndex((d) => d.disputeId === id);
    if (idx > -1) {
      const d = memDisputes[idx];
      d.vendorResponse = responseObj;
      d.status = 'Vendor Responded';
      d.auditTrail.push({
        action: 'VENDOR_RESPONDED',
        performedBy: { id: vendorId, name: vendorName, role: 'vendor' },
        timestamp: new Date(),
        notes: 'Vendor submitted explanation and fulfillment evidence.',
        previousStatus: 'Open',
        newStatus: 'Vendor Responded'
      });
      if (!updated) updated = d;
    }

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Dispute not found.' });
    }

    return res.json({
      success: true,
      message: 'Vendor response submitted successfully.',
      dispute: updated
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to submit vendor response.',
      error: error.message
    });
  }
};

/**
 * 5. ADMIN: Get all disputes with dynamic filtering
 * GET /api/disputes/admin
 */
export const getAllDisputesAdmin = async (req, res) => {
  try {
    const { status, vendorId, category, search } = req.query;
    let disputes = [];

    if (isDbReady()) {
      try {
        const query = {};
        if (status && status !== 'All') query.status = status;
        if (vendorId && vendorId !== 'All') query.vendorId = vendorId;
        if (category && category !== 'All') query.category = category;
        if (search) {
          query.$or = [
            { disputeId: { $regex: search, $options: 'i' } },
            { orderId: { $regex: search, $options: 'i' } },
            { customerName: { $regex: search, $options: 'i' } },
            { vendorName: { $regex: search, $options: 'i' } }
          ];
        }
        disputes = await Dispute.find(query).sort({ createdAt: -1 });
        disputes = disputes.map((d) => (d.toJSON ? d.toJSON() : d));
      } catch {
        disputes = [];
      }
    }

    if (!disputes || disputes.length === 0) {
      let filtered = [...memDisputes];
      if (status && status !== 'All') filtered = filtered.filter((d) => d.status === status);
      if (vendorId && vendorId !== 'All') filtered = filtered.filter((d) => d.vendorId === vendorId);
      if (category && category !== 'All') filtered = filtered.filter((d) => d.category === category);
      if (search) {
        const s = search.toLowerCase();
        filtered = filtered.filter(
          (d) =>
            d.disputeId?.toLowerCase().includes(s) ||
            d.orderId?.toLowerCase().includes(s) ||
            d.customerName?.toLowerCase().includes(s) ||
            d.vendorName?.toLowerCase().includes(s)
        );
      }
      disputes = filtered;
    }

    return res.json({
      success: true,
      count: disputes.length,
      disputes
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch disputes for admin.',
      error: error.message
    });
  }
};

/**
 * 6. ADMIN: Review, change status, add resolution notes, resolve or reject
 * PATCH /api/disputes/:id/status
 */
export const updateDisputeStatusAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, resolutionNote, refundAction = 'None', refundAmount = 0 } = req.body;

    const adminId = req.user?.id || 'admin';
    const adminName = req.user?.name || 'Platform Admin';

    const adminResolution = {
      adminId,
      adminName,
      resolutionNote: resolutionNote ? resolutionNote.trim() : '',
      decision: status,
      refundAction,
      refundAmount: Number(refundAmount) || 0,
      resolvedAt: new Date()
    };

    let updated = null;

    if (isDbReady()) {
      try {
        const dispute = await Dispute.findOne({ $or: [{ disputeId: id }, { _id: id }] });
        if (dispute) {
          dispute.status = status;
          dispute.adminResolution = adminResolution;
          dispute.auditTrail.push({
            action: status === 'Resolved' ? 'DISPUTE_RESOLVED' : status === 'Rejected' ? 'DISPUTE_REJECTED' : 'UNDER_REVIEW',
            performedBy: { id: adminId, name: adminName, role: 'admin' },
            timestamp: new Date(),
            notes: resolutionNote || `Admin moved dispute to ${status}.`,
            previousStatus: dispute.status,
            newStatus: status
          });
          await dispute.save();
          updated = dispute.toJSON();
        }
      } catch {}
    }

    const idx = memDisputes.findIndex((d) => d.disputeId === id);
    if (idx > -1) {
      const d = memDisputes[idx];
      d.status = status;
      d.adminResolution = adminResolution;
      d.auditTrail.push({
        action: status === 'Resolved' ? 'DISPUTE_RESOLVED' : status === 'Rejected' ? 'DISPUTE_REJECTED' : 'UNDER_REVIEW',
        performedBy: { id: adminId, name: adminName, role: 'admin' },
        timestamp: new Date(),
        notes: resolutionNote || `Admin moved dispute to ${status}.`,
        previousStatus: 'Open',
        newStatus: status
      });
      if (!updated) updated = d;
    }

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Dispute not found.' });
    }

    return res.json({
      success: true,
      message: `Dispute marked as ${status} successfully.`,
      dispute: updated
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update dispute status.',
      error: error.message
    });
  }
};

/**
 * 7. COMMON: Get single dispute details
 * GET /api/disputes/:id
 */
export const getDisputeById = async (req, res) => {
  try {
    const { id } = req.params;
    let dispute = null;

    if (isDbReady()) {
      try {
        dispute = await Dispute.findOne({ $or: [{ disputeId: id }, { _id: id }] });
        if (dispute) dispute = dispute.toJSON();
      } catch {
        dispute = null;
      }
    }

    if (!dispute) {
      dispute = memDisputes.find((d) => d.disputeId === id);
    }

    if (!dispute) {
      return res.status(404).json({
        success: false,
        message: 'Dispute record not found.'
      });
    }

    return res.json({
      success: true,
      dispute
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve dispute details.',
      error: error.message
    });
  }
};
