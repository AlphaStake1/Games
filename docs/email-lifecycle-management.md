# Email Lifecycle Management for Tuta Free Plan

## Overview

This system manages OC-Phil's Tuta email account (1GB free plan) with intelligent deletion policies to prevent storage overflow while preserving important communications.

## Account Details

- **Email**: OC-Phil@tutamail.com
- **Plan**: Tuta Free (1GB storage)
- **Recovery Code**: Available in secure configuration

## Retention Policies

### High Priority (Archive Before Delete)

- **Transfer Confirmations**: 90 days
- **CBL Applications**: 60 days
- **Dispute Resolutions**: 120 days

### Medium Priority (Standard Retention)

- **Player Notifications**: 30 days
- **CBL Communications**: 45 days (archived)
- **System Alerts**: 21 days

### Low Priority (Quick Delete)

- **Promotional Emails**: 14 days
- **Automated Reports**: 7 days
- **Spam/Filtered**: 3 days
- **Bounce Notifications**: 7 days

## Storage Thresholds

- **85%**: Warning threshold - standard cleanup
- **95%**: Critical threshold - emergency cleanup
- **Emergency Mode**: Reduces all retention by 50%

## Automatic Features

### Cleanup Schedule

- Runs every 6 hours
- Monitors storage utilization
- Triggers appropriate cleanup level

### Email Categorization

- Automatic categorization of inbound/outbound emails
- Smart retention based on content and sender
- Prioritizes important business communications

### Storage Monitoring

- Real-time storage usage tracking
- Proactive cleanup before limits reached
- Email size estimation and optimization

## Usage Examples

### Initialize Service

```typescript
import TutaEmailService from '@/lib/services/tutaEmailService';

const tutaService = new TutaEmailService();
await tutaService.authenticate();
tutaService.initializeWithLifecycle(archiveService, database);
```

### Send Transfer Confirmation

```typescript
await tutaService.sendTransferConfirmation(
  'player@example.com',
  'PlayerName',
  'Old Community',
  'New Community',
  'NEWCBL2025',
);
```

### Check Storage Status

```typescript
const stats = await tutaService.getLifecycleStats();
console.log(`Storage: ${stats.storageStats.utilizationPercent}%`);
```

### Manual Cleanup

```typescript
const result = await tutaService.performManualCleanup(true);
console.log(`Freed ${result.storageFreed}MB`);
```

## Email Templates

### Community Transfer Confirmation

- **To**: Transferred player
- **Category**: transfer_confirmations (90 day retention)
- **Priority**: High
- **Archive**: Yes

### CBL New Member Notification

- **To**: CBL leader
- **Category**: cbl_communications (45 day retention)
- **Priority**: Normal
- **Archive**: Yes

### Storage Warnings

- **To**: System administrators
- **Category**: system_alerts (21 day retention)
- **Priority**: High based on severity

## Storage Optimization Tips

### Immediate Actions (90%+ full)

1. Run emergency cleanup
2. Archive transfer confirmations externally
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

### Community Transfer System

- Automatically sends confirmation emails
- Categorizes for proper retention
- Integrates with wallet signature flow

### Coach B Responses

- Sends follow-up emails for complex issues
- Archives important dispute communications
- Maintains audit trail for 120 days

### CBL Milestone Notifications

- Notifies CBLs of achievements and rewards
- Archives for business record keeping
- Medium priority retention (45 days)

## Monitoring & Alerts

### Storage Alerts

- 85%: Warning email to admins
- 90%: Daily alerts until resolved
- 95%: Critical alerts every 6 hours
- 98%: Emergency cleanup activation

### Cleanup Reports

- Daily storage utilization reports
- Weekly cleanup activity summaries
- Monthly retention policy effectiveness reviews
- Quarterly storage trend analysis

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

This system ensures OC-Phil's Tuta account stays within the 1GB limit while preserving all business-critical communications and maintaining full audit trails for compliance and dispute resolution.
