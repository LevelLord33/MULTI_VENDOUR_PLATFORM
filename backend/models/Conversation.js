import mongoose from 'mongoose';

const attachmentSchema = new mongoose.Schema(
  {
    fileName: { type: String, required: true },
    fileUrl: { type: String, required: true },
    fileType: { type: String, default: 'image/jpeg' },
    fileSize: { type: Number }
  },
  { _id: false }
);

const messageItemSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    senderId: { type: String, required: true },
    senderType: {
      type: String,
      enum: ['customer', 'vendor', 'system'],
      required: true
    },
    senderName: { type: String, required: true },
    senderAvatar: { type: String, default: '' },
    text: { type: String, required: true, trim: true },
    attachments: [attachmentSchema],
    createdAt: { type: String, default: () => new Date().toISOString() },
    isRead: { type: Boolean, default: false }
  },
  { _id: false }
);

const relatedProductSchema = new mongoose.Schema(
  {
    productId: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number },
    image: { type: String },
    sku: { type: String },
    category: { type: String }
  },
  { _id: false }
);

const relatedOrderSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true },
    trackingNumber: { type: String },
    courierPartner: { type: String },
    status: { type: String },
    total: { type: Number },
    orderDate: { type: String }
  },
  { _id: false }
);

const conversationSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    customerId: {
      type: String,
      required: true,
      index: true
    },
    customerName: {
      type: String,
      required: true
    },
    customerEmail: {
      type: String
    },
    customerAvatar: {
      type: String,
      default: ''
    },
    vendorId: {
      type: String,
      required: true,
      index: true
    },
    vendorName: {
      type: String,
      required: true
    },
    vendorAvatar: {
      type: String,
      default: ''
    },
    subject: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      enum: ['product_inquiry', 'order_inquiry', 'shipping', 'warranty', 'general'],
      default: 'general',
      index: true
    },
    relatedProduct: {
      type: relatedProductSchema,
      default: null
    },
    relatedOrder: {
      type: relatedOrderSchema,
      default: null
    },
    status: {
      type: String,
      enum: ['active', 'resolved', 'archived'],
      default: 'active',
      index: true
    },
    unreadVendor: {
      type: Number,
      default: 0
    },
    unreadCustomer: {
      type: Number,
      default: 0
    },
    lastMessage: {
      type: String,
      default: ''
    },
    lastMessageSender: {
      type: String,
      enum: ['customer', 'vendor', 'system'],
      default: 'customer'
    },
    lastMessageAt: {
      type: String,
      default: () => new Date().toISOString(),
      index: true
    },
    messages: [messageItemSchema]
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

conversationSchema.index({ vendorId: 1, lastMessageAt: -1 });
conversationSchema.index({ customerId: 1, lastMessageAt: -1 });
conversationSchema.index({ vendorId: 1, status: 1 });

const Conversation = mongoose.models.Conversation || mongoose.model('Conversation', conversationSchema);
export default Conversation;
