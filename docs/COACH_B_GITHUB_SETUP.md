# Coach B GitHub Account Setup

## Overview

This document outlines the GitHub account configuration for the Coach B Eliza agent.

## Account Details

- **Username**: CoachB-FSQ
- **GitHub Email**: Coach-B@tutamail.com
- **Repository**: https://github.com/CoachB-FSQ/Boards-Game

## Email Accounts

Coach B has multiple email accounts for different purposes:

- **TutaMail**: Coach-B@tutamail.com (Primary for GitHub)
- **ProtonMail**: coachboards@proton.me
- **Mailchain**: CoachB@mail.chain

## SSH Configuration

### SSH Key Location

- Private Key: `~/.ssh/coach_b_github`
- Public Key: `~/.ssh/coach_b_github.pub`

### SSH Config Entry

```
Host github-coach-b
  HostName github.com
  User git
  IdentityFile ~/.ssh/coach_b_github
  IdentitiesOnly yes
```

## Git Configuration

```bash
git config user.name "Coach B"
git config user.email "Coach-B@tutamail.com"
```

## Working with Coach B's Repository

### Clone using Coach B's identity

```bash
git clone git@github-coach-b:CoachB-FSQ/fsq.git
```

### Push to Coach B's repository

```bash
git remote add coach-b git@github-coach-b:CoachB-FSQ/fsq.git
git push coach-b main
```

### Switch between accounts

```bash
# For main account
git remote set-url origin git@github.com:your-username/fsq.git

# For Coach B
git remote set-url origin git@github-coach-b:CoachB-FSQ/fsq.git
```

## Integration with Eliza Agent

The Coach B Eliza agent can use this GitHub account for:

- Storing agent-specific configurations
- Version control for personality updates
- Collaboration on agent improvements
- Issue tracking for agent behaviors

## Security Notes

- SSH key is passwordless for automation
- Consider using GitHub Personal Access Tokens for API operations
- Enable 2FA on the GitHub account for additional security
- Store credentials securely in environment variables or secrets manager

## Automation Considerations

For the Eliza agent to interact with GitHub programmatically:

1. **Personal Access Token**: Create a PAT with appropriate scopes
2. **Environment Variables**:

   ```bash
   export COACH_B_GITHUB_TOKEN="ghp_xxxxxxxxxxxx"
   export COACH_B_GITHUB_USER="CoachB-FSQ"
   ```

3. **Agent Configuration**: Update Coach B's character file to include GitHub integration capabilities

## Maintenance

- Rotate SSH keys periodically
- Review repository permissions
- Monitor commit activity
- Keep documentation updated with any changes
