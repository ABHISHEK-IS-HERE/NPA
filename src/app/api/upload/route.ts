/*
 * Copyright © 2026 Abhishek
 * All rights reserved.
 */

import { NextResponse } from 'next/server';
import { getCurrentAdmin } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  try {
    // For manuscript submissions, allow public upload if type === 'manuscripts'
    // Otherwise require admin authentication for site assets, papers, etc.
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const type = (formData.get('type') as string) || 'general';

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    if (type !== 'manuscripts') {
      const admin = await getCurrentAdmin();
      if (!admin) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    const validFolders = ['papers', 'covers', 'certificates', 'branding', 'manuscripts', 'general'];
    const targetFolder = validFolders.includes(type) ? type : 'general';

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sanitize filename and prepend unique timestamp
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const uniqueName = `${Date.now()}_${originalName}`;
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', targetFolder);

    await mkdir(uploadDir, { recursive: true });
    const filePath = path.join(uploadDir, uniqueName);
    await writeFile(filePath, buffer);

    const publicUrl = `/uploads/${targetFolder}/${uniqueName}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename: uniqueName,
      originalName: file.name,
      size: file.size,
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Failed to upload file: ' + error.message }, { status: 500 });
  }
}
