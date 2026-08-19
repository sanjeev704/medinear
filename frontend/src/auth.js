// Simple localStorage-based session helper.
// Token + role are set on login and read by ProtectedRoute / pages.

export function saveSession(token, role, pharmacyId) {
  localStorage.setItem('medinear_token', token)
  localStorage.setItem('medinear_role', role)
  if (pharmacyId) localStorage.setItem('medinear_pharmacy_id', pharmacyId)
}

export function clearSession() {
  localStorage.removeItem('medinear_token')
  localStorage.removeItem('medinear_role')
  localStorage.removeItem('medinear_pharmacy_id')
}

export function getRole() {
  return localStorage.getItem('medinear_role')
}

export function isLoggedIn() {
  return Boolean(localStorage.getItem('medinear_token'))
}
