import express from 'express'
import Medicine from '../models/Medicine.js'
import Pharmacy from '../models/Pharmacy.js'
import { getDistanceKm } from '../utils/geo.js'

const router = express.Router()

// GET all medicines for one pharmacy (owner dashboard / inventory)
router.get('/', async (req, res) => {
  try {
    const filter = req.query.pharmacyId ? { pharmacy: req.query.pharmacyId } : {}
    const medicines = await Medicine.find(filter)
    res.json(medicines)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /search?name=paracetamol&lat=25.6&lng=85.1&radiusKm=5
// Customer-facing: medicines matching a name, at approved pharmacies within radiusKm,
// sorted cheapest first. This is the core "5km price comparison" endpoint.
router.get('/search', async (req, res) => {
  try {
    const { name = '', lat, lng, radiusKm = 5 } = req.query

    const matches = await Medicine.find({
      name: { $regex: name, $options: 'i' },
    }).populate('pharmacy')

    let results = matches.filter((m) => m.pharmacy && m.pharmacy.status === 'approved')

    if (lat && lng) {
      const userLat = parseFloat(lat)
      const userLng = parseFloat(lng)
      results = results
        .map((m) => ({
          ...m.toObject(),
          distanceKm: getDistanceKm(userLat, userLng, m.pharmacy.lat, m.pharmacy.lng),
        }))
        .filter((m) => m.distanceKm <= parseFloat(radiusKm))
        .sort((a, b) => a.price - b.price)
    } else {
      results = results.sort((a, b) => a.price - b.price)
    }

    res.json(results)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST add a new medicine (owner adds stock)
router.post('/', async (req, res) => {
  try {
    const medicine = new Medicine(req.body)
    await medicine.save()
    res.status(201).json(medicine)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

// PATCH update a medicine (edit / quantity stepper)
router.patch('/:id', async (req, res) => {
  try {
    const medicine = await Medicine.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json(medicine)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

// DELETE a medicine
router.delete('/:id', async (req, res) => {
  try {
    await Medicine.findByIdAndDelete(req.params.id)
    res.status(204).end()
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

export default router
