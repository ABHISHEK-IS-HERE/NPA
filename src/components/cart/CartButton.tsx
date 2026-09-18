'use client';

/*
 * Copyright © 2026 Abhishek
 * All rights reserved.
 */

import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export const CartButton: React.FC = () => {
  const { totalItems, subtotal, openCart } = useCart();

  return (
    <button
      onClick={openCart}
      className="relative inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-semibold px-3.5 py-2.5 rounded-lg border border-slate-300 shadow-2xs hover:shadow transition-all group"
      aria-label="View Shopping Bag"
    >
      <div className="relative">
        <ShoppingBag className="w-4 h-4 text-primary-700 group-hover:scale-110 transition-transform" />
        {totalItems > 0 && (
          <span className="absolute -top-2 -right-2 bg-amber-500 text-slate-950 font-extrabold text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow-xs animate-in zoom-in-50 duration-200">
            {totalItems}
          </span>
        )}
      </div>

      <div className="flex items-center gap-1.5">
        <span className="hidden sm:inline text-slate-700 font-medium">Bag</span>
        {totalItems > 0 ? (
          <span className="font-bold text-primary-800">₹{subtotal.toLocaleString('en-IN')}</span>
        ) : (
          <span className="hidden sm:inline text-slate-500 text-xs font-normal">(0)</span>
        )}
      </div>
    </button>
  );
};
