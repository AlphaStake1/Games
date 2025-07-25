# Coach B ProtonMail Setup - Todo List

## Overview

This document contains the requirements and steps needed to set up a ProtonMail account for Coach B the Chatbot to enable email functionality.

## Requirements Checklist

### 1. ProtonMail Account Creation

- [ ] Visit [proton.me](https://proton.me) to create account
- [ ] Choose appropriate email address (e.g., `coach.b@proton.me`)
- [ ] **IMPORTANT**: Purchase paid subscription (Mail Plus, Unlimited, or Business plan)
- [ ] Note: ProtonMail Bridge requires paid subscription to function

### 2. Proton Bridge Installation

- [ ] Download [Proton Mail Bridge](https://proton.me/mail/download#bridge)
- [ ] Install on server/local environment
- [ ] Verify [system requirements](https://proton.me/support/operating-systems-supported-bridge)
- [ ] Bridge creates local SMTP/IMAP server for encryption/decryption

### 3. Bridge Configuration

- [ ] Configure Bridge with Coach B's ProtonMail credentials
- [ ] Bridge will generate unique SMTP password (different from login password)
- [ ] Test Bridge connection
- [ ] Note down generated SMTP credentials

### 4. Environment Variables Setup

Update these environment variables:

```env
SMTP_HOST=127.0.0.1
SMTP_PORT=1025
SMTP_USER=coach.b@proton.me  # Coach B's ProtonMail address
SMTP_PASS=<bridge-password>  # Generated by Proton Bridge (NOT login password)
FROM_EMAIL=coach.b@proton.me
```

### 5. Integration Testing

- [ ] Update `.env` file with new credentials
- [ ] Test email connection using existing `EmailAgent.testEmailConnection()`
- [ ] Run `EmailAgent.healthCheck()` to verify ongoing connectivity
- [ ] Send test email to verify full functionality

### 6. Coach B Email Templates (Optional Enhancement)

Consider adding Coach B-specific email templates:

- [ ] Crypto guidance responses
- [ ] Solana wallet setup instructions
- [ ] Football Squares help emails
- [ ] Fantasy football analysis notifications

## Technical Notes

### Current Infrastructure Compatibility

The existing [`EmailAgent`](../agents/EmailAgent/index.ts) is already configured for Proton Bridge:

- Uses STARTTLS (not SSL)
- Configured for local Bridge connection
- Has `rejectUnauthorized: false` for local Bridge certificates
- Includes proper error handling and logging

### Security Features

- **Bridge Password**: Uses unique Bridge-generated password
- **Local Encryption**: Bridge handles all encryption/decryption locally
- **No Key Storage**: Bridge doesn't permanently store PGP keys
- **TLS Security**: All communications use STARTTLS encryption

### Testing Methods Available

- `testEmailConnection()` - SMTP verification
- `healthCheck()` - Ongoing monitoring
- Event emitters for email tracking
- Comprehensive error handling and logging

## Implementation Priority

1. **HIGH**: Create ProtonMail account with paid subscription
2. **HIGH**: Install and configure Proton Bridge
3. **HIGH**: Update environment variables and test connection
4. **MEDIUM**: Create Coach B-specific email templates
5. **LOW**: Add Coach B email analytics and reporting

## Notes

- Bridge must be running continuously for email functionality
- Bridge credentials are different from ProtonMail login credentials
- Consider setting up Bridge as a system service for production
- Monitor Bridge logs for any connection issues

## Status

- [ ] Todo list created and saved
- [ ] ProtonMail account setup - PENDING
- [ ] Bridge installation - PENDING
- [ ] Integration testing - PENDING
- [ ] Production deployment - PENDING

---

_Created: 2025-07-14_
_Last Updated: 2025-07-14_
