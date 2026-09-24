import mongoose from 'mongoose';

const storeAnalyticsSchema = new mongoose.Schema(
  {
    vendorId: {
      type: String,
      required: true,
      index: true
    },
    date: {
      type: String, // 'YYYY-MM-DD'
      required: true,
      index: true
    },
    visits: {
      type: Number,
      default: 0
    },
    uniqueVisitors: {
      type: Number,
      default: 0
    },
    productViews: {
      type: Number,
      default: 0
    },
    cartAdds: {
      type: Number,
      default: 0
    },
    ordersCount: {
      type: Number,
      default: 0
    },
    revenue: {
      type: Number,
      default: 0
    },
    visitorIps: [
      {
        type: String
      }
    ]
  },
  {
    timestamps: true
  }
);

// Unique compound index so there is at most one record per vendor per day
storeAnalyticsSchema.index({ vendorId: 1, date: 1 }, { unique: true });

const StoreAnalytics = mongoose.model('StoreAnalytics', storeAnalyticsSchema);

export default StoreAnalytics;
