import mongoose from 'mongoose';

const settingSchema = new mongoose.Schema({
  keyName: {
    type: String,
    required: true,
    unique: true,
  },
  value: {
    type: String,
  },
}, {
  timestamps: true,
});

export default mongoose.model('Setting', settingSchema);
