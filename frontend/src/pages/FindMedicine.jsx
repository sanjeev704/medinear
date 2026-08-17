import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import api from '../api.js'
import Badge, { stockStatus } from '../components/Badge.jsx'
import PharmacyMap from '../components/PharmacyMap.jsx'
import { defaultLocation } from '../data/mockData.js'

const RADIUS_KM = 5

export default function FindMedicine() {
  const [params] = useSearchParams()
  const [query, setQuery] = useState(params.get('q') || '')
  const [searched, setSearched] = useState(Boolean(params.get('q')))
  const [location] = useState(defaultLocation) // swap with navigator.geolocation for real "near me"
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const runSearch = async (name) => {
    if (!name.trim()) return
    setLoading(true)
    setError(null)
    try {
      const res = await api.get('/api/medicines/search', {
        params: { name, lat: location.lat, lng: location.lng, radiusKm: RADIUS_KM },
      })
      setResults(res.data)
    } catch {
      setError('Could not reach the backend. Is the server running?')
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (searched && query) runSearch(query)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    setSearched(true)
    runSearch(query)
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Find a medicine</h1>
        <p>Comparing prices across pharmacies within {RADIUS_KM}km of {location.label}.</p>
      </div>

      <form className="search-bar" onSubmit={handleSearch} style={{ margin: '0 0 1.5rem' }}>
        <input
          placeholder="Paracetamol"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button className="btn btn-primary" type="submit">
          Search
        </button>
        <button type="button" className="btn btn-outline">
          📍 Near me
        </button>
      </form>

      {loading && <p>Searching...</p>}
      {error && <p className="banner banner-destructive">{error}</p>}

      {searched && !loading && !error && (
        <>
          <p style={{ fontWeight: 600, marginBottom: '0.8rem' }}>
            {results.length} result{results.length !== 1 ? 's' : ''} for "{query}"
          </p>

          {results.length === 0 && (
            <p style={{ color: 'var(--muted-foreground)' }}>
              No matches within {RADIUS_KM}km. Try a different name or widen your search area.
            </p>
          )}

          {results.map((r) => (
            <div className="list-item" key={r._id}>
              <div>
                <div className="list-item-title">
                  {r.name} <Badge status={stockStatus(r.quantity)} />
                </div>
                <p className="list-item-meta">
                  {r.composition} · {r.category}
                </p>
                <p className="list-item-meta" style={{ color: 'var(--primary)', fontWeight: 600 }}>
                  {r.pharmacy?.name}
                </p>
                <p className="list-item-meta">
                  📍 {r.pharmacy?.address} · {r.distanceKm?.toFixed(1)} km away
                </p>
                <p className="list-item-meta">📞 {r.pharmacy?.phone}</p>
              </div>
              <div className="list-item-price">
                {r.mrp > r.price && <span className="old-price">₹{r.mrp.toFixed(2)}</span>}
                ₹{r.price.toFixed(2)}
                <div style={{ fontWeight: 400, fontSize: '0.78rem', color: 'var(--muted-foreground)' }}>
                  {r.quantity} units
                </div>
              </div>
            </div>
          ))}

          {results.length > 0 && (
            <PharmacyMap
              center={location}
              radiusKm={RADIUS_KM}
              pharmacies={results.map((r) => ({ ...r.pharmacy, distanceKm: r.distanceKm }))}
            />
          )}
        </>
      )}
    </div>
  )
}
