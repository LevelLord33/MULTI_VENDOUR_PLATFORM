import mongoose from 'mongoose';

const vendorSubscriptionSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    customerId: { type: String, required: true, index: true },
    vendorId: { type: String, required: true, index: true },
    status: {
      type: String,
      enum: ['active', 'cancelled'],
      default: 'active',
      index: true
    },
    subscribedAt: {
      type: String,
      default: () => new Date().toISOString()
    },
    cancelledAt: {
      type: String,
      default: null
    },
    notificationPreferences: {
      channelEmail: { type: Boolean, default: true },
      channelSms: { type: Boolean, default: false },
      newProducts: { type: Boolean, default: true },
      promotions: { type: Boolean, default: true },
      deals: { type: Boolean, default: true },
      updates: { type: Boolean, default: true }
    }
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

// Compound index to prevent duplicate active subscriptions
vendorSubscriptionSchema.index({ customerId: 1, vendorId: 1 }, { unique: true });

const VendorSubscription =
  mongoose.models.VendorSubscription ||
  mongoose.model('VendorSubscription', vendorSubscriptionSchema);

export default VendorSubscription;
