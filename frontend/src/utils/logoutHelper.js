import clearAuthToken  from '../api/axios';
// frontend/src/utils/logoutHelper.js
// simple helper to call window location or dispatch a custom event the AuthContext listens to

export function logout() {
  // simplest: reload to /login and clear token
  try {
    localStorage.removeItem('token');
    clearAuthToken();
    // Optionally broadcast an event for AuthContext to pick up
    window.dispatchEvent(new Event('app:logout'));
  } finally {
    // navigate to login page explicitly
    window.location.href = '/login';
  }
}
