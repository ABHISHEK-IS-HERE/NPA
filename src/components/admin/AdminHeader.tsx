'use client';

/*
 * Copyright © 2026 Abhishek
 * All rights reserved.
 */

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Menu, LogOut, ExternalLink, User, ShieldCheck } from 'lucide-react';

interface AdminHeaderProps {
  onToggleMobile?: () => void;
  adminName?: string;
  adminEmail?: string;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  onToggleMobile,
  adminName = 'Chief Editor',
  adminEmail = 'admin@nrjbe.in',
}) => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <header className="bg-slate-900 border-b border-slate-800 h-16 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-20 shadow-xs text-slate-100">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobile}
          className="lg:hidden p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-800"
          aria-label="Toggle Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 hidden sm:inline">
            Admin Portal /
          </span>
          <span className="text-sm font-bold text-white">
            Publishing Management System
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/"
          target="_blank"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
        >
          <span>Live Site</span>
          <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
        </Link>

        {/* User Info */}
        <div className="flex items-center gap-2.5 pl-3 border-l border-slate-800 text-xs">
          <div className="w-8 h-8 rounded-full bg-primary-950 text-primary-400 border border-primary-700/50 font-bold flex items-center justify-center">
            <User className="w-4 h-4" />
          </div>
          <div className="hidden md:block text-left">
            <p className="font-bold text-slate-100 leading-tight">{adminName}</p>
            <p className="text-[10px] text-slate-400">{adminEmail}</p>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          title="Sign Out"
          className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 rounded-lg transition-colors ml-1"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
