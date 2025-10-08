import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import CurrencySelector from './CurrencySelector';
import { CurrencyProvider } from '../contexts/CurrencyContext';

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: vi.fn((key) => store[key] || null),
    setItem: vi.fn((key, value) => {
      store[key] = value.toString();
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('CurrencySelector - localStorage persistence', () => {
  beforeEach(() => {
    // Clear localStorage and reset mocks before each test
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  it('should persist currency selection to localStorage and reload it on re-render', async () => {
    const user = userEvent.setup();

    // Initial render - should show USD (default currency)
    const { unmount } = render(
      <CurrencyProvider>
        <CurrencySelector />
      </CurrencyProvider>
    );

    // Verify initial currency is USD
    expect(screen.getByText('USD')).toBeInTheDocument();
    expect(screen.getByText('🇺🇸')).toBeInTheDocument();

    // Click on currency selector to open dropdown
    const currencyButton = screen.getByRole('button');
    await user.click(currencyButton);

    // Select INR from the dropdown
    const inrOption = screen.getByText(/Indian Rupee \(INR\)/i);
    await user.click(inrOption);

    // Verify localStorage.setItem was called with correct values
    expect(localStorageMock.setItem).toHaveBeenCalledWith('currencyCode', 'INR');

    // Verify UI updated to show INR
    expect(screen.getByText('INR')).toBeInTheDocument();
    expect(screen.getByText('🇮🇳')).toBeInTheDocument();

    // Unmount the component
    unmount();

    // Re-render the component to simulate page refresh
    render(
      <CurrencyProvider>
        <CurrencySelector />
      </CurrencyProvider>
    );

    // Verify the component initialized with INR from localStorage
    expect(localStorageMock.getItem).toHaveBeenCalledWith('currencyCode');
    expect(screen.getByText('INR')).toBeInTheDocument();
    expect(screen.getByText('🇮🇳')).toBeInTheDocument();
  });

  it('should persist EUR selection to localStorage', async () => {
    const user = userEvent.setup();

    render(
      <CurrencyProvider>
        <CurrencySelector />
      </CurrencyProvider>
    );

    // Click on currency selector to open dropdown
    const currencyButton = screen.getByRole('button');
    await user.click(currencyButton);

    // Select EUR from the dropdown
    const eurOption = screen.getByText(/Euro \(EUR\)/i);
    await user.click(eurOption);

    // Verify localStorage.setItem was called with correct values
    expect(localStorageMock.setItem).toHaveBeenCalledWith('currencyCode', 'EUR');

    // Verify UI updated to show EUR
    expect(screen.getByText('EUR')).toBeInTheDocument();
    expect(screen.getByText('🇪🇺')).toBeInTheDocument();
  });

  it('should default to USD when localStorage is empty', () => {
    render(
      <CurrencyProvider>
        <CurrencySelector />
      </CurrencyProvider>
    );

    // Verify default currency is USD
    expect(screen.getByText('USD')).toBeInTheDocument();
    expect(screen.getByText('🇺🇸')).toBeInTheDocument();
  });
});
