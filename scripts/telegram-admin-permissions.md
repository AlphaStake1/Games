# OC Phil Telegram Admin Permissions Guide

## 🎯 Recommended Minimal Permissions

### Groups (CBL Communities)

**Essential Permissions:**

- ✅ **Delete Messages** - Remove spam, inappropriate content
- ✅ **Pin Messages** - Pin important board announcements
- ✅ **Read Message History** - Access previous messages for context

**Optional Permissions (CBL Choice):**

- ⚠️ **Ban Users** - Only if CBL wants automated moderation
- ⚠️ **Restrict Members** - Temporary timeouts for rule violations
- ⚠️ **Manage Topics** - For communities using topic organization

**AVOID These Permissions:**

- ❌ **Add Admins** - Security risk
- ❌ **Invite Users via Link** - Prevents spam control
- ❌ **Change Group Info** - Bot shouldn't modify group details
- ❌ **Post Stories** - Not needed for squares functionality

### Channels (Announcement Channels)

**Essential Permissions:**

- ✅ **Post Messages** - Send board updates and celebrations
- ✅ **Edit Messages** - Update live board status

**Optional Permissions:**

- ⚠️ **Delete Messages** - Clean up outdated announcements

**AVOID These Permissions:**

- ❌ **Add Admins** - Security risk
- ❌ **Edit Channel Info** - Bot shouldn't change channel details
- ❌ **Invite Users via Link** - Manual control preferred
- ❌ **Manage Live Streams** - Not relevant to squares

## 🛡️ Security Best Practices

### 1. Principle of Least Privilege

Grant only the minimum permissions needed for functionality.

### 2. Regular Permission Audits

Review bot permissions monthly:

```bash
# Check what permissions OC Phil currently has
/mybots -> @OC_Phil_bot -> Bot Settings -> Group Admin Rights
```

### 3. Monitoring & Alerts

Set up alerts for admin actions:

- Message deletions
- User bans/restrictions
- Permission changes

### 4. Backup Admin Access

Always maintain human admin access:

- At least 2 human admins per group
- Document admin credentials securely
- Regular access verification

## 🚨 If Bot Gets Compromised

### Immediate Actions:

1. **Revoke Bot Token**

   ```
   /revoke -> @OC_Phil_bot
   ```

2. **Remove Admin Rights**
   - Group Settings → Administrators → Remove @OC_Phil_bot

3. **Review Recent Actions**
   - Check message history for deletions
   - Review member list for unauthorized bans
   - Audit permission changes

4. **Generate New Token**

   ```
   /newtoken -> @OC_Phil_bot
   ```

5. **Update Environment Variables**
   ```bash
   OC_PHIL_BOT_TOKEN=new_token_here
   ```

## 🔄 Permission Configuration Commands

### Remove All Admin Rights

```
# In group chat as admin:
/setpermissions @OC_Phil_bot
[Uncheck all boxes]
```

### Set Minimal Recommended Rights

```
# In group chat as admin:
/setpermissions @OC_Phil_bot
✅ Delete Messages
✅ Pin Messages
❌ Everything else
```

### Check Current Permissions

```
# View bot's current permissions:
Group Settings → Administrators → @OC_Phil_bot
```

## 🎯 Functionality Impact

### With Minimal Permissions:

- ✅ All core features work
- ✅ Board creation and management
- ✅ Tips and strategy advice
- ✅ Celebration messages
- ✅ Milestone notifications
- ✅ Community engagement

### What You Lose by Reducing Rights:

- ❌ Automated spam removal (manual moderation needed)
- ❌ Automated user banning (human judgment better anyway)
- ❌ Channel info updates (probably not needed)

### What You Gain:

- ✅ Enhanced security
- ✅ Reduced risk of bot abuse
- ✅ Clear accountability for admin actions
- ✅ Community trust in bot behavior

## ✅ Action Items

1. **Audit Current Permissions**
   - List all current admin rights for @OC_Phil_bot
   - Document which groups/channels have admin access

2. **Reduce to Minimal Set**
   - Keep only essential permissions listed above
   - Remove high-risk permissions immediately

3. **Test Functionality**
   - Verify all core features still work
   - Test board creation, tips, celebrations

4. **Monitor for Issues**
   - Watch for permission-related errors in logs
   - Be ready to grant additional rights if needed

5. **Document Changes**
   - Record what permissions were changed and when
   - Share with other admins

Remember: **Functionality over convenience, security over features!**
