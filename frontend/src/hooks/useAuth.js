import { useContext } from 'react';
import AuthContext from '../contexts/AuthContext';

/**
 * useAuth
 * returns the AuthContext plus small OAuth helpers:
 * - startOAuth(provider) -> navigates to backend auth URL
 * - handleOAuthCallback(token) -> delegates to loginWithOAuth from context
 */
const useAuth = () => {
  const ctx = useContext(AuthContext);

  // Start OAuth flow by redirecting to backend auth endpoint
  const startOAuth = (provider) => {
    // Ensure VITE_API_URL is set in your frontend env (e.g. http://localhost:5000)
    const base = import.meta.env.VITE_API_URL || '';
    // providers: 'google' | 'github'
    const url = `${base.replace(/\/$/, '')}/api/auth/${provider}`;
    // navigation via location so it works for popups/redirects
    window.location.href = url;
  };

  // Handle callback by calling the context's loginWithOAuth (if available)
  const handleOAuthCallback = async (token) => {
    if (!token) return null;
    if (typeof ctx.loginWithOAuth === 'function') {
      return ctx.loginWithOAuth(token);
    }
    console.warn('loginWithOAuth not available on AuthContext');
    return null;
  };

  return {
    ...ctx,
    startOAuth,
    handleOAuthCallback,
  };
};

export default useAuth;