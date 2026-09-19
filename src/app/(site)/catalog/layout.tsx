/*
 * Copyright © 2026 Abhishek
 * All rights reserved.
 */

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Annual Catalog & Price List',
  description: 'Download or print the comprehensive annual journal catalog, institutional subscription tariff, and publisher mandate.',
};

export default function CatalogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
