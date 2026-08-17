// Sample data — replace with real API responses once backend is wired up.
// Coordinates are illustrative points around Lakhisarai, Bihar.

export const pharmacies = [
  {
    id: 'p1',
    name: 'Demo Pharmacy (UI capture)',
    address: '12 Sample Road, Block C, Patna 800001',
    phone: '9000000000',
    verified: true,
    lat: 25.617,
    lng: 85.146,
  },
  {
    id: 'p2',
    name: 'GUNJAN MEDICAL STORE',
    address: 'HKNAK, Samstipur 886534',
    phone: '9304152855',
    verified: true,
    lat: 25.62,
    lng: 85.15,
  },
  {
    id: 'p3',
    name: 'Prabhakar Medical Store',
    address: 'HQQ8+R3V Bochaha, Harpur 848503',
    phone: '9234944591',
    verified: true,
    lat: 25.63,
    lng: 85.16,
  },
]

export const medicines = [
  {
    id: 'm1',
    name: 'Paracetamol 500mg',
    composition: 'Paracetamol 500mg',
    manufacturer: 'Sample Pharma',
    category: 'Tablet',
    batch: 'B-1024',
    expiryDate: '2027-04-30',
    price: 24.5,
    mrp: 30.0,
    quantity: 120,
    pharmacyId: 'p1',
  },
  {
    id: 'm2',
    name: 'Paracetamol',
    composition: 'Paracetamol 500mg',
    manufacturer: 'TESCO',
    category: 'Tablets',
    batch: 'B-9001',
    expiryDate: '2026-12-31',
    price: 100.0,
    mrp: 100.0,
    quantity: 46,
    pharmacyId: 'p2',
  },
  {
    id: 'm3',
    name: 'Amoxicillin 250mg',
    composition: 'Amoxicillin 250mg',
    manufacturer: 'Sample Pharma',
    category: 'Capsule',
    batch: 'B-2210',
    expiryDate: '2026-11-15',
    price: 86.0,
    mrp: 95.0,
    quantity: 8,
    pharmacyId: 'p1',
  },
  {
    id: 'm4',
    name: 'Cetirizine 10mg',
    composition: 'Cetirizine Hydrochloride 10mg',
    manufacturer: 'Sample Pharma',
    category: 'Tablet',
    batch: 'B-3388',
    expiryDate: '2026-09-01',
    price: 18.0,
    mrp: 22.0,
    quantity: 0,
    pharmacyId: 'p1',
  },
]

// Default "current location" used until real geolocation / map-picked location is wired in
export const defaultLocation = { lat: 25.617, lng: 85.146, label: 'Lakhisarai Bazar' }
