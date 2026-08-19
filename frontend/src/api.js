import axios from 'axios'

// In dev this defaults to your local backend. In production, set VITE_API_URL
// in your hosting provider's environment variables to your deployed backend URL.
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const api = axios.create({ baseURL })

// Attach the saved login token (if any) to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('medinear_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export default api
