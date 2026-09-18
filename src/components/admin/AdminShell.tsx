'use client';

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
    <div className="min-h-screen bg-slate-100 flex">
      <AdminSidebar mobileOpen={mobileOpen} onCloseMobile={() => setMobileOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <AdminHeader
          onToggleMobile={() => setMobileOpen(!mobileOpen)}
          adminName={adminUser?.name || 'Chief Editor'}
          adminEmail={adminUser?.email || 'admin@nrjbe.in'}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
