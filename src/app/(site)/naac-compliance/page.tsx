'use client';

/*
 * Copyright © 2026 Abhishek
 * All rights reserved.
 */

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Building,
  Award,
  Printer,
  CheckCircle2,
  FileCheck,
  Download,
  BookOpen,
  QrCode,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Info,
} from 'lucide-react';

const NPA_JOURNALS = [
  {
    id: 'nrjbe',
    name: 'National Research Journal of Business Economics',
    issn: '2349-2015',
    if: '6.74',
    category: 'Commerce, Economics & Business Management',
  },
  {
    id: 'nrjbfm',
    name: 'National Research Journal of Banking & Finance Management',
    issn: '2349-6762',
    if: '6.52',
    category: 'Banking, Financial Markets & Corporate Finance',
  },
  {
    id: 'nrjhrm',
    name: 'National Research Journal of Human Resource Management',
    issn: '2349-7432',
    if: '6.31',
    category: 'HRM, Organizational Behavior & Labor Studies',
  },
  {
    id: 'nrjit',
    name: 'National Research Journal of Information Technology',
    issn: '2349-8129',
    if: '6.85',
    category: 'IT, Computer Science & AI Systems',
  },
  {
    id: 'nrjbt',
    name: 'National Research Journal of Biotechnology & Biosciences',
    issn: '2349-9041',
    if: '6.40',
    category: 'Biotechnology, Life Sciences & Biosciences',
  },
  {
    id: 'nrjer',
    name: 'National Research Journal of Educational Research',
    issn: '2349-5510',
    if: '6.15',
    category: 'Higher Education, Pedagogy & Social Sciences',
  },
];

export default function NaacCompliancePage() {
  const [collegeName, setCollegeName] = useState('Govt. Post Graduate College / University Campus');
  const [affiliatedUniversity, setAffiliatedUniversity] = useState('Affiliated with State / Central University');
  const [academicSession, setAcademicSession] = useState('2025–2026');
  const [poNumber, setPoNumber] = useState('LIB/PO/2026/048');
  const [librarianName, setLibrarianName] = useState('Chief Librarian / Head of Resource Centre');
  const [selectedJournals, setSelectedJournals] = useState<string[]>(['nrjbe', 'nrjbfm', 'nrjhrm']);
  const [expenditure, setExpenditure] = useState('10,500');

  const toggleJournal = (id: string) => {
    if (selectedJournals.includes(id)) {
      if (selectedJournals.length > 1) {
        setSelectedJournals(selectedJournals.filter((j) => j !== id));
      }
    } else {
      setSelectedJournals([...selectedJournals, id]);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="py-10 bg-slate-50 min-h-[75vh]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Intro */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-900 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              <Award className="w-4 h-4 text-amber-700" />
              <span>Institutional Library Accreditation Portal</span>
            </div>
            <span className="text-xs font-semibold text-primary-800 bg-primary-50 px-3 py-0.5 rounded border border-primary-200">
              NAAC Criterion 4.2 &bull; NIRF Library Audit Compliant
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-navy-950">
            NAAC &amp; NIRF Library Subscription Compliance Kit
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed max-w-4xl">
            Higher Education Institutions (HEIs) across India undergo mandatory NAAC assessment and annual NIRF ranking verification. Generate official, stamp-ready <strong>NAAC Criterion 4.2.2 / 4.2.3 Library Subscription Certificates &amp; Holdings Proof</strong> on National Press Associates letterhead for inclusion in your library SSR audit binder.
          </p>

          <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Criterion 4.2.2: Library as Learning Resource</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Criterion 4.2.3: Annual Journal Expenditure</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Barcoded Publisher Authenticity Seal</span>
            </div>
          </div>
        </div>

        {/* Certificate Configuration Form */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <h2 className="text-base font-bold text-navy-900 flex items-center gap-2">
              <Building className="w-5 h-5 text-primary-700" />
              <span>1. Enter College Library Details for Official Certificate</span>
            </h2>
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 bg-primary-700 hover:bg-primary-800 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm"
            >
              <Printer className="w-4 h-4" />
              <span>Print Official Certificate</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">
                College / Institution Name (as per NAAC Portal) *
              </label>
              <input
                type="text"
                value={collegeName}
                onChange={(e) => setCollegeName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none font-semibold text-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Affiliating University *
              </label>
              <input
                type="text"
                value={affiliatedUniversity}
                onChange={(e) => setAffiliatedUniversity(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Academic Session *</label>
              <select
                value={academicSession}
                onChange={(e) => setAcademicSession(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
              >
                <option>2025–2026</option>
                <option>2026–2027</option>
                <option>2024–2025</option>
                <option>Multi-Year (2025–2028)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Library PO / Sanction Ref Number *
              </label>
              <input
                type="text"
                value={poNumber}
                onChange={(e) => setPoNumber(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Total Subscription Expenditure (₹ INR) *
              </label>
              <input
                type="text"
                value={expenditure}
                onChange={(e) => setExpenditure(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg font-bold text-slate-900"
              />
            </div>
          </div>

          {/* Subscribed Journals Selection */}
          <div className="pt-4 border-t border-slate-100">
            <label className="block font-bold text-xs text-navy-900 mb-2">
              Select Subscribed NPA Periodicals to Include in Proof Certificate:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
              {NPA_JOURNALS.map((j) => {
                const checked = selectedJournals.includes(j.id);
                return (
                  <div
                    key={j.id}
                    onClick={() => toggleJournal(j.id)}
                    className={`p-3 rounded-lg border cursor-pointer transition-all flex items-start gap-2.5 ${
                      checked
                        ? 'bg-primary-50/70 border-primary-600 ring-1 ring-primary-500'
                        : 'bg-white border-slate-200 hover:border-slate-300 opacity-60'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => {}}
                      className="mt-0.5 text-primary-700 rounded"
                    />
                    <div>
                      <span className="font-bold text-slate-900 block leading-tight">{j.name}</span>
                      <span className="text-[10px] text-slate-500 font-mono block mt-0.5">
                        ISSN: {j.issn} &bull; IF: {j.if}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* PREVIEW OF THE OFFICIAL NAAC CERTIFICATE (Stamp-Ready) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Certificate Preview (Print / PDF Rendering):
            </span>
            <button
              onClick={handlePrint}
              className="text-xs text-primary-700 hover:underline font-semibold flex items-center gap-1"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Click to Print Formal Copy</span>
            </button>
          </div>

          <div
            id="naac-certificate"
            className="bg-white rounded-2xl shadow-lg border-2 border-navy-950/20 p-8 sm:p-12 text-slate-900 space-y-6 relative overflow-hidden"
          >
            {/* Watermark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
              <span className="text-9xl font-serif font-black uppercase text-navy-950 rotate-[-25deg]">
                NAAC AUDIT PROOF
              </span>
            </div>

            {/* Letterhead */}
            <div className="text-center pb-6 border-b-2 border-navy-950 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                Official Certification for Institutional Quality Assurance (IQAC / NAAC / NIRF)
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-black text-navy-950 tracking-tight">
                NATIONAL PRESS ASSOCIATES
              </h2>
              <p className="text-xs text-slate-600 font-medium">
                Publishers of International Reputed Peer-Reviewed &amp; Refereed Research Journals
              </p>
              <p className="text-[11px] font-mono text-slate-500">
                GSTIN: 03AAEFN4829K1Z4 &bull; PAN: AAEFN4829K &bull; MSME Reg: UDYAM-PB-12-0048291
              </p>
              <p className="text-[11px] text-slate-500">
                Publishing HQ: Regional Office, Punjab, India &bull; Email: editornrjbe@gmail.com &bull; Tel: +91-9888934889
              </p>
            </div>

            {/* Certificate Header */}
            <div className="text-center space-y-1 py-2">
              <div className="inline-block bg-navy-950 text-white text-xs font-bold uppercase tracking-wider px-4 py-1 rounded">
                CERTIFICATE OF JOURNAL SUBSCRIPTION &amp; LIBRARY HOLDINGS
              </div>
              <p className="text-[11px] font-mono text-slate-500 pt-1">
                Ref ID: NPA/NAAC-CR4/{academicSession.replace(/[^0-9]/g, '')}/{poNumber.replace(/[^0-9]/g, '').slice(-4) || '1048'}
              </p>
            </div>

            {/* Body Text */}
            <div className="text-xs sm:text-sm text-slate-800 leading-relaxed space-y-3 text-justify">
              <p>
                This is to officially certify that the library of <strong>{collegeName}</strong>{' '}
                ({affiliatedUniversity}) is an active, verified institutional subscriber to the following scholarly peer-reviewed journals published by National Press Associates for the Academic Session <strong>{academicSession}</strong>:
              </p>

              {/* Table of Subscribed Journals */}
              <div className="overflow-x-auto py-2">
                <table className="w-full border-collapse border border-slate-300 text-xs">
                  <thead className="bg-slate-100 text-navy-950">
                    <tr>
                      <th className="border border-slate-300 px-3 py-2 text-left">S.No</th>
                      <th className="border border-slate-300 px-3 py-2 text-left">Journal Title</th>
                      <th className="border border-slate-300 px-3 py-2 text-center">ISSN</th>
                      <th className="border border-slate-300 px-3 py-2 text-center">Impact Factor</th>
                      <th className="border border-slate-300 px-3 py-2 text-left">Discipline Coverage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {NPA_JOURNALS.filter((j) => selectedJournals.includes(j.id)).map((j, idx) => (
                      <tr key={j.id} className="hover:bg-slate-50">
                        <td className="border border-slate-300 px-3 py-1.5 text-center font-bold">
                          {idx + 1}
                        </td>
                        <td className="border border-slate-300 px-3 py-1.5 font-semibold text-navy-950">
                          {j.name}
                        </td>
                        <td className="border border-slate-300 px-3 py-1.5 text-center font-mono font-bold">
                          {j.issn}
                        </td>
                        <td className="border border-slate-300 px-3 py-1.5 text-center font-mono text-emerald-800 font-bold">
                          {j.if}
                        </td>
                        <td className="border border-slate-300 px-3 py-1.5 text-slate-600">
                          {j.category}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs mt-2">
                <div>
                  <span className="text-slate-500 block text-[11px]">Library Sanction Reference:</span>
                  <strong className="font-mono text-navy-900">{poNumber}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Total Subscription Amount:</span>
                  <strong className="text-emerald-800 font-bold">₹{expenditure} INR</strong>
                </div>
              </div>

              <p className="pt-2 text-slate-700">
                The printed periodicals are regularly dispatched directly to the college library address via India Post Speed Post. This certificate is officially issued to facilitate the institution's audit under <strong>NAAC Criterion 4: Metric 4.2.2 &amp; 4.2.3 (Library as a Learning Resource &amp; Expenditure on Journals)</strong> and annual NIRF ranking verification.
              </p>
            </div>

            {/* Seal & Signatures */}
            <div className="pt-8 flex items-end justify-between border-t border-slate-300 text-xs">
              <div className="space-y-1">
                <div className="w-24 h-24 border-2 border-navy-900 rounded-full flex flex-col items-center justify-center text-center p-1 text-[8px] font-bold text-navy-900 uppercase tracking-tighter">
                  <span>★ OFFICIAL SEAL ★</span>
                  <span className="text-[7px]">NATIONAL PRESS</span>
                  <span className="text-[7px]">ASSOCIATES</span>
                  <span className="text-[6px]">VERIFIED 2026</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono block">Publisher Stamp</span>
              </div>

              <div className="text-right space-y-1">
                <div className="h-10 border-b border-slate-400 w-48 ml-auto" />
                <span className="font-bold text-navy-950 block">Director / Editor-in-Chief</span>
                <span className="text-slate-500 text-[11px] block">National Press Associates</span>
                <span className="text-slate-400 text-[10px] font-mono block">Date: {new Date().toLocaleDateString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* NAAC Criterion Guidelines FAQ for Librarians */}
        <div className="bg-slate-100 p-6 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-3">
          <h3 className="font-bold text-sm text-navy-950 flex items-center gap-2">
            <Info className="w-4 h-4 text-primary-700" />
            <span>NAAC Criterion 4.2 Library Audit Guidelines for IQAC</span>
          </h3>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
            <li>
              <strong>Metric 4.2.2 (Holdings &amp; Remote Access):</strong> Subscribed print copies should be accessioned in the library register and made accessible in the periodical reading room for faculty and students.
            </li>
            <li>
              <strong>Metric 4.2.3 (Expenditure Proof):</strong> Attach this official certificate along with the corresponding Tax Invoice and Postal Dispatch Receipts in your library's NAAC DVV submission file.
            </li>
            <li>
              <strong>Audit Replacement Guarantee:</strong> In case any issue is damaged or misplaced during transit, National Press Associates provides immediate complimentary replacements upon request.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
