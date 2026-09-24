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
    password: { type: String, required: true },
    name: { type: String },
    fullName: { type: String },
    mobile: { type: String, default: '' },
    avatar: { type: String, default: '' },
    joinedDate: { type: String, default: () => new Date().toISOString().split('T')[0] },

    // Customer Specific Fields
    address: { type: String, default: '' },
    city: { type: String, default: '' },
    state: { type: String, default: '' },
    pincode: { type: String, default: '' },

    // Vendor Specific Storefront Fields
    businessName: { type: String },
    storeSlug: { type: String, sparse: true, index: true },
    tagline: { type: String, default: '' },
    ownerName: { type: String, default: '' },
    businessAddress: { type: String, default: '' },
    location: { type: String, default: '' },
    banner: { type: String, default: '' },
    themeColor: { type: String, default: '#4F46E5' },
    themePreset: { type: String, default: 'indigo' },
    storeStatus: {
      type: String,
      enum: ['published', 'draft'],
      default: 'published'
    },
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
    description: { type: String, default: '' }
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
