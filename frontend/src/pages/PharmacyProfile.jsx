import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../api.js'
import Badge, { stockStatus } from '../components/Badge.jsx'
import PharmacyMap from '../components/PharmacyMap.jsx'

export default function PharmacyProfile() {
  const { id } = useParams()
  const [pharmacy, setPharmacy] = useState(null)
  const [inventory, setInventory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const pharmaciesRes = await api.get('/api/pharmacies')
      const found = pharmaciesRes.data.find((p) => p._id === id) || pharmaciesRes.data[0]
      setPharmacy(found || null)
      if (found) {
        const medsRes = await api.get('/api/medicines', { params: { pharmacyId: found._id } })
        setInventory(medsRes.data)
      }
      setLoading(false)
    }
    load()
  }, [id])

  if (loading) return <div className="page">Loading...</div>
  if (!pharmacy) return <div className="page">Pharmacy not found.</div>

  return (
    <div className="page">
      <Badge status="Verified" />
      <h1 style={{ margin: '0.6rem 0 0.3rem' }}>{pharmacy.name}</h1>
      <p style={{ color: 'var(--muted-foreground)' }}>📍 {pharmacy.address}</p>
      <div style={{ display: 'flex', gap: '0.6rem', margin: '0.8rem 0 1.5rem' }}>
        <button className="btn btn-primary btn-sm">📞 {pharmacy.phone}</button>
        <a
          className="btn btn-outline btn-sm"
          href={`https://www.google.com/maps/dir/?api=1&destination=${pharmacy.lat},${pharmacy.lng}`}
          target="_blank"
          rel="noreferrer"
        >
          Get directions
        </a>
      </div>

      <h3>Inventory ({inventory.length})</h3>
      {inventory.map((m) => (
        <div className="list-item" key={m._id}>
          <div>
            <div className="list-item-title">{m.name}</div>
            <p className="list-item-meta">{m.composition}</p>
            <Badge status={stockStatus(m.quantity)} />
          </div>
          <div className="list-item-price">₹{m.price.toFixed(2)}</div>
        </div>
      ))}

      <PharmacyMap center={pharmacy} pharmacies={[pharmacy]} />
    </div>
  )
}
