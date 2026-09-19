/*
 * Copyright © 2026 Abhishek
 * All rights reserved.
 */

import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export interface StorageUploadResult {
  success: boolean;
  url: string;
  filename: string;
  error?: string;
}

/**
 * Uploads a file to cloud storage (Supabase) if configured,
 * or falls back gracefully to local filesystem storage.
 */
export async function uploadAsset(
  buffer: Buffer,
  filename: string,
  targetFolder: string,
  mimeType: string = 'application/octet-stream'
): Promise<StorageUploadResult> {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

  // 1. Cloud Storage Path (Supabase Storage)
  if (supabaseUrl && supabaseKey) {
    try {
      const bucket = 'uploads';
      const cleanFilename = `${targetFolder}/${Date.now()}_${filename.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const uploadEndpoint = `${supabaseUrl.replace(/\/$/, '')}/storage/v1/object/${bucket}/${cleanFilename}`;

      const res = await fetch(uploadEndpoint, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${supabaseKey}`,
          'Content-Type': mimeType,
          'x-upsert': 'true',
        },
        body: new Uint8Array(buffer),
      });

      if (res.ok) {
        const publicUrl = `${supabaseUrl.replace(/\/$/, '')}/storage/v1/object/public/${bucket}/${cleanFilename}`;
        return {
          success: true,
          url: publicUrl,
          filename: cleanFilename,
        };
      } else {
        const errorText = await res.text();
        console.warn('Supabase storage upload failed, falling back to local storage:', errorText);
      }
    } catch (cloudErr) {
      console.warn('Cloud storage connection error, falling back to local:', cloudErr);
    }
  }

  // 2. Local Filesystem Fallback
  try {
    const originalExt = path.extname(filename);
    const sanitizedBase = path.basename(filename, originalExt).replace(/[^a-zA-Z0-9_-]/g, '_');
    const uniqueName = `${Date.now()}_${sanitizedBase}${originalExt}`;
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', targetFolder);

    await mkdir(uploadDir, { recursive: true });
    const filePath = path.join(uploadDir, uniqueName);
    await writeFile(filePath, buffer);

    const publicUrl = `/uploads/${targetFolder}/${uniqueName}`;
    return {
      success: true,
      url: publicUrl,
      filename: uniqueName,
    };
  } catch (localErr: any) {
    console.error('Local filesystem upload failed:', localErr);
    return {
      success: false,
      url: '',
      filename: '',
      error: localErr.message || 'File write failed.',
    };
  }
}
