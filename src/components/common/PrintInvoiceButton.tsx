'use client';

/*
 * Copyright © 2026 Abhishek
 * All rights reserved.
 */

import React from 'react';
import { Printer } from 'lucide-react';

export function PrintInvoiceButton() {
  return (
    <button
      onClick={() => window.print()}
      className="inline-flex items-center gap-2 text-xs font-bold text-white bg-primary-800 hover:bg-primary-900 px-4 py-2 rounded-lg shadow-sm transition-colors cursor-pointer"
      title="Print invoice or save as PDF"
    >
      <Printer className="w-4 h-4" />
      <span>Print Invoice / Save as PDF</span>
    </button>
  );
}
