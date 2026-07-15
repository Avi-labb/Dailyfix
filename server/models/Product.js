import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
  },
  stock: {
    type: Number,
    default: 0,
  },
  sku: {
    type: String,
  },
  brand: {
    type: String,
  },
  image: {
    type: String,
  },
}, {
  timestamps: true,
});

export default mongoose.model('Product', productSchema);
