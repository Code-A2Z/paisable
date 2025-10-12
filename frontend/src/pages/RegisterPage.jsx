import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import PasswordInput from '../components/PasswordInput';
import startOAuth from '../hooks/useAuth';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  // State for server-side errors
  const [serverError, setServerError] = useState('');
  const { signup } = useAuth();

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
    setServerError(''); // Clear previous server errors
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    
    // The signup function in AuthContext needs to be updated to handle errors
    try {
      await signup(email, password);
    } catch (error) {
      setServerError(error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 px-4">
      <Link to="/" className="text-4xl font-bold text-blue-600 dark:text-blue-400 font-montserrat mb-8">
        Paisable
      </Link>
      <div className="px-8 py-6 text-left bg-white dark:bg-gray-800 shadow-lg rounded-lg w-full max-w-md">
        <h3 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-200">Create an account</h3>
        {serverError && <p className="text-center text-red-500 bg-red-100 dark:bg-red-900/50 p-2 rounded-md my-4">{serverError}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mt-4">
            <div>
              <label className="block text-gray-700 dark:text-gray-300" htmlFor="email">Email</label>
              <input
                type="email"
                placeholder="Email"
                className={`w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 ${errors.email ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-600 dark:border-gray-600'}`}
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>
            <div className="mt-4">
              <label className="block text-gray-700 dark:text-gray-300" htmlFor="password">Password</label>
              <PasswordInput 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
              />
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
            </div>
            <div className="flex">
              <button type="submit" className="w-full px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-900">
                Create Account
              </button>
            </div>
            <div className="flex items-center mt-6 mb-4">
              <hr className="flex-grow border-gray-300 dark:border-gray-600" />
              <span className="px-4 text-sm text-gray-500 dark:text-gray-400">or sign in using</span>
              <hr className="flex-grow border-gray-300 dark:border-gray-600" />
            </div>
            <div className="flex justify-center gap-4">
              <button type="button" onClick={()=> startOAuth('google')} className="p-2 rounded-lg bg-blue-600 hover:bg-blue-900 transition-colors duration-300">
                <img src="/google.svg" alt="Google" className="w-6 h-6" />
              </button>
              <button type="button" onClick={()=> startOAuth('apple')} className="p-2 rounded-lg bg-blue-600 hover:bg-blue-900 transition-colors duration-300">
                <img src="/apple.svg" alt="GitHub" className="w-6 h-6" />
              </button>
              <button type="button" onClick={()=> startOAuth('microsoft')} className="p-2 rounded-lg bg-blue-600 hover:bg-blue-900 transition-colors duration-300">
                <img src="/microsoft.svg" alt="Apple" className="w-6 h-6" />
              </button>
              <button type="button" onClick={()=> startOAuth('facebook')} className="p-2 rounded-lg bg-blue-600 hover:bg-blue-900 transition-colors duration-300">
                <img src="/facebook.svg" alt="Facebook" className="w-6 h-6" />
              </button>
              <button type="button" onClick={()=> startOAuth('twitter')} className="p-2 rounded-lg bg-blue-600 hover:bg-blue-900 transition-colors duration-300">
                <img src="/twitter.svg" alt="Twitter" className="w-6 h-6" />
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