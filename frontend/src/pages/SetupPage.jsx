import React, { useState } from 'react';
import useAuth from '../hooks/useAuth';
import useCurrency from '../hooks/useCurrency';
import Spinner from '../components/Spinner';

const SetupPage = () => {
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [loading, setLoading] = useState(false);
  const { user, setup } = useAuth();
  const { supportedCurrencies } = useCurrency();
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await setup(selectedCurrency);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome to Paisable!
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Welcome, {user.email}! Let's set up your account.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="currency" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Choose your default currency
            </label>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {supportedCurrencies.map((currency) => (
                <label
                  key={currency.code}
                  className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedCurrency === currency.code
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
                >
                  <input
                    type="radio"
                    name="currency"
                    value={currency.code}
                    checked={selectedCurrency === currency.code}
                    onChange={(e) => setSelectedCurrency(e.target.value)}
                    className="sr-only"
                  />
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{currency.flag}</span>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {currency.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {currency.code} • {currency.symbol}
                      </div>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
          >
            {loading ? (
              <>
                <Spinner inline />
                <span className="ml-2">Setting up...</span>
              </>
            ) : (
              'Save and Continue'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            You can change your currency preference later in settings.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SetupPage;
