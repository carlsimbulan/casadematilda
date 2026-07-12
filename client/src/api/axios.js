import axios from 'axios';

// In production (Vercel), frontend and API share the same domain — use relative URLs (empty baseURL).
// In local dev, the API runs on port 5000.
const baseURL = import.meta.env.PROD ? '' : 'http://localhost:5000';

const api = axios.create({ baseURL });

// Attach Bearer token from localStorage to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('cdm_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
