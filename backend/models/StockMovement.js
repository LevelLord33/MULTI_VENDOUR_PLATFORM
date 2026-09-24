import mongoose from 'mongoose';

const stockMovementSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    productId: {
      type: String,
      required: true,
      index: true
    },
    productName: {
      type: String,
      required: true
    },
    sku: {
      type: String,
      required: true,
      index: true
    },
    barcode: {
      type: String,
      default: ''
    },
    vendorId: {
      type: String,
      required: true,
      index: true
    },
    type: {
      type: String,
      enum: ['restock', 'order_reservation', 'dispatch', 'adjustment', 'return_restock', 'damage_writeoff'],
      required: true
    },
    quantityDelta: {
      type: Number,
      required: true
    },
    previousStock: {
      type: Number,
      required: true
    },
    newStock: {
      type: Number,
      required: true
    },
    reason: {
      type: String,
      default: 'Manual Inventory Adjustment'
    },
    referenceId: {
      type: String,
      default: ''
    },
    performedBy: {
      type: String,
      default: 'Vendor Operator'
    },
    warehouseLocation: {
      type: String,
      default: 'Warehouse Main'
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

const StockMovement = mongoose.model('StockMovement', stockMovementSchema);

export default StockMovement;
