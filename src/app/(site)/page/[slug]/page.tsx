import React from 'react';
import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen, FileText, ArrowRight, ShieldCheck, Download } from 'lucide-react';

export const revalidate = 0;

interface DynamicPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: DynamicPageProps): Promise<Metadata> {
  const page = await db.page.findUnique({
    where: { slug: params.slug },
  });

  if (!page) return { title: 'Page Not Found' };

  return {
    title: `${page.title} | NRJBE`,
    description: page.metaDescription || page.subtitle || `National Research Journal of Business Economics - ${page.title}`,
  };
}

export default async function DynamicCMSPage({ params }: DynamicPageProps) {
  const page = await db.page.findUnique({
    where: { slug: params.slug },
  });

  if (!page || !page.isPublished) notFound();

  // Also fetch sister pages for quick sidebar navigation
  const otherPages = await db.page.findMany({
    where: { isPublished: true },
    select: { slug: true, title: true },
    orderBy: { id: 'asc' },
  });

  return (
    <div className="py-10 bg-slate-50 min-h-[70vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content Area (3 Cols) */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sm:p-10">
              {/* Header */}
              <div className="border-b border-slate-200 pb-5 mb-6">
                <span className="text-xs font-bold uppercase tracking-wider text-primary-700 bg-primary-50 px-2.5 py-0.5 rounded border border-primary-200">
                  Journal Guidelines &amp; Policies
                </span>
                <h1 className="text-2xl sm:text-3xl font-serif font-bold text-navy-900 mt-2">
                  {page.title}
                </h1>
                {page.subtitle && (
                  <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                    {page.subtitle}
                  </p>
                )}
              </div>

              {/* Dynamic HTML Content */}
              <div
                className="prose prose-slate max-w-none text-xs sm:text-sm leading-relaxed space-y-4 [&>h3]:text-base [&>h3]:font-serif [&>h3]:font-bold [&>h3]:text-navy-900 [&>h3]:mt-6 [&>h3]:mb-2 [&>h4]:text-sm [&>h4]:font-bold [&>h4]:text-slate-800 [&>p]:text-slate-700 [&>p]:leading-relaxed [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:space-y-1.5 [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:space-y-1.5 [&>table]:w-full [&>table]:border-collapse"
                dangerouslySetInnerHTML={{ __html: page.contentHtml }}
              />
            </div>
          </div>

          {/* Sidebar (1 Col): Other Policies & Fast Actions */}
          <div className="space-y-6">
            {/* Quick Policies Menu */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-2 mb-3">
                Policies &amp; Guidelines
              </h3>
              <ul className="space-y-1 text-xs">
                {otherPages.map((p) => (
                  <li key={p.slug}>
                    <Link
                      href={`/page/${p.slug}`}
                      className={`block px-3 py-2 rounded-lg transition-colors font-medium ${
                        p.slug === page.slug
                          ? 'bg-primary-50 text-primary-800 font-bold border-l-4 border-primary-600'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      {p.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick Downloads Box */}
            <div className="bg-slate-900 text-white rounded-xl p-5 shadow-sm space-y-3 text-xs">
              <div className="flex items-center gap-2 text-amber-400 font-bold">
                <Download className="w-4 h-4" />
                <span>Author Resources</span>
              </div>
              <p className="text-slate-300 text-[11px]">
                Download standardized formatting files for preparation:
              </p>
              <div className="space-y-2 pt-1">
                <a
                  href="/templates/Copyright-Form.pdf"
                  download
                  className="block p-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors border border-slate-700 text-[11px]"
                >
                  &darr; Copyright Form (PDF)
                </a>
                <a
                  href="/templates/Paper-Template.pdf"
                  download
                  className="block p-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors border border-slate-700 text-[11px]"
                >
                  &darr; Manuscript Template (PDF)
                </a>
              </div>
            </div>

            {/* Quick Submit CTA */}
            <div className="bg-gradient-to-br from-primary-800 to-navy-900 text-white rounded-xl p-5 text-xs text-center space-y-3">
              <h4 className="font-serif font-bold text-sm">Ready to Publish?</h4>
              <p className="text-slate-300 text-[11px]">
                Submit your paper online for fast-track double blind review.
              </p>
              <Link
                href="/submit-paper"
                className="inline-block bg-amber-500 hover:bg-amber-600 text-navy-950 font-bold px-4 py-2 rounded-lg text-xs transition-colors w-full"
              >
                Submit Paper Online
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
