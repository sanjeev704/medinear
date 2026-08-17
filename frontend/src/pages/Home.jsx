import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import StatTile from '../components/StatTile.jsx'
import { pharmacies, medicines } from '../data/mockData.js'

export default function Home() {
  const [query, setQuery] = useState('')
  const [city, setCity] = useState('')
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    navigate(`/find-medicine?q=${encodeURIComponent(query)}`)
  }

  return (
    <div>
      <section className="hero">
        <div className="hero-badge">✓ Verified pharmacies only</div>
        <h1>
          Find your medicine at a pharmacy <span className="accent">nearby</span>
        </h1>
        <p>
          Real-time stock and prices from verified local pharmacies. Search by medicine name
          and your area — we show alternatives when something is out of stock.
        </p>

        <form className="search-bar" onSubmit={handleSearch}>
          <input
            placeholder="Medicine name e.g. Paracetamol"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <input
            placeholder="City or pincode"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <button className="btn btn-primary" type="submit">
            Search
          </button>
        </form>

        <div className="stats-row">
          <StatTile number={pharmacies.length} caption="Verified pharmacies" />
          <StatTile number={medicines.length} caption="Medicines listed" />
          <StatTile number="24/7" caption="Live stock updates" />
        </div>
      </section>

      <div className="container">
        <h2 style={{ textAlign: 'center', margin: '2.5rem 0 0.5rem' }}>How MediNear works</h2>
        <div className="feature-grid">
          <div className="card feature-card">
            <div className="feature-icon">🔍</div>
            <h3>Search a medicine</h3>
            <p>Type the medicine you need and your area. We match stock across verified pharmacies instantly.</p>
          </div>
          <div className="card feature-card">
            <div className="feature-icon">🏬</div>
            <h3>Compare pharmacies</h3>
            <p>See live quantities, prices, distance and phone numbers — plus generic alternatives with the same composition.</p>
          </div>
          <div className="card feature-card">
            <div className="feature-icon">🔄</div>
            <h3>Pharmacies stay in sync</h3>
            <p>Partner pharmacies add stock manually or by scanning a medicine box photo, so listings stay accurate.</p>
          </div>
        </div>

        <h2 style={{ margin: '2.5rem 0 1rem' }}>Recently verified pharmacies</h2>
        <div className="feature-grid">
          {pharmacies.map((p) => (
            <div className="card feature-card card-hover" key={p.id}>
              <h3>{p.name}</h3>
              <p>{p.address}</p>
              <p style={{ color: 'var(--primary)', fontWeight: 600 }}>{p.phone}</p>
            </div>
          ))}
        </div>

        <div className="card" style={{ textAlign: 'center', padding: '2.5rem 1.5rem', margin: '2.5rem 0' }}>
          <h2 style={{ marginBottom: '0.5rem' }}>Own a pharmacy?</h2>
          <p style={{ color: 'var(--muted-foreground)', maxWidth: 480, margin: '0 auto 1.2rem' }}>
            Register in minutes, upload your licence for verification, and start listing your
            inventory so nearby patients can find you.
          </p>
          <button className="btn btn-primary" onClick={() => navigate('/register-pharmacy')}>
            Register your pharmacy
          </button>
        </div>
      </div>
    </div>
  )
}
