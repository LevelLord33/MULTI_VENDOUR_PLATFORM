import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    customerName: { type: String, default: 'Customer' },
    rating: { type: Number, default: 5 },
    title: { type: String, default: '' },
    comment: { type: String, default: '' },
    date: { type: String, default: () => new Date().toISOString().split('T')[0] },
    verified: { type: Boolean, default: true }
  },
  { _id: false }
);

const inquirySchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    date: { type: String, default: () => new Date().toISOString().split('T')[0] },
    question: { type: String, required: true },
    customerName: { type: String, default: 'Customer' },
    answer: { type: String, default: null },
    answeredAt: { type: String, default: null }
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    sku: { type: String, required: true, unique: true },
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, index: true },
    brand: { type: String, default: '' },
    price: { type: Number, required: true, min: 0 },
    mrp: { type: Number, required: true, min: 0 },
    discountPercent: { type: Number, default: 0 },
    stock: { type: Number, required: true, min: 0, default: 0 },
    quantity: { type: Number, min: 0, default: 0 },
    barcode: { type: String, default: '' },
    lowStockThreshold: { type: Number, default: 5 },
    reservedStock: { type: Number, default: 0 },
    warehouseLocation: { type: String, default: 'Warehouse Main, Shelf A' },
    restockLeadDays: { type: Number, default: 3 },
    vendorId: { type: String, required: true, index: true },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
      index: true
    },
    images: [{ type: String }],
    description: { type: String, default: '' },
    condition: { type: String, default: 'Brand New (Sealed)' },
    specifications: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    shipping: {
      weight: { type: String, default: '500 g' },
      dispatchTime: { type: String, default: 'Ships within 24 hours' },
      estimatedDays: { type: String, default: '2 - 4 days' },
      courierPartners: [{ type: String }],
      codAvailable: { type: Boolean, default: true },
      returnWindowDays: { type: Number, default: 7 }
    },
    variants: {
      colors: [
        {
          name: String,
          hex: String,
          inStock: { type: Boolean, default: true }
        }
      ],
      options: [
        {
          label: String,
          priceDelta: { type: Number, default: 0 },
          stock: { type: Number, default: 10 }
        }
      ],
      customization: {
        allowGiftWrap: { type: Boolean, default: true },
        allowEngraving: { type: Boolean, default: false },
        warrantyPlans: [
          {
            id: String,
            name: String,
            price: Number,
            duration: String
          }
        ]
      }
    },
    rating: { type: Number, default: 4.5 },
    reviewsCount: { type: Number, default: 0 },
    reviews: [reviewSchema],
    inquiries: [inquirySchema],
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

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
export default Product;
