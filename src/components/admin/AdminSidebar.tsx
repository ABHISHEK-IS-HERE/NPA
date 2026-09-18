'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Settings,
  Menu,
  Layers,
  FileText,
  Inbox,
  FileCode,
  Users,
  Bell,
  CreditCard,
  Image,
  UserCheck,
  ExternalLink,
  BookOpen,
} from 'lucide-react';

interface AdminSidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ mobileOpen, onCloseMobile }) => {
  const pathname = usePathname();

  const navItems = [
    { label: 'Dashboard Overview', path: '/admin', icon: LayoutDashboard },
    { label: 'Customer Orders & Pricing', path: '/admin/subscriptions', icon: CreditCard },
    { label: 'Journal Issues & Covers', path: '/admin/issues', icon: Layers },
    { label: 'Published Articles', path: '/admin/articles', icon: FileText },
    { label: 'Author Submissions', path: '/admin/submissions', icon: Inbox },
    { label: 'Website Menu Links', path: '/admin/navigation', icon: Menu },
    { label: 'Website Pages & Text', path: '/admin/pages', icon: FileCode },
    { label: 'Contact Info & Settings', path: '/admin/settings', icon: Settings },
    { label: 'Editorial Board', path: '/admin/editorial', icon: Users },
    { label: 'Top Announcement Banner', path: '/admin/announcements', icon: Bell },
    { label: 'File & Image Uploads', path: '/admin/media', icon: Image },
    { label: 'Change Password', path: '/admin/profile', icon: UserCheck },
  ];

  const content = (
    <div className="h-full flex flex-col justify-between bg-navy-950 text-slate-300 border-r border-navy-900 w-64 select-none">
      <div>
        {/* Branding header */}
        <div className="p-4 border-b border-navy-900 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary-800 text-amber-400 flex items-center justify-center font-bold shadow">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-white text-sm">NRJBE CMS</h2>
              <span className="text-[10px] text-slate-400 font-medium">Content Management</span>
            </div>
          </Link>
        </div>

        {/* Navigation list */}
        <nav className="p-3 space-y-1 text-xs">
          {navItems.map((item) => {
            const isActive =
              item.path === '/admin' ? pathname === '/admin' : pathname.startsWith(item.path);
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={onCloseMobile}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors font-medium ${
                  isActive
                    ? 'bg-primary-700 text-white font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-navy-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-300' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer link to public site */}
      <div className="p-4 border-t border-navy-900">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between p-2.5 rounded-lg bg-navy-900/80 hover:bg-navy-900 text-slate-300 hover:text-white text-xs transition-colors border border-navy-800"
        >
          <span className="font-semibold">View Live Website</span>
          <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop static sidebar */}
      <aside className="hidden lg:block h-screen sticky top-0 flex-shrink-0 z-30">
        {content}
      </aside>

      {/* Mobile sliding drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onCloseMobile} />
          <div className="relative z-10 w-64 max-w-xs">{content}</div>
        </div>
      )}
    </>
  );
};
