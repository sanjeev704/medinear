import { useEffect, useState } from 'react'
import api from '../api.js'
import Badge, { stockStatus } from '../components/Badge.jsx'

const emptyForm = {
  name: '',
  composition: '',
  manufacturer: '',
  category: '',
  batch: '',
  expiryDate: '',
  price: '',
  mrp: '',
  quantity: '',
}

export default function Inventory() {
  const [pharmacy, setPharmacy] = useState(null)
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)

  const loadItems = async (pharmacyId) => {
    const res = await api.get('/api/medicines', { params: { pharmacyId } })
    setItems(res.data)
  }

  useEffect(() => {
    const load = async () => {
      const me = await api.get('/api/pharmacies/me')
      setPharmacy(me.data)
      if (me.data) await loadItems(me.data._id)
      setLoading(false)
    }
    load()
  }, [])

  const filtered = items.filter((m) => m.name.toLowerCase().includes(filter.toLowerCase()))

  const openAdd = () => {
    setForm(emptyForm)
    setEditingId(null)
    setDialogOpen(true)
  }

  const openEdit = (m) => {
    setForm(m)
    setEditingId(m._id)
    setDialogOpen(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    const payload = {
      ...form,
      price: Number(form.price),
      mrp: Number(form.mrp || form.price),
      quantity: Number(form.quantity),
      pharmacy: pharmacy._id,
    }
    if (editingId) {
      await api.patch(`/api/medicines/${editingId}`, payload)
    } else {
      await api.post('/api/medicines', payload)
    }
    await loadItems(pharmacy._id)
    setDialogOpen(false)
  }

  const handleDelete = async (id) => {
    await api.delete(`/api/medicines/${id}`)
    await loadItems(pharmacy._id)
  }

  const adjustQty = async (m, delta) => {
    const quantity = Math.max(0, m.quantity + delta)
    await api.patch(`/api/medicines/${m._id}`, { quantity })
    await loadItems(pharmacy._id)
  }

  if (loading) return <div className="page">Loading...</div>
  if (!pharmacy) return <div className="page">No approved pharmacy found yet.</div>

  return (
    <div className="page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h1>Inventory</h1>
        <div style={{ display: 'flex', gap: '0.6rem' }}>
          <button className="btn btn-outline">📷 Scan medicine photo</button>
          <button className="btn btn-primary" onClick={openAdd}>
            + Add medicine
          </button>
        </div>
      </div>

      <div className="field" style={{ marginBottom: '1rem' }}>
        <input placeholder="Filter medicines" value={filter} onChange={(e) => setFilter(e.target.value)} />
      </div>

      {filtered.map((m) => (
        <div className="list-item" key={m._id}>
          <div>
            <div className="list-item-title">
              {m.name} <Badge status={stockStatus(m.quantity)} />
            </div>
            <p className="list-item-meta">
              {m.composition} · ₹{Number(m.price).toFixed(2)} · Exp {m.expiryDate} · Batch {m.batch}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <div className="stepper">
              <button onClick={() => adjustQty(m, -1)}>−</button>
              <span>{m.quantity}</span>
              <button onClick={() => adjustQty(m, 1)}>+</button>
            </div>
            <button className="btn btn-outline btn-sm" onClick={() => openEdit(m)}>
              Edit
            </button>
            <button className="btn btn-outline btn-sm" onClick={() => handleDelete(m._id)}>
              🗑
            </button>
          </div>
        </div>
      ))}

      {dialogOpen && (
        <div className="dialog-overlay" onClick={() => setDialogOpen(false)}>
          <div className="dialog" onClick={(e) => e.stopPropagation()}>
            <div className="dialog-header">
              <h3>{editingId ? 'Edit medicine' : 'Add medicine'}</h3>
              <button className="dialog-close" onClick={() => setDialogOpen(false)}>
                ✕
              </button>
            </div>
            <form onSubmit={handleSave}>
              <div className="form-grid">
                <div className="field">
                  <label>Name</label>
                  <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div className="field">
                  <label>Composition</label>
                  <input value={form.composition} onChange={(e) => setForm({ ...form, composition: e.target.value })} />
                </div>
                <div className="field">
                  <label>Manufacturer</label>
                  <input value={form.manufacturer} onChange={(e) => setForm({ ...form, manufacturer: e.target.value })} />
                </div>
                <div className="field">
                  <label>Category</label>
                  <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
                </div>
                <div className="field">
                  <label>Batch number</label>
                  <input value={form.batch} onChange={(e) => setForm({ ...form, batch: e.target.value })} />
                </div>
                <div className="field">
                  <label>Expiry date</label>
                  <input type="date" value={form.expiryDate} onChange={(e) => setForm({ ...form, expiryDate: e.target.value })} />
                </div>
                <div className="field">
                  <label>Selling price (₹)</label>
                  <input type="number" step="0.01" required value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
                </div>
                <div className="field">
                  <label>MRP (₹)</label>
                  <input type="number" step="0.01" value={form.mrp} onChange={(e) => setForm({ ...form, mrp: e.target.value })} />
                </div>
              </div>
              <div className="field" style={{ marginTop: '1rem' }}>
                <label>Quantity</label>
                <input type="number" required value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} />
              </div>
              <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'flex-end', marginTop: '1.2rem' }}>
                <button type="button" className="btn btn-outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save medicine
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
