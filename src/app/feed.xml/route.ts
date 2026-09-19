/*
 * Copyright © 2026 Abhishek
 * All rights reserved.
 */

import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://npa-puce.vercel.app';

    const articles = await db.article.findMany({
      where: { status: 'Published' },
      orderBy: { publishedAt: 'desc' },
      take: 50,
      include: {
        issue: { include: { volume: true } },
      },
    });

    const rssItemsXml = articles
      .map((article) => {
        const articleUrl = `${baseUrl}/article/${article.id}`;
        const pubDate = new Date(article.publishedAt).toUTCString();
        const safeTitle = (article.title || '')
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&apos;');

        const safeAuthors = (article.authors || '')
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;');

        return `
    <item>
      <title>${safeTitle}</title>
      <link>${articleUrl}</link>
      <guid isPermaLink="true">${articleUrl}</guid>
      <pubDate>${pubDate}</pubDate>
      <dc:creator>${safeAuthors}</dc:creator>
      <description><![CDATA[${article.abstract || ''}]]></description>
      ${article.keywords ? `<category>${article.keywords.replace(/&/g, '&amp;')}</category>` : ''}
      ${article.doi ? `<dc:identifier>info:doi/${article.doi}</dc:identifier>` : ''}
    </item>`;
      })
      .join('');

    const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" 
     xmlns:atom="http://www.w3.org/2005/Atom"
     xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>National Research Journal of Business Economics (NRJBE)</title>
    <link>${baseUrl}</link>
    <description>An International Reputed Peer Reviewed Refereed Research Journal | Open Access | ISSN: 2349-2015</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml" />
    <image>
      <url>${baseUrl}/templates/npa-logo.png</url>
      <title>NRJBE Research Journal</title>
      <link>${baseUrl}</link>
    </image>
    ${rssItemsXml}
  </channel>
</rss>`;

    return new NextResponse(rssXml.trim(), {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('RSS feed generation error:', error);
    return new NextResponse('Error generating RSS feed', { status: 500 });
  }
}
