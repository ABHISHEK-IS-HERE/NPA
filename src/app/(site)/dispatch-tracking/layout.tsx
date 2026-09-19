/*
 * Copyright © 2026 Abhishek
 * All rights reserved.
 */

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Speed Post Dispatch Tracking',
  description: 'Track the India Post Speed Post consignment status of your printed journal issues, certificates, and hard copies.',
};

export default function DispatchTrackingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
