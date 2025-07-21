# Email Subscription System

## Overview

This document describes the email subscription system for the Football Squares platform, designed to work with wallet-only authentication while providing optional email communication channels.

## Architecture

The system consists of three main components:

1. **API Endpoint** (`/api/subscribe`) - Handles subscription requests
2. **Data Storage** (`lib/emailSubscriptions.ts`) - File-based storage for development
3. **Email Service** (`lib/emailService.ts`) - Handles email sending with Proton Mail integration

## Features

- ✅ **Wallet-first approach**: Optional email collection respects user privacy
- ✅ **Source tracking**: Track where subscriptions come from
- ✅ **Duplicate prevention**: Prevents duplicate email subscriptions
- ✅ **Development testing**: Uses Ethereal Email for testing
- ✅ **Production ready**: Proton Mail integration for production
- ✅ **Error handling**: Graceful error handling and user feedback
- ✅ **Loading states**: User-friendly loading indicators

## API Endpoints

### POST /api/subscribe

Subscribe a user to email updates.

**Request Body:**
```json
{
  "email": "user@example.com",
  "walletAddress": "5x...yZ", // optional
  "source": "free_board_popup" // optional, defaults to "unknown"
}
```

**Response (201):**
```json
{
  "message": "Successfully subscribed to email updates",
  "subscriptionId": "uuid"
}
```

**Error Responses:**
- `400`: Invalid email format
- `409`: Email already subscribed
- `500`: Internal server error

## Components

### EmailCapture Component

A reusable React component for capturing email subscriptions.

**Props:**
- `source?: string` - Track subscription source (default: "general")
- `title?: string` - Custom title
- `description?: string` - Custom description

**Usage Examples:**

```tsx
// Basic usage
<EmailCapture />

// Custom configuration for different contexts
<EmailCapture 
  source="free_board_popup"
  title="Get Alerts for New Boards"
  description="Be the first to know when new boards open!"
/>

<EmailCapture 
  source="winners_page"
  title="Get Winner Notifications"
  description="Receive instant notifications when winners are announced."
/>
```

## Data Storage

### Development
- Uses file-based storage (`data/subscriptions.json`)
- Data directory is gitignored for privacy
- Automatic directory creation

### Production Considerations
- Current implementation uses file storage
- Recommended: Migrate to PostgreSQL or MongoDB for production
- Schema is designed to be database-agnostic

### Database Schema

```typescript
interface EmailSubscription {
  id: string;           // UUID
  email: string;        // User's email (unique)
  walletAddress: string | null; // Optional wallet address
  source: string;       // Subscription source
  createdAt: string;    // ISO timestamp
}
```

## Email Service

### Development
- Uses Ethereal Email for testing
- Logs email content to console
- Test URLs provided for viewing emails

### Production
- Integrates with Proton Mail SMTP
- Requires environment variables
- Health check functionality

### Email Templates

The system includes pre-built templates for:

1. **Welcome Email** - Sent when user subscribes
2. **Board Opening Alert** - Notify about new game boards
3. **Winner Announcement** - Notify about game winners

## Environment Variables

Required environment variables:

```env
# Basic Configuration
NODE_ENV=development
EMAIL_FROM=noreply@footballsquares.com

# Proton Mail (Production)
PROTON_SMTP_HOST=smtp.protonmail.com
PROTON_SMTP_PORT=587
PROTON_EMAIL_USER=your-proton-email@protonmail.com
PROTON_EMAIL_PASS=your-proton-app-password
```

## Usage in Different Contexts

### 1. General Newsletter Signup
```tsx
<EmailCapture 
  source="homepage"
  title="Get Weekly NFL Tips"
  description="Weekly strategies and insights delivered to your inbox."
/>
```

### 2. Board-specific Alerts
```tsx
<EmailCapture 
  source="board_entry"
  title="Get Board Updates"
  description="Receive notifications about this specific board."
/>
```

### 3. Winner Notifications
```tsx
<EmailCapture 
  source="winner_page"
  title="Winner Alerts"
  description="Get notified when winners are announced."
/>
```

## Analytics & Tracking

The system tracks:
- Total subscriptions
- Subscriptions by source
- Subscriptions by month
- Wallet vs non-wallet subscribers

Access analytics via:
```typescript
import { getSubscriptionAnalytics } from '@/lib/emailSubscriptions';

const analytics = await getSubscriptionAnalytics();
```

## Privacy & Compliance

- **Opt-in Only**: Users must explicitly subscribe
- **Source Tracking**: For analytics and optimization
- **Unsubscribe Ready**: Email templates include unsubscribe links
- **Data Minimization**: Only collect necessary data
- **Wallet Integration**: Links email to wallet for better UX

## Testing

Run the test suite:
```bash
node tests/email-subscription.test.js
```

The test covers:
- Subscription creation
- Duplicate prevention
- Email service functionality
- Data retrieval

## Deployment Checklist

### Before Production:
1. ✅ Set up Proton Mail business account
2. ✅ Configure environment variables
3. ✅ Test email sending in staging
4. ✅ Set up proper database (recommended)
5. ✅ Configure unsubscribe functionality
6. ✅ Set up email analytics
7. ✅ Test with real wallet addresses

### Proton Mail Setup:
1. Create Proton Mail business account
2. Enable SMTP access
3. Generate app-specific password
4. Configure DNS records (if using custom domain)
5. Test connection with health check

## Future Enhancements

### Planned Features:
- **Unsubscribe API**: Allow users to unsubscribe
- **Email Preferences**: Let users choose email types
- **Segmentation**: Target specific user groups
- **A/B Testing**: Test different email content
- **Analytics Dashboard**: Visual analytics interface
- **Database Migration**: Move to production database

### Integration Opportunities:
- **Ceramic Network**: Store preferences on-chain
- **Solana Programs**: Trigger emails from smart contracts
- **Web3 Messaging**: XMTP integration for wallet-to-wallet messaging
- **Push Notifications**: Browser notifications for wallet users

## Troubleshooting

### Common Issues:

1. **TypeScript Import Errors**
   - Ensure `@/` path mapping is configured in `tsconfig.json`
   - Check file extensions match imports

2. **Email Not Sending**
   - Check environment variables
   - Verify Proton Mail credentials
   - Run health check: `await emailService.healthCheck()`

3. **File Storage Issues**
   - Ensure `data/` directory permissions
   - Check disk space
   - Verify JSON file format

4. **Wallet Integration**
   - Ensure wallet is connected before accessing `publicKey`
   - Handle wallet disconnection gracefully

### Debug Commands:
```bash
# Test email service
node -e "const {getEmailService} = require('./lib/emailService'); getEmailService().sendWelcomeEmail('test@example.com')"

# Check subscriptions
node -e "const {getAllSubscriptions} = require('./lib/emailSubscriptions'); getAllSubscriptions().then(console.log)"
```

## Support

For issues or questions:
1. Check this documentation
2. Review error logs
3. Test with development environment
4. Verify environment variables
5. Check Proton Mail service status

---

*This system is designed to scale with your platform while maintaining user privacy and providing excellent user experience.*