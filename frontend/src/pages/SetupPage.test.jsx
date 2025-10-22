import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import AuthContext from '../contexts/AuthContext';
import CurrencyContext from '../contexts/CurrencyContext';
import SetupPage from './SetupPage';

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock API
vi.mock('../api/axios', () => ({
  default: {
    put: vi.fn(),
  },
}));

const MockAuthProvider = ({ children }) => {
  const mockAuth = {
    user: {
      _id: '123',
      email: 'test@example.com',
      defaultCurrency: 'USD',
      isSetupComplete: false,
    },
  };
  return (
    <AuthContext.Provider value={mockAuth}>
      {children}
    </AuthContext.Provider>
  );
};

const MockCurrencyProvider = ({ children }) => {
  const mockCurrency = {
    currency: { code: 'USD', name: 'United States Dollar', symbol: '$', flag: '🇺🇸' },
    changeCurrency: vi.fn(),
    supportedCurrencies: [
      { code: 'USD', name: 'United States Dollar', symbol: '$', flag: '🇺🇸' },
      { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺' },
      { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧' },
    ],
  };
  return (
    <CurrencyContext.Provider value={mockCurrency}>
      {children}
    </CurrencyContext.Provider>
  );
};

describe('SetupPage', () => {
  it('renders setup page with welcome message', () => {
    render(
      <BrowserRouter>
        <MockAuthProvider>
          <MockCurrencyProvider>
            <SetupPage />
          </MockCurrencyProvider>
        </MockAuthProvider>
      </BrowserRouter>
    );

    expect(screen.getByText('Welcome to Paisable!')).toBeInTheDocument();
    expect(screen.getByText('Welcome, test@example.com! Let\'s set up your account.')).toBeInTheDocument();
    expect(screen.getByText('Choose your default currency')).toBeInTheDocument();
    expect(screen.getByText('Save and Continue')).toBeInTheDocument();
  });

  it('displays available currencies', () => {
    render(
      <BrowserRouter>
        <MockAuthProvider>
          <MockCurrencyProvider>
            <SetupPage />
          </MockCurrencyProvider>
        </MockAuthProvider>
      </BrowserRouter>
    );

    expect(screen.getByText('United States Dollar')).toBeInTheDocument();
    expect(screen.getByText('Euro')).toBeInTheDocument();
    expect(screen.getByText('British Pound')).toBeInTheDocument();
  });
});
