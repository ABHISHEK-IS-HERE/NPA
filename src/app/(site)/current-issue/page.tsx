import React from 'react';
import { db } from '@/lib/db';
import { ArticleCard } from '@/components/articles/ArticleCard';
import { BookOpen, Search, Filter, Calendar, FileText, ShieldCheck, Award, Truck } from 'lucide-react';
import Link from 'next/link';
import { IssueSwitcher } from '@/components/articles/IssueSwitcher';
import { MagazineCover } from '@/components/covers/MagazineCover';
import { AddToCartButton } from '@/components/cart/AddToCartButton';

export const revalidate = 0;

interface CurrentIssuePageProps {
  searchParams: {
    q?: string;
    issueId?: string;
  };
}

export default async function CurrentIssuePage({ searchParams }: CurrentIssuePageProps) {
  const query = searchParams.q?.trim();
  const selectedIssueId = searchParams.issueId ? Number(searchParams.issueId) : undefined;

  // Find active or selected issue
  const issue = selectedIssueId
    ? await db.issue.findUnique({
        where: { id: selectedIssueId },
        include: { volume: true },
      })
    : await db.issue.findFirst({
        where: { isCurrent: true },
        include: { volume: true },
      });

  // All published issues for switcher
  const allIssues = await db.issue.findMany({
    orderBy: { createdAt: 'desc' },
    include: { volume: true },
  });

  // Build where clause
  const whereClause: any = {
    status: 'Published',
  };

  if (issue) {
    whereClause.issueId = issue.id;
  }

  if (query) {
    whereClause.OR = [
      { title: { contains: query } },
      { authors: { contains: query } },
      { abstract: { contains: query } },
      { keywords: { contains: query } },
      { paperId: { contains: query } },
    ];
  }

  const articles = await db.article.findMany({
    where: whereClause,
    orderBy: { id: 'asc' },
    include: {
      issue: {
        include: { volume: true },
      },
    },
  });

  return (
    <div className="py-8 bg-slate-50 min-h-[70vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Issue Header Banner */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sm:p-8">
          {/* In the header banner */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="flex gap-5 items-start">
                {issue && (
                  <div className="hidden sm:block flex-shrink-0">
                    <MagazineCover
                      volumeNumber={issue.volume?.volumeNumber || '12'}
                      issueNumber={issue.issueNumber}
                      year={issue.volume?.year || '2026'}
                      monthYear={issue.monthYear}
                      coverImage={issue.coverImage}
                      size="sm"
                      isCurrent={issue.isCurrent}
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="bg-primary-50 text-primary-700 text-xs font-bold px-2.5 py-0.5 rounded border border-primary-200">
                      {issue?.isCurrent ? 'Current Active Issue' : 'Archived Issue'}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      {issue?.volume?.title}
                    </span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs text-slate-500 font-medium">
                      {issue?.monthYear}
                    </span>
                  </div>

                  <h1 className="text-2xl sm:text-3xl font-serif font-bold text-navy-900 leading-tight">
                    {issue?.title || 'Volume 12, Issue 1 (January - June 2026)'}
                  </h1>

                  <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
                    All research papers in this issue have completed rigorous double-blind peer review and are permanently registered with Zenodo / CrossRef Digital Object Identifiers (DOIs).
                  </p>

                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    <AddToCartButton
                      id={`issue-${issue?.id || 'current'}`}
                      type="print_issue"
                      title={`${issue?.title || 'Current Issue'} - Print Copy`}
                      subtitle="Printed on 80 GSM Bond • Speed Post Dispatch"
                      price={issue?.printPrice || 450}
                      badge="Physical Copy"
                      label={`Order Physical Copy (₹${issue?.printPrice || 450})`}
                      className="bg-amber-500 hover:bg-amber-600 text-navy-950 text-xs font-bold py-2 px-4 rounded-lg shadow-xs transition-all flex items-center gap-1.5"
                    />

                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Free Speed Post across India</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Metrics Badge */}
              <div className="flex sm:flex-col gap-3 flex-shrink-0 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs w-full lg:w-auto">
                <div>
                  <span className="text-slate-500 font-medium">Published Papers:</span>
                  <p className="font-bold text-navy-900 text-lg">{articles.length} Articles</p>
                </div>
                <div className="border-t border-slate-200 pt-2 hidden sm:block">
                  <span className="text-slate-500 font-medium">Indexing:</span>
                  <p className="font-semibold text-emerald-700">Zenodo DOI &amp; Scholar</p>
                </div>
              </div>
            </div>

          {/* Search & Issue Switcher Bar */}
          <div className="mt-6 pt-6 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4" id="search-articles">
            {/* Search Filter Form */}
            <form action="/current-issue" method="GET" className="w-full md:w-auto flex-1 max-w-lg">
              {issue && <input type="hidden" name="issueId" value={issue.id} />}
              <div className="relative flex items-center">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                <input
                  type="text"
                  name="q"
                  defaultValue={query || ''}
                  placeholder="Search articles by title, author, keyword, or DOI..."
                  className="w-full pl-9 pr-24 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
                />
                <button
                  type="submit"
                  className="absolute right-1 px-3 py-1 bg-primary-700 hover:bg-primary-800 text-white text-xs font-semibold rounded-md transition-colors"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Switch Issue Dropdown */}
            <div className="flex items-center gap-2 w-full md:w-auto justify-end">
              <span className="text-xs text-slate-500 font-medium whitespace-nowrap">Switch Issue:</span>
              <IssueSwitcher
                issues={allIssues.map((iss) => ({
                  id: iss.id,
                  title: iss.title,
                  isCurrent: iss.isCurrent,
                }))}
                currentSelectedId={issue?.id}
              />
            </div>
          </div>
        </div>

        {/* Query filter indicator */}
        {query && (
          <div className="flex items-center justify-between bg-primary-50 border border-primary-200 text-primary-900 px-4 py-2 rounded-lg text-xs">
            <span>
              Showing search results matching: <strong>&ldquo;{query}&rdquo;</strong> ({articles.length} papers found)
            </span>
            <Link
              href={`/current-issue${issue ? `?issueId=${issue.id}` : ''}`}
              className="font-bold underline hover:text-primary-700"
            >
              Clear Search
            </Link>
          </div>
        )}

        {/* Papers Listing */}
        <div className="space-y-4" id="papers-list">
          {articles.length > 0 ? (
            articles.map((article) => (
              <ArticleCard
                key={article.id}
                article={{
                  ...article,
                  issue: {
                    id: article.issue.id,
                    title: article.issue.title,
                    issueNumber: article.issue.issueNumber,
                    volume: article.issue.volume,
                  },
                }}
              />
            ))
          ) : (
            <div className="p-12 text-center bg-white rounded-xl border border-slate-200">
              <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="font-bold text-slate-800 text-base">No Research Papers Found</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                No published papers match your criteria. Try adjusting your search query or select another issue from the dropdown above.
              </p>
              <Link
                href="/current-issue"
                className="mt-4 inline-block text-xs font-semibold text-primary-700 hover:underline"
              >
                Reset Filters
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
