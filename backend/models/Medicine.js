import mongoose from 'mongoose'

const medicineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  composition: { type: String },
  manufacturer: { type: String },
  category: { type: String },
  batch: { type: String },
  expiryDate: { type: String, required: true }, // e.g. "2027-04-30"
  price: { type: Number, required: true },
  mrp: { type: Number },
  quantity: { type: Number, default: 0 },
  pharmacy: { type: mongoose.Schema.Types.ObjectId, ref: 'Pharmacy', required: true },
})

export default mongoose.model('Medicine', medicineSchema)
