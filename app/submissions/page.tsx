'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  AlertTriangle,
  CheckCircle2,
  Loader2,
  Paperclip,
  Shield,
} from 'lucide-react';
import Link from 'next/link';

type UploadState =
  | { status: 'idle' }
  | { status: 'submitting' }
  | { status: 'success'; submissionId: string }
  | { status: 'error'; message: string };

const ALLOWED_EXT = ['.pdf', '.doc', '.docx', '.txt', '.csv', '.xls', '.xlsx'];

const MAX_FILES = 5;
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
const MAX_TOTAL_SIZE_BYTES = 30 * 1024 * 1024; // 30MB

function formatBytes(bytes: number) {
  const units = ['B', 'KB', 'MB', 'GB'];
  let i = 0;
  let n = bytes;
  while (n >= 1024 && i < units.length - 1) {
    n /= 1024;
    i++;
  }
  return `${Math.round(n * 10) / 10} ${units[i]}`;
}

export default function SecureSubmissionsPage() {
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('');
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [uploadState, setUploadState] = useState<UploadState>({
    status: 'idle',
  });
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const onPickFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(e.target.files || []);
    const next = [...files, ...picked].slice(0, MAX_FILES);
    setFiles(next);
    // reset input value to allow re-picking the same file
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeFile = (idx: number) => {
    const next = files.slice();
    next.splice(idx, 1);
    setFiles(next);
  };

  const clientValidate = (): string | null => {
    if (!email.trim()) return 'Email is required';
    if (!message.trim() && files.length === 0)
      return 'Provide a message or at least one file';
    if (files.length > MAX_FILES) return `Too many files (max ${MAX_FILES})`;

    let total = 0;
    for (const f of files) {
      if (f.size > MAX_FILE_SIZE_BYTES) {
        return `File "${f.name}" exceeds ${formatBytes(MAX_FILE_SIZE_BYTES)}`;
      }
      total += f.size;
    }
    if (total > MAX_TOTAL_SIZE_BYTES) {
      return `Total attachment size exceeds ${formatBytes(MAX_TOTAL_SIZE_BYTES)}`;
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = clientValidate();
    if (err) {
      setUploadState({ status: 'error', message: err });
      return;
    }
    setUploadState({ status: 'submitting' });

    try {
      const fd = new FormData();
      fd.append('name', name);
      fd.append('company', company);
      fd.append('email', email);
      fd.append('subject', subject);
      fd.append('category', category);
      fd.append('message', message);
      for (const f of files) {
        fd.append('files', f, f.name);
      }

      const res = await fetch('/api/submissions', {
        method: 'POST',
        body: fd,
      });

      const data = await res.json();
      if (!res.ok || !data?.success) {
        throw new Error(data?.error || 'Submission failed');
      }
      setUploadState({ status: 'success', submissionId: data.submissionId });
      // Optionally clear form
      setFiles([]);
      setSubject('');
      setCategory('');
      setMessage('');
    } catch (err: any) {
      setUploadState({
        status: 'error',
        message: err?.message || 'An unknown error occurred',
      });
    }
  };

  const totalBytes = files.reduce((acc, f) => acc + f.size, 0);

  return (
    <div className="min-h-screen bg-white dark:bg-black py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900">
                <Shield className="h-5 w-5 text-blue-700 dark:text-blue-300" />
              </div>
              <div>
                <CardTitle className="text-2xl">Secure Submissions</CardTitle>
                <CardDescription>
                  Submit text and supporting documents directly to Morgan
                  without using email storage. Attachments are screened and
                  stored securely.
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {uploadState.status === 'success' ? (
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium text-green-800 dark:text-green-200">
                      Submission received
                    </p>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      Reference ID: {uploadState.submissionId}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Link href="/" className="w-full">
                    <Button className="w-full" variant="outline">
                      Return Home
                    </Button>
                  </Link>
                  <Link href="/business-intake" className="w-full">
                    <Button className="w-full">Back to Business Intake</Button>
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {uploadState.status === 'error' && (
                  <div className="p-3 rounded-md bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-sm text-red-800 dark:text-red-200 flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 mt-0.5" />
                    <span>{uploadState.message}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Your Name</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Jane Smith"
                    />
                  </div>
                  <div>
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="Acme, Inc."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Business Email (required)</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@company.com"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="Brief subject"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="category">Category (optional)</Label>
                  <Input
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="e.g., White Label, Sponsorship, Partnership"
                  />
                </div>

                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Provide context for your submission..."
                    rows={6}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Attachments (optional)</Label>
                  <div className="flex items-center gap-3">
                    <Input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept={ALLOWED_EXT.join(',')}
                      onChange={onPickFiles}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Paperclip className="h-4 w-4 mr-2" /> Add files
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500">
                    Allowed: {ALLOWED_EXT.join(', ')} • Max {MAX_FILES} files •
                    Max {formatBytes(MAX_FILE_SIZE_BYTES)} per file • Total{' '}
                    {formatBytes(MAX_TOTAL_SIZE_BYTES)}
                  </p>

                  {files.length > 0 && (
                    <ul className="mt-2 divide-y rounded-md border">
                      {files.map((f, i) => (
                        <li
                          key={i}
                          className="flex items-center justify-between px-3 py-2 text-sm"
                        >
                          <div className="flex items-center gap-2">
                            <Paperclip className="h-4 w-4 text-gray-500" />
                            <span
                              className="truncate max-w-[16rem]"
                              title={f.name}
                            >
                              {f.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-gray-500">
                              {formatBytes(f.size)}
                            </span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFile(i)}
                            >
                              Remove
                            </Button>
                          </div>
                        </li>
                      ))}
                      <li className="flex items-center justify-between px-3 py-2 text-xs text-gray-600">
                        <span>Total</span>
                        <span>{formatBytes(totalBytes)}</span>
                      </li>
                    </ul>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-500">
                    Files are screened for unsafe content before storage.
                  </div>
                  <Button
                    type="submit"
                    disabled={uploadState.status === 'submitting'}
                  >
                    {uploadState.status === 'submitting' ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />{' '}
                        Submitting...
                      </>
                    ) : (
                      'Submit Securely'
                    )}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        <div className="text-xs text-gray-500 mt-4 text-center">
          Prefer email? You can still reach Morgan at{' '}
          <a
            href="mailto:morganreese@tutamail.com"
            className="text-blue-600 underline"
          >
            morganreese@tutamail.com
          </a>
          .
        </div>
      </div>
    </div>
  );
}
