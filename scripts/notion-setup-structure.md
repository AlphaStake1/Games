# Notion CBL Playbook Structure Setup

## 📚 Required Notion Pages Structure

Create this exact page structure in your Notion workspace for OC Phil's tips integration:

### **1. Main CBL Playbook Database/Pages**

```
📁 CBL Playbooks (Parent Page)
├── 🏈 Telegram CBL Playbook
├── 🎮 Discord CBL Playbook
├── 🐦 Twitter CBL Playbook
├── 📘 Facebook CBL Playbook
├── 📸 Instagram CBL Playbook
├── 🏘️ Existing Community Playbook
└── 🎯 General Strategy Guides
```

### **2. Platform-Specific Playbook Pages**

#### **Telegram CBL Playbook**

Create page with these sections (use H2 headers):

- Quick Start
- Bot Setup
- Automation
- Growth Tactics
- Troubleshooting

#### **Discord CBL Playbook**

Create page with these sections:

- Server Setup
- Bot Integration
- Voice Strategy
- Growth Tactics

#### **Twitter CBL Playbook**

Create page with these sections:

- Profile Setup
- Content Strategy
- Hashtag Strategy
- Engagement

#### **Facebook CBL Playbook**

Create page with these sections:

- Page Setup
- Group Strategy
- Live Video
- Local Marketing

#### **Instagram CBL Playbook**

Create page with these sections:

- Profile Setup
- Content Pillars
- Reels Strategy
- Stories Strategy

#### **Existing Community Playbook**

Create page with these sections:

- Assessment
- Integration
- Migration

### **3. General Strategy Pages**

Create separate pages for:

- Pricing Psychology Guide
- Content Calendar Template
- Milestone Tracking Guide

## 🔗 **Get Page URLs**

After creating each page, you need to:

1. **Click "Share" on each page**
2. **Copy the page URL**
   - Format: `https://www.notion.so/workspace/Page-Name-123abc456def789`
3. **Share with your integration**
   - Click "Share" → "Invite" → Select "OC Phil CBL Tips" integration
   - Grant "Read" access

## 📝 **Sample Content Structure**

### Example: Telegram Quick Start Page

```markdown
# Telegram CBL Quick Start

## Getting Started with Telegram

Your first week as a Telegram CBL...

## Setting Up Your Community

1. Create your Telegram group
2. Set group rules and description
3. Add @OC_Phil_bot as admin

## Initial Content Strategy

- Welcome message template
- Community rules
- First board announcement

## Growth Tactics

- Cross-platform promotion
- Member referral system
- Content calendar planning

## Next Steps

- Review advanced automation
- Set up milestone tracking
- Connect with other CBLs
```

## 🎯 **URLs You'll Need to Update**

In `/lib/cbl/ocPhilTipsIntegration.ts`, replace these placeholder URLs with your actual Notion page URLs:

```typescript
export const NOTION_PLAYBOOK_URLS = {
  // Replace these with your actual Notion URLs:
  telegram: 'https://notion.so/your-workspace/telegram-cbl-playbook-abc123',
  discord: 'https://notion.so/your-workspace/discord-cbl-playbook-def456',
  twitter: 'https://notion.so/your-workspace/twitter-cbl-playbook-ghi789',
  facebook: 'https://notion.so/your-workspace/facebook-cbl-playbook-jkl012',
  instagram: 'https://notion.so/your-workspace/instagram-cbl-playbook-mno345',
  existing:
    'https://notion.so/your-workspace/existing-community-playbook-pqr678',

  // Section URLs (use anchors):
  sections: {
    telegram: {
      quickStart:
        'https://notion.so/your-workspace/telegram-cbl-playbook-abc123#quick-start',
      botSetup:
        'https://notion.so/your-workspace/telegram-cbl-playbook-abc123#bot-setup',
      // ... etc
    },
  },
};
```

## ✅ **Checklist**

- [ ] Create Notion integration at notion.so/my-integrations
- [ ] Copy integration token
- [ ] Create all 6 platform playbook pages
- [ ] Create 3 general strategy pages
- [ ] Add content to each page (at least basic structure)
- [ ] Share each page with your integration
- [ ] Copy all page URLs
- [ ] Update NOTION_PLAYBOOK_URLS in code
- [ ] Test OC Phil /tips command

## 🔄 **Integration Testing**

After setup, test with:

```bash
# Test Notion API access
curl -X GET 'https://api.notion.com/v1/pages/YOUR_PAGE_ID' \
  -H 'Authorization: Bearer YOUR_INTEGRATION_TOKEN' \
  -H 'Notion-Version: 2022-06-28'
```

## 📋 **Content Recommendations**

### High-Priority Pages to Create First:

1. **Telegram Quick Start** - Most CBLs start here
2. **Pricing Psychology** - Critical for revenue
3. **General Strategy** - Universal tips

### Can Create Later:

- Platform-specific advanced guides
- Detailed troubleshooting sections
- Advanced automation guides

The integration will work with basic pages and can be expanded over time!
