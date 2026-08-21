import express from 'express'
import bcrypt from 'bcryptjs'
import Pharmacy from '../models/Pharmacy.js'
import { requireOwner, requireAdmin } from '../utils/auth.js'
import { sendMail, newApplicationEmail, approvedEmail, rejectedEmail } from '../utils/email.js'

const router = express.Router()

// GET all approved pharmacies (public)
router.get('/', async (req, res) => {
  try {
    const pharmacies = await Pharmacy.find({ status: 'approved' }).select('-passwordHash')
    res.json(pharmacies)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET all applications regardless of status (admin console)
router.get('/all', requireAdmin, async (req, res) => {
  try {
    const pharmacies = await Pharmacy.find().select('-passwordHash')
    res.json(pharmacies)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET the logged-in owner's own pharmacy (any status — pending owners can still see their dashboard)
router.get('/me', requireOwner, async (req, res) => {
  try {
    const pharmacy = await Pharmacy.findById(req.auth.pharmacyId).select('-passwordHash')
    res.json(pharmacy)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST register a new pharmacy (public; starts as "pending")
router.post('/', async (req, res) => {
  try {
    const { password, ...rest } = req.body
    if (!password || password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' })
    }
    const passwordHash = await bcrypt.hash(password, 10)
    const pharmacy = new Pharmacy({ ...rest, passwordHash, status: 'pending' })
    await pharmacy.save()

    // Notify admin — fire and forget, never blocks the response
    if (process.env.ADMIN_EMAIL) {
      const { subject, html } = newApplicationEmail(pharmacy)
      sendMail(process.env.ADMIN_EMAIL, subject, html)
    }

    const { passwordHash: _omit, ...safe } = pharmacy.toObject()
    res.status(201).json(safe)
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ error: 'Email already registered' })
    res.status(400).json({ error: err.message })
  }
})

// PATCH approve or reject a pharmacy (admin only)
router.patch('/:id/status', requireAdmin, async (req, res) => {
  try {
    const { status } = req.body // 'approved' | 'rejected'
    const pharmacy = await Pharmacy.findByIdAndUpdate(req.params.id, { status }, { new: true }).select('-passwordHash')

    if (pharmacy && status === 'approved') {
      const { subject, html } = approvedEmail(pharmacy)
      sendMail(pharmacy.email, subject, html)
    } else if (pharmacy && status === 'rejected') {
      const { subject, html } = rejectedEmail(pharmacy)
      sendMail(pharmacy.email, subject, html)
    }

    res.json(pharmacy)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

export default router
