'use client';

/*
 * Copyright © 2026 Abhishek
 * All rights reserved.
 */

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';

interface AdminShellProps {
  children: React.ReactNode;
  adminUser?: {
    name: string;
    email: string;
  } | null;
}

export const AdminShell: React.FC<AdminShellProps> = ({ children, adminUser }) => {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // If on /admin/login, render bare without sidebar and header
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <div className="admin-theme min-h-screen bg-slate-950 text-slate-100 flex selection:bg-primary-500 selection:text-white">
      <AdminSidebar mobileOpen={mobileOpen} onCloseMobile={() => setMobileOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <AdminHeader
          onToggleMobile={() => setMobileOpen(!mobileOpen)}
          adminName={adminUser?.name || 'Administrator'}
          adminEmail={adminUser?.email || ''}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl w-full mx-auto text-slate-100">
          {children}
        </main>
      </div>
    </div>
  );
};
