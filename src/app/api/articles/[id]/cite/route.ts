/*
 * Copyright © 2026 Abhishek
 * All rights reserved.
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const articleId = Number(params.id);
    if (isNaN(articleId)) {
      return NextResponse.json({ error: 'Invalid article ID' }, { status: 400 });
    }

    const article = await db.article.findUnique({
      where: { id: articleId },
      include: {
        issue: { include: { volume: true } },
      },
    });

    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const format = (searchParams.get('format') || 'bibtex').toLowerCase();
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://npa-puce.vercel.app';

    const year = article.publishedAt.getFullYear();
    const volume = article.issue?.volume?.volumeNumber || '12';
    const issue = article.issue?.issueNumber || '1';
    const firstPage = article.pageRange?.split('-')[0]?.trim() || '1';
    const lastPage = article.pageRange?.split('-')[1]?.trim() || '';
    const citeKey = `NRJBE_${year}_${article.paperId || article.id}`;
    const articleUrl = `${baseUrl}/article/${article.id}`;

    // Format BibTeX
    if (format === 'bibtex' || format === 'bib') {
      const bibtexAuthors = article.authors
        ? article.authors
            .split(/[,;]/)
            .map((a) => a.trim())
            .filter(Boolean)
            .join(' and ')
        : 'Author';

      const bibtex = [
        `@article{${citeKey},`,
        `  title = {${article.title}},`,
        `  author = {${bibtexAuthors}},`,
        `  journal = {National Research Journal of Business Economics},`,
        `  volume = {${volume}},`,
        `  number = {${issue}},`,
        `  year = {${year}},`,
        firstPage && lastPage ? `  pages = {${firstPage}--${lastPage}},` : '',
        `  issn = {2349-2015},`,
        article.doi ? `  doi = {${article.doi}},` : '',
        `  url = {${articleUrl}}`,
        `}`,
      ]
        .filter(Boolean)
        .join('\n');

      return new NextResponse(bibtex, {
        status: 200,
        headers: {
          'Content-Type': 'application/x-bibtex; charset=utf-8',
          'Content-Disposition': `attachment; filename="${article.paperId || `article-${article.id}`}.bib"`,
          'Cache-Control': 'public, max-age=86400',
        },
      });
    }

    // Format RIS (EndNote, Zotero, Mendeley)
    if (format === 'ris') {
      const authorLines = article.authors
        ? article.authors
            .split(/[,;]/)
            .map((a) => a.trim())
            .filter(Boolean)
            .map((a) => `AU  - ${a}`)
            .join('\n')
        : 'AU  - Unknown';

      const risLines = [
        'TY  - JOUR',
        `TI  - ${article.title}`,
        authorLines,
        'T2  - National Research Journal of Business Economics',
        `PY  - ${year}`,
        `VL  - ${volume}`,
        `IS  - ${issue}`,
        firstPage ? `SP  - ${firstPage}` : '',
        lastPage ? `EP  - ${lastPage}` : '',
        'SN  - 2349-2015',
        article.doi ? `DO  - ${article.doi}` : '',
        `UR  - ${articleUrl}`,
        article.abstract ? `AB  - ${article.abstract.replace(/\n/g, ' ')}` : '',
        'ER  - ',
      ]
        .filter(Boolean)
        .join('\n');

      return new NextResponse(risLines, {
        status: 200,
        headers: {
          'Content-Type': 'application/x-research-info-systems; charset=utf-8',
          'Content-Disposition': `attachment; filename="${article.paperId || `article-${article.id}`}.ris"`,
          'Cache-Control': 'public, max-age=86400',
        },
      });
    }

    return NextResponse.json(
      { error: 'Unsupported format. Use format=bibtex or format=ris' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Citation generation error:', error);
    return NextResponse.json({ error: 'Failed to generate citation' }, { status: 500 });
  }
}
