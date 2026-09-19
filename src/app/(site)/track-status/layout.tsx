/*
 * Copyright © 2026 Abhishek
 * All rights reserved.
 */

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Track Manuscript Status',
  description: 'Track the real-time peer-review, similarity check, acceptance, and publication status of your submitted manuscript.',
};

export default function TrackStatusLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
