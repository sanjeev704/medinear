import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import Pharmacy from '../models/Pharmacy.js'
import { JWT_SECRET } from '../utils/auth.js'

const router = express.Router()

// POST /api/auth/login — pharmacy owner login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const pharmacy = await Pharmacy.findOne({ email })
    if (!pharmacy) return res.status(401).json({ error: 'Invalid email or password' })

    const ok = await bcrypt.compare(password, pharmacy.passwordHash)
    if (!ok) return res.status(401).json({ error: 'Invalid email or password' })

    const token = jwt.sign({ role: 'owner', pharmacyId: pharmacy._id }, JWT_SECRET, {
      expiresIn: '7d',
    })
    res.json({
      token,
      pharmacy: { id: pharmacy._id, name: pharmacy.name, status: pharmacy.status },
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /api/auth/admin-login — single shared admin password
router.post('/admin-login', (req, res) => {
  const { password } = req.body
  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Incorrect admin password' })
  }
  const token = jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '7d' })
  res.json({ token })
})

export default router
