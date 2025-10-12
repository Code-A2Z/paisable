// frontend/src/api/axios.js
import axios from 'axios';
import { logout as defaultLogout } from '../utils/logoutHelper'; // optional helper, see note below

// Build baseURL: prefer VITE_API_URL, otherwise default to http://localhost:5000
const rawBase = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const baseURL = rawBase.replace(/\/+$/, '') + '/api';

const instance = axios.create({
  baseURL,
  // withCredentials: true, // enable if your backend uses cookie-based auth
});

/**
 * Programmatically set auth token for immediate use (and persist to localStorage)
 * Use this from AuthContext.loginWithOAuth or login()
 */
export function setAuthToken(token) {
  if (token) {
    localStorage.setItem('token', token);
    instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
}

/** Clear token from axios instance and localStorage */
export function clearAuthToken() {
  localStorage.removeItem('token');
  delete instance.defaults.headers.common['Authorization'];
}

/** Request interceptor (fallback — uses stored token if defaults are not set) */
instance.interceptors.request.use(
  (config) => {
    // If header already set via setAuthToken above, keep it.
    if (!config.headers?.Authorization) {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers = config.headers || {};
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response interceptor:
 * - If 401 returned, optionally trigger logout handler (to be implemented in app)
 * - Normalize error to include response data for easier handling in components
 */
instance.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error?.response?.status;
    if (status === 401) {
      // optional: try refresh token flow here if you implement it.
      // Fallback: clear token and call a logout handler if provided.
      try {
        // Importing directly would create a circular dependency with AuthContext.
        // So we call a small external helper. You can implement it to dispatch logout.
        if (typeof defaultLogout === 'function') {
          defaultLogout();
        } else {
          clearAuthToken();
        }
      } catch (e) {
        clearAuthToken();
      }
    }

    // Normalize the error for consumers
    const normalized = {
      message: error.message,
      status: error?.response?.status,
      data: error?.response?.data,
    };
    return Promise.reject(normalized);
  }
);

export default instance;