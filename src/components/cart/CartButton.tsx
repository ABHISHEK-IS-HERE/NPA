'use client';

import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export const CartButton: React.FC = () => {
  const { totalItems, subtotal, openCart } = useCart();

  return (
    <button
      onClick={openCart}
      className="relative inline-flex items-center gap-2 bg-navy-900 hover:bg-navy-950 text-white text-xs sm:text-sm font-semibold px-3.5 py-2 rounded-lg border border-navy-700/80 shadow-xs hover:shadow transition-all group"
      aria-label="View Shopping Bag"
    >
      <div className="relative">
        <ShoppingBag className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
        {totalItems > 0 && (
          <span className="absolute -top-2 -right-2 bg-amber-500 text-navy-950 font-extrabold text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow-xs animate-in zoom-in-50 duration-200">
            {totalItems}
          </span>
        )}
      </div>

      <div className="flex items-center gap-1.5">
        <span className="hidden sm:inline text-slate-300">Bag</span>
        {totalItems > 0 ? (
          <span className="font-bold text-amber-400">₹{subtotal.toLocaleString('en-IN')}</span>
        ) : (
          <span className="hidden sm:inline text-slate-400 text-xs font-normal">(0)</span>
        )}
      </div>
    </button>
  );
};
