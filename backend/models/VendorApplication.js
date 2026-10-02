import mongoose from 'mongoose';

const vendorApplicationSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    vendorId: { type: String, required: true, index: true },
    businessName: { type: String, required: true },
    ownerName: { type: String, required: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    mobile: { type: String, required: true },
    category: { type: String, default: 'General Retail' },
    businessType: {
      type: String,
      enum: ['Private Limited', 'Partnership', 'Sole Proprietorship', 'LLP', 'Individual Artisan / Producer'],
      default: 'Private Limited'
    },
    gstin: { type: String, default: '' },
    panNumber: { type: String, default: '' },
    fssaiLicense: { type: String, default: '' },
    businessAddress: { type: String, default: '' },
    city: { type: String, default: '' },
    state: { type: String, default: '' },
    pincode: { type: String, default: '' },
    deliveryRadiusKm: { type: Number, default: 25 },
    deliveryScope: {
      type: String,
      enum: ['local', 'city', 'pan_india'],
      default: 'pan_india'
    },
    bankDetails: {
      accountHolder: { type: String, default: '' },
      accountNumber: { type: String, default: '' },
      ifscCode: { type: String, default: '' },
      upiId: { type: String, default: '' }
    },
    documents: [
      {
        type: { type: String, default: 'Registration Document' },
        title: { type: String, default: 'Certificate' },
        url: { type: String, default: '' }
      }
    ],
    status: {
      type: String,
      enum: ['pending', 'under_review', 'approved', 'rejected'],
      default: 'pending',
      index: true
    },
    rejectionReason: { type: String, default: '' },
    adminNotes: { type: String, default: '' },
    submittedAt: { type: String, default: () => new Date().toISOString() },
    reviewedAt: { type: String, default: null },
    reviewedBy: { type: String, default: null }
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

const VendorApplication =
  mongoose.models.VendorApplication || mongoose.model('VendorApplication', vendorApplicationSchema);
export default VendorApplication;
