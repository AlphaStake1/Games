# Indexer

This document outlines the setup, schema, and logic for the Subsquid-based indexer.

## 1. Prerequisites

First, install the Subsquid CLI and scaffold the project:

```bash
npm i -g @subsquid/cli      # CLI
sqd init squares-squid --template solana   # scaffold
cd squares-squid && npm ci
```

## 2. Schema Definition

The core data entities are defined in the `schema.graphql` file. Here are the key entities for Football Squares:

```graphql
type SquareClaim @entity {
  id: ID!
  squareId: String!
  owner: String!
  timestamp: BigInt!
}

type ScoreUpdate @entity {
  id: ID!
  gameId: String!
  homeScore: Int!
  awayScore: Int!
  timestamp: BigInt!
}

type Payout @entity {
  id: ID!
  squareId: String!
  winner: String!
  amount: BigInt!
  timestamp: BigInt!
}
```

_For more details on field annotations and advanced schema features, see the Orca-swap example in the Subsquid documentation._

## 3. Processor Logic

The processor logic resides in `src/main.ts`. Key parsing logic includes:

- **Parsing Program Logs:** Use regular expressions to extract data from transaction logs.
  ```typescript
  // Example for parsing a 'SquareClaim' event
  const claimLog = log.match(/SquareClaim\((.*)\)/);
  if (claimLog) {
    const data = JSON.parse(claimLog[1]);
    // ... create and save SquareClaim entity
  }
  ```
- **Decoding Switchboard VRF Callbacks:** Handle account data from the Switchboard VRF oracle to process RNG-based events.

## 4. Local Run

Use Docker to run the indexer stack locally. The official self-hosting snippet provides the baseline `docker-compose.yml`.

```yaml
# docker-compose.yml
version: "3"
services:
  db:
    image: postgres:15
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=squares
    volumes:
      - db-data:/var/lib/postgresql/data
  processor:
    build: .
    depends_on:
      - db
    environment:
      - DB_URL=postgres://user:password@db:5432/squares
  api:
    image: subsquid/graphql-server:latest
    depends_on:
      - db
    ports:
      - "4350:4350"
    environment:
      - DB_URL=postgres://user:password@db:5432/squares
volumes:
  db-data:
```

Add a healthcheck to ensure Postgres is ready before the processor starts:

```yaml
# ... inside db service definition
healthcheck:
  test: ["CMD-SHELL", "pg_isready -U user -d squares"]
  interval: 5s
  timeout: 5s
  retries: 5
```

## 5. Production Deploy Paths

### Option A: Self-Host

Follow the provided `Dockerfile` template for building and deploying the indexer container to your own infrastructure.

### Option B: Subsquid Cloud

For managed hosting, use a `squid.yaml` manifest.

```yaml
# squid.yaml
manifestVersion: subsquid.io/v0.1
name: football-squares
version: 1
description: "Indexer for Football Squares"
build: .
processor:
  - name: subsquid-solana-processor
    cmd: ["node", "lib/main"]
deploy:
  addons:
    postgres: # Request a managed Postgres database
  processor:
    - name: squares-processor
      env:
        RPC_URL: ${{ secrets.RPC_URL }}
  api:
    - name: squares-api
```
