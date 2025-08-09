'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Download,
  Eye,
  RefreshCw,
  Shield,
  FolderDown,
  Search,
} from 'lucide-react';

type SubmissionMeta = {
  submissionId: string;
  receivedAt: string;
  name?: string;
  email: string;
  company?: string;
  subject?: string;
  message?: string;
  category?: string;
  files: {
    originalName: string;
    storedName: string;
    size: number;
    mimeType: string;
    sha256: string;
  }[];
  client?: {
    ip?: string | null;
    userAgent?: string | null;
  };
};

export default function SubmissionsAdminPage() {
  const [loading, setLoading] = useState(false);
  const [submissions, setSubmissions] = useState<SubmissionMeta[]>([]);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<SubmissionMeta | null>(null);
  const [details, setDetails] = useState<SubmissionMeta | null>(null);

  const fetchList = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/submissions', { cache: 'no-store' });
      const data = await res.json();
      if (data?.success) {
        setSubmissions((data.submissions || []) as SubmissionMeta[]);
      }
    } catch (e) {
      console.error('Failed to load submissions', e);
    } finally {
      setLoading(false);
    }
  };

  const fetchDetails = async (id: string) => {
    try {
      const res = await fetch(`/api/submissions?id=${encodeURIComponent(id)}`, {
        cache: 'no-store',
      });
      const data = await res.json();
      if (data?.success) {
        setDetails(data.submission as SubmissionMeta);
      }
    } catch (e) {
      console.error('Failed to load submission details', e);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  useEffect(() => {
    if (selected) {
      fetchDetails(selected.submissionId);
    } else {
      setDetails(null);
    }
  }, [selected?.submissionId]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return submissions;
    return submissions.filter((s) => {
      return (
        s.submissionId.toLowerCase().includes(q) ||
        (s.name || '').toLowerCase().includes(q) ||
        (s.email || '').toLowerCase().includes(q) ||
        (s.company || '').toLowerCase().includes(q) ||
        (s.category || '').toLowerCase().includes(q) ||
        (s.subject || '').toLowerCase().includes(q)
      );
    });
  }, [query, submissions]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Shield className="h-5 w-5 text-blue-700" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Secure Submissions
                </h1>
                <p className="text-gray-600">
                  Admin review and downloads for Morgan
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/submissions">
                <Button variant="outline">Open Public Upload Page</Button>
              </Link>
              <Button onClick={fetchList} disabled={loading}>
                <RefreshCw
                  className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`}
                />{' '}
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <Card>
          <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FolderDown className="h-5 w-5" /> Submissions (
                {filtered.length})
              </CardTitle>
              <CardDescription>
                Files are stored on the server filesystem and can be downloaded
                below.
              </CardDescription>
            </div>
            <div className="w-full md:w-80">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  className="pl-9"
                  placeholder="Search by name, email, company, subject, category, ID..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Received</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead className="text-center">Files</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((s) => (
                    <TableRow key={s.submissionId}>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium">
                            {new Date(s.receivedAt).toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-500">
                            ID: {s.submissionId.slice(0, 8)}…
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium">{s.name || '—'}</div>
                          <div className="text-xs text-gray-500">{s.email}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        {s.company || '—'}
                      </TableCell>
                      <TableCell>
                        {s.category ? (
                          <Badge variant="outline">{s.category}</Badge>
                        ) : (
                          '—'
                        )}
                      </TableCell>
                      <TableCell className="text-sm">
                        <div className="line-clamp-1" title={s.subject || ''}>
                          {s.subject || '—'}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        {s.files?.length ?? 0}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelected(s)}
                          >
                            <Eye className="h-4 w-4 mr-2" /> View
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filtered.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="text-center text-sm text-gray-500 py-6"
                      >
                        No submissions found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog
        open={!!selected}
        onOpenChange={(open) => !open && setSelected(null)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Submission Details</DialogTitle>
          </DialogHeader>
          {!(details && selected) ? (
            <div className="text-sm text-gray-500">Loading...</div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-gray-500">ID</div>
                  <div className="font-mono break-all">
                    {details.submissionId}
                  </div>
                </div>
                <div>
                  <div className="text-gray-500">Received</div>
                  <div>{new Date(details.receivedAt).toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-gray-500">Name</div>
                  <div>{details.name || '—'}</div>
                </div>
                <div>
                  <div className="text-gray-500">Email</div>
                  <div className="break-all">{details.email}</div>
                </div>
                <div>
                  <div className="text-gray-500">Company</div>
                  <div>{details.company || '—'}</div>
                </div>
                <div>
                  <div className="text-gray-500">Category</div>
                  <div>{details.category || '—'}</div>
                </div>
                <div className="col-span-2">
                  <div className="text-gray-500">Subject</div>
                  <div>{details.subject || '—'}</div>
                </div>
                <div className="col-span-2">
                  <div className="text-gray-500">Message</div>
                  <div className="whitespace-pre-wrap">
                    {details.message || '—'}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="font-medium">
                  Files ({details.files?.length || 0})
                </div>
                {details.files?.length ? (
                  <div className="rounded-md border divide-y">
                    {details.files.map((f) => (
                      <div
                        key={f.storedName}
                        className="flex items-center justify-between px-3 py-2 text-sm"
                      >
                        <div className="min-w-0">
                          <div
                            className="font-medium truncate max-w-xs"
                            title={f.originalName}
                          >
                            {f.originalName}
                          </div>
                          <div
                            className="text-xs text-gray-500 font-mono truncate max-w-xs"
                            title={f.sha256}
                          >
                            {f.sha256.slice(0, 16)}…
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-gray-600">
                            {formatBytes(f.size)}
                          </span>
                          <Link
                            href={`/api/submissions?id=${encodeURIComponent(details.submissionId)}&file=${encodeURIComponent(f.storedName)}`}
                            target="_blank"
                          >
                            <Button size="sm" variant="outline">
                              <Download className="h-4 w-4 mr-2" /> Download
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">No files attached</div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

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
