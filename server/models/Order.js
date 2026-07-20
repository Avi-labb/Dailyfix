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
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true }
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
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Pending',
  },
  paymentMethod: {
    type: String,
    enum: ['COD', 'Online'],
    default: 'COD',
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Pending (COD)', 'Paid', 'Failed'],
    default: 'Pending',
  },
  shippingAddress: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
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
