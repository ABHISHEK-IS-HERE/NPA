/*
 * Copyright © 2026 Abhishek
 * All rights reserved.
 */

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'NAAC & NIRF Compliance Kit',
  description: 'Instant compliance certificate generator for university and college libraries undergoing NAAC Criterion 4.2 and NIRF annual audits.',
};

export default function NaacComplianceLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
