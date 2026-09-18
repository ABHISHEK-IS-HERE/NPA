/*
 * Copyright © 2026 Abhishek
 * All rights reserved.
 */

import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentAdmin } from '@/lib/auth';

export async function GET() {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const [
      totalArticles,
      totalVolumes,
      totalIssues,
      pendingSubmissions,
      totalSubscribers,
      unreadMessages,
      recentSubmissions,
      recentArticles,
    ] = await Promise.all([
      db.article.count(),
      db.volume.count(),
      db.issue.count(),
      db.submission.count({ where: { status: 'Submitted' } }),
      db.subscriptionOrder.count(),
      db.contactMessage.count({ where: { isRead: false } }),
      db.submission.findMany({
        take: 5,
        orderBy: { submittedAt: 'desc' },
      }),
      db.article.findMany({
        take: 5,
        orderBy: { id: 'desc' },
        include: { issue: true },
      }),
    ]);

    return NextResponse.json({
      stats: {
        totalArticles,
        totalVolumes,
        totalIssues,
        pendingSubmissions,
        totalSubscribers,
        unreadMessages,
      },
      recentSubmissions,
      recentArticles,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
