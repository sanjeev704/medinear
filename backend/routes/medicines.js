import express from 'express'
import Medicine from '../models/Medicine.js'
import Pharmacy from '../models/Pharmacy.js'
import { getDistanceKm } from '../utils/geo.js'
import { requireOwner } from '../utils/auth.js'

const router = express.Router()

// GET all medicines for one pharmacy (owner dashboard / inventory) — public read so profile pages work
router.get('/', async (req, res) => {
  try {
    const filter = req.query.pharmacyId ? { pharmacy: req.query.pharmacyId } : {}
    const medicines = await Medicine.find(filter)
    res.json(medicines)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /autocomplete — distinct {name, composition} pairs for the search-bar suggestions dropdown
router.get('/autocomplete', async (req, res) => {
  try {
    const meds = await Medicine.find().select('name composition -_id')
    const seen = new Set()
    const out = []
    for (const m of meds) {
      const key = m.name.toLowerCase()
      if (!seen.has(key)) {
        seen.add(key)
        out.push({ name: m.name, composition: m.composition || '' })
      }
    }
    res.json(out)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /search?name=paracetamol&lat=25.6&lng=85.1&radiusKm=5
// Matches by medicine name OR composition (so searching a salt name works too),
// restricted to pharmacies within radius, sorted cheapest first.
router.get('/search', async (req, res) => {
  try {
    const { name = '', lat, lng, radiusKm = 5 } = req.query

    const matches = await Medicine.find({
      $or: [{ name: { $regex: name, $options: 'i' } }, { composition: { $regex: name, $options: 'i' } }],
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

// POST add a new medicine — owner only, forced to their own pharmacy
router.post('/', requireOwner, async (req, res) => {
  try {
    const medicine = new Medicine({ ...req.body, pharmacy: req.auth.pharmacyId })
    await medicine.save()
    res.status(201).json(medicine)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

// PATCH update a medicine — owner only, and only their own
router.patch('/:id', requireOwner, async (req, res) => {
  try {
    const medicine = await Medicine.findOne({ _id: req.params.id, pharmacy: req.auth.pharmacyId })
    if (!medicine) return res.status(404).json({ error: 'Not found' })
    Object.assign(medicine, req.body)
    await medicine.save()
    res.json(medicine)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

// DELETE a medicine — owner only, and only their own
router.delete('/:id', requireOwner, async (req, res) => {
  try {
    const result = await Medicine.deleteOne({ _id: req.params.id, pharmacy: req.auth.pharmacyId })
    if (result.deletedCount === 0) return res.status(404).json({ error: 'Not found' })
    res.status(204).end()
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

export default router
