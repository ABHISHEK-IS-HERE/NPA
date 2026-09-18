'use client';

/*
 * Copyright © 2026 Abhishek
 * All rights reserved.
 */

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  X,
  FileText,
  BookOpen,
  ShoppingBag,
  ExternalLink,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Loader2,
} from 'lucide-react';
import { useCurrency } from '@/context/CurrencyContext';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const { formatPrice } = useCurrency();
  const inputRef = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{
    articles: any[];
    issues: any[];
    plans: any[];
    journals: any[];
  }>({
    articles: [],
    issues: [],
    plans: [],
    journals: [],
  });

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setResults({ articles: [], issues: [], plans: [], journals: [] });
    }
  }, [isOpen]);

  // Debounced live search
  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setResults({ articles: [], issues: [], plans: [], journals: [] });
      setLoading(false);
      return;
    }

    setLoading(true);
    const timer = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(query.trim())}`)
        .then((res) => res.json())
        .then((data) => {
          setResults({
            articles: data.articles || [],
            issues: data.issues || [],
            plans: data.plans || [],
            journals: data.journals || [],
          });
        })
        .catch((err) => console.error('Search fetch error:', err))
        .finally(() => setLoading(false));
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  // Keyboard shortcut listener (Esc to close)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const hasResults =
    results.articles.length > 0 ||
    results.issues.length > 0 ||
    results.plans.length > 0 ||
    results.journals.length > 0;

  const handleSelectResult = (url: string) => {
    onClose();
    router.push(url);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-navy-950/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative min-h-screen px-4 flex items-start justify-center pt-16 sm:pt-24 pb-6">
        <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in-50 zoom-in-95 duration-200">
          {/* Search Input Bar */}
          <div className="relative flex items-center px-4 py-3.5 border-b border-slate-200 bg-slate-50/50">
            <Search className="w-5 h-5 text-slate-400 mr-3 flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by article title, author, DOI, keyword, or journal name..."
              className="w-full text-sm sm:text-base text-slate-900 placeholder:text-slate-400 bg-transparent focus:outline-none"
            />
            {loading && <Loader2 className="w-4 h-4 text-primary-600 animate-spin mr-2" />}
            {query && !loading && (
              <button
                onClick={() => setQuery('')}
                className="p-1 text-slate-400 hover:text-slate-600 mr-1"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono font-semibold text-slate-500 bg-slate-200/80 rounded border border-slate-300">
              ESC
            </kbd>
          </div>

          {/* Search Body Content */}
          <div className="max-h-[65vh] overflow-y-auto p-4 sm:p-5 space-y-6">
            {!query && (
              <div className="space-y-4 py-2">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Popular Search Topics:
                </div>
                <div className="flex flex-wrap gap-2">
                  {[
                    'Business Economics',
                    'Banking Reforms',
                    'Fintech Analytics',
                    'Human Resource Strategy',
                    'Artificial Intelligence',
                    'Biotechnology',
                    'Higher Education Policy',
                    'ISSN 2349-2015',
                  ].map((topic) => (
                    <button
                      key={topic}
                      type="button"
                      onClick={() => setQuery(topic)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-primary-50 hover:text-primary-800 text-slate-700 text-xs font-medium rounded-lg border border-slate-200 transition-colors"
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {query && !loading && !hasResults && (
              <div className="py-12 text-center space-y-2">
                <Search className="w-10 h-10 text-slate-300 mx-auto" />
                <h4 className="font-bold text-slate-800 text-sm">No results found for &quot;{query}&quot;</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Try searching with author surnames, broader keywords, or browse the complete volume archives.
                </p>
              </div>
            )}

            {/* 1. ARTICLES RESULTS */}
            {results.articles.length > 0 && (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500 pb-1 border-b border-slate-100">
                  <span className="flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-primary-700" />
                    <span>Research Papers ({results.articles.length})</span>
                  </span>
                </div>

                <div className="space-y-2">
                  {results.articles.map((art) => (
                    <div
                      key={art.id}
                      onClick={() => handleSelectResult(`/article/${art.id}`)}
                      className="p-3 rounded-xl border border-slate-200/80 hover:border-primary-400 hover:bg-primary-50/30 transition-all cursor-pointer space-y-1 group"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] font-bold bg-primary-50 text-primary-800 px-1.5 py-0.5 rounded border border-primary-200">
                          {art.paperId}
                        </span>
                        {art.doi && (
                          <span className="text-[10px] font-mono text-slate-500 truncate">
                            DOI: {art.doi}
                          </span>
                        )}
                        <span className="text-[10px] text-slate-400 ml-auto">
                          Pages: {art.pageRange}
                        </span>
                      </div>

                      <h4 className="font-serif font-bold text-navy-900 text-xs sm:text-sm group-hover:text-primary-800 transition-colors leading-snug">
                        {art.title}
                      </h4>

                      <p className="text-[11px] text-slate-500">
                        Authors: <strong>{art.authors}</strong> &bull; {art.issue?.title}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 2. NPA JOURNALS RESULTS */}
            {results.journals.length > 0 && (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500 pb-1 border-b border-slate-100">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>NPA Journals ({results.journals.length})</span>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {results.journals.map((j) => (
                    <a
                      key={j.id}
                      href={j.url}
                      target={j.external ? '_blank' : '_self'}
                      rel={j.external ? 'noopener noreferrer' : undefined}
                      onClick={() => !j.external && onClose()}
                      className="p-3 rounded-xl border border-slate-200 hover:border-amber-400 hover:bg-amber-50/40 transition-all block space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] font-bold bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded">
                          ISSN: {j.issn}
                        </span>
                        {j.external && <ExternalLink className="w-3 h-3 text-slate-400" />}
                      </div>
                      <div className="font-bold text-xs text-navy-900 leading-snug">
                        {j.name}
                      </div>
                      <div className="text-[10px] text-slate-500">{j.discipline}</div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* 3. ISSUES RESULTS */}
            {results.issues.length > 0 && (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500 pb-1 border-b border-slate-100">
                  <span className="flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-primary-700" />
                    <span>Journal Issues &amp; Bound Volumes ({results.issues.length})</span>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {results.issues.map((iss) => (
                    <div
                      key={iss.id}
                      onClick={() => handleSelectResult(iss.isCurrent ? '/current-issue' : `/archives#issue-${iss.id}`)}
                      className="p-3 rounded-xl border border-slate-200 hover:border-primary-400 hover:bg-primary-50/20 transition-all cursor-pointer flex items-center justify-between"
                    >
                      <div>
                        <div className="font-bold text-xs text-navy-900">{iss.title}</div>
                        <div className="text-[11px] text-slate-500">Period: {iss.monthYear}</div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. SUBSCRIPTION PLANS RESULTS */}
            {results.plans.length > 0 && (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500 pb-1 border-b border-slate-100">
                  <span className="flex items-center gap-1.5">
                    <ShoppingBag className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Subscription Packages ({results.plans.length})</span>
                  </span>
                </div>

                <div className="space-y-2">
                  {results.plans.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => handleSelectResult('/store#subscriptions')}
                      className="p-3 rounded-xl border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/30 transition-all cursor-pointer flex items-center justify-between"
                    >
                      <div>
                        <div className="font-bold text-xs text-navy-900">{p.title}</div>
                        <div className="text-[11px] text-slate-500">{p.format} &bull; {p.duration}</div>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-bold text-navy-900 text-xs">
                          {formatPrice(p.priceInr, p.priceUsd)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer Bar */}
          <div className="px-4 py-2.5 bg-slate-100/80 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1.5 text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>National Press Associates Search Engine</span>
            </span>
            <Link
              href="/store"
              onClick={onClose}
              className="text-[11px] font-bold text-primary-700 hover:underline flex items-center gap-1"
            >
              <span>Browse Full Catalog</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
