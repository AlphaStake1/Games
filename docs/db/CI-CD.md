# CI/CD for the Indexer

This document provides an example of a CI/CD pipeline for building, testing, and deploying the Subsquid indexer.

## GitHub Actions Workflow

Here is a sample GitHub Actions workflow that can be used to automate the deployment process. This workflow triggers on pushes to the `main` branch.

```yaml
# .github/workflows/deploy-indexer.yml
name: Deploy Indexer

on:
  push:
    branches:
      - main

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18

      - name: Install dependencies
        run: npm ci

      - name: Build the processor
        run: sqd build

      - name: Log in to GitHub Container Registry
        uses: docker/login-action@v2
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Build and push Docker image
        uses: docker/build-push-action@v4
        with:
          context: .
          push: true
          tags: ghcr.io/${{ github.repository }}/indexer:latest

      - name: Deploy to Subsquid Cloud
        env:
          SQUID_API_KEY: ${{ secrets.SQUID_API_KEY }}
        run: npx sqd deploy . --org my-org
```

### Secrets

You will need to configure the following secrets in your GitHub repository settings:

- `SQUID_API_KEY`: Your API key for Subsquid Cloud.

## Build Status Badges

You can add badges to your `README.md` to show the status of your builds.

```markdown
[![Deploy Indexer](https://github.com/<YOUR_ORG>/<YOUR_REPO>/actions/workflows/deploy-indexer.yml/badge.svg)](https://github.com/<YOUR_ORG>/<YOUR_REPO>/actions/workflows/deploy-indexer.yml)
```
