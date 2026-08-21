import dns from 'node:dns'
dns.setServers(['8.8.8.8'])

import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import medicineRoutes from './routes/medicines.js'
import pharmacyRoutes from './routes/pharmacies.js'
import authRoutes from './routes/auth.js'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/medicines', medicineRoutes)
app.use('/api/pharmacies', pharmacyRoutes)

app.get('/', (req, res) => {
  res.send('MediNear API is running')
})

const PORT = process.env.PORT || 5000
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/medinear'

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connected')
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
  })
  .catch((err) => console.error('MongoDB connection error:', err))
