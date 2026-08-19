import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api.js'

export default function OwnerDashboard() {
  const navigate = useNavigate()
  const [pharmacy, setPharmacy] = useState(null)
  const [inventory, setInventory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const load = async () => {
      try {
        const me = await api.get('/api/pharmacies/me')
        setPharmacy(me.data)
        const medsRes = await api.get('/api/medicines', { params: { pharmacyId: me.data._id } })
        setInventory(medsRes.data)
      } catch {
        setError('Could not load your pharmacy. Try signing in again.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) return <div className="page">Loading...</div>
  if (error) return <div className="page banner banner-destructive">{error}</div>
  if (!pharmacy) return <div className="page">No pharmacy found.</div>

  const stockValue = inventory.reduce((sum, m) => sum + m.price * m.quantity, 0)
  const low = inventory.filter((m) => m.quantity > 0 && m.quantity <= 10).length
  const out = inventory.filter((m) => m.quantity <= 0).length
  const needsAttention = inventory.filter((m) => m.quantity <= 10)

  return (
    <div className="page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>{pharmacy.name}</h1>
          <p style={{ color: 'var(--muted-foreground)' }}>{pharmacy.address}</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/owner/inventory')}>
          + Manage inventory
        </button>
      </div>

      {pharmacy.status === 'approved' ? (
        <div className="banner banner-success" style={{ marginTop: '1.2rem' }}>
          ✓ Verified and live. Patients can find your stock in search.
        </div>
      ) : pharmacy.status === 'pending' ? (
        <div className="banner banner-warning" style={{ marginTop: '1.2rem' }}>
          ⏳ Your application is pending admin approval. You can still add stock now — it'll show once approved.
        </div>
      ) : (
        <div className="banner banner-destructive" style={{ marginTop: '1.2rem' }}>
          Your application was rejected. Contact support for details.
        </div>
      )}

      <div className="feature-grid">
        <div className="card">
          <div className="stat-number">{inventory.length}</div>
          <div className="stat-caption">Medicines listed</div>
        </div>
        <div className="card">
          <div className="stat-number">₹{stockValue.toFixed(2)}</div>
          <div className="stat-caption">Stock value</div>
        </div>
        <div className="card">
          <div className="stat-number">{low}</div>
          <div className="stat-caption">Low stock</div>
        </div>
        <div className="card">
          <div className="stat-number">{out}</div>
          <div className="stat-caption">Out of stock</div>
        </div>
      </div>

      {needsAttention.length > 0 && (
        <div className="card">
          <h3 style={{ marginBottom: '0.8rem' }}>Needs attention</h3>
          {needsAttention.map((m) => (
            <div key={m._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0' }}>
              <span>{m.name}</span>
              <span style={{ color: m.quantity <= 0 ? 'var(--destructive)' : 'var(--muted-foreground)' }}>
                {m.quantity <= 0 ? `Expires ${m.expiryDate}` : `Only ${m.quantity} left`}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
