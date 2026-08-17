export default function Badge({ status }) {
  const map = {
    'In stock': 'badge-success',
    'Low stock': 'badge-warning',
    'Out of stock': 'badge-destructive',
    Scanned: 'badge-muted',
    Verified: 'badge-success',
    Approved: 'badge-success',
    Pending: 'badge-warning',
    Rejected: 'badge-destructive',
  }
  const cls = map[status] || 'badge-muted'
  return <span className={`badge ${cls}`}>{status}</span>
}

// Derives a stock badge label from quantity
export function stockStatus(quantity) {
  if (quantity <= 0) return 'Out of stock'
  if (quantity <= 10) return 'Low stock'
  return 'In stock'
}
