# Architecture

This document provides an overview of the system architecture for Football Squares.

## Indexer Data-Flow

The indexer is a critical component for providing low-latency data to the front-end. Here is a step-by-step breakdown of the data flow from the Solana validator to the UI.

| #   | Component              | Purpose                                   | Key Tech           |
| --- | ---------------------- | ----------------------------------------- | ------------------ |
| 1   | **Geyser gRPC plugin** | Streams slots/tx/account updates          | Yellowstone-GRPC﻿  |
| 2   | **Subsquid Processor** | Decodes instructions & populates Postgres | Solana template﻿   |
| 3   | **GraphQL API**        | Low-latency queries from UI               | `sqd serve`        |
| 4   | **UI Fallback**        | Direct on-chain RPC if indexer stalls     | Helius/Triton RPC﻿ |

_Latencies observed in proof-of-concept testing were approximately **~800 ms end-to-end** on mainnet-beta, handling a load of 700 million daily transactions. This is in line with community benchmarks for similar Subsquid implementations._
