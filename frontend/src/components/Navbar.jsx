import { Link, useLocation } from 'react-router-dom'

const links = [
  { to: '/', label: 'Home' },
  { to: '/find-medicine', label: 'Find medicine' },
  { to: '/register-pharmacy', label: 'For pharmacies' },
  { to: '/admin', label: 'Admin' },
  { to: '/owner', label: 'Dashboard' },
]

export default function Navbar() {
  const location = useLocation()

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
        <Link to="/sign-in" className="btn btn-primary btn-sm">
          Sign in
        </Link>
      </div>
    </nav>
  )
}
