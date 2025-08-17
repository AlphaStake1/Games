# 🚀 Supabase Deployment Guide for Football Squares

## 📋 Pre-Deployment Checklist

- [x] Supabase account created
- [x] Database connection configured in .env
- [x] ElizaOS agents running
- [ ] Migration scripts ready to run

## 🔧 Step-by-Step Deployment

### Step 1: Open Supabase SQL Editor

1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor** (left sidebar)
3. Click **New Query**

### Step 2: Run Migrations in Order

#### Migration 1: Initial Schema

1. Copy entire contents of `migrations/001_initial_schema.sql`
2. Paste into SQL Editor
3. Click **Run**
4. ✅ Should create schema, tables, and insert 9 agents

#### Migration 2: Security Policies

1. Copy entire contents of `migrations/002_security_policies.sql`
2. Paste into SQL Editor
3. Click **Run**
4. ✅ Should create all RLS policies

#### Migration 3: Public API Views

1. Copy entire contents of `migrations/003_public_api_views.sql`
2. Paste into SQL Editor
3. Click **Run**
4. ✅ Should create public views and API functions

#### Migration 4: Production Security

1. Copy entire contents of `migrations/004_production_security.sql`
2. Paste into SQL Editor
3. Click **Run**
4. ✅ Should set up monitoring and cron jobs

### Step 3: Configure Dashboard Settings

#### Enable SSL (Required)

1. Go to **Settings** → **Database**
2. Toggle ON: **Enforce SSL on incoming connections**
3. Click **Save**

#### Network Restrictions (Recommended)

1. Go to **Settings** → **Database** → **Network Restrictions**
2. Add your server's IP address
3. Add your local development IP (if needed)
4. Click **Save**

#### API Rate Limiting (Recommended)

1. Go to **Settings** → **API**
2. Set rate limits:
   - Requests per minute: 100
   - Requests per hour: 1000
3. Click **Save**

#### Enable Backups (Critical)

1. Go to **Settings** → **Database** → **Backups**
2. Enable **Point-in-Time Recovery**
3. Set retention period: 7 days minimum

### Step 4: Get Your API Keys

1. Go to **Settings** → **API**
2. Copy these to your .env:

```bash
SUPABASE_URL=https://[your-project].supabase.co
SUPABASE_ANON_KEY=[your-anon-key]
SUPABASE_SERVICE_KEY=[your-service-key] # Keep secret!
```

### Step 5: Verify Deployment

Run the test script:

```bash
pnpm ts-node supabase/test-connection.ts
```

## 🎮 Testing Your Setup

### Test 1: Check Agents Table

```sql
SELECT * FROM fsq_private.agents;
```

Should show 9 agents (Coach B, Dean, Jerry, etc.)

### Test 2: Check Public Views

```sql
SELECT * FROM public.boards;
SELECT * FROM public.leaderboard;
```

### Test 3: Test Coach B Function

```sql
SELECT public.create_board(
  'NFL-2024-W1-001',
  'Chiefs',
  'Ravens',
  '2024-09-05 20:20:00',
  10.00,
  'standard'
);
```

## 🔍 Monitoring

### View Audit Logs (Dean)

```sql
SELECT * FROM fsq_private.audit_log
ORDER BY created_at DESC
LIMIT 50;
```

### Check Suspicious Activity (Dean)

```sql
SELECT * FROM fsq_private.suspicious_activity;
```

### View Failed Transactions (Jordan)

```sql
SELECT * FROM fsq_private.failed_transactions;
```

## ⚠️ Troubleshooting

### Issue: RLS policies blocking access

**Solution**: Check you're using the correct auth.uid() for agents

### Issue: Migrations fail

**Solution**: Run them in order, check for typos in SQL

### Issue: Can't connect from ElizaOS

**Solution**: Verify DATABASE_URL and SSL settings

### Issue: Public views empty

**Solution**: RLS policies may be too restrictive, check agent IDs

## 🎉 Success Indicators

- ✅ All 4 migrations run without errors
- ✅ 9 agents appear in agents table
- ✅ Public views are accessible
- ✅ SSL enforced in settings
- ✅ Test board creation works
- ✅ Audit logging is active

## 🚨 Important Security Notes

1. **NEVER** commit SUPABASE_SERVICE_KEY to git
2. **ALWAYS** use RLS policies, never disable them
3. **MONITOR** audit_log table daily
4. **BACKUP** before major changes
5. **TEST** in development before production

## 📞 Agent Responsibilities Summary

- **Coach B**: Creates boards, manages games
- **Dean**: Security monitoring, bans users
- **Jerry (GM)**: Executive management, emergency overrides, dispute resolution
- **Jordan**: Financial operations, payouts
- **Trainer Reviva**: User support
- **Others**: Supporting roles per their permissions

---

**Your Supabase environment is now ready for Football Squares!** 🏈
