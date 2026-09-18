'use client';

import React, { useState } from 'react';
import {
  Image as ImageIcon,
  Upload,
  Copy,
  Check,
  CheckCircle2,
  AlertCircle,
  FileText,
  ExternalLink,
} from 'lucide-react';

export default function AdminMediaPage() {
  const [fileType, setFileType] = useState('branding');
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([
    {
      url: '/templates/Copyright-Form.pdf',
      name: 'Copyright-Form.pdf',
      type: 'PDF Document',
    },
    {
      url: '/templates/Paper-Template.pdf',
      name: 'Paper-Template.pdf',
      type: 'PDF Document',
    },
    {
      url: '/uploads/certificates/cert-HEA-6a647828e3453.pdf',
      name: 'cert-HEA-6a647828e3453.pdf',
      type: 'Certificate PDF',
    },
    {
      url: '/uploads/papers/HEA-6a647828e3453.pdf',
      name: 'HEA-6a647828e3453.pdf',
      type: 'Research Paper PDF',
    },
  ]);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', fileType);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to upload file');

      setUploadedFiles((prev) => [
        {
          url: data.url,
          name: data.filename,
          type: fileType,
        },
        ...prev,
      ]);
      setSuccess(`File "${file.name}" uploaded successfully!`);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-xl sm:text-2xl font-serif font-bold text-navy-900 flex items-center gap-2">
          <ImageIcon className="w-6 h-6 text-primary-700" />
          <span>Media &amp; File Asset Library</span>
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Upload branding logos, issue covers, PDF manuscripts, templates, and copy their public URLs with one click.
        </p>
      </div>

      {success && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Upload Zone */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-sm font-bold text-slate-800">Upload New File or Image</h2>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Target Folder:</span>
            <select
              value={fileType}
              onChange={(e) => setFileType(e.target.value)}
              className="text-xs py-1.5 px-3 border border-slate-300 rounded-lg bg-slate-50 text-slate-700 font-medium"
            >
              <option value="branding">Branding &amp; Logos</option>
              <option value="covers">Issue Covers</option>
              <option value="papers">Paper PDFs</option>
              <option value="certificates">Certificates</option>
              <option value="general">General Media</option>
            </select>
          </div>
        </div>

        <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-primary-500 transition-colors bg-slate-50">
          <input
            type="file"
            id="media-file-input"
            onChange={handleUpload}
            className="hidden"
            accept="image/*,.pdf,.doc,.docx"
          />
          <label htmlFor="media-file-input" className="cursor-pointer flex flex-col items-center">
            <Upload className="w-10 h-10 text-primary-600 mb-2" />
            <span className="text-xs sm:text-sm font-bold text-slate-800">
              {uploading ? 'Uploading to Server...' : 'Click to Select File to Upload'}
            </span>
            <span className="text-xs text-slate-500 mt-1">
              Supports JPG, PNG, WEBP, SVG, and PDF documents
            </span>
          </label>
        </div>
      </div>

      {/* File Assets Grid */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Uploaded Assets Library:
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {uploadedFiles.map((file, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-primary-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-4 h-4 text-primary-700" />
                  <span className="text-xs font-bold text-slate-800 truncate max-w-[180px]">
                    {file.name}
                  </span>
                </div>
                <code className="text-[11px] font-mono text-slate-500 bg-white p-1.5 rounded border border-slate-200 block truncate">
                  {file.url}
                </code>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                <a
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-700 hover:underline flex items-center gap-1 text-[11px]"
                >
                  <span>Preview</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                <button
                  onClick={() => copyToClipboard(file.url)}
                  className="inline-flex items-center gap-1 text-slate-700 hover:text-navy-900 bg-white px-2.5 py-1 rounded border border-slate-200 text-[11px] font-semibold"
                >
                  {copiedUrl === file.url ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span className="text-emerald-700">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-slate-500" />
                      <span>Copy URL</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
