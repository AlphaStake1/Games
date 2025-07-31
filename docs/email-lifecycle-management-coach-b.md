# Email Lifecycle Management for Tuta Free Plan - Coach B

## Overview

This system manages Coach B's Tuta email account (1GB free plan) with intelligent deletion policies to prevent storage overflow while preserving important player communications.

## Account Details

- **Email**: Coach-B@tutamail.com
- **Plan**: Tuta Free (1GB storage)

## Retention Policies

To ensure business continuity and compliance, emails are categorized and assigned a retention period. High-priority emails are archived before deletion.

### High Priority (Archive Before Delete)

- **Player Feedback**: 90 days
- **Player Inquiry**: 60 days

### Medium Priority

- **Newsletter Campaign**: 30 days
- **System Alerts**: 21 days

### Low Priority (Quick Delete)

- **Promotional Campaign**: 14 days
- **Bounce Notifications**: 7 days
- **Spam**: 3 days

## Automated Management

The system runs automated cleanups to keep storage within limits.

- **Warning Threshold**: 85% (Triggers standard cleanup)
- **Critical Threshold**: 95% (Triggers emergency cleanup, reducing retention by 50%)
- **Cleanup Schedule**: Runs automatically every 6 hours.

## How It Works

1.  **Email Categorization**: Inbound and outbound emails are automatically categorized based on their content and subject.
2.  **Storage Monitoring**: The system continuously monitors the Tuta account's storage usage.
3.  **Proactive Cleanup**: When storage exceeds the warning threshold, the system deletes the oldest, lowest-priority emails first.
4.  **Emergency Cleanup**: If storage hits the critical threshold, a more aggressive cleanup is performed.
5.  **Archiving**: High-priority emails are archived to an external location before being deleted from the Tuta account.
