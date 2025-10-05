import React, { createContext, useState, useEffect } from 'react';
import { supportedCurrencies } from '../config/currencies';
import useAuth from '../hooks/useAuth';

const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState(supportedCurrencies[0]);
  const { user } = useAuth();

  useEffect(() => {
    if (user?.defaultCurrency) {
      const userCurrency = supportedCurrencies.find(c => c.code === user.defaultCurrency);
      setCurrency(userCurrency);
    }
  }, [user]);

  const changeCurrency = (currencyCode) => {
    const newCurrency = supportedCurrencies.find(c => c.code === currencyCode);
    if (newCurrency) {
      setCurrency(newCurrency);
    }
  };

  return (
    <CurrencyContext.Provider value={{ currency, changeCurrency, supportedCurrencies }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export default CurrencyContext;