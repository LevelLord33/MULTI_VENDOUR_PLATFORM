import mongoose from 'mongoose';

const promotionSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    vendorId: { type: String, required: true, index: true },
    title: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ['coupon', 'discount_campaign', 'promotional_banner', 'featured_deal'],
      required: true,
      index: true
    },
    code: {
      type: String,
      uppercase: true,
      trim: true,
      sparse: true,
      index: true
    },
    discountType: {
      type: String,
      enum: ['percentage', 'fixed'],
      default: 'percentage'
    },
    discountValue: { type: Number, default: 0, min: 0 },
    minOrderValue: { type: Number, default: 0, min: 0 },
    maxDiscount: { type: Number, default: 0, min: 0 },
    applicableProductIds: [{ type: String }],
    applicableCategory: { type: String, default: 'All' },
    bannerUrl: { type: String, default: '' },
    bannerPlacement: {
      type: String,
      enum: ['store_top', 'marketplace_banner', 'category_hero'],
      default: 'store_top'
    },
    bannerLink: { type: String, default: '' },
    subtitle: { type: String, default: '' },
    buttonText: { type: String, default: 'Shop Offer' },
    badgeText: { type: String, default: 'LIMITED OFFER' },
    startDate: { type: String, default: () => new Date().toISOString().split('T')[0] },
    endDate: { type: String, default: '2026-12-31' },
    usageLimit: { type: Number, default: 100 },
    usageCount: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['active', 'paused', 'expired'],
      default: 'active',
      index: true
    },
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

const Promotion = mongoose.models.Promotion || mongoose.model('Promotion', promotionSchema);
export default Promotion;
