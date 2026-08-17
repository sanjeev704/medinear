import { useEffect, useState } from 'react'
import api from '../api.js'

export default function AdminConsole() {
  const [tab, setTab] = useState('pending')
  const [applications, setApplications] = useState([])
  const [medicineCount, setMedicineCount] = useState(0)
  const [loading, setLoading] = useState(true)

  const load = async () => {
    const [pharmaciesRes, medicinesRes] = await Promise.all([
      api.get('/api/pharmacies/all'),
      api.get('/api/medicines'),
    ])
    setApplications(pharmaciesRes.data)
    setMedicineCount(medicinesRes.data.length)
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  const setStatus = async (id, status) => {
    await api.patch(`/api/pharmacies/${id}/status`, { status })
    await load()
  }

  const filtered = applications.filter((a) => a.status === tab)
  const counts = {
    pending: applications.filter((a) => a.status === 'pending').length,
    approved: applications.filter((a) => a.status === 'approved').length,
    rejected: applications.filter((a) => a.status === 'rejected').length,
  }

  if (loading) return <div className="page">Loading...</div>

  return (
    <div className="page">
      <h1>Admin console</h1>

      <div className="feature-grid">
        <div className="card">
          <div className="stat-number">{counts.pending}</div>
          <div className="stat-caption">Pending</div>
        </div>
        <div className="card">
          <div className="stat-number">{counts.approved}</div>
          <div className="stat-caption">Approved</div>
        </div>
        <div className="card">
          <div className="stat-number">{counts.rejected}</div>
          <div className="stat-caption">Rejected</div>
        </div>
        <div className="card">
          <div className="stat-number">{medicineCount}</div>
          <div className="stat-caption">Medicines</div>
        </div>
      </div>

      <div className="tabs" style={{ margin: '1rem 0 1.2rem' }}>
        <button className={`tab ${tab === 'pending' ? 'active' : ''}`} onClick={() => setTab('pending')}>
          Pending ({counts.pending})
        </button>
        <button className={`tab ${tab === 'approved' ? 'active' : ''}`} onClick={() => setTab('approved')}>
          Approved ({counts.approved})
        </button>
        <button className={`tab ${tab === 'rejected' ? 'active' : ''}`} onClick={() => setTab('rejected')}>
          Rejected ({counts.rejected})
        </button>
      </div>

      {filtered.length === 0 && <p style={{ color: 'var(--muted-foreground)' }}>No applications in this category.</p>}

      {filtered.map((a) => (
        <div className="list-item" key={a._id}>
          <div>
            <div className="list-item-title">
              🏬 {a.name} <span className={`badge badge-${a.status === 'approved' ? 'success' : a.status === 'rejected' ? 'destructive' : 'warning'}`}>{a.status}</span>
            </div>
            <p className="list-item-meta">{a.address}</p>
            <p className="list-item-meta">Owner: {a.ownerName} · Phone: {a.phone}</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', alignItems: 'flex-end' }}>
            {a.status !== 'approved' && (
              <button className="btn btn-primary btn-sm" onClick={() => setStatus(a._id, 'approved')}>
                Approve
              </button>
            )}
            {a.status !== 'rejected' && (
              <button className="btn btn-outline btn-sm" onClick={() => setStatus(a._id, 'rejected')}>
                Reject
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
