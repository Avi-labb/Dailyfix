import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
}, {
  timestamps: true,
});

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true,
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
  },
  total: {
    type: Number,
    required: true,
  },
  tax: {
    type: Number,
    default: 0,
  },
  shipping: {
    type: Number,
    default: 0,
  },
  discount: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Pending',
  },
  paymentMethod: {
    type: String,
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Failed'],
    default: 'Pending',
  },
  shippingAddress: {
    type: String,
  },
  billingAddress: {
    type: String,
  },
  items: [orderItemSchema],
  
  // Delhivery Integration Fields
  delhiveryWaybill: {
    type: String,
  },
  delhiveryStatus: {
    type: String,
  },
  delhiveryTrackingData: {
    type: mongoose.Schema.Types.Mixed,
  },
  shipmentCreatedAt: {
    type: Date,
  },
  estimatedDelivery: {
    type: Date,
  },
}, {
  timestamps: true,
});

export default mongoose.model('Order', orderSchema);
