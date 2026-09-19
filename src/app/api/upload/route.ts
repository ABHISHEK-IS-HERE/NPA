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

const uploadRateLimits = new Map<string, { count: number; resetTime: number }>();

function isUploadRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = uploadRateLimits.get(ip);
  if (!record || now > record.resetTime) {
    uploadRateLimits.set(ip, { count: 1, resetTime: now + 60 * 60 * 1000 });
    return false;
  }
  record.count++;
  return record.count > 15; // Max 15 uploads per hour
}

function isValidFileSignature(buffer: Buffer, ext: string): boolean {
  if (buffer.length < 4) return false;

  // PDF: %PDF- (0x25, 0x50, 0x44, 0x46)
  if (ext === '.pdf') {
    return buffer[0] === 0x25 && buffer[1] === 0x50 && buffer[2] === 0x44 && buffer[3] === 0x46;
  }

  // PNG: 89 50 4E 47
  if (ext === '.png') {
    return buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47;
  }

  // JPEG: FF D8 FF
  if (ext === '.jpg' || ext === '.jpeg') {
    return buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  }

  // DOCX: PK\x03\x04 (ZIP format)
  if (ext === '.docx') {
    return buffer[0] === 0x50 && buffer[1] === 0x4b && buffer[2] === 0x03 && buffer[3] === 0x04;
  }

  // DOC: D0 CF 11 E0 (CFBF format)
  if (ext === '.doc') {
    return buffer[0] === 0xd0 && buffer[1] === 0xcf && buffer[2] === 0x11 && buffer[3] === 0xe0;
  }

  // WEBP: RIFF....WEBP
  if (ext === '.webp') {
    return (
      buffer[0] === 0x52 &&
      buffer[1] === 0x49 &&
      buffer[2] === 0x46 &&
      buffer[3] === 0x46 &&
      buffer.length >= 12 &&
      buffer[8] === 0x57 &&
      buffer[9] === 0x45 &&
      buffer[10] === 0x42 &&
      buffer[11] === 0x50
    );
  }

  return false;
}

export async function POST(request: Request) {
  try {
    const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown-ip';
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

    // Manuscripts can only be PDF or DOC/DOCX
    if (type === 'manuscripts') {
      const allowedManuscriptExts = new Set(['.pdf', '.doc', '.docx']);
      if (!allowedManuscriptExts.has(originalExt)) {
        return NextResponse.json(
          { error: 'Manuscripts must be submitted in PDF or Microsoft Word (.doc, .docx) format.' },
          { status: 400 }
        );
      }

      // Rate limit manuscript uploads per IP
      if (isUploadRateLimited(clientIp)) {
        return NextResponse.json(
          { error: 'Upload rate limit exceeded. Please wait before submitting additional files.' },
          { status: 429 }
        );
      }
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

    // 4. Magic-byte file signature validation to prevent disguised payloads
    if (!isValidFileSignature(buffer, originalExt)) {
      return NextResponse.json(
        { error: `File content does not match the declared extension (${originalExt}). Upload rejected.` },
        { status: 400 }
      );
    }

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
