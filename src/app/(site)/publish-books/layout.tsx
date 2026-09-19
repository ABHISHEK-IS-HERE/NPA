/*
 * Copyright © 2026 Abhishek
 * All rights reserved.
 */

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Publish Academic Books & Monographs',
  description: 'Publish your academic reference book, edited volume, or research monograph with valid ISBN, barcode, and global distribution.',
};

export default function PublishBooksLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
