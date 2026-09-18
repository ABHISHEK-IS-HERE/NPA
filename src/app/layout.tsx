import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'National Research Journal of Business Economics | NRJBE',
  description:
    'An International Reputed Peer Reviewed Refereed Research Journal | Open Access | Impact Factor: 6.74 | ISSN: 2349-2015',
  keywords: [
    'Research Journal',
    'Business Economics',
    'Peer Reviewed',
    'Impact Factor 6.74',
    'ISSN 2349-2015',
    'Open Access Journal',
    'Call for Papers',
    'DOI Zenodo',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}
