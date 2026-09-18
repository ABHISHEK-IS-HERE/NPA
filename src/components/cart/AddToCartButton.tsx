'use client';

/*
 * Copyright © 2026 Abhishek
 * All rights reserved.
 */

import React from 'react';
import { ShoppingBag, Check } from 'lucide-react';
import { useCart, CartItemType } from '@/context/CartContext';

interface AddToCartButtonProps {
  id: string;
  type: CartItemType;
  title: string;
  subtitle?: string;
  price: number;
  badge?: string;
  coverImage?: string | null;
  className?: string;
  label?: string;
  icon?: React.ReactNode;
}

export const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  id,
  type,
  title,
  subtitle,
  price,
  badge,
  coverImage,
  className = '',
  label = 'Add to Bag',
  icon,
}) => {
  const { addItem } = useCart();
  const [added, setAdded] = React.useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addItem({
      id,
      type,
      title,
      subtitle,
      price,
      badge,
      coverImage,
      quantity: 1,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <button
      onClick={handleClick}
      className={
        className ||
        'inline-flex items-center justify-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-3.5 py-2 rounded-lg shadow-xs hover:shadow transition-all'
      }
    >
      {added ? (
        <>
          <Check className="w-3.5 h-3.5 text-white" />
          <span>Added to Bag!</span>
        </>
      ) : (
        <>
          {icon || <ShoppingBag className="w-3.5 h-3.5" />}
          <span>{label}</span>
        </>
      )}
    </button>
  );
};
