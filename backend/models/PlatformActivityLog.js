import mongoose from 'mongoose';

const platformActivityLogSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    action: {
      type: String,
      required: true,
      index: true
      // e.g., 'vendor_application_submitted', 'vendor_approved', 'vendor_rejected',
      // 'product_approved', 'product_rejected', 'order_placed', 'order_status_changed',
      // 'invoice_generated', 'invoice_delivery_attempted', 'subscription_created',
      // 'subscription_cancelled', 'dispute_raised', 'dispute_resolved', 'admin_action',
      // 'vendor_broadcast_sent'
    },
    actorId: { type: String, default: 'system', index: true },
    actorRole: {
      type: String,
      enum: ['admin', 'vendor', 'customer', 'system'],
      default: 'system',
      index: true
    },
    actorName: { type: String, default: 'Platform System' },
    targetType: {
      type: String,
      enum: ['vendor', 'customer', 'order', 'product', 'invoice', 'subscription', 'dispute', 'system', 'communication'],
      required: true,
      index: true
    },
    targetId: { type: String, default: '', index: true },
    title: { type: String, required: true },
    details: { type: mongoose.Schema.Types.Mixed, default: {} },
    timestamp: { type: Date, default: Date.now, index: true }
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

platformActivityLogSchema.index({ timestamp: -1 });

const PlatformActivityLog =
  mongoose.models.PlatformActivityLog ||
  mongoose.model('PlatformActivityLog', platformActivityLogSchema);

export default PlatformActivityLog;
