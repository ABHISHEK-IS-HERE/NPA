/*
 * Copyright © 2026 Abhishek
 * All rights reserved.
 */

import { MetadataRoute } from 'next';
import { db } from '@/lib/db';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://npa-puce.vercel.app';

  const staticPaths = [
    '',
    '/current-issue',
    '/archives',
    '/editorial-board',
    '/submit-paper',
    '/track-status',
    '/subscribe',
    '/contact',
    '/store',
    '/institutions',
    '/publish-books',
    '/ugc-api-calculator',
    '/naac-compliance',
    '/catalog',
    '/dispatch-tracking',
  ];

  const staticEntries: MetadataRoute.Sitemap = staticPaths.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: path === '' ? 'daily' : 'weekly',
    priority: path === '' ? 1.0 : 0.8,
  }));

  try {
    const [articles, pages] = await Promise.all([
      db.article.findMany({
        where: { status: 'Published' },
        select: { id: true, publishedAt: true },
      }),
      db.page.findMany({
        where: { isPublished: true },
        select: { slug: true, updatedAt: true },
      }),
    ]);

    const articleEntries: MetadataRoute.Sitemap = articles.map((a) => ({
      url: `${baseUrl}/article/${a.id}`,
      lastModified: a.publishedAt,
      changeFrequency: 'monthly',
      priority: 0.9,
    }));

    const pageEntries: MetadataRoute.Sitemap = pages.map((p) => ({
      url: `${baseUrl}/page/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: 'monthly',
      priority: 0.7,
    }));

    return [...staticEntries, ...articleEntries, ...pageEntries];
  } catch (e) {
    console.error('Error generating dynamic sitemap entries:', e);
    return staticEntries;
  }
}
