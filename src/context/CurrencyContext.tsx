'use client';

/*
 * Copyright © 2026 Abhishek
 * All rights reserved.
 */

import React, { createContext, useContext, useState, useEffect } from 'react';

export type CurrencyCode = 'INR' | 'USD';

interface CurrencyContextType {
  currency: CurrencyCode;
  setCurrency: (curr: CurrencyCode) => void;
  formatPrice: (amountInr: number, customUsd?: number | null) => string;
  getRawPrice: (amountInr: number, customUsd?: number | null) => number;
  symbol: string;
  exchangeRate: number;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

const STORAGE_KEY = 'npa_currency_preference';
const DEFAULT_INR_TO_USD_RATE = 0.012; // ~1 USD = 83.33 INR

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrencyState] = useState<CurrencyCode>('INR');
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as CurrencyCode | null;
      if (stored === 'INR' || stored === 'USD') {
        setCurrencyState(stored);
      }
    } catch (e) {
      console.warn('Unable to access localStorage for currency', e);
    } finally {
      setHasLoaded(true);
    }
  }, []);

  const setCurrency = (curr: CurrencyCode) => {
    setCurrencyState(curr);
    try {
      localStorage.setItem(STORAGE_KEY, curr);
    } catch (e) {
      console.warn('Unable to persist currency preference', e);
    }
  };

  const symbol = currency === 'INR' ? '₹' : '$';

  const getRawPrice = (amountInr: number, customUsd?: number | null): number => {
    if (currency === 'USD') {
      if (customUsd !== undefined && customUsd !== null && customUsd > 0) {
        return customUsd;
      }
      return Math.round(amountInr * DEFAULT_INR_TO_USD_RATE);
    }
    return amountInr;
  };

  const formatPrice = (amountInr: number, customUsd?: number | null): string => {
    if (currency === 'USD') {
      const val = getRawPrice(amountInr, customUsd);
      return `$${val} USD`;
    }
    return `₹${amountInr.toLocaleString('en-IN')}`;
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        formatPrice,
        getRawPrice,
        symbol,
        exchangeRate: DEFAULT_INR_TO_USD_RATE,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = (): CurrencyContextType => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
