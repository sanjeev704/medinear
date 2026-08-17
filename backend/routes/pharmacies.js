import express from 'express'
import Pharmacy from '../models/Pharmacy.js'

const router = express.Router()

// GET all approved pharmacies (public)
router.get('/', async (req, res) => {
  try {
    const pharmacies = await Pharmacy.find({ status: 'approved' })
    res.json(pharmacies)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET all applications regardless of status (admin console)
router.get('/all', async (req, res) => {
  try {
    const pharmacies = await Pharmacy.find()
    res.json(pharmacies)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST register a new pharmacy (starts as "pending")
router.post('/', async (req, res) => {
  try {
    const pharmacy = new Pharmacy({ ...req.body, status: 'pending' })
    await pharmacy.save()
    res.status(201).json(pharmacy)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

// PATCH approve or reject a pharmacy (admin action)
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body // 'approved' | 'rejected'
    const pharmacy = await Pharmacy.findByIdAndUpdate(req.params.id, { status }, { new: true })
    res.json(pharmacy)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

export default router
