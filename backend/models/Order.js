import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema(
  {
    cartItemId: { type: String },
    productId: { type: String, required: true },
    sku: { type: String },
    name: { type: String, required: true },
    basePrice: { type: Number },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    image: { type: String },
    vendorId: { type: String, required: true },
    vendorName: { type: String },
    selectedVariant: {
      color: String,
      hex: String,
      option: String,
      priceDelta: Number
    },
    customization: {
      giftWrap: Boolean,
      engravingText: String,
      selectedWarranty: mongoose.Schema.Types.Mixed
    },
    maxStock: Number
  },
  { _id: false }
);

const timelineEventSchema = new mongoose.Schema(
  {
    status: { type: String, required: true },
    timestamp: { type: String, required: true },
    location: { type: String, default: '' },
    note: { type: String, default: '' }
  },
  { _id: false }
);

const returnRequestSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    reason: { type: String, required: true },
    requestedAction: { type: String, default: 'replacement' },
    note: { type: String, default: '' },
    requestedAt: { type: String, default: () => new Date().toISOString().split('T')[0] },
    vendorNote: { type: String, default: null },
    resolvedAt: { type: String, default: null }
  },
  { _id: false }
);

const supportTicketSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    productId: { type: String, required: true },
    productName: { type: String, default: 'Product' },
    issueType: { type: String, default: 'General Product Inquiry' },
    message: { type: String, default: '' },
    status: { type: String, default: 'Open' },
    date: { type: String, default: () => new Date().toISOString().split('T')[0] }
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    customerId: { type: String, required: true, index: true },
    items: [orderItemSchema],
    subtotal: { type: Number, default: 0 },
    shippingCost: { type: Number, default: 0 },
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ['Placed', 'Confirmed', 'Dispatched', 'Out for Delivery', 'Delivered', 'Cancelled', 'Disputed'],
      default: 'Placed',
      index: true
    },
    shippingMethod: { type: String, default: 'Standard' },
    courierPartner: { type: String, default: 'Delhivery Surface Express' },
    trackingNumber: { type: String },
    shippingAddress: {
      fullName: String,
      phone: String,
      street: String,
      city: String,
      state: String,
      pincode: String
    },
    address: { type: String },
    paymentMethod: {
      type: String,
      default: 'UPI_QR'
    },
    paymentStatus: {
      type: String,
      default: 'Paid'
    },
    paymentDetails: {
      method: String,
      status: String,
      codOtp: String,
      amountToCollect: Number,
      upiId: String,
      upiRef: String,
      cardLast4: String,
      cardNetwork: String,
      paidAt: String
    },
    shipmentTimeline: [timelineEventSchema],
    returnRequest: { type: returnRequestSchema, default: null },
    supportTickets: [supportTicketSchema],
    hasActiveDispute: { type: Boolean, default: false },
    activeDisputeId: { type: String },
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

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);
export default Order;
