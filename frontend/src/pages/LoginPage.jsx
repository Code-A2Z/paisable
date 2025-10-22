import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import PasswordInput from '../components/PasswordInput';
import { HiMail, HiArrowRight } from 'react-icons/hi';

/* // Demo user credentials
const DEMO_EMAIL = 'test@example.com';
const DEMO_PASSWORD = 'password123'; */

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [serverError, setServerError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError(''); // Clear previous server errors
    setIsLoading(true);
    try {
      await login(email, password);
      // Toast handled globally in AuthContext
    } catch (error) {
      setServerError(error.message);
      // Toast handled globally in AuthContext
    } finally {
      setIsLoading(false);
    }
  };

  /* const handleFillDemoCredentials = () => {
    setEmail(DEMO_EMAIL);
    setPassword(DEMO_PASSWORD);
  }; */

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 px-4 py-8">
      {/* Logo/Brand */}
      <Link 
        to="/" 
        className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 dark:from-blue-400 dark:to-blue-300 bg-clip-text text-transparent mb-12 transition-all duration-500 hover:scale-105 hover:drop-shadow-2xl cursor-pointer animate-fade-in" 
        title="Go to home"
      >
        Paisable
      </Link>

      {/* Login Card */}
      <div className="px-8 py-8 text-left bg-white dark:bg-gray-800 shadow-2xl rounded-2xl w-full max-w-md border border-gray-200 dark:border-gray-700 backdrop-blur-sm transform transition-all duration-300 hover:shadow-3xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h3 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Welcome Back</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">Sign in to continue to your account</p>
        </div>

        {/* Error Message */}
        {serverError && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 animate-shake">
            <p className="text-sm text-red-600 dark:text-red-400 text-center font-medium">{serverError}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2" htmlFor="email">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <HiMail aria-hidden="true" className="h-5 w-5 text-gray-400 dark:text-gray-500" />
              </div>
              <input 
                type="email" 
                placeholder="you@example.com" 
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
                id="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2" htmlFor="password">
              Password
            </label>
            <PasswordInput 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full px-6 py-3 text-white font-semibold bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg hover:from-blue-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </>
            ) : (
              <>
                Sign In
                <HiArrowRight className="h-5 w-5" />
              </>
            )}
          </button>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                New to Paisable?
              </span>
            </div>
          </div>

          {/* Register Link */}
          <div className="text-center">
            <Link 
              to="/register" 
              className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold transition-colors duration-200"
            >
              Create an account
              <HiArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </form>
      </div>

      {/* Footer */}
      <p className="mt-8 text-sm text-gray-500 dark:text-gray-400 text-center">
        Protected by industry-standard security
      </p>
    </div>
  );
}