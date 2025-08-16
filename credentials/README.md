# Credentials Directory

This directory stores sensitive credential files for the Football Squares application.

## Files (not committed to git):

- `coach-b-service-account.json` - Google Cloud Service Account credentials
- `*.key` - SSH keys and private keys
- `*.env` - Environment-specific credential files

## Security Notes:

- All credential files are git-ignored
- Use absolute paths in environment variables
- Never commit credential files
- Rotate credentials regularly

## Usage:

Set environment variable to reference files here:

```bash
GOOGLE_APPLICATION_CREDENTIALS=/home/new-msi/workspace/fsq/credentials/coach-b-service-account.json
```
