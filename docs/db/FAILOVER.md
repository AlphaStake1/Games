# Indexer Failover and Recovery

This document outlines the failover mechanism and recovery procedures for the Football Squares indexer.

## UI Fallback to RPC

If the Subsquid indexer becomes unavailable or falls significantly behind the head of the chain, the dApp UI has a built-in fallback mechanism. It will switch to making direct `getProgramAccounts` or similar RPC calls to a public-facing RPC endpoint.

- **Primary Fallback:** Helius RPC
- **Secondary Fallback:** Triton RPC

This ensures that users can still view essential data, though with potentially higher latency compared to the indexer's GraphQL API.

## Emergency Checklist

In the event of a catastrophic indexer failure, follow these steps to recover:

1.  **Promote Read-Only RPC:** If the UI is not already using it, configure it to use a read-only RPC endpoint as its primary data source. This takes the immediate pressure off the indexer.

2.  **Diagnose and Replay Backlog:**
    - Identify the root cause of the failure (e.g., database corruption, resource exhaustion, bug in processor logic).
    - If necessary, drop the existing database tables.
    - Restart the processor. Subsquid will begin replaying blocks from the last known good state, or from the beginning if the database was wiped. Monitor the logs to ensure it's catching up.

3.  **Restart Processor:** Once the backlog is cleared and the processor is in sync with the chain, it can resume its role as the primary data source for the GraphQL API.

4.  **Switch UI Back to GraphQL:** Once the indexer is stable and fully synced, re-configure the UI to use the GraphQL API as its primary data source.
