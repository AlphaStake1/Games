# Email Lifecycle Management for Tuta Free Plan - Coach B

## Overview

This system manages Coach B's Tuta email account (1GB free plan) with intelligent deletion policies to prevent storage overflow while preserving important player communications.

## Account Details

- **Email**: Coach-B@tutamail.com
- **Password**: CoachB00!
- **Secret Key**: b317 5ad1 12c2 f15d 0727 a542 a8e1 9415 be80 419e 5a23 7463 aa84 a95e 9c0f 2bd3
- **Plan**: Tuta Free (1GB storage)

## Retention Policies

To ensure business continuity and compliance, emails are categorized and assigned a retention period. High-priority emails are archived before deletion.

### High Priority (Archive Before Delete)

- **Player Feedback**: 90 days
- **Player Inquiry**: 60 days

### Medium Priority

- **Game Update Campaign**: 30 days
- **System Alerts**: 21 days

### Low Priority (Quick Delete)

- **Promotional Campaign**: 14 days
- **Verification Email**: 7 days
- **Bounce Notifications**: 7 days
- **Spam**: 3 days

## Automated Management

The system runs automated cleanups to keep storage within limits.

- **Warning Threshold**: 85% (Triggers standard cleanup)
- **Critical Threshold**: 95% (Triggers emergency cleanup, reducing retention by 50%)
- **Cleanup Schedule**: Runs automatically every 6 hours

## Core Features

### Player Email Management

- **Contact Database**: Secure storage of player contact information
- **Wallet Authentication**: Only Coach B can access the admin system
- **Batch Email Sending**: Send campaigns to segmented player groups
- **Email Analytics**: Track open rates, delivery rates, and engagement
- **Template System**: Reusable email templates for common communications

### Email Categorization

1. **Player Inquiry**: Direct questions and support requests from players
2. **Player Feedback**: Reviews, suggestions, and testimonials
3. **Game Update Campaign**: Newsletters about new features and updates
4. **Promotional Campaign**: Special offers and marketing emails
5. **System Alert**: Important announcements and notifications
6. **Verification Email**: Account verification and confirmation emails
7. **Bounce Notification**: Delivery failure notifications
8. **Spam**: Unwanted or filtered emails

### Storage Monitoring

- Real-time storage usage tracking
- Proactive cleanup before limits reached
- Email size estimation and optimization
- Intelligent categorization of inbound/outbound emails

## Usage Examples

### Initialize Coach B Service

```typescript
import { coachBTutaEmailService } from '@/lib/services/tutaEmailServiceCoachB';

// Initialize with authentication and cleanup scheduling
await coachBTutaEmailService.initialize();
```

### Send Player Verification Email

```typescript
await coachBTutaEmailService.sendPlayerVerificationEmail(
  'player@example.com',
  'PlayerName',
  'verification_token_123',
);
```

### Send Game Update Campaign

```typescript
await coachBTutaEmailService.sendGameUpdateCampaign(
  'player@example.com',
  'PlayerName',
  'advanced',
  'New Features Available!',
  'Hi {playerName}, check out these new features for {gameLevel} players...',
);
```

### Check Storage Status

```typescript
const stats = await coachBTutaEmailService.getLifecycleStats();
console.log(`Storage: ${stats.storageStats.utilizationPercent}%`);
```

### Manual Cleanup

```typescript
const result = await coachBTutaEmailService.performManualCleanup(true);
console.log(`Freed ${result.storageFreed}MB`);
```

## Email Templates

### Player Verification Email

- **To**: New player subscribers
- **Category**: system_alerts (21 day retention)
- **Priority**: Normal
- **Archive**: No

### Game Update Newsletter

- **To**: All active players or segmented groups
- **Category**: player_communications (30 day retention)
- **Priority**: Normal
- **Archive**: No

### Player Support Response

- **To**: Players who submitted inquiries
- **Category**: player_communications (60 day retention)
- **Priority**: High
- **Archive**: Yes

## Storage Optimization Tips

### Immediate Actions (90%+ full)

1. Run emergency cleanup
2. Archive player feedback externally
3. Delete promotional emails manually
4. Consider upgrading to paid Tuta plan

### Preventive Measures (70-85% full)

1. Enable automatic cleanup
2. Review retention policies monthly
3. Archive important emails to external storage
4. Monitor large attachments

### Best Practices

- Use concise email subjects and bodies
- Avoid large attachments when possible
- Regularly review and update retention policies
- Monitor storage trends weekly

## Integration Points

### Player Email System

- Automatically sends verification emails
- Categorizes for proper retention
- Integrates with batch campaign system

### Admin Dashboard

- Secure wallet-based authentication for Coach B
- Campaign composer with personalization
- Contact management and analytics
- Template system for reusable content

### Lifecycle Management

- Automatic cleanup every 6 hours
- Intelligent email categorization
- Storage threshold monitoring
- Emergency cleanup procedures

## Monitoring & Alerts

### Storage Alerts

- 85%: Warning email to Coach B
- 90%: Daily alerts until resolved
- 95%: Critical alerts every 6 hours
- 98%: Emergency cleanup activation

### Cleanup Reports

- Daily storage utilization reports
- Weekly cleanup activity summaries
- Monthly retention policy effectiveness reviews
- Quarterly storage trend analysis

## API Integration

### Player Email Service

The `PlayerEmailService` class provides comprehensive email management:

```typescript
import PlayerEmailService from '@/lib/services/playerEmailService';
import { coachBTutaEmailService } from '@/lib/services/tutaEmailServiceCoachB';

const playerEmailService = new PlayerEmailService(
  database,
  coachBTutaEmailService,
);

// Authenticate Coach B
const session = await playerEmailService.authenticateCoachB(
  walletAddress,
  signature,
);

// Add new player contact
const contact = await playerEmailService.addPlayerContact({
  playerName: 'John Doe',
  emailAddress: 'john@example.com',
  gameLevel: 'intermediate',
  totalGamesPlayed: 15,
  preferences: {
    emailNotifications: true,
    gameUpdates: true,
    promotionalEmails: false,
    systemAlerts: true,
    batchCommunications: true,
  },
});

// Send batch campaign
const campaign = await playerEmailService.createCampaign({
  name: 'January Updates',
  subject: 'New Features Available',
  body: 'Hi {playerName}, check out these updates for {gameLevel} players...',
  targetAudience: 'all',
});

const result = await playerEmailService.sendBatchCampaign(campaign.id);
```

## Security Features

- **Wallet Authentication**: Only Coach B's verified wallet can access admin functions
- **Session Management**: Secure session handling with expiration
- **Security Logging**: All actions are logged with IP addresses and timestamps
- **Permission System**: Granular permissions for different operations
- **Data Encryption**: All email content is stored encrypted

## Troubleshooting

### Storage Still Full After Cleanup

1. Check for large attachments
2. Verify cleanup policies are working
3. Consider external archiving
4. Evaluate upgrading to paid plan

### Important Emails Getting Deleted

1. Review categorization logic
2. Adjust retention policies
3. Implement manual preservation tags
4. Use external archiving for critical items

### Performance Issues

1. Reduce cleanup frequency if needed
2. Process deletions in smaller batches
3. Schedule cleanup during low-usage periods
4. Monitor API rate limits

## Future Considerations

### Paid Plan Upgrade

- **Tuta Premium**: €36/year for 10GB
- **Tuta Business**: €60/year for 20GB + custom domain
- Eliminates storage constraints
- Allows longer retention periods

### External Archiving Options

- AWS S3 for long-term storage
- Google Drive backup integration
- Local file system archiving
- Database backup of important emails

### Enhanced Features

- Machine learning for better categorization
- Predictive storage usage modeling
- Integration with other email providers
- Advanced search and retrieval capabilities

---

This system ensures Coach B's Tuta account stays within the 1GB limit while preserving all important player communications and maintaining full audit trails for compliance and player support.
