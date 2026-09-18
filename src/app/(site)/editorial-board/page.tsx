import React from 'react';
import { db } from '@/lib/db';
import Link from 'next/link';
import { Users, Mail, Globe, Award, Building, UserCheck } from 'lucide-react';

export const revalidate = 0;

export default async function EditorialBoardPage() {
  const members = await db.editorialMember.findMany({
    orderBy: [{ isEditorInChief: 'desc' }, { order: 'asc' }],
  });

  const editorInChief = members.filter((m) => m.isEditorInChief);
  const advisoryBoard = members.filter((m) => !m.isEditorInChief && m.role.toLowerCase().includes('advisory'));
  const associateEditors = members.filter((m) => !m.isEditorInChief && (m.role.toLowerCase().includes('associate') || m.role.toLowerCase().includes('editor')));
  const otherMembers = members.filter(
    (m) => !m.isEditorInChief && !advisoryBoard.includes(m) && !associateEditors.includes(m)
  );

  return (
    <div className="py-10 bg-slate-50 min-h-[70vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary-700 bg-primary-50 px-2.5 py-0.5 rounded w-fit border border-primary-200 mb-2">
              <Users className="w-3.5 h-3.5" />
              <span>Editorial Leadership</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-navy-900">
              Editorial Board &amp; Advisory Committee
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-3xl leading-relaxed">
              Our esteemed editorial board comprises eminent scholars, university deans, and senior researchers from premier academic institutions across the globe, upholding the rigorous quality and scientific integrity of NRJBE.
            </p>
          </div>

          <div className="flex-shrink-0">
            <Link
              href="/contact?subject=Application+to+Join+Editorial+Board"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-700 to-navy-900 hover:from-primary-800 hover:to-navy-950 text-white text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-lg shadow-sm transition-all"
            >
              <UserCheck className="w-4 h-4 text-amber-300" />
              <span>Join Editorial Board</span>
            </Link>
          </div>
        </div>

        {/* Section 1: Editor-in-Chief */}
        {editorInChief.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-2 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-600" />
              <span>Editor-in-Chief</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {editorInChief.map((editor) => (
                <div
                  key={editor.id}
                  className="bg-white rounded-xl p-6 border-2 border-primary-200 shadow-sm flex flex-col sm:flex-row gap-5 items-start"
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-gradient-to-br from-primary-800 to-navy-900 text-amber-400 flex items-center justify-center font-bold text-2xl flex-shrink-0 shadow">
                    {editor.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 px-2 py-0.5 rounded border border-amber-200">
                      Chief Editor
                    </span>
                    <h3 className="font-serif font-bold text-lg text-navy-900 mt-1">
                      {editor.name}
                    </h3>
                    <p className="text-xs font-semibold text-primary-800">
                      {editor.designation}
                    </p>
                    {editor.department && (
                      <p className="text-xs text-slate-600">
                        {editor.department}
                      </p>
                    )}
                    <p className="text-xs text-slate-700 font-medium flex items-center gap-1.5 pt-1">
                      <Building className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span>{editor.institution}, {editor.country}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 2: International Advisory Board */}
        {advisoryBoard.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-2 flex items-center gap-2">
              <Globe className="w-4 h-4 text-primary-600" />
              <span>International Advisory Board</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {advisoryBoard.map((member) => (
                <div
                  key={member.id}
                  className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:border-primary-300 transition-colors"
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                    {member.role}
                  </span>
                  <h3 className="font-serif font-bold text-base text-navy-900 mt-2">
                    {member.name}
                  </h3>
                  <p className="text-xs font-semibold text-primary-800 mt-0.5">
                    {member.designation}
                  </p>
                  <p className="text-xs text-slate-600 mt-1 flex items-start gap-1">
                    <Building className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
                    <span>{member.institution} ({member.country})</span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 3: Associate Editors & Reviewers */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-2 flex items-center gap-2">
            <Users className="w-4 h-4 text-slate-600" />
            <span>Associate Editors &amp; Review Board</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...associateEditors, ...otherMembers].map((member) => (
              <div
                key={member.id}
                className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:border-primary-300 transition-colors"
              >
                <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                  {member.role}
                </span>
                <h3 className="font-serif font-bold text-base text-navy-900 mt-2">
                  {member.name}
                </h3>
                <p className="text-xs font-semibold text-primary-800 mt-0.5">
                  {member.designation}
                </p>
                <p className="text-xs text-slate-600 mt-1 flex items-start gap-1">
                  <Building className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
                  <span>{member.institution} ({member.country})</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
