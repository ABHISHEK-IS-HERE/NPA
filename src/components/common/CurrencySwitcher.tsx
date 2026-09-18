'use client';

/*
 * Copyright © 2026 Abhishek
 * All rights reserved.
 */

import React from 'react';
import { useCurrency, CurrencyCode } from '@/context/CurrencyContext';

interface CurrencySwitcherProps {
  className?: string;
  variant?: 'compact' | 'pill' | 'dark';
}

export const CurrencySwitcher: React.FC<CurrencySwitcherProps> = ({
  className = '',
  variant = 'compact',
}) => {
  const { currency, setCurrency } = useCurrency();

  return (
    <div
      className={`inline-flex items-center rounded-full p-0.5 border text-xs font-semibold select-none transition-colors ${
        variant === 'dark' || variant === 'compact'
          ? 'bg-slate-900/90 border-slate-700 text-slate-300'
          : 'bg-slate-100 border-slate-300 text-slate-700'
      } ${className}`}
      role="group"
      aria-label="Currency Selector"
    >
      <button
        type="button"
        onClick={() => setCurrency('INR')}
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full transition-all font-mono text-[11px] ${
          currency === 'INR'
            ? 'bg-stone-900 text-white shadow-xs font-bold'
            : 'text-stone-400 hover:text-white'
        }`}
        title="India Domestic Pricing (INR ₹)"
      >
        <span>₹ INR</span>
      </button>

      <button
        type="button"
        onClick={() => setCurrency('USD')}
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full transition-all font-mono text-[11px] ${
          currency === 'USD'
            ? 'bg-stone-900 text-white shadow-xs font-bold'
            : 'text-stone-400 hover:text-white'
        }`}
        title="International Pricing (USD $)"
      >
        <span>$ USD</span>
      </button>
    </div>
  );
};
