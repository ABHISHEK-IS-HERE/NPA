'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Printer,
  ArrowLeft,
  Award,
  FileCheck,
  Share2,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Edit3,
} from 'lucide-react';

interface CertificateViewerProps {
  documentType: 'certificate' | 'acceptance';
  paperTitle: string;
  authorName: string;
  coAuthors?: string;
  affiliation?: string;
  volumeNumber?: string | number;
  issueNumber?: string | number;
  year?: string | number;
  issueTitle?: string;
  doi?: string;
  paperId?: string;
  publishedDate?: string;
  authorEmail?: string;
  authorPhone?: string;
  settings?: {
    journalName?: string;
    issn?: string;
    impactFactor?: string;
    publisherName?: string;
    contactEmail?: string;
    contactPhone?: string;
  };
}

export const CertificateViewer: React.FC<CertificateViewerProps> = ({
  documentType: initialDocType,
  paperTitle: initialPaperTitle,
  authorName: initialAuthorName,
  coAuthors = '',
  affiliation: initialAffiliation = '',
  volumeNumber = '12',
  issueNumber = '1',
  year = '2026',
  issueTitle = 'Volume 12, Issue 1 (Jan - Jun 2026)',
  doi = '10.5281/zenodo.10892341',
  paperId = 'NRJBE-2026-001',
  publishedDate = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }),
  authorEmail = '',
  authorPhone = '',
  settings,
}) => {
  const [docType, setDocType] = useState<'certificate' | 'acceptance'>(initialDocType);
  const [paperTitle, setPaperTitle] = useState(initialPaperTitle);
  const [authorName, setAuthorName] = useState(initialAuthorName);
  const [affiliation, setAffiliation] = useState(initialAffiliation);
  const [isEditing, setIsEditing] = useState(false);

  const certId = `CERT-NRJBE-${year}-${paperId.replace(/[^0-9]/g, '').slice(-4) || '1042'}`;
  const refNo = `NRJBE/ACCEPT/${year}/${paperId.replace(/[^0-9]/g, '').slice(-4) || '1042'}`;

  const allAuthors = [authorName, coAuthors].filter(Boolean).join(', ');

  const whatsappMessage = encodeURIComponent(
    `Dear ${authorName},\n\nGreetings from National Research Journal of Business Economics (NRJBE).\n\nYour ${
      docType === 'certificate' ? 'Certificate of Publication' : 'Letter of Acceptance'
    } for the research paper "${paperTitle}" has been generated.\n\nDocument ID: ${
      docType === 'certificate' ? certId : refNo
    }\nISSN: 2349-2015 | Impact Factor: 6.74\n\nThank you for publishing with National Press Associates.`
  );

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4 sm:px-6 lg:px-8 print:bg-white print:p-0 print:m-0">
      {/* Top Action & Control Bar (Hidden on Print) */}
      <div className="max-w-5xl mx-auto mb-6 print:hidden space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/admin/articles"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white px-3.5 py-2 rounded-lg border border-slate-200 shadow-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Research Articles</span>
          </Link>

          <div className="flex flex-wrap items-center gap-3">
            {/* Toggle Switcher */}
            <div className="bg-slate-200 p-1 rounded-lg flex items-center text-xs font-bold">
              <button
                onClick={() => setDocType('certificate')}
                className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
                  docType === 'certificate'
                    ? 'bg-white text-navy-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Award className="w-3.5 h-3.5 text-amber-600" />
                <span>Certificate of Publication</span>
              </button>
              <button
                onClick={() => setDocType('acceptance')}
                className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
                  docType === 'acceptance'
                    ? 'bg-white text-navy-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FileCheck className="w-3.5 h-3.5 text-primary-700" />
                <span>Letter of Acceptance</span>
              </button>
            </div>

            <button
              onClick={() => setIsEditing(!isEditing)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5 text-slate-500" />
              <span>{isEditing ? 'Done Editing' : 'Quick Edit Fields'}</span>
            </button>

            {authorPhone && (
              <a
                href={`https://wa.me/${authorPhone.replace(/[^0-9]/g, '')}?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-2 rounded-lg transition-colors"
              >
                <span>WhatsApp to Author</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}

            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 text-xs font-bold text-white bg-primary-800 hover:bg-primary-900 px-4 py-2 rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Download PDF</span>
            </button>
          </div>
        </div>

        {/* Quick Edit Inputs */}
        {isEditing && (
          <div className="bg-white p-4 rounded-xl border border-slate-300 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs animate-in fade-in">
            <div className="sm:col-span-2">
              <label className="font-bold text-slate-700 block mb-1">Paper Title:</label>
              <input
                type="text"
                value={paperTitle}
                onChange={(e) => setPaperTitle(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-300 rounded"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Primary Author:</label>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-300 rounded"
              />
            </div>
            <div className="sm:col-span-3">
              <label className="font-bold text-slate-700 block mb-1">Affiliation / University:</label>
              <input
                type="text"
                value={affiliation}
                onChange={(e) => setAffiliation(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-300 rounded"
              />
            </div>
          </div>
        )}
      </div>

      {/* DOCUMENT PREVIEW CONTAINER */}
      <div className="max-w-5xl mx-auto">
        {docType === 'certificate' ? (
          /* ========================================================================= */
          /* 1. CERTIFICATE OF PUBLICATION (Ornate Landscape / A4 Certificate Layout) */
          /* ========================================================================= */
          <div className="bg-white rounded-xl shadow-xl border-8 border-double border-primary-900 p-8 sm:p-14 relative overflow-hidden print:shadow-none print:border-8 print:p-8 print:m-0 print:max-w-none">
            {/* Ornate Gold Inner Inset Frame */}
            <div className="border-2 border-amber-600/70 p-6 sm:p-10 rounded-lg relative">
              {/* Corner Flourishes */}
              <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-amber-600" />
              <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-amber-600" />
              <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-amber-600" />
              <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-amber-600" />

              {/* Watermark Crest */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] select-none">
                <ShieldCheck className="w-96 h-96 text-primary-900" />
              </div>

              {/* Header Section */}
              <div className="text-center space-y-1 relative z-10">
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-amber-800 bg-amber-50 px-3 py-0.5 rounded border border-amber-200">
                  {settings?.publisherName || 'National Press Associates'}
                </span>
                <h1 className="font-serif font-black text-2xl sm:text-3xl text-navy-950 tracking-tight mt-2">
                  {settings?.journalName || 'National Research Journal of Business Economics'}
                </h1>
                <p className="text-xs text-slate-600 font-medium tracking-wide">
                  An International Reputed Peer Reviewed Refereed Scholarly Journal • Open Access
                </p>
                <div className="flex justify-center items-center gap-6 text-[11px] font-bold text-slate-700 pt-1">
                  <span>ISSN: <strong className="text-primary-900">{settings?.issn || '2349-2015'}</strong></span>
                  <span className="text-amber-600">•</span>
                  <span>Impact Factor: <strong className="text-primary-900">{settings?.impactFactor || '6.74'}</strong></span>
                  <span className="text-amber-600">•</span>
                  <span>UGC &amp; Refereed Standards</span>
                </div>
              </div>

              {/* Certificate Title Banner */}
              <div className="text-center my-6 relative z-10">
                <div className="inline-block relative">
                  <span className="text-xs font-mono uppercase tracking-widest text-slate-400 block mb-1">
                    CERTIFICATE ID: {certId}
                  </span>
                  <h2 className="font-serif font-extrabold text-2xl sm:text-3xl text-primary-900 tracking-wider uppercase border-b-2 border-amber-500 pb-1 px-8">
                    Certificate of Publication
                  </h2>
                </div>
              </div>

              {/* Certificate Body */}
              <div className="text-center space-y-4 max-w-3xl mx-auto relative z-10 text-xs sm:text-sm text-slate-700 leading-relaxed">
                <p className="italic text-slate-500 text-xs font-serif">
                  This is proudly awarded to
                </p>

                <h3 className="font-serif font-extrabold text-lg sm:text-xl text-navy-950 uppercase tracking-wide underline decoration-amber-400 underline-offset-4">
                  {allAuthors}
                </h3>

                {affiliation && (
                  <p className="text-xs font-semibold text-slate-600">
                    {affiliation}
                  </p>
                )}

                <p className="text-xs text-slate-600 pt-2">
                  in recognition and appreciation of the contribution of the scholarly research paper entitled:
                </p>

                <div className="p-3.5 bg-slate-50/80 rounded-lg border border-slate-200/80 my-2">
                  <p className="font-serif font-bold text-sm sm:text-base text-primary-950 italic leading-snug">
                    &ldquo;{paperTitle}&rdquo;
                  </p>
                </div>

                <p className="text-xs text-slate-700">
                  which has been evaluated through a <strong>Double-Blind Peer Review Process</strong> and officially published in{' '}
                  <strong className="text-navy-900 font-semibold">{issueTitle}</strong>.
                </p>

                {doi && (
                  <p className="text-[11px] font-mono text-slate-500 pt-1">
                    Digital Object Identifier (DOI): <strong className="text-emerald-700">{doi}</strong>
                  </p>
                )}
              </div>

              {/* Quality Badges */}
              <div className="flex flex-wrap justify-center items-center gap-4 my-6 text-[10px] uppercase font-bold text-slate-600 relative z-10">
                <span className="flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded border border-slate-200">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Peer Reviewed &amp; Refereed
                </span>
                <span className="flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded border border-slate-200">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Open Access (CC-BY-NC)
                </span>
                <span className="flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded border border-slate-200">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Zenodo DOI Assigned
                </span>
              </div>

              {/* Signatures & Seal Section */}
              <div className="pt-6 border-t border-amber-600/40 flex items-end justify-between relative z-10 text-xs">
                {/* Managing Editor */}
                <div className="text-center space-y-1 w-44">
                  <div className="h-10 flex items-end justify-center">
                    <span className="font-serif italic font-bold text-slate-800 text-sm">Managing Editor</span>
                  </div>
                  <div className="border-t border-slate-400 pt-1">
                    <p className="font-bold text-slate-900 text-[11px]">Managing Editor</p>
                    <p className="text-[10px] text-slate-500">Publication Desk, NPA</p>
                  </div>
                </div>

                {/* Circular Gold Seal Graphic */}
                <div className="w-24 h-24 rounded-full border-4 border-double border-amber-600 bg-gradient-to-br from-amber-100 via-amber-50 to-amber-200 flex flex-col items-center justify-center text-center p-1 shadow-sm select-none">
                  <span className="text-[6.5px] font-black uppercase tracking-tighter text-amber-900">
                    NATIONAL PRESS ASSOCIATES
                  </span>
                  <Award className="w-6 h-6 text-amber-700 my-0.5" />
                  <span className="text-[6.5px] font-black uppercase tracking-tight text-amber-900">
                    OFFICIAL CERTIFIED
                  </span>
                  <span className="text-[5.5px] text-amber-800 font-mono">ISSN 2349-2015</span>
                </div>

                {/* Editor-in-Chief */}
                <div className="text-center space-y-1 w-44">
                  <div className="h-10 flex items-end justify-center">
                    <span className="font-serif italic font-bold text-slate-800 text-sm">Editor-in-Chief</span>
                  </div>
                  <div className="border-t border-slate-400 pt-1">
                    <p className="font-bold text-slate-900 text-[11px]">Editor-in-Chief</p>
                    <p className="text-[10px] text-slate-500">NRJBE Editorial Board</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* ========================================================================= */
          /* 2. OFFICIAL LETTER OF ACCEPTANCE (Formal Publisher Letterhead)             */
          /* ========================================================================= */
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 p-8 sm:p-14 text-xs sm:text-sm text-slate-800 space-y-6 print:shadow-none print:border-none print:p-4 print:max-w-none">
            {/* Letterhead Header */}
            <div className="border-b-2 border-primary-900 pb-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-primary-800 bg-primary-50 px-2.5 py-0.5 rounded border border-primary-200">
                  {settings?.publisherName || 'National Press Associates'}
                </span>
                <h1 className="font-serif font-bold text-xl sm:text-2xl text-slate-900 mt-1">
                  {settings?.journalName || 'National Research Journal of Business Economics'}
                </h1>
                <p className="text-xs text-slate-600 font-medium">
                  An International Reputed Peer Reviewed Refereed Research Journal • Open Access
                </p>
                <div className="flex flex-wrap gap-x-4 text-[11px] text-slate-500 pt-0.5">
                  <span>ISSN: <strong>{settings?.issn || '2349-2015'}</strong></span>
                  <span>Impact Factor: <strong>{settings?.impactFactor || '6.74'}</strong></span>
                  <span>Frequency: <strong>Biannual</strong></span>
                </div>
              </div>

              <div className="text-left sm:text-right text-xs space-y-1">
                <div className="font-mono">
                  <span className="text-slate-500">Ref. No: </span>
                  <strong className="text-slate-900">{refNo}</strong>
                </div>
                <div className="font-mono">
                  <span className="text-slate-500">Date: </span>
                  <span className="text-slate-800">{publishedDate}</span>
                </div>
              </div>
            </div>

            {/* Recipient */}
            <div className="space-y-1 pt-2">
              <p className="font-bold text-slate-900">To,</p>
              <p className="font-bold text-base text-primary-900">{allAuthors}</p>
              {affiliation && <p className="text-slate-600">{affiliation}</p>}
              {authorEmail && <p className="text-slate-500">Email: {authorEmail}</p>}
            </div>

            {/* Subject */}
            <div className="bg-slate-50 p-3 rounded-lg border-l-4 border-primary-800 text-xs sm:text-sm">
              <p className="font-bold text-slate-900">
                Subject: Official Letter of Acceptance for Publication in NRJBE
              </p>
              <p className="text-xs text-slate-600 mt-0.5 font-mono">
                Manuscript ID: {paperId} | Tracking Code: {certId}
              </p>
            </div>

            {/* Letter Body */}
            <div className="space-y-4 leading-relaxed text-slate-700">
              <p>Dear Author(s),</p>

              <p>
                We are pleased to formally inform you that following rigorous double-blind peer review by our editorial referee panel, your original research paper entitled:
              </p>

              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <p className="font-serif font-bold text-base text-navy-950 italic">
                  &ldquo;{paperTitle}&rdquo;
                </p>
              </div>

              <p>
                has been <strong>accepted for publication</strong> in the forthcoming edition of the{' '}
                <strong>National Research Journal of Business Economics</strong>:
              </p>

              <div className="bg-slate-50/80 p-3.5 rounded-lg border border-slate-200 text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Journal Particulars:</span>
                  <span className="font-bold text-slate-800">{settings?.journalName || 'NRJBE'} (ISSN: 2349-2015)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Scheduled Edition:</span>
                  <span className="font-bold text-slate-800">{issueTitle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Review Decision:</span>
                  <span className="font-bold text-emerald-700">Accepted without Further Revision</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Indexing &amp; DOI:</span>
                  <span className="font-bold text-slate-800">Zenodo OpenAIRE Assigned</span>
                </div>
              </div>

              <p>
                This letter serves as an official confirmation of acceptance for institutional API scoring, conference deputation, thesis clearance, and faculty CAS promotion purposes.
              </p>

              <p>
                We congratulate you on your intellectual contribution and look forward to your continued scholarly association with National Press Associates.
              </p>
            </div>

            {/* Letter Sign-off */}
            <div className="pt-8 border-t border-slate-200 flex items-end justify-between text-xs">
              <div className="space-y-1">
                <p className="text-[11px] text-slate-500">Editorial &amp; Publication Secretariat</p>
                <p className="text-[10px] text-slate-400">National Press Associates, Regional HQ, India</p>
                <p className="text-[10px] text-slate-400">Website: https://npajournals.org • Email: editornrjbe@gmail.com</p>
              </div>

              <div className="text-center sm:text-right space-y-1">
                <div className="h-10 flex items-end justify-center sm:justify-end">
                  <span className="font-serif italic font-bold text-slate-800 text-sm">Editor-in-Chief</span>
                </div>
                <div className="w-48 border-t border-slate-400 pt-1">
                  <p className="font-bold text-slate-900 text-[11px]">Authorized Signatory</p>
                  <p className="text-[10px] text-slate-500">National Research Journal of Business Economics</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
