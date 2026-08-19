import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api.js'
import { saveSession } from '../auth.js'

export default function SignIn() {
  const [mode, setMode] = useState('owner') // 'owner' | 'admin'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [adminPassword, setAdminPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleOwnerLogin = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await api.post('/api/auth/login', { email, password })
      saveSession(res.data.token, 'owner', res.data.pharmacy.id)
      navigate('/owner')
    } catch (err) {
      setError(err.response?.data?.error || 'Could not sign in. Is the backend running?')
    } finally {
      setLoading(false)
    }
  }

  const handleAdminLogin = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await api.post('/api/auth/admin-login', { password: adminPassword })
      saveSession(res.data.token, 'admin')
      navigate('/admin')
    } catch (err) {
      setError(err.response?.data?.error || 'Could not sign in. Is the backend running?')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page" style={{ maxWidth: 440 }}>
      <h1 style={{ textAlign: 'center' }}>Welcome to MediNear</h1>
      <p style={{ textAlign: 'center', color: 'var(--muted-foreground)', marginBottom: '1.5rem' }}>
        Sign in to manage your pharmacy, or as an admin to review applications.
      </p>

      <div className="card">
        <div className="tabs" style={{ width: '100%', marginBottom: '1.2rem' }}>
          <button
            className={`tab ${mode === 'owner' ? 'active' : ''}`}
            style={{ flex: 1 }}
            onClick={() => { setMode('owner'); setError(null) }}
          >
            Pharmacy owner
          </button>
          <button
            className={`tab ${mode === 'admin' ? 'active' : ''}`}
            style={{ flex: 1 }}
            onClick={() => { setMode('admin'); setError(null) }}
          >
            Admin
          </button>
        </div>

        {error && <div className="banner banner-destructive">{error}</div>}

        {mode === 'owner' ? (
          <form onSubmit={handleOwnerLogin}>
            <div className="field" style={{ marginBottom: '0.9rem' }}>
              <label>Email</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
            </div>
            <div className="field" style={{ marginBottom: '1.2rem' }}>
              <label>Password</label>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
            </div>
            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
            <p style={{ fontSize: '0.82rem', color: 'var(--muted-foreground)', marginTop: '0.8rem', textAlign: 'center' }}>
              Don't have a pharmacy yet? <a href="/register-pharmacy" style={{ color: 'var(--primary)' }}>Register here</a>.
            </p>
          </form>
        ) : (
          <form onSubmit={handleAdminLogin}>
            <div className="field" style={{ marginBottom: '1.2rem' }}>
              <label>Admin password</label>
              <input type="password" required value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} placeholder="••••••••" />
            </div>
            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in as admin'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
