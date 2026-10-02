import mongoose from 'mongoose';
import VendorApplication from '../models/VendorApplication.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import { getIO } from '../socket/socketService.js';

let memApplications = [
  {
    id: 'app-1001',
    vendorId: 'v11-demo',
    businessName: 'Vedic Aromas & Organics',
    ownerName: 'Sunita Sharma',
    email: 'sunita@vedicaromas.in',
    mobile: '9811223344',
    category: 'Beauty',
    businessType: 'Sole Proprietorship',
    gstin: '07AABCS9876K1Z3',
    panNumber: 'AABCS9876K',
    fssaiLicense: '10019022001234',
    businessAddress: '24, Rose Garden Road, Civil Lines',
    city: 'Jaipur',
    state: 'Rajasthan',
    pincode: '302006',
    deliveryRadiusKm: 30,
    deliveryScope: 'pan_india',
    bankDetails: {
      accountHolder: 'Vedic Aromas',
      accountNumber: '918273645019',
      ifscCode: 'HDFC0001234',
      upiId: 'vedicaromas@okhdfc'
    },
    documents: [
      {
        type: 'GST Certificate',
        title: 'Form GST REG-06 Certificate of Registration',
        url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&h=400&fit=crop'
      },
      {
        type: 'PAN Card',
        title: 'Business PAN Entity Card',
        url: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&h=400&fit=crop'
      }
    ],
    status: 'pending',
    rejectionReason: '',
    submittedAt: '2026-09-28T10:00:00.000Z',
    reviewedAt: null,
    reviewedBy: null
  },
  {
    id: 'app-1002',
    vendorId: 'v12-demo',
    businessName: 'Himalayan Shilajit & Pure Herbs',
    ownerName: 'Vikram Negi',
    email: 'vikram@himalayanherbs.in',
    mobile: '9822334455',
    category: 'Grocery',
    businessType: 'Partnership',
    gstin: '05AABCH5544R1Z9',
    panNumber: 'AABCH5544R',
    fssaiLicense: '10020011009876',
    businessAddress: '78, Mall Road, Almora',
    city: 'Dehradun',
    state: 'Uttarakhand',
    pincode: '248001',
    deliveryRadiusKm: 50,
    deliveryScope: 'pan_india',
    bankDetails: {
      accountHolder: 'Himalayan Shilajit Traders',
      accountNumber: '50100234567891',
      ifscCode: 'SBIN0004567',
      upiId: 'himalayanherbs@oksbi'
    },
    documents: [
      {
        type: 'FSSAI License',
        title: 'Central FSSAI Food Safety Compliance Certificate',
        url: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&h=400&fit=crop'
      }
    ],
    status: 'pending',
    rejectionReason: '',
    submittedAt: '2026-09-29T14:30:00.000Z',
    reviewedAt: null,
    reviewedBy: null
  }
];

const isDbReady = () => mongoose.connection.readyState === 1;

/**
 * POST /api/vendor-applications
 * Vendor submits application for merchant verification & onboarding
 */
export const submitApplication = async (req, res) => {
  try {
    const data = req.body;
    const vendorId = req.user?.id || data.vendorId || ('v' + Date.now());

    if (!data.businessName || !data.ownerName || !data.mobile || !data.email) {
      return res.status(400).json({
        success: false,
        message: 'Business name, owner name, email, and mobile are required.'
      });
    }

    const appId = 'app-' + Date.now();
    const newApplication = {
      ...data,
      id: appId,
      vendorId,
      email: data.email.toLowerCase().trim(),
      status: 'pending',
      rejectionReason: '',
      submittedAt: new Date().toISOString()
    };

    if (isDbReady()) {
      try {
        const doc = new VendorApplication(newApplication);
        await doc.save();

        // Update vendor user model status
        await User.findOneAndUpdate(
          { id: vendorId },
          {
            $set: {
              vendorApplicationStatus: 'pending',
              vendorApplicationId: appId,
              gstin: data.gstin || '',
              businessType: data.businessType || 'Private Limited',
              businessAddress: data.businessAddress || '',
              location: `${data.city || ''}, ${data.state || ''}`.replace(/^,\s*|,\s*$/g, '') || data.location,
              deliveryRadiusKm: Number(data.deliveryRadiusKm) || 25,
              deliveryScope: data.deliveryScope || 'pan_india',
              isVerified: false
            }
          }
        );
      } catch (e) {
        console.warn('DB vendor application save fallback:', e.message);
      }
    }

    memApplications.unshift(newApplication);

    // Notify Admins in real-time
    const io = getIO();
    if (io) {
      const adminNotif = {
        id: `notif-${Date.now()}`,
        userId: 'admin',
        type: 'application',
        title: `New Vendor Application: ${data.businessName}`,
        message: `${data.ownerName} submitted merchant application for category ${data.category || 'General'}.`,
        link: '/admin/vendors',
        createdAt: new Date().toISOString()
      };
      io.to('role_admin').emit('new_notification', adminNotif);
    }

    return res.status(201).json({
      success: true,
      message: 'Vendor onboarding application submitted successfully. Admin review in progress.',
      application: newApplication
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET /api/vendor-applications
 * Admin gets all applications (filterable by status)
 */
export const getApplications = async (req, res) => {
  try {
    const { status } = req.query;

    let apps = [];
    if (isDbReady()) {
      try {
        const query = {};
        if (status && status !== 'all') query.status = status;
        apps = await VendorApplication.find(query).sort({ createdAt: -1 });
        apps = apps.map((a) => (a.toJSON ? a.toJSON() : a));
      } catch (e) {
        apps = [];
      }
    }

    if (!apps || apps.length === 0) {
      apps = memApplications.filter((a) => !status || status === 'all' || a.status === status);
    }

    return res.json({
      success: true,
      count: apps.length,
      applications: apps
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET /api/vendor-applications/my-status
 * Vendor checks their own application status
 */
export const getMyApplicationStatus = async (req, res) => {
  try {
    const vendorId = req.user?.id;
    if (!vendorId) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    let app = null;
    if (isDbReady()) {
      try {
        app = await VendorApplication.findOne({ vendorId }).sort({ createdAt: -1 });
        if (app) app = app.toJSON();
      } catch (e) {}
    }

    if (!app) {
      app = memApplications.find((a) => a.vendorId === vendorId);
    }

    return res.json({
      success: true,
      application: app || null,
      status: app ? app.status : 'none'
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * PATCH /api/vendor-applications/:id/status
 * Admin approves or rejects application
 */
export const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, rejectionReason, adminNotes } = req.body;

    if (!['approved', 'rejected', 'under_review'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status specified' });
    }

    const reviewedAt = new Date().toISOString();
    const reviewedBy = req.user?.name || 'Platform Administrator';

    let updated = null;
    if (isDbReady()) {
      try {
        updated = await VendorApplication.findOneAndUpdate(
          { id },
          {
            $set: {
              status,
              rejectionReason: rejectionReason || '',
              adminNotes: adminNotes || '',
              reviewedAt,
              reviewedBy
            }
          },
          { new: true }
        );
        if (updated) updated = updated.toJSON();

        if (updated && updated.vendorId) {
          const isApproved = status === 'approved';
          await User.findOneAndUpdate(
            { id: updated.vendorId },
            {
              $set: {
                vendorApplicationStatus: status,
                rejectionReason: rejectionReason || '',
                isVerified: isApproved,
                storeStatus: isApproved ? 'published' : 'draft'
              }
            }
          );
        }
      } catch (e) {
        console.warn('DB application status update fallback:', e.message);
      }
    }

    const idx = memApplications.findIndex((a) => a.id === id);
    if (idx > -1) {
      memApplications[idx] = {
        ...memApplications[idx],
        status,
        rejectionReason: rejectionReason || '',
        adminNotes: adminNotes || '',
        reviewedAt,
        reviewedBy
      };
      if (!updated) updated = memApplications[idx];
    }

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    // Socket.IO Notify Vendor
    const io = getIO();
    if (io && updated.vendorId) {
      const isApproved = status === 'approved';
      const vendorNotif = {
        id: `notif-${Date.now()}`,
        userId: updated.vendorId,
        type: 'application',
        title: isApproved ? '🎉 Merchant Storefront Approved & Activated!' : '⚠️ Merchant Application Status Update',
        message: isApproved
          ? 'Your store is now fully verified and published on Vendor Hub marketplace.'
          : `Application status changed to ${status}. ${rejectionReason ? 'Reason: ' + rejectionReason : ''}`,
        link: '/vendor/dashboard',
        createdAt: new Date().toISOString()
      };

      io.to(`user_${updated.vendorId}`).emit('new_notification', vendorNotif);
      io.to(`vendor_${updated.vendorId}`).emit('application_status_changed', { status, application: updated });
    }

    return res.json({
      success: true,
      message: `Vendor application ${status} successfully.`,
      application: updated
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
