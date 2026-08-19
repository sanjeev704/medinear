import axios from 'axios'

// In dev this defaults to your local backend. In production, set VITE_API_URL
// in your hosting provider's environment variables to your deployed backend URL.
const baseURL = import.meta.env.VITE_API_URL || '"http://12.0.9.89:5000"'

const api = axios.create({ baseURL })

export default api
