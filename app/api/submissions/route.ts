import { NextResponse } from 'next/server';
import { randomUUID, createHash } from 'crypto';
import path from 'path';
import { mkdir, writeFile, readdir, readFile, stat } from 'fs/promises';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type AllowedExt = 'pdf' | 'doc' | 'docx' | 'txt' | 'csv' | 'xls' | 'xlsx';

const ALLOWED_EXTS: Record<AllowedExt, string[]> = {
  pdf: ['application/pdf'],
  doc: ['application/msword'],
  docx: [
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ],
  txt: ['text/plain', 'application/octet-stream'],
  csv: ['text/csv', 'application/vnd.ms-excel'],
  xls: ['application/vnd.ms-excel'],
  xlsx: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
};

const MAX_FILES = 5;
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB per file
const MAX_TOTAL_SIZE_BYTES = 30 * 1024 * 1024; // 30MB total
const STORAGE_ROOT = path.join(process.cwd(), 'storage', 'submissions');

function extToMime(filename: string): string {
  const ext = getExt(filename);
  switch (ext) {
    case 'pdf':
      return 'application/pdf';
    case 'doc':
      return 'application/msword';
    case 'docx':
      return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    case 'txt':
      return 'text/plain';
    case 'csv':
      return 'text/csv';
    case 'xls':
      return 'application/vnd.ms-excel';
    case 'xlsx':
      return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    default:
      return 'application/octet-stream';
  }
}

function sanitizeFilename(name: string): string {
  const base = path.basename(name);
  const cleaned = base.replace(/[^a-zA-Z0-9._-]/g, '_');
  return cleaned.slice(0, 120);
}

function getExt(name: string): string {
  const idx = name.lastIndexOf('.');
  if (idx === -1) return '';
  return name.slice(idx + 1).toLowerCase();
}

function isAllowedMime(ext: string, mime: string): boolean {
  if (!ext) return false;
  if (!(ext in ALLOWED_EXTS)) return false;
  return ALLOWED_EXTS[ext as AllowedExt].some((m) => m === mime);
}

function looksLikeExecutable(buf: Uint8Array): boolean {
  // PE header "MZ"
  if (buf.length >= 2 && buf[0] === 0x4d && buf[1] === 0x5a) return true;
  // ELF header 0x7f 'E' 'L' 'F'
  if (
    buf.length >= 4 &&
    buf[0] === 0x7f &&
    buf[1] === 0x45 &&
    buf[2] === 0x4c &&
    buf[3] === 0x46
  )
    return true;
  // Script shebang (#!)
  if (buf.length >= 2 && buf[0] === 0x23 && buf[1] === 0x21) return true;
  return false;
}

function containsEICAR(buf: Uint8Array): boolean {
  const eicar =
    'X5O!P%@AP[4\\PZX54(P^)7CC)7}$EICAR-STANDARD-ANTIVIRUS-TEST-FILE!$H+H*';
  // Check first 1MB for the signature to avoid heavy decoding on very large files
  const sample = buf.subarray(0, Math.min(buf.length, 1024 * 1024));
  const text = new TextDecoder('ascii').decode(sample);
  return text.includes(eicar);
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const name = (formData.get('name') || '').toString().slice(0, 120);
    const email = (formData.get('email') || '').toString().slice(0, 200);
    const company = (formData.get('company') || '').toString().slice(0, 200);
    const subject = (formData.get('subject') || '').toString().slice(0, 200);
    const message = (formData.get('message') || '').toString().slice(0, 5000);
    const category = (formData.get('category') || '').toString().slice(0, 100);

    const files = formData.getAll('files') as File[];

    if (!email || (!message && files.length === 0)) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 },
      );
    }

    if (files.length > MAX_FILES) {
      return NextResponse.json(
        { success: false, error: `Too many files. Max ${MAX_FILES}.` },
        { status: 400 },
      );
    }

    let totalSize = 0;
    const submissionId = randomUUID();
    const submissionDir = path.join(STORAGE_ROOT, submissionId);
    await mkdir(submissionDir, { recursive: true });

    const storedFiles: any[] = [];
    for (const f of files) {
      if (!(f instanceof File)) continue;
      const originalName = f.name || 'file';
      const ext = getExt(originalName);
      const type = f.type || 'application/octet-stream';

      // Quick extension deny-list
      if (
        [
          'exe',
          'dll',
          'bat',
          'cmd',
          'sh',
          'ps1',
          'js',
          'mjs',
          'jar',
          'apk',
          'com',
        ].includes(ext)
      ) {
        return NextResponse.json(
          { success: false, error: `File type .${ext} is not allowed` },
          { status: 400 },
        );
      }

      // Allow list check
      if (!isAllowedMime(ext, type)) {
        return NextResponse.json(
          {
            success: false,
            error: `File ${originalName} with type ${type} is not allowed`,
          },
          { status: 400 },
        );
      }

      if (f.size > MAX_FILE_SIZE_BYTES) {
        return NextResponse.json(
          {
            success: false,
            error: `File ${originalName} exceeds max size of ${Math.round(
              MAX_FILE_SIZE_BYTES / (1024 * 1024),
            )}MB`,
          },
          { status: 400 },
        );
      }

      totalSize += f.size;
      if (totalSize > MAX_TOTAL_SIZE_BYTES) {
        return NextResponse.json(
          {
            success: false,
            error: `Total upload size exceeds ${Math.round(
              MAX_TOTAL_SIZE_BYTES / (1024 * 1024),
            )}MB`,
          },
          { status: 400 },
        );
      }

      const arrayBuffer = await f.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);

      if (looksLikeExecutable(bytes) || containsEICAR(bytes)) {
        return NextResponse.json(
          {
            success: false,
            error:
              'File appears to be unsafe and was rejected by basic screening',
          },
          { status: 400 },
        );
      }

      const sha256 = createHash('sha256').update(bytes).digest('hex');
      const storedName = sanitizeFilename(originalName);
      const dest = path.join(submissionDir, storedName);
      await writeFile(dest, bytes);

      storedFiles.push({
        originalName,
        storedName,
        size: f.size,
        mimeType: type,
        sha256,
      });
    }

    const headers = Object.fromEntries(
      Array.from(request.headers.entries()).map(([k, v]) => [k, v]),
    );

    const metadata = {
      submissionId,
      receivedAt: new Date().toISOString(),
      name,
      email,
      company,
      subject,
      message,
      category,
      files: storedFiles,
      client: {
        ip:
          request.headers.get('x-forwarded-for') ||
          request.headers.get('x-real-ip') ||
          null,
        userAgent: request.headers.get('user-agent') || null,
      },
      headers,
    };

    await writeFile(
      path.join(submissionDir, 'metadata.json'),
      JSON.stringify(metadata, null, 2),
      'utf8',
    );

    return NextResponse.json({ success: true, submissionId }, { status: 201 });
  } catch (error: any) {
    console.error('Submission error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Server error' },
      { status: 500 },
    );
  }
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    const file = url.searchParams.get('file');

    // Download a specific file for a submission: /api/submissions?id=...&file=storedName
    if (id && file) {
      const safeName = sanitizeFilename(file);
      const dir = path.join(STORAGE_ROOT, id);
      const filePath = path.join(dir, safeName);
      const data = await readFile(filePath);
      const mime = extToMime(safeName);
      return new Response(new Uint8Array(data), {
        status: 200,
        headers: {
          'Content-Type': mime,
          'Content-Disposition': `attachment; filename="${safeName}"`,
          'Cache-Control': 'no-store',
        },
      });
    }

    // Return a single submission by id
    if (id) {
      const dir = path.join(STORAGE_ROOT, id);
      const metaPath = path.join(dir, 'metadata.json');
      const metaStr = await readFile(metaPath, 'utf8');
      const meta = JSON.parse(metaStr);
      return NextResponse.json({ success: true, submission: meta });
    }

    // List all submissions (metadata only)
    let entries: string[] = [];
    try {
      entries = await readdir(STORAGE_ROOT);
    } catch {
      // Directory might not exist yet
      return NextResponse.json({ success: true, submissions: [] });
    }

    const submissions = await Promise.all(
      entries.map(async (entry) => {
        try {
          const dirPath = path.join(STORAGE_ROOT, entry);
          const st = await stat(dirPath);
          if (!st.isDirectory()) return null;

          const metaPath = path.join(dirPath, 'metadata.json');
          const metaStr = await readFile(metaPath, 'utf8');
          const meta = JSON.parse(metaStr);
          // Trim heavy headers for listing payload
          if (meta.headers) delete meta.headers;
          return meta;
        } catch {
          return null;
        }
      }),
    );

    const list = submissions.filter(Boolean);
    return NextResponse.json({ success: true, submissions: list });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Server error' },
      { status: 500 },
    );
  }
}
