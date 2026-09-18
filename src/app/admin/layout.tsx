/*
 * Copyright © 2026 Abhishek
 * All rights reserved.
 */

import React from 'react';
import { getCurrentAdmin } from '@/lib/auth';
import { AdminShell } from '@/components/admin/AdminShell';

export const revalidate = 0;

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await getCurrentAdmin();

  return <AdminShell adminUser={admin}>{children}</AdminShell>;
}
