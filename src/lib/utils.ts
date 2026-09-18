import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateInput: string | Date | null | undefined): string {
  if (!dateInput) return '';
  const d = new Date(dateInput);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function generateBibtex(article: {
  title: string;
  authors: string;
  doi?: string | null;
  pageRange?: string | null;
  publishedAt?: Date | string | null;
  paperId?: string;
  journalName?: string;
  volumeNumber?: number;
  issueNumber?: string;
}): string {
  const firstAuthorLast = article.authors.split(',')[0].trim().split(' ').pop() || 'Author';
  const year = article.publishedAt ? new Date(article.publishedAt).getFullYear() : '2026';
  const citeKey = `${firstAuthorLast.toLowerCase()}${year}`;

  return `@article{${citeKey},
  title = {${article.title}},
  author = {${article.authors}},
  journal = {${article.journalName || 'National Research Journal of Business Economics'}},
  volume = {${article.volumeNumber || '12'}},
  number = {${article.issueNumber || '1'}},
  pages = {${article.pageRange || '1-10'}},
  year = {${year}},
  doi = {${article.doi || ''}}
}`;
}

export function generateApaCitation(article: {
  title: string;
  authors: string;
  doi?: string | null;
  pageRange?: string | null;
  publishedAt?: Date | string | null;
  journalName?: string;
  volumeNumber?: number;
  issueNumber?: string;
}): string {
  const year = article.publishedAt ? new Date(article.publishedAt).getFullYear() : '2026';
  const vol = article.volumeNumber ? `${article.volumeNumber}` : '12';
  const iss = article.issueNumber ? `(${article.issueNumber})` : '(1)';
  const pages = article.pageRange ? `, ${article.pageRange}` : '';
  const doiStr = article.doi ? ` ${article.doi}` : '';
  const journal = article.journalName || 'National Research Journal of Business Economics';

  return `${article.authors} (${year}). ${article.title}. ${journal}, ${vol}${iss}${pages}.${doiStr}`;
}
