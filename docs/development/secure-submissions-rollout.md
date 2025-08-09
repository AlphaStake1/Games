Secure Submissions: Devnet and Production Rollout Plan

Scope

- This document defines what is needed to move the current keyless, filesystem-backed Secure Submissions implementation to Devnet and then to Production with optimal API connections, storage, and anti-virus/malware screening.
- Current implementation references:
  - Public page: [app/submissions/page.tsx](app/submissions/page.tsx)
  - Admin page: [app/admin/submissions/page.tsx](app/admin/submissions/page.tsx)
  - API route: [app/api/submissions/route.ts](app/api/submissions/route.ts)
  - Business intake integration: [app/business-intake/page.tsx](app/business-intake/page.tsx)

Current Local Design (No external keys)

- Storage: Local filesystem at ./storage/submissions/<uuid>.
- API:
  - POST /api/submissions: Accepts multipart form data, validates basic constraints, stores files, writes metadata.json.
  - GET /api/submissions:
    - No params: list metadata for all submissions.
    - ?id=(uuid): return metadata.json for a single submission.
    - ?id=(uuid)&file=(storedName): download attachment.
- Screening:
  - Deny-list of risky extensions (.exe, .dll, .bat, .cmd, .sh, .ps1, .js, .mjs, .jar, .apk, .com).
  - Detect EICAR signature (basic AV test string).
  - Detect executable headers (MZ, ELF) and script shebangs (#!).
- Admin: /admin/submissions lists and downloads submissions.

Devnet Rollout (Recommended)
Goal: Keep simple developer experience but move off local FS and lay foundations for production.

API and storage architecture

- Replace local FS with object storage (S3-compatible) using signed URLs for uploads/downloads.
  - Minimal path to start: API continues to accept multipart uploads, but server streams files directly to object storage (no disk writes). Metadata remains in a metadata.json uploaded alongside files or is persisted in DB.
  - Optimal path: Client requests a server-generated pre-signed upload URL, then uploads file chunks directly to storage. API handles only metadata.
- Suggested providers:
  - AWS S3 (standard), Cloudflare R2 (S3-compatible), or Supabase Storage.
- Namespacing:
  - Bucket: secure-submissions-dev
  - Key scheme: submissions/<uuid>/metadata.json and submissions/<uuid>/files/<storedName>

Malware/AV screening (Devnet)

- Baseline: Maintain current static checks (deny-list, header checks, EICAR).
- Optional Devnet hardening without paid keys:
  - ClamAV container or daemon on the same network. API writes files to a “quarantine” folder (or temporary bucket path), invokes ClamAV scan, then promotes clean files to the submissions/ path.
  - If ClamAV not available, adhere to small size limits and deny-list as now.
- Logging: Log scan results and any rejections.

Auth and access (Devnet)

- Keep public uploads unauthenticated (if desired).
- Restrict /admin/submissions using one of:
  - IP allowlist in reverse proxy, or
  - Simple shared admin secret (custom header checked by GET route), or
  - Temporary password-protection for the admin page (server-side check).

Rate limiting (Devnet)

- Add basic rate limiting at API (e.g., per-IP, sliding window).
- Add payload size constraints already enforced in the route.

Environment variables (Devnet)

- NEXT_PUBLIC_URL (optional UI links).
- STORAGE_PROVIDER=s3|r2|supabase (plan for switch).
- STORAGE_BUCKET=secure-submissions-dev
- STORAGE_REGION=us-... (provider-specific)
- STORAGE_ENDPOINT=https://... (for R2 or custom S3 endpoints)
- STORAGE_ACCESS_KEY=...
- STORAGE_SECRET_KEY=...
- CLAMAV_HOST=clamav
- CLAMAV_PORT=3310
- ADMIN_ACCESS_TOKEN=... (if using header-based auth for admin GET routes)

Production Rollout (Recommended)
Goal: Robust security, scalability, observability, and lifecycle management.

API and storage architecture

- Storage: Use object storage with server-side encryption at rest (SSE-S3/KMS).
- File flow:
  - Client → presigned PUT URL (max size, content-type constraints).
  - API receives metadata and associates file manifests; stored objects remain “quarantined” until scanning is completed.
  - After AV scan passes, flip a “status=clean” flag in metadata and move/rename keys to submissions/clean path.
- Signed downloads:
  - Admin UI requests file downloads via signed GET URLs; no raw streaming from Next.js server to keep memory/CPU low and simplify CDN cache control.

Malware/AV scanning (Production)

- Options in order of control:
  - ClamAV (containerized) with freshclam updates; scan each object after upload (event-driven or API-triggered).
  - Cloud AV services (requires API keys): VirusTotal, OPSWAT MetaDefender, Cloudflare AV scanning add-ons (if available).
  - Advanced: Multi-engine scanning via queues (SQS/PubSub), store verdicts, quarantine failed files, auto-expire quarantined items.
- Policy:
  - Reject known malware signatures.
  - Quarantine suspicious files; manual review path in Admin UI with an override.
  - Keep immutable audit log for scans (timestamp, engine version, signature DB version).

Authentication, authorization, and transport

- Protect /admin/submissions:
  - SSO, Passkeys, or NextAuth with an allowlist of admins.
  - Enforce role-based access for list vs. download operations.
- TLS everywhere:
  - HTTPS termination at CDN or ingress; HSTS enforced.
- WAF/CDN:
  - Enable WAF rules to block common attack vectors and excessive posting.
  - Rate limit per-IP/ASN for POST endpoint.

Data retention, privacy, and lifecycle

- Metadata retention policy:
  - Default: 180 days, configurable per category (e.g., business-intake 365 days).
- File retention:
  - Define retention per category and delete or archive to cold storage after expiration.
- PII/security:
  - Store only what you need; redact headers in list endpoints (already redacted).
- Backups:
  - Daily object storage snapshots or cross-region replication if needed.
- Audit logs:
  - Log every access to admin listing and downloads with admin identity.

Observability and alerting

- Metrics:
  - Upload volume/day, storage used, scan pass/fail counts, rejection rate, 4xx/5xx counts.
- Alerts:
  - On scan failure spikes, on storage threshold exceed, on anomalous traffic patterns to POST route.
- Tracing:
  - Optional: wrap API handlers with tracing (OpenTelemetry) to observe latency and error hotspots.

Rollout Checklist
Devnet

- Switch storage to object storage (bucket: secure-submissions-dev).
- Optional: containerized ClamAV scanning into the upload flow.
- Protect /admin/submissions (basic auth or token).
- Add rate limiting to POST route.
- Verify logs and metrics.

Production

- Harden auth for /admin/submissions (SSO/Passkeys).
- Use KMS-backed encryption in storage.
- Deploy WAF/CDN with rate limit + bot mitigation.
- Enable AV scanning pipeline with quarantine/promote model.
- Implement signed download URLs; remove direct unguarded reads.
- Set retention policies and automated cleanup.
- Add monitoring and alerting.

Optimal API connections and storage

- Minimal friction: API issues presigned URLs (upload/download), metadata submitted separately; scanning asynchronously promotes files.
- Why:
  - Removes large file streams from app server.
  - Lets storage/CDN handle delivery (lower latency, fewer server resources).
  - Works well with queue-based AV scanning.

Anti-virus/malware expansion

- ClamAV quick-start:
  - Run clamav/clamd container near the API.
  - API sends the object bytes or streams the object via a service worker to clamd.
  - Promote only if “OK”.
- Third-party scanning:
  - VirusTotal: asynchronous hash-based checks plus file submissions; requires API key.
  - OPSWAT MetaDefender: multi-AV scanning APIs; requires API key.
- File-type controls:
  - Keep deny-list for executables and scripts.
  - Maintain allow-list for business docs (.pdf, .docx, .xlsx, .txt, .csv).
- Size limits:
  - Keep 10MB/file and 30MB/request as defaults; tune per partner needs.

Environment example (Production)

- STORAGE_PROVIDER=s3
- STORAGE_BUCKET=secure-submissions
- STORAGE_REGION=us-east-1
- STORAGE_ENDPOINT= (empty for AWS S3)
- STORAGE_ACCESS_KEY=...
- STORAGE_SECRET_KEY=...
- STORAGE_KMS_KEY_ID=arn:aws:kms:...
- ADMIN_AUTH_PROVIDER=nextauth|passkeys|sso
- ADMIN_ACCESS_GROUP=admins
- AV_MODE=clamav|virustotal|opswat
- CLAMAV_HOST=clamav
- CLAMAV_PORT=3310
- WAF_ENABLED=true
- RATE_LIMIT_POSTS_PER_MIN=5

Future LLM Reminders (Persistent Anchors)
These are explicit anchors for future assistants to find and follow. Do not remove.

LLM-ANCHOR:SECURE-SUBMISSIONS-TODO

- If STORAGE_PROVIDER is local filesystem, propose migrating to S3-compatible storage with presigned uploads and downloads.
- Add authentication to /admin/submissions (do not leave open).
- Add rate limiting and WAF notes.
- Suggest ClamAV scanning with quarantine/promote flow.
- Implement retention policy and cleanups.
- Replace direct file streaming with signed URLs in production.

LLM-ANCHOR:SECURE-SUBMISSIONS-FILES

- Public upload page: [app/submissions/page.tsx](app/submissions/page.tsx)
- Admin page: [app/admin/submissions/page.tsx](app/admin/submissions/page.tsx)
- API route: [app/api/submissions/route.ts](app/api/submissions/route.ts)
- Intake integration: [app/business-intake/page.tsx](app/business-intake/page.tsx)

LLM-ANCHOR:SECURE-SUBMISSIONS-CONFIG

- Expected env keys include storage provider, bucket, credentials, AV settings, admin auth.
- If a provider is detected (S3, R2, Supabase), implement presigned URL path and scan pipeline.
- Ensure no secrets are exposed to NEXT*PUBLIC*\* variables.

Notes

- This document is the canonical reference for rolling Secure Submissions into Devnet and Production.
- Keep it updated with infra decisions and credentials handling patterns.
