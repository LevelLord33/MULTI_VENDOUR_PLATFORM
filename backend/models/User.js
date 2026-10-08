import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    type: {
      type: String,
      enum: ['customer', 'vendor', 'admin'],
      default: 'customer',
      index: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },
    password: { type: String, required: false, default: '' },
    name: { type: String },
    fullName: { type: String },
    mobile: { type: String, default: '' },
    avatar: { type: String, default: '' },
    joinedDate: { type: String, default: () => new Date().toISOString().split('T')[0] },

    // Registration Security & Verification Code
    isEmailVerified: { type: Boolean, default: false },
    verificationCode: { type: String, default: null },
    verificationCodeExpiresAt: { type: Date, default: null },

    // Customer Specific Fields
    address: { type: String, default: '' },
    city: { type: String, default: '' },
    state: { type: String, default: '' },
    pincode: { type: String, default: '' },
    wishlist: [{ type: String }],
    followedVendors: [{ type: String }],

    // Coordinates (Customer or Vendor)
    latitude: { type: Number, default: null },
    longitude: { type: Number, default: null },

    // Vendor Specific Storefront Fields
    businessName: { type: String },
    businessType: { type: String, default: 'Private Limited' },
    category: { type: String, default: '' },
    storeSlug: { type: String, sparse: true, index: true },
    tagline: { type: String, default: '' },
    ownerName: { type: String, default: '' },
    businessAddress: { type: String, default: '' },
    location: { type: String, default: '' },
    deliveryRadiusKm: { type: Number, default: 25 },
    deliveryScope: {
      type: String,
      enum: ['local', 'city', 'pan_india'],
      default: 'pan_india'
    },
    serviceablePincodes: [{ type: String }],
    followersCount: { type: Number, default: 0 },
    banner: { type: String, default: '' },
    themeColor: { type: String, default: '#4F46E5' },
    themePreset: { type: String, default: 'indigo' },
    storeStatus: {
      type: String,
      enum: ['published', 'approved', 'pending_approval', 'draft', 'rejected'],
      default: 'draft'
    },
    storeApprovalStatus: {
      type: String,
      enum: ['none', 'pending', 'approved', 'rejected'],
      default: 'none'
    },
    storeRejectionReason: { type: String, default: '' },
    storeSubmittedAt: { type: String, default: null },
    storeApprovedAt: { type: String, default: null },
    isVerified: { type: Boolean, default: true },
    gstin: { type: String, default: '' },
    announcement: { type: String, default: '' },
    featuredProductIds: [{ type: String }],
    storeRating: { type: Number, default: 4.8 },
    totalOrdersFulfilled: { type: Number, default: 0 },
    onTimeDispatchRate: { type: String, default: '98.8%' },
    shippingPartners: [{ type: String }],
    returnPolicy: { type: String, default: '7 Days Hassle-Free Physical Replacement or Full Refund' },
    warrantyPolicy: { type: String, default: '100% Verified Brand Warranty & Tax Invoice Included' },
    description: { type: String, default: '' },

    // Vendor Onboarding / Application Workflow Status
    vendorApplicationStatus: {
      type: String,
      enum: ['none', 'pending', 'under_review', 'approved', 'rejected'],
      default: 'approved'
    },
    vendorApplicationId: { type: String, default: '' },
    rejectionReason: { type: String, default: '' },
    applicationData: { type: mongoose.Schema.Types.Mixed, default: null }
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        delete ret._id;
        delete ret.__v;
        return ret;
      }
    }
  }
);

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;
