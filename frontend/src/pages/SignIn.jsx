import { useState } from 'react'

export default function SignIn() {
  const [mode, setMode] = useState('signin')

  return (
    <div className="page" style={{ maxWidth: 440 }}>
      <h1 style={{ textAlign: 'center' }}>Welcome to MediNear</h1>
      <p style={{ textAlign: 'center', color: 'var(--muted-foreground)', marginBottom: '1.5rem' }}>
        Sign in to register a pharmacy or manage your inventory.
      </p>

      <div className="card">
        <div className="tabs" style={{ width: '100%', marginBottom: '1.2rem' }}>
          <button
            className={`tab ${mode === 'signin' ? 'active' : ''}`}
            style={{ flex: 1 }}
            onClick={() => setMode('signin')}
          >
            Sign in
          </button>
          <button
            className={`tab ${mode === 'signup' ? 'active' : ''}`}
            style={{ flex: 1 }}
            onClick={() => setMode('signup')}
          >
            Create account
          </button>
        </div>

        <form>
          <div className="field" style={{ marginBottom: '0.9rem' }}>
            <label>Email</label>
            <input type="email" placeholder="you@example.com" />
          </div>
          <div className="field" style={{ marginBottom: '1.2rem' }}>
            <label>Password</label>
            <input type="password" placeholder="••••••••" />
          </div>
          <button type="submit" className="btn btn-primary btn-block">
            {mode === 'signin' ? 'Sign in' : 'Create account'}
          </button>
        </form>

        <div style={{ textAlign: 'center', color: 'var(--muted-foreground)', margin: '1rem 0', fontSize: '0.85rem' }}>
          or
        </div>
        <button className="btn btn-outline btn-block">Continue with Google</button>
      </div>
    </div>
  )
}
