# Testing Portal Deployment Checklist

## ✅ Step 1: File Preparation (COMPLETED)

- [x] Testing portal created at `/pages/testing/index.html`
- [x] File is properly formatted and tested
- [x] All 6 testing categories configured
- [x] Email submission set to btcinfo@protonmail.com

## 📧 Step 2: Verify Email Address

**ACTION REQUIRED BY ERIC:**

- [ ] Confirm btcinfo@protonmail.com is the correct email
- [ ] Test email receipt by sending a test message to btcinfo@protonmail.com
- [ ] Ensure email client can handle long mailto: URLs

**Note:** The testing forms will send feedback via mailto: links that open the user's default email client.

## 🚀 Step 3: Server Deployment

### File Location

- **Local file:** `/home/new-msi/workspace/fsq/pages/testing/index.html`
- **Target URL:** `bore.pub:1143/testing/`

### Deployment Options:

#### Option A: Using Bore Tunnel (Current Setup)

Since you're using bore for tunneling, the file should already be accessible if your Next.js server is running:

```bash
# Start Next.js server (if not running)
pnpm run dev

# In another terminal, start bore tunnel
./bore local 3001 --to bore.pub --port 1143
```

Then access at: `http://bore.pub:1143/testing/`

#### Option B: Static File Hosting

If you want to serve it separately from Next.js:

```bash
# Create a simple static server for testing
cd pages/testing
python3 -m http.server 8080

# Then tunnel it
./bore local 8080 --to bore.pub --port 1143
```

#### Option C: Include in Next.js Build

The file is already in the `pages` directory, so it should be served automatically by Next.js at `/testing/`

## 🔗 Step 4: Access URLs

### Primary Access URL:

- **Live URL:** `http://bore.pub:1143/testing/`
- **File served as:** index.html (automatically served when accessing /testing/)

### Testing Access Flow:

1. Testers visit `bore.pub:1143/testing/`
2. They select a testing category
3. Complete the form with progress tracking
4. Submit feedback via email to btcinfo@protonmail.com

## 📋 Step 5: Share with Testers

### Quick Share Message Template:

```
🏈 Football Squares Beta Testing Portal Ready!

Please help us test our platform:
🔗 bore.pub:1143/testing/

Choose your area of expertise:
• Weekly Board Play (35 questions)
• Season-Long Features (24 questions)
• Community Board Leader (25 questions)
• Signature & NFT Art (30 questions)
• AI Assistant (20 questions)
• Points & Rewards (23 questions)

Time needed: ~30 minutes
Your feedback will be emailed to our team.

Thank you for helping improve Football Squares!
```

## 🔧 Step 6: Verify Deployment

### Test Checklist:

- [ ] Access bore.pub:1143/testing/ in browser
- [ ] Verify all 6 form categories load
- [ ] Test form selection and navigation
- [ ] Complete a test submission
- [ ] Verify email opens with feedback
- [ ] Test on mobile device
- [ ] Check auto-save functionality

## 📝 Additional Notes

### File Permissions:

- The file should have 644 permissions (readable by all)
- Already set correctly in the local filesystem

### Browser Compatibility:

- Tested with modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile responsive design included
- Auto-save uses localStorage (supported in all modern browsers)

### Email Limitations:

- Mailto URLs have a ~2000 character limit
- Long responses will be truncated with a note
- Uploaded files cannot be attached via mailto (noted in submission)

## 🚨 Troubleshooting

### If bore tunnel isn't working:

```bash
# Kill any existing bore processes
pkill -f bore

# Restart with verbose logging
./bore local 3001 --to bore.pub --port 1143 --log-level debug
```

### If page not found:

1. Ensure Next.js dev server is running: `pnpm run dev`
2. Check that file exists: `ls -la pages/testing/`
3. Try direct file access: `bore.pub:1143/testing/index.html`

### If email doesn't open:

- Users may need to configure default email client
- Provide fallback: "Email feedback to btcinfo@protonmail.com"

## ✅ Ready for Testing!

Once Eric confirms the email address, the testing portal is ready for immediate deployment and use.
