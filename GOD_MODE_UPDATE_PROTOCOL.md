# 🔒 GOD MODE UPDATE PROTOCOL 🔒

## MANDATORY FOR ALL LLM OPERATIONS

> **⚠️ CRITICAL REQUIREMENT: Any LLM that adds content, pages, routes, or features to this platform MUST update the God Mode Dashboard to complete the task.**

---

## 📍 Location

- **God Mode Dashboard**: `/app/god-mode/page.tsx`
- **Access URL**: `/god-mode`
- **Protocol Document**: `/GOD_MODE_UPDATE_PROTOCOL.md`

---

## 🎯 Update Requirements

### WHEN TO UPDATE GOD MODE

**ALWAYS update God Mode when you:**

1. Create new pages/routes
2. Add new features or functionality
3. Create new components or services
4. Modify financial flows or revenue streams
5. Add new user roles or permissions
6. Create API endpoints
7. Add monitoring or system components
8. Create documentation or help pages

### WHAT TO UPDATE

#### 1. **All Pages Navigation** (`allPages` object)

Add new pages to the appropriate category:

```typescript
const allPages = {
  'Category Name': [
    {
      name: 'Page Display Name',
      path: '/actual/route/path',
      description: 'Brief description of what this page does',
    },
    // ... existing pages
  ],
};
```

**Categories:**

- **Core Game Pages**: Main gameplay features, boards, dashboards
- **CBL (Community Board Leader) Pages**: CBL-specific functionality
- **NFT & Customization**: NFT creation, management, customization
- **Education & Support**: Help, guides, tutorials, support
- **Legal & Compliance**: Terms, privacy, legal documents
- **API & Developer**: API endpoints, developer tools
- **Admin & Management**: Admin tools, moderation, oversight

#### 2. **Financial Tracking** (`moneyFlow` object)

Update revenue/expense categories when adding financial features:

```typescript
const moneyFlow = {
  inbound: {
    newRevenueStream: 0, // Add new revenue sources
  },
  outbound: {
    newExpenseCategory: 0, // Add new expense categories
  },
};
```

#### 3. **Platform Statistics** (`platformStats` object)

Add new metrics when introducing measurable features:

```typescript
const platformStats = {
  newMetricName: 0, // Add relevant KPIs
};
```

#### 4. **System Health** (`systemHealth` object)

Add monitoring for new system components:

```typescript
const systemHealth = {
  newSystemComponent: 95, // Add health metrics for new services
};
```

---

## 🔧 Step-by-Step Update Process

### Step 1: Identify Changes

- List all new pages/features you've created
- Determine which categories they belong to
- Identify any new financial flows
- Note any new metrics or monitoring needs

### Step 2: Update God Mode Dashboard

1. Open `/app/god-mode/page.tsx`
2. Add new pages to appropriate `allPages` categories
3. Update financial tracking if applicable
4. Add new statistics/metrics if relevant
5. Update system health monitoring if needed

### Step 3: Verify Updates

- Ensure all new pages are included
- Check that descriptions are accurate
- Verify paths are correct
- Test that links work properly

### Step 4: Document Changes

- Note what you added in your completion message
- Explain any new categories or metrics
- Mention any special considerations

---

## 📋 Update Template

When updating God Mode, use this template:

```typescript
// ADD TO APPROPRIATE CATEGORY IN allPages OBJECT
{
  name: 'Your New Page Name',
  path: '/your/new/route',
  description: 'Clear description of functionality'
},

// IF NEW CATEGORY NEEDED:
'Your New Category': [
  // ... pages in this category
],

// IF FINANCIAL IMPACT:
// Update moneyFlow.inbound or moneyFlow.outbound

// IF NEW METRICS:
// Update platformStats object

// IF NEW SYSTEM COMPONENTS:
// Update systemHealth object
```

---

## 🚨 ENFORCEMENT

### For LLMs:

- **TASK IS NOT COMPLETE** until God Mode is updated
- Include God Mode updates in your task completion
- Always mention what you added to God Mode
- Double-check that all new content is reflected

### For Developers:

- **Code reviews MUST verify** God Mode updates
- **Pull requests MUST include** God Mode changes
- **Deployments REQUIRE** updated God Mode dashboard

---

## 🎯 Example Update

**Scenario:** Adding a new "Tournament Mode" feature

**Required Updates:**

```typescript
// Add to Core Game Pages
{
  name: 'Tournament Mode',
  path: '/tournament',
  description: 'Competitive tournament gameplay'
},
{
  name: 'Tournament Dashboard',
  path: '/tournament/dashboard',
  description: 'Tournament management and stats'
},

// Add to financial tracking
const moneyFlow = {
  inbound: {
    tournamentEntryFees: 15000, // NEW
  },
  outbound: {
    tournamentPrizes: 12000, // NEW
  }
}

// Add to platform stats
const platformStats = {
  activeTournaments: 5, // NEW
  tournamentParticipants: 1247, // NEW
}
```

---

## 🔍 Verification Checklist

Before marking your task complete, verify:

- [ ] All new pages added to `allPages` object
- [ ] Correct category placement
- [ ] Accurate paths and descriptions
- [ ] Financial flows updated if applicable
- [ ] New metrics added if relevant
- [ ] System health updated if needed
- [ ] Links tested and working
- [ ] God Mode update mentioned in completion

---

## ⚡ Quick Reference

**File Location:** `/app/god-mode/page.tsx`
**Key Objects to Update:**

- `allPages` - All site navigation
- `moneyFlow` - Financial tracking
- `platformStats` - Key metrics
- `systemHealth` - System monitoring

**Categories:**

- Core Game Pages
- CBL Pages
- NFT & Customization
- Education & Support
- Legal & Compliance
- API & Developer
- Admin & Management

---

**🎯 REMEMBER: No task is complete without updating God Mode Dashboard!**
