import { Navigate } from 'react-router-dom'
import { getRole, isLoggedIn } from './auth.js'

export default function ProtectedRoute({ role, children }) {
  if (!isLoggedIn()) return <Navigate to="/sign-in" replace />
  if (role && getRole() !== role) return <Navigate to="/sign-in" replace />
  return children
}
