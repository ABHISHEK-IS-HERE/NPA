'use client';

/*
 * Copyright © 2026 Abhishek
 * All rights reserved.
 */

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Calculator,
  Award,
  BookOpen,
  FileText,
  Plus,
  Trash2,
  Printer,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  HelpCircle,
  ArrowRight,
  Info,
  GraduationCap,
} from 'lucide-react';

interface PaperItem {
  id: string;
  title: string;
  journal: string;
  ifCategory: 'no_if' | 'if_1_2' | 'if_2_5' | 'if_5_10' | 'if_gt_10';
  authorRole: 'single' | 'first_or_corresp' | 'joint';
}

interface BookItem {
  id: string;
  title: string;
  publisher: string;
  type: 'national_book' | 'intl_book' | 'chapter' | 'edited_national' | 'edited_intl';
  isbn: string;
}

interface ConfItem {
  id: string;
  title: string;
  confName: string;
  isbnIssn: string;
}

export default function UgcApiCalculatorPage() {
  const [facultyName, setFacultyName] = useState('');
  const [designation, setDesignation] = useState('Assistant Professor (Stage 1 to Stage 2)');
  const [institution, setInstitution] = useState('');
  const [department, setDepartment] = useState('Commerce & Management / Economics');

  // Papers list
  const [papers, setPapers] = useState<PaperItem[]>([
    {
      id: '1',
      title: 'Monetary Policy Transmission and Bank Profitability in Emerging Economies',
      journal: 'National Research Journal of Business Economics (ISSN: 2349-2015)',
      ifCategory: 'if_5_10', // 20 points!
      authorRole: 'first_or_corresp',
    },
  ]);

  // Books list
  const [books, setBooks] = useState<BookItem[]>([
    {
      id: '1',
      title: 'Emerging Paradigms in Sustainable Finance and Corporate Governance',
      publisher: 'National Press Associates (ISBN: 978-81-965412-1-2)',
      type: 'chapter',
      isbn: '978-81-965412-1-2',
    },
  ]);

  // Conference list
  const [confs, setConfs] = useState<ConfItem[]>([]);

  // Paper points logic (UGC Regulations 2018, Table 1 & 2 / Appendix II Table 3A/3B)
  const getBasePaperPoints = (cat: PaperItem['ifCategory']) => {
    switch (cat) {
      case 'no_if':
        return 5; // Refereed journal without IF
      case 'if_1_2':
        return 10; // IF between 1 and 2
      case 'if_2_5':
        return 15; // IF between 2 and 5
      case 'if_5_10':
        return 20; // IF between 5 and 10 (e.g. NRJBE IF: 6.74)
      case 'if_gt_10':
        return 25; // IF > 10
      default:
        return 5;
    }
  };

  const getAuthorMultiplier = (role: PaperItem['authorRole']) => {
    switch (role) {
      case 'single':
        return 1.0; // 100%
      case 'first_or_corresp':
        return 0.7; // 70% per UGC 2018 guidelines
      case 'joint':
        return 0.3; // 30% per UGC 2018 guidelines
      default:
        return 0.7;
    }
  };

  const calculatePaperScore = (p: PaperItem) => {
    const base = getBasePaperPoints(p.ifCategory);
    const mult = getAuthorMultiplier(p.authorRole);
    return Math.round(base * mult * 10) / 10;
  };

  const getBookPoints = (type: BookItem['type']) => {
    switch (type) {
      case 'intl_book':
        return 12;
      case 'national_book':
        return 10;
      case 'chapter':
        return 5;
      case 'edited_intl':
        return 10;
      case 'edited_national':
        return 8;
      default:
        return 5;
    }
  };

  const getConfPoints = () => 5;

  // Totals
  const totalPaperScore = papers.reduce((sum, p) => sum + calculatePaperScore(p), 0);
  const totalBookScore = books.reduce((sum, b) => sum + getBookPoints(b.type), 0);
  const totalConfScore = confs.reduce((sum) => sum + getConfPoints(), 0);
  const grandTotalScore = Math.round((totalPaperScore + totalBookScore + totalConfScore) * 10) / 10;

  // Add Handlers
  const addPaper = () => {
    setPapers([
      ...papers,
      {
        id: Math.random().toString(36).substring(7),
        title: '',
        journal: '',
        ifCategory: 'if_5_10',
        authorRole: 'first_or_corresp',
      },
    ]);
  };

  const removePaper = (id: string) => {
    setPapers(papers.filter((p) => p.id !== id));
  };

  const addBook = () => {
    setBooks([
      ...books,
      {
        id: Math.random().toString(36).substring(7),
        title: '',
        publisher: '',
        type: 'chapter',
        isbn: '',
      },
    ]);
  };

  const removeBook = (id: string) => {
    setBooks(books.filter((b) => b.id !== id));
  };

  const addConf = () => {
    setConfs([
      ...confs,
      {
        id: Math.random().toString(36).substring(7),
        title: '',
        confName: '',
        isbnIssn: '',
      },
    ]);
  };

  const removeConf = (id: string) => {
    setConfs(confs.filter((c) => c.id !== id));
  };

  return (
    <div className="py-10 bg-slate-50 min-h-[75vh]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Box */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary-800 bg-primary-50 px-3 py-1 rounded-full border border-primary-200">
              <GraduationCap className="w-4 h-4 text-primary-700" />
              <span>Higher Education Faculty Toolkit</span>
            </div>
            <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-0.5 rounded border border-emerald-200">
              UGC Regulations 2018 Compliant
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-navy-950">
            UGC CAS &amp; API Score Calculator
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed max-w-4xl">
            Calculate your verified <strong>Academic Performance Indicator (API)</strong> research points for Career Advancement Scheme (CAS) promotions (Assistant Professor Stage 1–3, Associate Professor, and Professor) and direct faculty recruitment across Central Universities, State Universities, and Colleges under UGC Regulations 2018 (Table 1 &amp; 2).
          </p>

          <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-4 text-xs text-slate-600">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Peer-Reviewed &amp; Refereed Journals</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Impact Factor (IF) Multiplier System</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>70% First / Corresponding Author Share</span>
            </div>
          </div>
        </div>

        {/* Live Score Counter Ribbon */}
        <div className="bg-[#fffdf5] text-stone-900 rounded-xl p-5 sm:p-6 shadow-md border-2 border-amber-300 sticky top-16 z-30 backdrop-blur-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs text-stone-500 font-semibold uppercase tracking-wider">
                Total Verified Research Score
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-3xl sm:text-4xl font-mono font-bold text-amber-600">
                  {grandTotalScore}
                </span>
                <span className="text-xs text-stone-600 font-medium">UGC API Points</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs">
              <div className="bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200/80">
                <span className="text-stone-500 block text-[10px]">Journals Score:</span>
                <span className="font-mono font-bold text-stone-900 text-sm">{totalPaperScore} pts</span>
              </div>
              <div className="bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200/80">
                <span className="text-stone-500 block text-[10px]">Books/Chapters:</span>
                <span className="font-mono font-bold text-stone-900 text-sm">{totalBookScore} pts</span>
              </div>
              <div className="bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200/80">
                <span className="text-stone-500 block text-[10px]">Proceedings:</span>
                <span className="font-mono font-bold text-stone-900 text-sm">{totalConfScore} pts</span>
              </div>

              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-4 py-2 rounded-lg text-xs transition-colors shadow-2xs"
              >
                <Printer className="w-4 h-4" />
                <span>Print Appraisal Sheet</span>
              </button>
            </div>
          </div>
        </div>

        {/* Faculty Metadata Box */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Info className="w-4 h-4 text-primary-700" />
            <span>Faculty &amp; Institutional Profile (Appraisal Sheet Details)</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Faculty Full Name:</label>
              <input
                type="text"
                placeholder="Dr. Amanpreet Singh"
                value={facultyName}
                onChange={(e) => setFacultyName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Target CAS Promotion:</label>
              <select
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none bg-white"
              >
                <option>Assistant Professor (Stage 1 to 2)</option>
                <option>Assistant Professor (Stage 2 to 3)</option>
                <option>Assistant Prof to Associate Professor</option>
                <option>Associate Professor to Professor</option>
                <option>Senior Professor Promotion</option>
                <option>Direct University Faculty Recruitment</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">College / University:</label>
              <input
                type="text"
                placeholder="Panjab University, Chandigarh"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Academic Department:</label>
              <input
                type="text"
                placeholder="Department of Economics"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* SECTION 1: RESEARCH PAPERS IN JOURNALS */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-navy-950 flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary-700" />
                <span>1. Research Papers in Peer-Reviewed / Refereed Journals</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                UGC Regulations 2018 Table 1: Base points are multiplied by impact factor tier and author role percentage.
              </p>
            </div>

            <button
              type="button"
              onClick={addPaper}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-700 hover:text-primary-800 bg-primary-50 hover:bg-primary-100 px-3 py-1.5 rounded-lg border border-primary-200 transition-colors flex-shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add Research Paper</span>
            </button>
          </div>

          {/* List of Papers */}
          {papers.length === 0 ? (
            <p className="text-xs text-slate-500 italic py-4 text-center">
              No papers added yet. Click &ldquo;Add Research Paper&rdquo; above.
            </p>
          ) : (
            <div className="space-y-4">
              {papers.map((p, idx) => (
                <div
                  key={p.id}
                  className="bg-slate-50/70 p-4 rounded-xl border border-slate-200 space-y-3 relative group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-700">
                      Paper #{idx + 1}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-bold text-primary-800 bg-white px-2.5 py-1 rounded border border-slate-200">
                        Score: <strong>{calculatePaperScore(p)}</strong> pts
                      </span>
                      <button
                        type="button"
                        onClick={() => removePaper(p.id)}
                        className="text-rose-600 hover:text-rose-800 p-1"
                        title="Delete paper"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Paper Title:
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Monetary Policy Transmission and Bank Profitability"
                        value={p.title}
                        onChange={(e) => {
                          const val = e.target.value;
                          setPapers(papers.map((item) => (item.id === p.id ? { ...item, title: val } : item)));
                        }}
                        className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Journal Name &amp; ISSN:
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. National Research Journal of Business Economics (ISSN: 2349-2015)"
                        value={p.journal}
                        onChange={(e) => {
                          const val = e.target.value;
                          setPapers(papers.map((item) => (item.id === p.id ? { ...item, journal: val } : item)));
                        }}
                        className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Journal Impact Factor (IF Tier):
                      </label>
                      <select
                        value={p.ifCategory}
                        onChange={(e) => {
                          const val = e.target.value as any;
                          setPapers(papers.map((item) => (item.id === p.id ? { ...item, ifCategory: val } : item)));
                        }}
                        className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white"
                      >
                        <option value="no_if">Refereed / Peer-Reviewed without IF (5 pts)</option>
                        <option value="if_1_2">Impact Factor between 1 and 2 (10 pts)</option>
                        <option value="if_2_5">Impact Factor between 2 and 5 (15 pts)</option>
                        <option value="if_5_10">
                          Impact Factor between 5 and 10 (20 pts) — ★ NRJBE IF: 6.74
                        </option>
                        <option value="if_gt_10">Impact Factor &gt; 10 (25 pts)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Your Authorship Role:
                      </label>
                      <select
                        value={p.authorRole}
                        onChange={(e) => {
                          const val = e.target.value as any;
                          setPapers(papers.map((item) => (item.id === p.id ? { ...item, authorRole: val } : item)));
                        }}
                        className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white"
                      >
                        <option value="first_or_corresp">
                          First / Principal Author or Corresponding Author (70% = 0.7)
                        </option>
                        <option value="joint">Joint Co-Author (30% = 0.3)</option>
                        <option value="single">Sole / Single Author (100% = 1.0)</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Quick NRJBE Callout */}
          <div className="p-4 bg-gradient-to-r from-primary-50 to-amber-50/50 rounded-xl border border-primary-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <span className="font-bold text-primary-950 block">
                Boost Your UGC API Score with NRJBE (Impact Factor: 6.74)
              </span>
              <p className="text-slate-600 text-[11px] mt-0.5">
                Under UGC 2018 regulations, journals with Impact Factor between 5.0 and 10.0 qualify for <strong>20 API points per paper</strong>.
              </p>
            </div>
            <Link
              href="/submit-paper"
              className="inline-flex items-center gap-1.5 bg-primary-700 hover:bg-primary-800 text-white font-semibold px-4 py-2 rounded-lg transition-colors flex-shrink-0"
            >
              <span>Submit Manuscript Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* SECTION 2: ACADEMIC BOOKS & CHAPTERS */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-navy-950 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-700" />
                <span>2. Books, Edited Volumes &amp; Chapters (with ISBN)</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                UGC Table 2: National Publishers (10 pts), International (12 pts), Edited Chapter (5 pts).
              </p>
            </div>

            <button
              type="button"
              onClick={addBook}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-200 transition-colors flex-shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add Book / Chapter</span>
            </button>
          </div>

          {books.length === 0 ? (
            <p className="text-xs text-slate-500 italic py-4 text-center">
              No books or chapters added.
            </p>
          ) : (
            <div className="space-y-4">
              {books.map((b, idx) => (
                <div
                  key={b.id}
                  className="bg-slate-50/70 p-4 rounded-xl border border-slate-200 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-700">Book / Chapter #{idx + 1}</span>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-bold text-emerald-800 bg-white px-2.5 py-1 rounded border border-slate-200">
                        Score: <strong>{getBookPoints(b.type)}</strong> pts
                      </span>
                      <button
                        type="button"
                        onClick={() => removeBook(b.id)}
                        className="text-rose-600 hover:text-rose-800 p-1"
                        title="Delete book"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Book / Chapter Title:
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Corporate Governance in Indian Financial Markets"
                        value={b.title}
                        onChange={(e) => {
                          const val = e.target.value;
                          setBooks(books.map((item) => (item.id === b.id ? { ...item, title: val } : item)));
                        }}
                        className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Publication Type:
                      </label>
                      <select
                        value={b.type}
                        onChange={(e) => {
                          const val = e.target.value as any;
                          setBooks(books.map((item) => (item.id === b.id ? { ...item, type: val } : item)));
                        }}
                        className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white"
                      >
                        <option value="chapter">Chapter in Edited Book (with ISBN) — 5 pts</option>
                        <option value="national_book">Book Authored with National ISBN — 10 pts</option>
                        <option value="intl_book">Book Authored with International ISBN — 12 pts</option>
                        <option value="edited_national">Editor of Book by National Publisher — 8 pts</option>
                        <option value="edited_intl">Editor of Book by International Publisher — 10 pts</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Publisher Name:
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. National Press Associates"
                        value={b.publisher}
                        onChange={(e) => {
                          const val = e.target.value;
                          setBooks(books.map((item) => (item.id === b.id ? { ...item, publisher: val } : item)));
                        }}
                        className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        ISBN (13-Digit):
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 978-81-965412-1-2"
                        value={b.isbn}
                        onChange={(e) => {
                          const val = e.target.value;
                          setBooks(books.map((item) => (item.id === b.id ? { ...item, isbn: val } : item)));
                        }}
                        className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white font-mono"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <span className="font-bold text-emerald-950 block">
                Publish an Academic Book / Edited Volume with ISBN
              </span>
              <p className="text-slate-600 text-[11px] mt-0.5">
                NPA provides official Raja Rammohun Roy National Agency for ISBN allocations.
              </p>
            </div>
            <Link
              href="/publish-books"
              className="inline-flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold px-4 py-2 rounded-lg transition-colors flex-shrink-0"
            >
              <span>Publish Book (ISBN)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* SECTION 3: CONFERENCE PROCEEDINGS */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-navy-950 flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-600" />
                <span>3. Research Papers in Conference Proceedings (with ISSN/ISBN)</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                UGC Table 2: 5 points per full paper published in conference proceedings.
              </p>
            </div>

            <button
              type="button"
              onClick={addConf}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-800 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-lg border border-amber-200 transition-colors flex-shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add Proceeding</span>
            </button>
          </div>

          {confs.length === 0 ? (
            <p className="text-xs text-slate-500 italic py-4 text-center">
              No conference proceedings added.
            </p>
          ) : (
            <div className="space-y-4">
              {confs.map((c, idx) => (
                <div
                  key={c.id}
                  className="bg-slate-50/70 p-4 rounded-xl border border-slate-200 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-700">Proceeding #{idx + 1}</span>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-bold text-amber-900 bg-white px-2.5 py-1 rounded border border-slate-200">
                        Score: <strong>5</strong> pts
                      </span>
                      <button
                        type="button"
                        onClick={() => removeConf(c.id)}
                        className="text-rose-600 hover:text-rose-800 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Paper Title:</label>
                      <input
                        type="text"
                        placeholder="Conference Paper Title"
                        value={c.title}
                        onChange={(e) => {
                          const val = e.target.value;
                          setConfs(confs.map((item) => (item.id === c.id ? { ...item, title: val } : item)));
                        }}
                        className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Conference Name:</label>
                      <input
                        type="text"
                        placeholder="e.g. International Conference on Applied Economics"
                        value={c.confName}
                        onChange={(e) => {
                          const val = e.target.value;
                          setConfs(confs.map((item) => (item.id === c.id ? { ...item, confName: val } : item)));
                        }}
                        className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">ISBN / ISSN:</label>
                      <input
                        type="text"
                        placeholder="ISBN or ISSN"
                        value={c.isbnIssn}
                        onChange={(e) => {
                          const val = e.target.value;
                          setConfs(confs.map((item) => (item.id === c.id ? { ...item, isbnIssn: val } : item)));
                        }}
                        className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white font-mono"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
