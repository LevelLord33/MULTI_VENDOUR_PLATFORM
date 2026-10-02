import mongoose from 'mongoose';

const invoiceItemSchema = new mongoose.Schema(
  {
    productId: { type: String, required: true },
    name: { type: String, required: true },
    sku: { type: String, default: 'SKU-ITEM' },
    hsnCode: { type: String, default: '8518.30.00' },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true },
    baseUnitRate: { type: Number },
    taxableValue: { type: Number },
    discount: { type: Number, default: 0 },
    gstRatePercent: { type: String, default: '18%' },
    cgst: { type: Number, default: 0 },
    sgst: { type: Number, default: 0 },
    igst: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true }
  },
  { _id: false }
);

const deliveryLogSchema = new mongoose.Schema(
  {
    channel: { type: String, enum: ['sms', 'whatsapp'], required: true },
    recipient: { type: String, required: true },
    status: {
      type: String,
      enum: ['sent', 'delivered', 'failed', 'simulated'],
      default: 'sent'
    },
    sentAt: { type: String, default: () => new Date().toISOString() },
    messageSid: { type: String, default: '' },
    content: { type: String, default: '' },
    errorMessage: { type: String, default: null }
  },
  { _id: false }
);

const invoiceSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    invoiceNumber: { type: String, required: true, unique: true, index: true },
    orderId: { type: String, required: true, index: true },
    customerId: { type: String, required: true, index: true },
    vendorId: { type: String, required: true, index: true },

    // Vendor Snapshot
    vendorBusinessName: { type: String, required: true },
    vendorGstin: { type: String, default: '07AABCT1234F1Z8' },
    vendorAddress: { type: String, default: '' },
    vendorCity: { type: String, default: '' },
    vendorState: { type: String, default: '' },
    vendorPhone: { type: String, default: '' },
    vendorEmail: { type: String, default: '' },

    // Customer Snapshot
    customerName: { type: String, required: true },
    customerEmail: { type: String, default: '' },
    customerPhone: { type: String, default: '' },
    customerAddress: { type: String, default: '' },
    customerCity: { type: String, default: '' },
    customerState: { type: String, default: '' },
    customerPincode: { type: String, default: '' },

    // Itemized Details
    items: [invoiceItemSchema],

    // Totals
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    shipping: { type: Number, default: 0 },
    grandTotal: { type: Number, required: true },
    amountInWords: { type: String, default: '' },

    // Payment & Reference
    paymentMethod: { type: String, default: 'Prepaid' },
    paymentStatus: { type: String, default: 'Paid' },
    orderReference: { type: String, default: '' },
    invoiceDate: { type: String, default: () => new Date().toISOString().split('T')[0] },

    // Twilio Delivery Tracking
    deliveryStatus: {
      type: String,
      enum: ['pending', 'sent', 'delivered', 'failed', 'simulated'],
      default: 'pending',
      index: true
    },
    deliveryLog: [deliveryLogSchema]
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

const Invoice = mongoose.models.Invoice || mongoose.model('Invoice', invoiceSchema);
export default Invoice;
