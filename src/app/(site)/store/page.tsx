/*
 * Copyright © 2026 Abhishek
 * All rights reserved.
 */

import React from 'react';
import { db } from '@/lib/db';
import { StoreCatalog } from '@/components/store/StoreCatalog';

export const revalidate = 0;

export default async function JournalStorePage() {
  const [issues, plans, settings] = await Promise.all([
    db.issue.findMany({
      orderBy: [{ volume: { volumeNumber: 'desc' } }, { issueNumber: 'desc' }],
      include: {
        volume: true,
        _count: { select: { articles: true } },
      },
    }),
    db.subscriptionPlan.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    }),
    db.siteSetting.findFirst({ where: { id: 1 } }),
  ]);

  return <StoreCatalog issues={issues} plans={plans} settings={settings} />;
}
