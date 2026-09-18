/*
 * Copyright © 2026 Abhishek
 * All rights reserved.
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

const NPA_JOURNALS_STATIC = [
  {
    id: 'nrjbe',
    name: 'National Research Journal of Business Economics',
    shortName: 'NRJBE',
    issn: '2349-2015',
    discipline: 'Business & Economics',
    url: '/current-issue',
  },
  {
    id: 'nrjbfm',
    name: 'National Research Journal of Banking & Finance Management',
    shortName: 'NRJBFM',
    issn: '2349-6762',
    discipline: 'Banking & Finance',
    url: 'https://nrjbfm.in/submit-paper.php',
    external: true,
  },
  {
    id: 'nrjhrm',
    name: 'National Research Journal of Human Resource Management',
    shortName: 'NRJHRM',
    issn: '2394-059X',
    discipline: 'Human Resources & Org Behavior',
    url: 'https://www.nrjhrm.in/submit-paper-online',
    external: true,
  },
  {
    id: 'nrjitis',
    name: 'National Research Journal of Info Tech & Info Science',
    shortName: 'NRJITIS',
    issn: '2350-1278',
    discipline: 'Computer Science, AI & IoT',
    url: 'https://nrjitis.in/submit-paper-online',
    external: true,
  },
  {
    id: 'rrbb',
    name: 'Research & Reviews in Biotechnology & Biosciences',
    shortName: 'RRBB',
    issn: '2321-8681',
    discipline: 'Biotechnology & Life Sciences',
    url: 'https://www.biotechjournal.in/submit-paper-online',
    external: true,
  },
  {
    id: 'ajep',
    name: 'Academe Journal of Education & Psychology',
    shortName: 'AJEP',
    issn: '2249-040X',
    discipline: 'Education & Behavioral Psychology',
    url: 'https://academejournal.in/submit-paper',
    external: true,
  },
];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q')?.trim() || '';

    if (!q || q.length < 2) {
      return NextResponse.json({
        articles: [],
        issues: [],
        plans: [],
        journals: [],
      });
    }

    const lowerQ = q.toLowerCase();

    // 1. Query Articles
    const articles = await db.article.findMany({
      where: {
        status: 'Published',
        OR: [
          { title: { contains: q } },
          { authors: { contains: q } },
          { abstract: { contains: q } },
          { keywords: { contains: q } },
          { paperId: { contains: q } },
          { doi: { contains: q } },
        ],
      },
      select: {
        id: true,
        title: true,
        authors: true,
        paperId: true,
        doi: true,
        pageRange: true,
        issue: {
          select: {
            title: true,
            issueNumber: true,
            volume: { select: { volumeNumber: true, year: true } },
          },
        },
      },
      take: 8,
    });

    // 2. Query Issues
    const issues = await db.issue.findMany({
      where: {
        OR: [
          { title: { contains: q } },
          { monthYear: { contains: q } },
        ],
      },
      select: {
        id: true,
        title: true,
        issueNumber: true,
        monthYear: true,
        isCurrent: true,
        printPrice: true,
        volume: { select: { volumeNumber: true, year: true } },
      },
      take: 4,
    });

    // 3. Query Subscription Plans
    const plans = await db.subscriptionPlan.findMany({
      where: {
        isActive: true,
        OR: [
          { title: { contains: q } },
          { planType: { contains: q } },
          { format: { contains: q } },
        ],
      },
      select: {
        id: true,
        title: true,
        planType: true,
        format: true,
        duration: true,
        priceInr: true,
        priceUsd: true,
      },
      take: 3,
    });

    // 4. Query NPA Journals
    const matchedJournals = NPA_JOURNALS_STATIC.filter(
      (j) =>
        j.name.toLowerCase().includes(lowerQ) ||
        j.shortName.toLowerCase().includes(lowerQ) ||
        j.issn.includes(q) ||
        j.discipline.toLowerCase().includes(lowerQ)
    );

    return NextResponse.json({
      articles,
      issues,
      plans,
      journals: matchedJournals,
    });
  } catch (error: any) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { error: 'Failed to execute search query' },
      { status: 500 }
    );
  }
}
