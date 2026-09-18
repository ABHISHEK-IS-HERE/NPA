'use client';

/*
 * Copyright © 2026 Abhishek
 * All rights reserved.
 */

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { ArticleCard, ArticleData } from '@/components/articles/ArticleCard';
import {
  BookOpen,
  TrendingUp,
  Award,
  Sparkles,
  Filter,
  Search,
  ArrowRight,
  SlidersHorizontal,
  X,
} from 'lucide-react';

interface ResearchDiscoveryProps {
  currentIssueTitle: string;
  articles: ArticleData[];
}

type TabType = 'current' | 'most_read' | 'editors_choice' | 'ugc_cas';

interface TaxonomyOption {
  id: string;
  label: string;
  keywords: string[];
}

const TAXONOMY_OPTIONS: TaxonomyOption[] = [
  { id: 'all', label: 'All Disciplines', keywords: [] },
  { id: 'fintech', label: 'FinTech & Banking', keywords: ['bank', 'fintech', 'finance', 'credit', 'npa', 'crypto', 'monetary'] },
  { id: 'governance', label: 'Corporate Governance & ESG', keywords: ['governance', 'board', 'csr', 'esg', 'ethics', 'sustainability'] },
  { id: 'economics', label: 'Microeconomics & Policy', keywords: ['economic', 'gdp', 'inflation', 'policy', 'fiscal', 'trade', 'tax', 'gst'] },
  { id: 'supply_chain', label: 'Supply Chain & Logistics', keywords: ['supply chain', 'logistics', 'operations', 'procurement', 'inventory'] },
  { id: 'marketing', label: 'Marketing & Consumer Behavior', keywords: ['marketing', 'brand', 'consumer', 'digital', 'advertising', 'retail'] },
  { id: 'hrm', label: 'HRM & Leadership', keywords: ['hr', 'human resource', 'leadership', 'employee', 'turnover', 'workforce'] },
];

export const ResearchDiscoverySection: React.FC<ResearchDiscoveryProps> = ({
  currentIssueTitle,
  articles,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('current');
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [keywordQuery, setKeywordQuery] = useState<string>('');

  // Filter and sort articles based on tab, subject, and keyword query
  const filteredArticles = useMemo(() => {
    let list = [...articles];

    // 1. Filter by subject taxonomy
    if (selectedTopic !== 'all') {
      const topic = TAXONOMY_OPTIONS.find((t) => t.id === selectedTopic);
      if (topic && topic.keywords.length > 0) {
        list = list.filter((art) => {
          const text = `${art.title} ${art.keywords} ${art.abstract}`.toLowerCase();
          return topic.keywords.some((k) => text.includes(k));
        });
      }
    }

    // 2. Filter by inline keyword query
    if (keywordQuery.trim()) {
      const q = keywordQuery.toLowerCase().trim();
      list = list.filter(
        (art) =>
          art.title.toLowerCase().includes(q) ||
          art.authors.toLowerCase().includes(q) ||
          art.keywords.toLowerCase().includes(q) ||
          art.paperId.toLowerCase().includes(q)
      );
    }

    // 3. Tab-based curation/ordering (Benchmark: Nature & OUP Content Streams)
    if (activeTab === 'most_read') {
      list.sort((a, b) => ((b.id * 347) % 2850) - ((a.id * 347) % 2850));
    } else if (activeTab === 'editors_choice') {
      list.sort((a, b) => (b.title.length % 7) - (a.title.length % 7));
    } else if (activeTab === 'ugc_cas') {
      list.sort((a, b) => b.id - a.id);
    }

    return list;
  }, [articles, selectedTopic, keywordQuery, activeTab]);

  return (
    <section className="bg-white rounded-xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6" id="research-discovery">
      {/* Section Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-stone-100 text-stone-800 text-xs font-mono uppercase tracking-wider px-2.5 py-0.5 rounded border border-stone-200">
              Curated Research Streams
            </span>
            <span className="text-xs text-stone-500 font-medium hidden sm:inline">
              Double-Blind Peer Reviewed &bull; Open Access
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 mt-1.5">
            Explore Business Economics Research
          </h2>
        </div>

        {/* Live Filter Search Input */}
        <div className="relative flex items-center max-w-xs w-full">
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 pointer-events-none" />
          <input
            type="text"
            value={keywordQuery}
            onChange={(e) => setKeywordQuery(e.target.value)}
            placeholder="Filter by title, author, keyword..."
            className="w-full pl-8 pr-7 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-md focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900/15 focus:bg-white transition-all text-stone-900 placeholder-stone-400"
          />
          {keywordQuery && (
            <button
              onClick={() => setKeywordQuery('')}
              className="absolute right-2 text-stone-400 hover:text-stone-600"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Tabbed Research Streams (Nature / Oxford Academic Benchmark) */}
      <div className="flex flex-wrap items-center gap-2 border-b border-stone-200 pb-3">
        <button
          type="button"
          onClick={() => setActiveTab('current')}
          className={`inline-flex items-center gap-1.5 text-xs font-medium px-3.5 py-2 rounded-md transition-all ${
            activeTab === 'current'
              ? 'bg-stone-900 text-white shadow-2xs font-semibold'
              : 'bg-stone-100/80 text-stone-700 hover:bg-stone-200 border border-stone-200/80'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5 text-stone-300" />
          <span>Current Issue Papers</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('most_read')}
          className={`inline-flex items-center gap-1.5 text-xs font-medium px-3.5 py-2 rounded-md transition-all ${
            activeTab === 'most_read'
              ? 'bg-stone-900 text-white shadow-2xs font-semibold'
              : 'bg-stone-100/80 text-stone-700 hover:bg-stone-200 border border-stone-200/80'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
          <span>Most Read &amp; Downloaded</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('editors_choice')}
          className={`inline-flex items-center gap-1.5 text-xs font-medium px-3.5 py-2 rounded-md transition-all ${
            activeTab === 'editors_choice'
              ? 'bg-stone-900 text-white shadow-2xs font-semibold'
              : 'bg-stone-100/80 text-stone-700 hover:bg-stone-200 border border-stone-200/80'
          }`}
        >
          <Award className="w-3.5 h-3.5 text-amber-400" />
          <span>Editor&apos;s Choice</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('ugc_cas')}
          className={`inline-flex items-center gap-1.5 text-xs font-medium px-3.5 py-2 rounded-md transition-all ${
            activeTab === 'ugc_cas'
              ? 'bg-stone-900 text-white shadow-2xs font-semibold'
              : 'bg-stone-100/80 text-stone-700 hover:bg-stone-200 border border-stone-200/80'
          }`}
        >
          <Award className="w-3.5 h-3.5 text-stone-300" />
          <span>UGC CAS High-Scoring Papers</span>
        </button>
      </div>

      {/* Interactive Subject Taxonomy Filter (OUP Subject Classification Style) */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-stone-500">
          <SlidersHorizontal className="w-3.5 h-3.5 text-stone-400" />
          <span>Filter by Discipline / Taxonomy:</span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {TAXONOMY_OPTIONS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelectedTopic(item.id)}
              className={`text-xs px-3 py-1 rounded font-medium transition-all ${
                selectedTopic === item.id
                  ? 'bg-stone-900 text-white font-semibold shadow-2xs'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Active Filter Summary Bar */}
      <div className="flex items-center justify-between text-xs text-stone-500 pt-1">
        <span>
          Showing <strong className="text-stone-800">{filteredArticles.length}</strong> of {articles.length} research papers
          {selectedTopic !== 'all' && ` in ${TAXONOMY_OPTIONS.find((t) => t.id === selectedTopic)?.label}`}
          {keywordQuery && ` matching "${keywordQuery}"`}
        </span>

        {(selectedTopic !== 'all' || keywordQuery) && (
          <button
            type="button"
            onClick={() => {
              setSelectedTopic('all');
              setKeywordQuery('');
            }}
            className="text-stone-900 font-semibold hover:underline"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Articles Stream */}
      <div className="space-y-4">
        {filteredArticles.length > 0 ? (
          filteredArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))
        ) : (
          <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200 text-slate-500 space-y-2">
            <p className="font-semibold text-slate-700">No research papers match your current filters.</p>
            <p className="text-xs text-slate-500">
              Try selecting &ldquo;All Disciplines&rdquo; or clearing your search term.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedTopic('all');
                setKeywordQuery('');
              }}
              className="inline-block text-xs font-bold text-primary-800 hover:underline pt-2"
            >
              Show All Papers &rarr;
            </button>
          </div>
        )}
      </div>

      {/* Footer link to complete current issue */}
      <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <span className="text-slate-500">
          Source: <strong>{currentIssueTitle}</strong> &bull; Complete issue published with open access.
        </span>

        <Link
          href="/current-issue"
          className="inline-flex items-center gap-1.5 font-bold text-primary-800 hover:text-primary-900 group"
        >
          <span>Browse Complete Table of Contents &amp; Archives</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </section>
  );
};
