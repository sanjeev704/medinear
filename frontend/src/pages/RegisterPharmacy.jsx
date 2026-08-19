import { useState } from 'react'
import api from '../api.js'
import { defaultLocation } from '../data/mockData.js'

const emptyForm = {
  name: '',
  ownerName: '',
  phone: '',
  email: '',
  address: '',
  city: '',
  pincode: '',
  licenceNumber: '',
  password: '',
}

export default function RegisterPharmacy() {
  const [form, setForm] = useState(emptyForm)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)

  const handleChange = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      // Location capture is stubbed with the default map center — wire up
      // navigator.geolocation for a real "Capture shop location" button.
      await api.post('/api/pharmacies', { ...form, lat: defaultLocation.lat, lng: defaultLocation.lng })
      setSubmitted(true)
    } catch {
      setError('Could not submit. Is the backend running?')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="page" style={{ maxWidth: 700 }}>
      <div className="page-header">
        <h1>Register your pharmacy</h1>
        <p>
          Submit your details and licence. Once our team verifies you, your pharmacy goes live
          and you can list medicines.
        </p>
      </div>

      {submitted ? (
        <div className="banner banner-success">
          ✓ Application submitted. We'll review your licence and notify you once approved.
        </div>
      ) : (
        <form className="card" onSubmit={handleSubmit}>
          {error && <div className="banner banner-destructive">{error}</div>}
          <div className="form-grid">
            <div className="field">
              <label>Pharmacy name</label>
              <input required value={form.name} onChange={handleChange('name')} />
            </div>
            <div className="field">
              <label>Owner name</label>
              <input required value={form.ownerName} onChange={handleChange('ownerName')} />
            </div>
            <div className="field">
              <label>Phone</label>
              <input placeholder="9876543210" required value={form.phone} onChange={handleChange('phone')} />
            </div>
            <div className="field">
              <label>Email</label>
              <input type="email" required value={form.email} onChange={handleChange('email')} />
            </div>
            <div className="field">
              <label>Password (for logging into your dashboard)</label>
              <input type="password" required minLength={6} value={form.password} onChange={handleChange('password')} placeholder="At least 6 characters" />
            </div>
          </div>

          <div className="field" style={{ marginTop: '1rem' }}>
            <label>Full address</label>
            <textarea rows={2} required value={form.address} onChange={handleChange('address')} />
          </div>

          <div className="form-grid" style={{ marginTop: '1rem' }}>
            <div className="field">
              <label>City</label>
              <input required value={form.city} onChange={handleChange('city')} />
            </div>
            <div className="field">
              <label>Pincode</label>
              <input placeholder="560001" required value={form.pincode} onChange={handleChange('pincode')} />
            </div>
            <div className="field">
              <label>Drug licence number</label>
              <input required value={form.licenceNumber} onChange={handleChange('licenceNumber')} />
            </div>
            <div className="field">
              <label>Licence document (PDF/JPG/PNG)</label>
              <input type="file" accept=".pdf,.jpg,.jpeg,.png" />
            </div>
          </div>

          <button type="button" className="btn btn-outline btn-sm" style={{ marginTop: '1rem' }}>
            📍 Capture shop location
          </button>
          <span style={{ fontSize: '0.8rem', color: 'var(--muted-foreground)', marginLeft: '0.6rem' }}>
            Optional, but lets patients sort results by distance.
          </span>

          <button type="submit" className="btn btn-primary btn-block" style={{ marginTop: '1.5rem' }} disabled={saving}>
            {saving ? 'Submitting...' : 'Submit for verification'}
          </button>
        </form>
      )}
    </div>
  )
}
