'use client';

/*
 * Copyright © 2026 Abhishek
 * All rights reserved.
 */

import React, { useState, useEffect } from 'react';
import { MessageCircle, ShoppingBag, ArrowUp, DollarSign } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useCurrency } from '@/context/CurrencyContext';

export const QuickAccessDock: React.FC = () => {
  const { totalItems, openCart } = useCart();
  const { currency, setCurrency } = useCurrency();
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleCurrency = () => {
    setCurrency(currency === 'INR' ? 'USD' : 'INR');
  };

  return (
    <aside aria-label="Quick utility actions" className="fixed bottom-5 right-4 sm:right-6 z-40 flex flex-col items-end gap-2.5">
      {/* Scroll To Top Button */}
      {showScrollTop && (
        <button
          type="button"
          onClick={scrollToTop}
          className="w-10 h-10 rounded-full bg-white/95 hover:bg-white text-slate-700 hover:text-navy-950 border border-slate-200 shadow-md flex items-center justify-center transition-all hover:-translate-y-0.5 active:translate-y-0"
          title="Scroll to top"
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      )}

      {/* Main Dock Pill */}
      <div className="bg-white/95 backdrop-blur-md rounded-full border border-stone-300 shadow-md p-1.5 flex items-center gap-1 text-xs font-sans">
        {/* Currency Switcher */}
        <button
          type="button"
          onClick={toggleCurrency}
          className="px-2.5 py-1.5 rounded-full font-bold transition-colors flex items-center gap-1 text-stone-700 hover:bg-stone-100"
          title={`Switch currency (Current: ${currency})`}
        >
          <span className="font-mono text-xs">{currency === 'INR' ? '₹ INR' : '$ USD'}</span>
        </button>

        <div className="w-[1px] h-5 bg-stone-200" />

        {/* Shopping Cart Drawer Trigger */}
        <button
          type="button"
          onClick={openCart}
          className="relative p-2 rounded-full text-stone-700 hover:text-stone-950 hover:bg-stone-100 transition-colors"
          title="Open Cart"
          aria-label="Open Shopping Cart"
        >
          <ShoppingBag className="w-4 h-4 text-stone-700" />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 bg-stone-900 text-white text-[10px] font-mono font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
              {totalItems}
            </span>
          )}
        </button>

        <div className="w-[1px] h-5 bg-stone-200" />

        {/* WhatsApp Fast Helpline */}
        <a
          href="https://wa.me/918427960144?text=Hello%20NRJBE%20Editorial%20Desk%2C%20I%20have%20an%20inquiry%20regarding%20manuscript%20submission%20or%20journal%20subscription."
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 bg-stone-900 hover:bg-stone-800 text-white font-medium px-3 py-1.5 rounded-full shadow-2xs transition-all"
          title="Chat with Editorial Desk on WhatsApp"
        >
          <MessageCircle className="w-4 h-4 text-emerald-400 fill-current" />
          <span className="hidden sm:inline text-xs">Editorial Desk</span>
        </a>
      </div>
    </aside>
  );
};
