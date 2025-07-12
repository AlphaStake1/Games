# Security Policy

This document outlines security procedures and practices for the Football Squares project.

## Reporting a Vulnerability

Please report any security vulnerabilities to `security@example.com`. We will address all valid reports in a timely manner.

## Anonymity & Key Hygiene

To maintain user privacy and operational security, we recommend the following practices:

1.  **Wallet Funding**: When funding wallets for use with this platform (either as a user or an operator), we recommend using a Decentralized Exchange (DEX) to acquire funds. Avoid using Centralized Exchanges (CEXs) that require Know Your Customer (KYC) identity verification, as this can link your real-world identity to your on-chain activity.

2.  **Server OpSec**: For self-hosted deployments, run the Docker hosts behind a VPN like WireGuard or through an anonymizing network like Tor. When paying for Virtual Private Servers (VPS), consider using cryptocurrencies to preserve privacy.

3.  **Avoid Public GRT Staking**: While The Graph is a powerful indexing tool, its Solana Substreams module is not yet fully permissionless. Until it is, avoid staking GRT publicly in a way that could link your operational wallets to a public identity.
