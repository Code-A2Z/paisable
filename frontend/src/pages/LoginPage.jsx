import React, { useState, useTransition } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import PasswordInput from '../components/PasswordInput';

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [serverError, setServerError] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    try {
      startTransition(async () => {
        await login(email, password);
      });
    } catch (error) {
      setServerError(error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 px-4 transition-colors duration-500">
      <Link
        to="/"
        className="text-4xl font-bold text-blue-600 dark:text-blue-400 font-montserrat mb-8 transition-all duration-300 hover:scale-105 hover:drop-shadow-lg hover:text-blue-500 dark:hover:text-blue-300"
        title="Go to home"
      >
        Paisable
      </Link>

      <div className="w-full max-w-md bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-8 transition-all duration-300">
        <h3 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-200 mb-6">
          Login to your account
        </h3>

        {serverError && (
          <p className="text-center text-red-500 bg-red-100 dark:bg-red-900/50 p-2 rounded-md mb-4 animate-pulse">
            {serverError}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1">
            <label htmlFor="email" className="block text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 transition-all duration-200"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="password" className="block text-gray-700 dark:text-gray-300">
              Password
            </label>
            <PasswordInput value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition-all duration-300 transform hover:-translate-y-0.5"
          >
            {isPending ? 'Logging in…' : 'Login'}
          </button>

          <p className="text-center text-gray-600 dark:text-gray-400 text-sm mt-4">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 dark:text-blue-400 hover:underline">
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
