import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import PasswordInput from '../components/PasswordInput';
import { HiMail, HiArrowRight, HiCheckCircle, HiXCircle } from 'react-icons/hi';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();

  // Password strength indicator
  const getPasswordStrength = () => {
    if (!password) return null;
    const hasLength = password.length >= 8 && password.length <= 16;
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasDigit = /\d/.test(password);
    const hasSymbol = /[\W_]/.test(password);
    
    const criteria = [hasLength, hasLetter, hasDigit, hasSymbol];
    const metCriteria = criteria.filter(Boolean).length;
    
    return {
      hasLength,
      hasLetter,
      hasDigit,
      hasSymbol,
      strength: metCriteria
    };
  };

  const passwordStrength = getPasswordStrength();

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      newErrors.email = 'Please enter a valid email address.';
    } else {
      // Frontend blacklist for instant feedback
      const domain = email.split('@')[1];
      const blockedDomains = ['example.com', 'test.com', 'invalid.com'];
      if (blockedDomains.includes(domain)) {
        newErrors.email = 'This email domain is not allowed.';
      }
    }

    if (password.length < 8 || password.length > 16) {
      newErrors.password = 'Password must be 8-16 characters long.';
    } else {
      const passwordRegex = /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[\W_])/;
      if (!passwordRegex.test(password)) {
        newErrors.password = 'Password must contain an alphabet, a digit, and a symbol.';
      }
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setIsLoading(true);
    
    try {
      await signup(email, password);
    } catch (error) {
      setServerError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const PasswordCriterion = ({ met, text }) => (
    <div className="flex items-center gap-2 text-sm">
      {met ? (
        <HiCheckCircle className="h-4 w-4 text-green-500 dark:text-green-400 flex-shrink-0" />
      ) : (
        <HiXCircle className="h-4 w-4 text-gray-300 dark:text-gray-600 flex-shrink-0" />
      )}
      <span className={`${met ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400 dark:text-gray-500'}`}>
        {text}
      </span>
    </div>
  );

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

      {/* Register Card */}
      <div className="px-8 py-8 text-left bg-white dark:bg-gray-800 shadow-2xl rounded-2xl w-full max-w-md border border-gray-200 dark:border-gray-700 backdrop-blur-sm transform transition-all duration-300 hover:shadow-3xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h3 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Create Account</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">Start managing your finances today</p>
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
                className={`w-full pl-10 pr-4 py-3 border rounded-lg bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 transition-all duration-200 ${
                  errors.email 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-transparent'
                }`}
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            {errors.email && (
              <p className="text-xs text-red-500 dark:text-red-400 mt-2 flex items-center gap-1">
                <HiXCircle className="h-4 w-4" />
                {errors.email}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2" htmlFor="password">
              Password
            </label>
            <PasswordInput 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              className={`w-full px-4 py-3 border rounded-lg bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 transition-all duration-200 ${
                errors.password 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-transparent'
              }`}
            />
            {errors.password && (
              <p className="text-xs text-red-500 dark:text-red-400 mt-2 flex items-center gap-1">
                <HiXCircle className="h-4 w-4" />
                {errors.password}
              </p>
            )}

            {/* Password Strength Indicator */}
            {password && passwordStrength && (
              <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Password Requirements:
                </p>
                <div className="space-y-2">
                  <PasswordCriterion met={passwordStrength.hasLength} text="8-16 characters" />
                  <PasswordCriterion met={passwordStrength.hasLetter} text="At least one letter" />
                  <PasswordCriterion met={passwordStrength.hasDigit} text="At least one number" />
                  <PasswordCriterion met={passwordStrength.hasSymbol} text="At least one symbol" />
                </div>
                {/* Strength Bar */}
                <div className="mt-3">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                          passwordStrength.strength >= level
                            ? passwordStrength.strength === 4
                              ? 'bg-green-500'
                              : passwordStrength.strength === 3
                              ? 'bg-yellow-500'
                              : 'bg-red-500'
                            : 'bg-gray-200 dark:bg-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
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
                Creating account...
              </>
            ) : (
              <>
                Create Account
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
                Already have an account?
              </span>
            </div>
          </div>

          {/* Login Link */}
          <div className="text-center">
            <Link 
              to="/login" 
              className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold transition-colors duration-200"
            >
              Sign in instead
              <HiArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </form>
      </div>

      {/* Footer */}
      <p className="mt-8 text-sm text-gray-500 dark:text-gray-400 text-center">
        By signing up, you agree to our Terms & Privacy Policy
      </p>
    </div>
  );
}