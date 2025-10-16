import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import PasswordInput from "../components/PasswordInput";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  // State for server-side errors
  const [serverError, setServerError] = useState("");
  const { signup } = useAuth();

  const emailTimerRef = useRef(null);
  const passwordTimerRef = useRef(null);

  const clearEmailError = () => {
    setErrors((prev) => {
      const { email, ...rest } = prev;
      return rest;
    });
    if (emailTimerRef.current) {
      clearTimeout(emailTimerRef.current);
      emailTimerRef.current = null;
    }
  };

  const clearPasswordError = () => {
    setErrors((prev) => {
      const { password, ...rest } = prev;
      return rest;
    });
    if (passwordTimerRef.current) {
      clearTimeout(passwordTimerRef.current);
      passwordTimerRef.current = null;
    }
  };

  // Clear errors when clicking anywhere on the document
  useEffect(() => {
    const onDocClick = () => {
      if (Object.keys(errors).length > 0) {
        setErrors({});
      }
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, [errors]);

  const validate = () => {
    const newErrors = {};

    const emailRequirements = [
      "A valid email address (e.g., user@domain.com)",
      "Domain must not be example.com, test.com, or invalid.com",
      "Top-level domain should be at least 3 characters (e.g., .com, .org) -- adjust rule if needed",
    ];

    // stricter email: require TLD of at least 3 letters to catch common typos like ".co"
    // If you do not want this strictness, change {3,} to {2,} or use your own allowed list.
    const emailRegex = /^[^\s@]+@[^\s@]+\.[A-Za-z]{3,}$/;
    let emailInvalid = false;
    if (!emailRegex.test(email)) {
      emailInvalid = true;
    } else {
      const domain = email.split("@")[1] || "";
      const blockedDomains = ["example.com", "test.com", "invalid.com"];
      if (blockedDomains.includes(domain.toLowerCase())) {
        emailInvalid = true;
      }
    }
    if (emailInvalid) {
      newErrors.email = emailRequirements;
    }

    const passwordRequirements = [
      "8-16 characters long",
      "Contain at least one alphabet letter (a-z or A-Z)",
      "Contain at least one digit (0-9)",
      "Contain at least one symbol (e.g., !@#$%)",
    ];
    const lengthOk = password.length >= 8 && password.length <= 16;
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasDigit = /\d/.test(password);
    const hasSymbol = /[\W_]/.test(password);

    if (!lengthOk || !hasLetter || !hasDigit || !hasSymbol) {
      newErrors.password = passwordRequirements;
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

    try {
      await signup(email, password);
    } catch (error) {
      // If server returns a generic failure but client validation would have caught something,
      // prefer to show the validation requirements to the user. Otherwise show server error.
      const validationErrorsAfterFail = validate();
      if (Object.keys(validationErrorsAfterFail).length > 0) {
        setErrors(validationErrorsAfterFail);
      } else {
        setServerError(error?.message || "Signup failed");
      }
    }
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
        {/* disable browser native validation UI so custom popups are used */}
        <form noValidate onSubmit={handleSubmit}>
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
              {errors.email && Array.isArray(errors.email) && (
                <ul
                  className="text-xs text-red-500 mt-1 list-disc list-inside cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation(); // prevent document click from also firing
                    clearEmailError();
                  }}
                >
                  {errors.email.map((msg, i) => (
                    <li key={i}>{msg}</li>
                  ))}
                </ul>
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
              {errors.password && Array.isArray(errors.password) && (
                <ul
                  className="text-xs text-red-500 mt-1 list-disc list-inside cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    clearPasswordError();
                  }}
                >
                  {errors.password.map((msg, i) => (
                    <li key={i}>{msg}</li>
                  ))}
                </ul>
              )}
            </div>
            <div className="flex">
              <button
                type="submit"
                className="w-full px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-900"
              >
                Create Account
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
