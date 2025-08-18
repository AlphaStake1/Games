# Deployment Guide: Getting footballsquares.sol Live

## 🚀 **Quick Deployment Options for Testers**

### **Option 1: Vercel (Fastest - 5 minutes)**

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Login to Vercel
vercel login

# 3. Deploy from your project root
vercel

# 4. Configure custom domain
vercel domains add footballsquares.sol
```

**Steps:**

1. Go to [vercel.com](https://vercel.com) and sign up with GitHub
2. Connect your fsq repository
3. Set environment variables in Vercel dashboard:
   - `GOOGLE_CLOUD_PROJECT_ID=football-squares-01-b9dfeaec4bff`
   - `GOOGLE_CLOUD_BUCKET=coach-b-fsq-assets`
   - `GOOGLE_APPLICATION_CREDENTIALS=[your service account JSON]`
   - All other env vars from your `.env` file
4. Deploy automatically triggers on git push

**Domain Setup:**

- Purchase `footballsquares.sol` domain (if using Solana naming)
- Or use `footballsquares.app` / `footballsquares.io` for immediate availability
- Configure DNS in Vercel dashboard

### **Option 2: Netlify (Alternative - 5 minutes)**

```bash
# 1. Install Netlify CLI
npm install -g netlify-cli

# 2. Login
netlify login

# 3. Build and deploy
npm run build
netlify deploy --prod --dir=.next
```

### **Option 3: Google Cloud (Your Infrastructure - 10 minutes)**

Since you already have Google Cloud set up:

```bash
# 1. Enable Cloud Run
gcloud services enable run.googleapis.com

# 2. Build container
docker build -t gcr.io/football-squares-01-b9dfeaec4bff/fsq-app .

# 3. Push to Container Registry
docker push gcr.io/football-squares-01-b9dfeaec4bff/fsq-app

# 4. Deploy to Cloud Run
gcloud run deploy fsq-app \
  --image gcr.io/football-squares-01-b9dfeaec4bff/fsq-app \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

---

## 🛠 **Required Configuration for Production**

### **1. Environment Variables Setup**

Create these in your deployment platform:

```bash
# Core App
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://footballsquares.sol

# Solana
SOLANA_RPC_URL=https://api.devnet.solana.com
NEXT_PUBLIC_SOLANA_NETWORK=devnet

# Google Cloud (Coach B's account)
GOOGLE_CLOUD_PROJECT_ID=football-squares-01-b9dfeaec4bff
GOOGLE_CLOUD_BUCKET=coach-b-fsq-assets
GOOGLE_APPLICATION_CREDENTIALS=[service account JSON]

# Storage for Signature NFTs
NEXT_PUBLIC_STORAGE_PROVIDER=google-cloud

# Database (your Supabase)
DATABASE_URL=postgresql://postgres:TeslaUTT!651@db.rryzwohvlvexroktqffn.supabase.co:5432/postgres

# Pinata (backup storage)
NEXT_PUBLIC_PINATA_API_KEY=fd6cabab378fa43bdb30
PINATA_JWT=[your JWT token]
```

### **2. Quick Domain Options**

#### **Immediate (.app/.io/.com)**

- `footballsquares.app` (Available on Namecheap/GoDaddy)
- `footballsquares.io` (Available)
- `fsq.app` (Short & memorable)

#### **Solana Domain (.sol)**

- Buy through [Bonfida](https://naming.bonfida.org/)
- Configure with [SNS (Solana Name Service)](https://sns.id/)
- Point to your deployment IP/URL

---

## ⚡ **One-Click Deployment (Recommended)**

I'll create deployment configurations for you:

### **Vercel Configuration**

```json
{
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  },
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 30
    }
  }
}
```

### **Docker Configuration**

```dockerfile
FROM node:18-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM base AS build
COPY . .
RUN npm run build

FROM base AS runtime
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
EXPOSE 3000
CMD ["npm", "start"]
```

---

## 🧪 **Testing Checklist Before Going Live**

### **Pre-Deployment Tests**

```bash
# 1. Build test
pnpm run build

# 2. Type check
pnpm run lint && npx tsc --noEmit

# 3. Signature NFT test
# Connect wallet → Check modal appears → Generate signature

# 4. Google Cloud Storage test
# Verify uploads work with your service account
```

### **Post-Deployment Tests**

- [ ] Site loads at domain
- [ ] Wallet connection works
- [ ] Signature modal appears for new users
- [ ] Signature generation completes
- [ ] Google Cloud Storage uploads work
- [ ] Navigation and core features work

---

## 🚨 **For Immediate Tester Access (30 seconds)**

**Fastest option right now:**

```bash
# Start dev server accessible externally
pnpm run dev -- --hostname 0.0.0.0

# Share your IP address
echo "Testers can access: http://$(curl -s ifconfig.me):3000"
```

**Or use ngrok for public URL:**

```bash
# Install ngrok
npm install -g ngrok

# Start your dev server
pnpm run dev

# In another terminal, expose it
ngrok http 3000
```

This gives you an instant public URL like `https://abc123.ngrok.io` that testers can use immediately.

---

## 🎯 **Recommended Next Steps**

1. **Immediate (5 min)**: Use ngrok to get testers started right now
2. **Quick (30 min)**: Deploy to Vercel with footballsquares.app domain
3. **Long-term (2 hours)**: Set up footballsquares.sol Solana domain
4. **Production**: Migrate to Google Cloud Run using your infrastructure

The signature NFT system is ready - just need to get it accessible to testers!
