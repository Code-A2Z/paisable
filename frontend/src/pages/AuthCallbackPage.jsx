import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function AuthCallbackPage() {
  const navigate = useNavigate();
  const { handleOAuthCallback } = useAuth(); // unified from your useAuth.js

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    async function processOAuth() {
      if (token) {
        try {
          await handleOAuthCallback(token);
          // if successful, user will be redirected by AuthContext/loginWithOAuth
        } catch (err) {
          console.error("OAuth callback failed:", err);
          navigate("/login");
        }
      } else {
        navigate("/login");
      }
    }

    processOAuth();
  }, [handleOAuthCallback, navigate]);

  return <p>Signing you in...</p>;
}
