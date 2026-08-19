import mongoose from 'mongoose'

const pharmacySchema = new mongoose.Schema({
  name: { type: String, required: true },
  ownerName: { type: String },
  phone: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String },
  pincode: { type: String },
  licenceNumber: { type: String },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
})

export default mongoose.model('Pharmacy', pharmacySchema)
