/*
 * Copyright © 2026 Abhishek
 * All rights reserved.
 */

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Periodical & Issue Store',
  description: 'Purchase print issues, commemorative volumes, and single issues of the National Research Journal of Business Economics.',
};

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
