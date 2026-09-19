/*
 * Copyright © 2026 Abhishek
 * All rights reserved.
 */

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'UGC CAS & API Score Calculator',
  description: 'Calculate your academic performance indicators (API) and Career Advancement Scheme (CAS) scores according to official UGC regulations.',
};

export default function UgcCalculatorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
