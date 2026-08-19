import { Link, useLocation, useNavigate } from 'react-router-dom'
import { isLoggedIn, getRole, clearSession } from '../auth.js'

const links = [
  { to: '/', label: 'Home' },
  { to: '/find-medicine', label: 'Find medicine' },
  { to: '/register-pharmacy', label: 'For pharmacies' },
  { to: '/admin', label: 'Admin' },
  { to: '/owner', label: 'Dashboard' },
]

export default function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const loggedIn = isLoggedIn()
  const role = getRole()

  const handleSignOut = () => {
    clearSession()
    navigate('/')
  }

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        <span className="logo-dot">+</span>
        MediNear
      </Link>
      <div className="navbar-links">
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={location.pathname === link.to ? 'active' : ''}
          >
            {link.label}
          </Link>
        ))}
        {loggedIn ? (
          <button className="btn btn-outline btn-sm" onClick={handleSignOut}>
            Sign out {role === 'admin' ? '(Admin)' : ''}
          </button>
        ) : (
          <Link to="/sign-in" className="btn btn-primary btn-sm">
            Sign in
          </Link>
        )}
      </div>
    </nav>
  )
}
