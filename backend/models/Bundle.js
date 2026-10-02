import mongoose from 'mongoose';

const bundleItemSchema = new mongoose.Schema(
  {
    productId: { type: String, required: true },
    quantity: { type: Number, default: 1, min: 1 },
    name: { type: String, required: true },
    sku: { type: String, default: '' },
    price: { type: Number, required: true },
    image: { type: String, default: '' },
    category: { type: String, default: '' }
  },
  { _id: false }
);

const bundleSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    vendorId: { type: String, required: true, index: true },
    vendorName: { type: String, default: '' },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    badgeText: { type: String, default: 'COMBO DEAL' },
    items: [bundleItemSchema],
    discountType: {
      type: String,
      enum: ['percentage', 'fixed'],
      default: 'percentage'
    },
    discountValue: { type: Number, default: 15, min: 0 },
    originalPrice: { type: Number, required: true, min: 0 },
    bundlePrice: { type: Number, required: true, min: 0 },
    savingsAmount: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['active', 'paused', 'expired'],
      default: 'active',
      index: true
    },
    image: { type: String, default: '' },
    startDate: { type: String, default: () => new Date().toISOString().split('T')[0] },
    endDate: { type: String, default: '2026-12-31' },
    createdAt: { type: String, default: () => new Date().toISOString().split('T')[0] }
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

const Bundle = mongoose.models.Bundle || mongoose.model('Bundle', bundleSchema);
export default Bundle;
