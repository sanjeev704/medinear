// Run with: npm run seed
// Adds a handful of approved demo pharmacies and medicines so search,
// price comparison, and the "About medicine" card have real data to show.
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
import Pharmacy from './models/Pharmacy.js'
import Medicine from './models/Medicine.js'

dotenv.config()

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/medinear'
const DEMO_PASSWORD = 'demo1234' // all seed pharmacies share this login password

// Roughly spread around Lakhisarai, Bihar — all within a few km of each other
const demoPharmacies = [
  {
    name: 'Sharma Medical Store',
    ownerName: 'Ravi Sharma',
    phone: '9800000001',
    email: 'sharma.medical.demo@example.com',
    address: 'Station Road, Lakhisarai Bazar',
    city: 'Lakhisarai',
    pincode: '811311',
    licenceNumber: 'DEMO-LIC-001',
    lat: 25.617,
    lng: 85.146,
  },
  {
    name: 'City Care Pharmacy',
    ownerName: 'Priya Singh',
    phone: '9800000002',
    email: 'citycare.demo@example.com',
    address: 'Main Market Road, Lakhisarai',
    city: 'Lakhisarai',
    pincode: '811311',
    licenceNumber: 'DEMO-LIC-002',
    lat: 25.622,
    lng: 85.151,
  },
  {
    name: 'Apollo Health Store',
    ownerName: 'Manoj Kumar',
    phone: '9800000003',
    email: 'apollo.demo@example.com',
    address: 'Hospital Road, Lakhisarai',
    city: 'Lakhisarai',
    pincode: '811311',
    licenceNumber: 'DEMO-LIC-003',
    lat: 25.613,
    lng: 85.140,
  },
]

// name/composition intentionally matches frontend/src/data/medicineUses.js
// so the "About medicine" card has something to show for these searches
const demoMedicinesByPharmacy = [
  [
    { name: 'Paracetamol 500mg', composition: 'Paracetamol (Acetaminophen)', manufacturer: 'Sun Pharma', category: 'Tablet', batch: 'B-1001', expiryDate: '2027-06-30', price: 22, mrp: 28, quantity: 150 },
    { name: 'Amoxicillin 250mg', composition: 'Amoxicillin', manufacturer: 'Cipla', category: 'Capsule', batch: 'B-1002', expiryDate: '2026-12-15', price: 65, mrp: 75, quantity: 40 },
    { name: 'Cetirizine 10mg', composition: 'Cetirizine Hydrochloride', manufacturer: 'Alkem', category: 'Tablet', batch: 'B-1003', expiryDate: '2027-03-01', price: 18, mrp: 22, quantity: 80 },
  ],
  [
    { name: 'Paracetamol 650mg', composition: 'Paracetamol (Acetaminophen)', manufacturer: 'Micro Labs', category: 'Tablet', batch: 'B-2001', expiryDate: '2027-01-20', price: 25, mrp: 30, quantity: 90 },
    { name: 'Ibuprofen 400mg', composition: 'Ibuprofen', manufacturer: 'Abbott', category: 'Tablet', batch: 'B-2002', expiryDate: '2026-11-10', price: 32, mrp: 38, quantity: 60 },
    { name: 'Omeprazole 20mg', composition: 'Proton pump inhibitor', manufacturer: 'Dr Reddy\'s', category: 'Capsule', batch: 'B-2003', expiryDate: '2027-05-05', price: 45, mrp: 55, quantity: 35 },
  ],
  [
    { name: 'Paracetamol 500mg', composition: 'Paracetamol (Acetaminophen)', manufacturer: 'GSK', category: 'Tablet', batch: 'B-3001', expiryDate: '2026-09-01', price: 19, mrp: 25, quantity: 200 },
    { name: 'Metformin 500mg', composition: 'Metformin Hydrochloride', manufacturer: 'USV', category: 'Tablet', batch: 'B-3002', expiryDate: '2027-02-18', price: 38, mrp: 45, quantity: 55 },
    { name: 'ORS Sachet', composition: 'Oral Rehydration Salts', manufacturer: 'FDC', category: 'Sachet', batch: 'B-3003', expiryDate: '2027-08-30', price: 12, mrp: 15, quantity: 100 },
  ],
]

async function seed() {
  await mongoose.connect(MONGO_URI)
  console.log('Connected to MongoDB — seeding demo data...')

  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10)

  for (let i = 0; i < demoPharmacies.length; i++) {
    const data = demoPharmacies[i]
    const existing = await Pharmacy.findOne({ email: data.email })
    if (existing) {
      console.log(`Skipping ${data.name} — already exists`)
      continue
    }

    const pharmacy = await Pharmacy.create({ ...data, passwordHash, status: 'approved' })
    console.log(`Created pharmacy: ${pharmacy.name}`)

    const meds = demoMedicinesByPharmacy[i].map((m) => ({ ...m, pharmacy: pharmacy._id }))
    await Medicine.insertMany(meds)
    console.log(`  Added ${meds.length} medicines`)
  }

  console.log('\nDone. Demo pharmacy owner login password for all seeded pharmacies:', DEMO_PASSWORD)
  await mongoose.disconnect()
}

seed().catch((err) => {
  console.error('Seeding failed:', err)
  process.exit(1)
})
