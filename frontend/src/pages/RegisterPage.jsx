import React, { useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import PasswordInput from "../components/PasswordInput";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  // State for server-side errors
  const [serverError, setServerError] = useState("");
  const { signup } = useAuth();

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      newErrors.email = "Please enter a valid email address.";
    } else {
      // Frontend blacklist for instant feedback
      const domain = email.split("@")[1];
      const blockedDomains = ["example.com", "test.com", "invalid.com"];
      if (blockedDomains.includes(domain)) {
        newErrors.email = "This email domain is not allowed.";
      }
    }

    if (password.length < 8 || password.length > 16) {
      newErrors.password = "Password must be 8-16 characters long.";
    } else {
      const passwordRegex = /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[\W_])/;
      if (!passwordRegex.test(password)) {
        newErrors.password =
          "Password must contain an alphabet, a digit, and a symbol.";
      }
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError(""); // Clear previous server errors
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});

    // The signup function in AuthContext needs to be updated to handle errors
    try {
      setLoading(true);
      await signup(email, password);
    } catch (error) {
      setServerError(error.message);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 px-4">
      <Link
        to="/"
        className="text-4xl font-bold text-blue-600 dark:text-blue-400 font-montserrat mb-8 transition-all duration-500 hover:scale-105 hover:drop-shadow-lg hover:text-blue-500 dark:hover:text-blue-300 cursor-pointer"
        title="Go to home"
      >
        Paisable
      </Link>
      <div className="px-8 py-6 text-left bg-white dark:bg-gray-800 shadow-lg rounded-lg w-full max-w-md">
        <h3 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-200">
          Create an account
        </h3>
        {serverError && (
          <p className="text-center text-red-500 bg-red-100 dark:bg-red-900/50 p-2 rounded-md my-4">
            {serverError}
          </p>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mt-4">
            <div>
              <label
                className="block text-gray-700 dark:text-gray-300"
                htmlFor="email"
              >
                Email
              </label>
              <input
                type="email"
                placeholder="Email"
                className={`w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 ${
                  errors.email
                    ? "border-red-500 focus:ring-red-500"
                    : "focus:ring-blue-600 dark:border-gray-600"
                }`}
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              {errors.email && (
                <p className="text-xs text-red-500 mt-1">{errors.email}</p>
              )}
            </div>
            <div className="mt-4">
              <label
                className="block text-gray-700 dark:text-gray-300"
                htmlFor="password"
              >
                Password
              </label>
              <PasswordInput
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
              />
              {errors.password && (
                <p className="text-xs text-red-500 mt-1">{errors.password}</p>
              )}
            </div>
            <div className="flex">
              <button
                type="submit"
                className={`w-full px-6 py-2 mt-4 text-white rounded-lg 
    ${
      loading
        ? "bg-blue-400 cursor-not-allowed" // Disabled state
        : "bg-blue-600 hover:bg-blue-900" // Active state
    }`}
                disabled={loading}
              >
                {loading ? "Loading..." : "Create Account"}
              </button>
            </div>
            <div className="mt-6 text-gray-600 dark:text-gray-400">
              Already have an account?
              <Link to="/login" className="text-blue-600 hover:underline ml-2">
                Log in
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
