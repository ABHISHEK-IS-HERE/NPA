/*
 * Copyright © 2026 Abhishek
 * All rights reserved.
 */

import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://npa-puce.vercel.app'),
  title: {
    default: 'National Research Journal of Business Economics | NRJBE',
    template: '%s | NRJBE Journal',
  },
  description:
    'An International Reputed Peer Reviewed Refereed Research Journal | Open Access | Impact Factor: 6.74 | ISSN: 2349-2015 | Zenodo DOI Indexed',
  keywords: [
    'Research Journal',
    'Business Economics',
    'Peer Reviewed',
    'Impact Factor 6.74',
    'ISSN 2349-2015',
    'Open Access Journal',
    'Call for Papers',
    'DOI Zenodo',
    'UGC CARE Journal',
    'Academic Publishing',
  ],
  authors: [{ name: 'National Press Associates' }],
  creator: 'National Press Associates',
  publisher: 'National Press Associates',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'National Research Journal of Business Economics (NRJBE)',
    description:
      'An International Reputed Peer Reviewed Refereed Research Journal | Open Access | Impact Factor: 6.74 | ISSN: 2349-2015',
    url: 'https://npa-puce.vercel.app',
    siteName: 'NRJBE — National Press Associates',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'National Research Journal of Business Economics (NRJBE)',
    description:
      'An International Reputed Peer Reviewed Refereed Research Journal | Impact Factor: 6.74 | ISSN: 2349-2015',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL || 'https://npa-puce.vercel.app',
    types: {
      'application/rss+xml': `${process.env.NEXT_PUBLIC_SITE_URL || 'https://npa-puce.vercel.app'}/feed.xml`,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link
          rel="alternate"
          type="application/rss+xml"
          title="National Research Journal of Business Economics (NRJBE) RSS Feed"
          href="/feed.xml"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[#fdfbf2] text-stone-900 antialiased selection:bg-amber-200 selection:text-stone-900">
        {children}
      </body>
    </html>
  );
}
