/*
 * Copyright © 2026 Abhishek
 * All rights reserved.
 */

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Institutional & Library Acquisition',
  description: 'University and college library acquisition packages, institutional discount rates, and instant proforma invoice generation.',
};

export default function InstitutionsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
