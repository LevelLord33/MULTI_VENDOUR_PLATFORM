import mongoose from 'mongoose';

const evidenceSchema = new mongoose.Schema({
  fileName: { type: String, required: true },
  fileUrl: { type: String, required: true }, // Base64 data URI or Cloud Storage URL
  fileType: { type: String, default: 'image/jpeg' },
  fileSize: { type: Number },
  uploadedAt: { type: Date, default: Date.now }
}, { _id: false });

const auditTrailSchema = new mongoose.Schema({
  action: {
    type: String,
    required: true,
    enum: [
      'DISPUTE_RAISED',
      'STATUS_UPDATED',
      'VENDOR_RESPONDED',
      'EVIDENCE_ADDED',
      'UNDER_REVIEW',
      'DISPUTE_RESOLVED',
      'DISPUTE_REJECTED'
    ]
  },
  performedBy: {
    id: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String, required: true, enum: ['customer', 'vendor', 'admin', 'system'] }
  },
  timestamp: { type: Date, default: Date.now },
  notes: { type: String, default: '' },
  previousStatus: { type: String },
  newStatus: { type: String }
}, { _id: false });

const disputeSchema = new mongoose.Schema(
  {
    disputeId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    orderId: {
      type: String,
      required: true,
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
    vendorId: {
      type: String,
      required: true,
      index: true
    },
    vendorName: {
      type: String,
      required: true
    },
    item: {
      productId: { type: String, required: true },
      name: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, default: 1 },
      image: { type: String },
      sku: { type: String }
    },
    category: {
      type: String,
      required: true,
      enum: [
        'Product not received',
        'Damaged product',
        'Wrong product',
        'Refund issue',
        'Other'
      ]
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 2000
    },
    evidence: [evidenceSchema],
    status: {
      type: String,
      required: true,
      enum: ['Open', 'Under Review', 'Vendor Responded', 'Resolved', 'Rejected'],
      default: 'Open',
      index: true
    },
    vendorResponse: {
      explanation: { type: String, trim: true },
      evidence: [evidenceSchema],
      respondedAt: { type: Date },
      respondedBy: { type: String }
    },
    adminResolution: {
      adminId: { type: String },
      adminName: { type: String },
      resolutionNote: { type: String, trim: true },
      decision: {
        type: String,
        enum: ['Resolved', 'Rejected', 'Under Review']
      },
      refundAction: {
        type: String,
        enum: ['None', 'Full Refund', 'Partial Refund', 'Replacement'],
        default: 'None'
      },
      refundAmount: { type: Number, default: 0 },
      resolvedAt: { type: Date }
    },
    auditTrail: [auditTrailSchema]
  },
  {
    timestamps: true
  }
);

// Indexes for high-performance dashboard querying
disputeSchema.index({ vendorId: 1, status: 1 });
disputeSchema.index({ customerId: 1, createdAt: -1 });
disputeSchema.index({ status: 1, createdAt: -1 });

const Dispute = mongoose.models.Dispute || mongoose.model('Dispute', disputeSchema);
export default Dispute;
