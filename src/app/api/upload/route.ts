/*
 * Copyright © 2026 Abhishek
 * All rights reserved.
 */

import { NextResponse } from 'next/server';
import { getCurrentAdmin } from '@/lib/auth';
import { uploadAsset } from '@/lib/storage';
import path from 'path';

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25 MB

const ALLOWED_EXTENSIONS = new Set([
  '.pdf',
  '.doc',
  '.docx',
  '.jpg',
  '.jpeg',
  '.png',
  '.webp',
]);

const ALLOWED_MIME_TYPES = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/jpeg',
  'image/png',
  'image/webp',
]);

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const type = (formData.get('type') as string) || 'general';

    if (!file) {
      return NextResponse.json({ error: 'No file provided for upload.' }, { status: 400 });
    }

    // 1. File size verification
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File exceeds the maximum allowable limit of 25MB.' },
        { status: 400 }
      );
    }

    if (file.size === 0) {
      return NextResponse.json({ error: 'Uploaded file cannot be empty.' }, { status: 400 });
    }

    // 2. Extension and MIME type verification
    const originalExt = path.extname(file.name).toLowerCase();
    if (!ALLOWED_EXTENSIONS.has(originalExt)) {
      return NextResponse.json(
        { error: `Unsupported file type (${originalExt}). Allowed: PDF, DOC, DOCX, JPG, PNG, WEBP.` },
        { status: 400 }
      );
    }

    if (file.type && !ALLOWED_MIME_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: `Invalid MIME type (${file.type}). Allowed: PDF, Word documents, and images.` },
        { status: 400 }
      );
    }

    // 3. Authorization check
    if (type !== 'manuscripts') {
      const admin = await getCurrentAdmin();
      if (!admin) {
        return NextResponse.json({ error: 'Unauthorized: Admin privileges required.' }, { status: 401 });
      }
    }

    const validFolders = ['papers', 'covers', 'certificates', 'branding', 'manuscripts', 'general'];
    const targetFolder = validFolders.includes(type) ? type : 'general';

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadResult = await uploadAsset(buffer, file.name, targetFolder, file.type);
    if (!uploadResult.success) {
      return NextResponse.json({ error: uploadResult.error || 'Upload failed.' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      url: uploadResult.url,
      filename: uploadResult.filename,
      originalName: file.name,
      size: file.size,
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Failed to upload file: ' + error.message }, { status: 500 });
  }
}
