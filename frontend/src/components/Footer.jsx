import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <h4 className="font-display">MediNear</h4>
          <p style={{ color: 'var(--muted-foreground)', fontSize: '0.85rem', maxWidth: 280 }}>
            Find the medicines you need at verified pharmacies near you, with live stock and
            prices.
          </p>
        </div>
        <div>
          <h4>For patients</h4>
          <Link to="/find-medicine">Search medicines</Link>
          <Link to="/">How it works</Link>
        </div>
        <div>
          <h4>For pharmacies</h4>
          <Link to="/register-pharmacy">Register your pharmacy</Link>
          <Link to="/owner">Pharmacy dashboard</Link>
        </div>
      </div>
      <div className="footer-bottom">© 2026 MediNear. Stock information is provided by partner pharmacies.</div>
    </footer>
  )
}
