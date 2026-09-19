/*
 * Copyright © 2026 Abhishek
 * All rights reserved.
 */

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Submit Manuscript',
  description: 'Submit your empirical research paper to NRJBE. Double-blind peer review, fast-track processing, and Zenodo DOI assignment.',
};

export default function SubmitPaperLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
