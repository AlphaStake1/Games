# Football Squares dApp Development Guide

## Overview

This guide provides comprehensive instructions for developers who want to contribute to, modify, or extend the Football Squares dApp. It covers the development environment setup, coding standards, testing procedures, and contribution guidelines.

## Table of Contents

1. [Development Environment Setup](#development-environment-setup)
2. [Project Structure](#project-structure)
3. [Development Workflow](#development-workflow)
4. [Coding Standards](#coding-standards)
5. [Testing Guidelines](#testing-guidelines)
6. [Debugging and Troubleshooting](#debugging-and-troubleshooting)
7. [Contributing](#contributing)
8. [Release Process](#release-process)
9. [Best Practices](#best-practices)

## Development Environment Setup

### Prerequisites

**System Requirements:**

- Operating System: Linux (Ubuntu 20.04+), macOS 12+, or Windows 11 with WSL2
- RAM: 16GB minimum, 32GB recommended
- Storage: 50GB free space for development tools and dependencies
- Network: Stable internet connection for blockchain interactions

**Required Software:**

- Node.js 18+ (LTS recommended)
- Rust 1.75+ with Cargo
- Git 2.35+
- Docker 24+ and Docker Compose 2.20+
- VS Code or preferred IDE

### Installation Steps

#### 1. Clone the Repository

```bash
# Clone the repository
git clone https://github.com/your-org/football-squares.git
cd football-squares

# Create a new branch for your work
git checkout -b feature/your-feature-name
```

#### 2. Install Core Dependencies

```bash
# Install Node.js dependencies
npm install

# Install Rust and Cargo
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source ~/.cargo/env

# Install Solana CLI
sh -c "$(curl -sSfL https://release.solana.com/v1.18.0/install)"
export PATH="~/.local/share/solana/install/active_release/bin:$PATH"

# Install Anchor CLI
cargo install --git https://github.com/coral-xyz/anchor anchor-cli --locked
```

#### 3. Environment Configuration

```bash
# Copy environment template
cp .env.example .env.local

# Edit environment variables
nano .env.local
```

**Required Environment Variables for Development:**

```bash
# Blockchain Configuration
RPC_ENDPOINT=http://localhost:8899
ANCHOR_WALLET=~/.config/solana/id.json
ANCHOR_PROVIDER_URL=http://localhost:8899

# AI Agent Configuration (optional for development)
ANTHROPIC_API_KEY=your_development_key
OPENAI_API_KEY=your_development_key

# WebSocket Configuration
WS_PORT=8080
WS_HOST=localhost

# Development Settings
NODE_ENV=development
LOG_LEVEL=debug
```

#### 4. Local Blockchain Setup

```bash
# Configure Solana for local development
solana config set --url localhost
solana config set --keypair ~/.config/solana/id.json

# Start local validator (in separate terminal)
solana-test-validator --reset

# Create and fund development wallet
solana-keygen new --force
solana airdrop 100
```

#### 5. Build and Test

```bash
# Build the smart contract
anchor build

# Run tests
npm run test:validate
npm run test:anchor

# Start development servers
npm run dev:ws &     # WebSocket server
npm run dev:agents & # AI agent system
npm run dev          # Frontend
```

### IDE Setup

#### VS Code Configuration

Install recommended extensions:

```bash
# Install VS Code extensions
code --install-extension ms-vscode.vscode-typescript-next
code --install-extension rust-lang.rust-analyzer
code --install-extension ms-python.python
code --install-extension bradlc.vscode-tailwindcss
code --install-extension ms-vscode.vscode-json
```

**VS Code Settings (.vscode/settings.json):**

```json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "typescript.suggest.autoImports": true,
  "rust-analyzer.checkOnSave.command": "clippy",
  "rust-analyzer.cargo.loadOutDirsFromCheck": true,
  "files.associations": {
    "*.rs": "rust",
    "Anchor.toml": "toml"
  },
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[rust]": {
    "editor.defaultFormatter": "rust-lang.rust-analyzer"
  }
}
```

#### IntelliJ IDEA / WebStorm

1. Install Rust plugin
2. Install TypeScript support
3. Configure Prettier for formatting
4. Set up ESLint integration

## Project Structure

### High-Level Directory Structure

```
football-squares/
├── programs/                 # Anchor smart contracts
│   └── squares/             # Main squares program
├── agents/                  # AI agent system
│   ├── OrchestratorAgent/   # Task coordination
│   ├── BoardAgent/          # Game state management
│   ├── RandomizerAgent/     # VRF handling
│   ├── OracleAgent/         # Score fetching
│   ├── WinnerAgent/         # Payout processing
│   └── EmailAgent/          # Notifications
├── app/                     # Next.js frontend
├── components/              # React components
├── lib/                     # Shared utilities
├── server/                  # WebSocket server
├── scripts/                 # Utility scripts
├── tests/                   # Test suites
├── docs/                    # Documentation
├── docker/                  # Container configuration
└── ceramic/                 # Ceramic integration
```

### Key File Descriptions

**Smart Contract:**

- [`programs/squares/src/lib.rs`](../programs/squares/src/lib.rs): Main Anchor program
- [`programs/squares/Cargo.toml`](../programs/squares/Cargo.toml): Rust dependencies

**Frontend:**

- [`app/page.tsx`](../app/page.tsx): Main page component
- [`components/SquaresGrid.tsx`](../components/SquaresGrid.tsx): Interactive game board
- [`app/providers.tsx`](../app/providers.tsx): Context providers

**Backend Services:**

- [`server/websocket.ts`](../server/websocket.ts): Real-time communication
- [`agents/*/index.ts`](../agents/): AI agent implementations

**Infrastructure:**

- [`docker/docker-compose.yml`](../docker/docker-compose.yml): Container orchestration
- [`.github/workflows/ci.yml`](../.github/workflows/ci.yml): CI/CD pipeline

### Configuration Files

- **Package Management**: [`package.json`](../package.json)
- **TypeScript**: [`tsconfig.json`](../tsconfig.json)
- **Anchor**: [`Anchor.toml`](../Anchor.toml)
- **Testing**: [`.mocharc.json`](../.mocharc.json)
- **Linting**: [`.eslintrc.json`](../.eslintrc.json)

## Development Workflow

### Feature Development Process

#### 1. Planning Phase

```bash
# Create feature branch
git checkout -b feature/new-feature-name

# Review requirements
# - Read existing documentation
# - Understand user stories
# - Identify affected components
```

#### 2. Implementation Phase

```bash
# Start local development environment
npm run dev:all

# Make changes incrementally
# - Write tests first (TDD)
# - Implement functionality
# - Update documentation
```

#### 3. Testing Phase

```bash
# Run comprehensive tests
npm run test:all

# Manual testing
npm run dev
# Test in browser

# Check code quality
npm run lint
npm run type-check
```

#### 4. Review Phase

```bash
# Create pull request
git push origin feature/new-feature-name

# Address review feedback
# Update tests and documentation
# Ensure CI passes
```

### Daily Development Commands

```bash
# Start full development environment
npm run dev:all

# Start individual services
npm run dev          # Frontend only
npm run dev:ws       # WebSocket server
npm run dev:agents   # AI agent system

# Development tools
npm run lint         # Code linting
npm run type-check   # TypeScript checking
npm run test:watch   # Continuous testing
npm run build        # Production build test
```

### Git Workflow

#### Branch Naming Convention

```bash
feature/description      # New features
bugfix/issue-description # Bug fixes
hotfix/critical-issue    # Critical production fixes
docs/topic              # Documentation updates
refactor/component-name  # Code refactoring
```

#### Commit Message Format

```
type(scope): description

[optional body]

[optional footer]
```

**Types:**

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting
- `refactor`: Code restructuring
- `test`: Test updates
- `chore`: Maintenance

**Examples:**

```bash
feat(squares): add automatic payout functionality
fix(websocket): resolve connection timeout issues
docs(api): update smart contract documentation
test(integration): add ceramic logging tests
```

## Coding Standards

### TypeScript/JavaScript Standards

#### Code Style

```typescript
// Use descriptive variable names
const userWalletAddress = wallet.publicKey.toString();

// Prefer const over let when possible
const maxSquares = 100;

// Use type annotations for function parameters
function calculatePayout(totalPot: number, quarterCount: number): number {
  return totalPot / quarterCount;
}

// Use interfaces for object shapes
interface BoardState {
  squares: Square[];
  currentQuarter: number;
  homeScore: number;
  awayScore: number;
}

// Use enums for constants
enum GamePhase {
  Created = 'created',
  Active = 'active',
  InPlay = 'in_play',
  Completed = 'completed',
}
```

#### Error Handling

```typescript
// Use custom error types
class InsufficientFundsError extends Error {
  constructor(required: number, available: number) {
    super(`Insufficient funds: required ${required}, available ${available}`);
    this.name = 'InsufficientFundsError';
  }
}

// Handle async operations properly
async function purchaseSquare(squareIndex: number): Promise<string> {
  try {
    const transaction = await program.methods.purchaseSquare(squareIndex).rpc();

    return transaction;
  } catch (error) {
    console.error('Failed to purchase square:', error);
    throw new Error('Purchase failed. Please try again.');
  }
}
```

### Rust Standards

#### Code Style

```rust
// Use descriptive function names
pub fn calculate_quarter_payout(total_pot: u64, quarter: u8) -> Result<u64> {
    let payout = total_pot / 4;
    Ok(payout)
}

// Use proper error handling
#[error_code]
pub enum ErrorCode {
    #[msg("Square is already owned")]
    SquareAlreadyOwned = 6000,
    #[msg("Invalid square index")]
    InvalidSquareIndex = 6001,
}

// Document public functions
/// Calculates the winner for a given quarter based on scores
///
/// # Arguments
/// * `home_score` - Home team score
/// * `away_score` - Away team score
/// * `headers` - Row and column header numbers
///
/// # Returns
/// * `Option<u8>` - Square index of winner, or None if no winner
pub fn calculate_winner(
    home_score: u8,
    away_score: u8,
    home_headers: &[u8; 10],
    away_headers: &[u8; 10],
) -> Option<u8> {
    // Implementation
}
```

#### Security Best Practices

```rust
// Validate all inputs
#[access_control(validate_square_index(&square_index))]
pub fn purchase_square(
    ctx: Context<PurchaseSquare>,
    square_index: u8,
) -> Result<()> {
    // Implementation
}

fn validate_square_index(square_index: &u8) -> Result<()> {
    require!(*square_index < 100, ErrorCode::InvalidSquareIndex);
    Ok(())
}

// Use proper account constraints
#[account(
    mut,
    constraint = board.state == BoardState::Active,
    has_one = authority
)]
pub board: Account<'info, Board>,
```

### React Component Standards

```typescript
// Use functional components with hooks
interface SquareProps {
  index: number;
  owner?: string;
  isSelected: boolean;
  onSelect: (index: number) => void;
}

export const Square: React.FC<SquareProps> = ({
  index,
  owner,
  isSelected,
  onSelect
}) => {
  const handleClick = useCallback(() => {
    if (!owner) {
      onSelect(index);
    }
  }, [index, owner, onSelect]);

  return (
    <button
      className={cn(
        'aspect-square border border-gray-300',
        isSelected && 'bg-blue-200',
        owner && 'bg-green-100'
      )}
      onClick={handleClick}
      disabled={!!owner}
    >
      {owner ? `Owner: ${owner.slice(0, 8)}...` : index}
    </button>
  );
};
```

## Testing Guidelines

### Test Structure

#### Unit Tests

```typescript
// Test individual functions
describe('calculateWinner', () => {
  it('should return correct winner for valid scores', () => {
    const homeHeaders = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    const awayHeaders = [9, 8, 7, 6, 5, 4, 3, 2, 1, 0];

    const winner = calculateWinner(14, 7, homeHeaders, awayHeaders);
    expect(winner).toBe(47); // Row 4, Column 7
  });

  it('should handle edge cases', () => {
    const winner = calculateWinner(0, 0, homeHeaders, awayHeaders);
    expect(winner).toBe(9); // Row 0, Column 0
  });
});
```

#### Integration Tests

```typescript
// Test component interactions
describe('SquaresGrid Integration', () => {
  it('should handle square purchase flow', async () => {
    render(<SquaresGrid gameId="test-game" />);

    const square = screen.getByTestId('square-42');
    fireEvent.click(square);

    const purchaseButton = screen.getByText('Purchase Selected');
    fireEvent.click(purchaseButton);

    await waitFor(() => {
      expect(mockPurchaseSquare).toHaveBeenCalledWith(42);
    });
  });
});
```

#### Smart Contract Tests

```typescript
// Test smart contract functionality
describe('Squares Program', () => {
  it('creates board successfully', async () => {
    const boardKeypair = Keypair.generate();
    const pricePerSquare = new BN(1_000_000);

    await program.methods
      .createBoard(pricePerSquare)
      .accounts({
        board: boardKeypair.publicKey,
        authority: provider.wallet.publicKey,
      })
      .signers([boardKeypair])
      .rpc();

    const board = await program.account.board.fetch(boardKeypair.publicKey);
    expect(board.pricePerSquare.toNumber()).toBe(1_000_000);
  });
});
```

### Testing Commands

```bash
# Run all tests
npm run test

# Run specific test suites
npm run test:unit
npm run test:integration
npm run test:anchor

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage

# Run tests with debugging
npm run test:debug
```

### Test Data Management

```typescript
// Use factories for test data
export const createMockBoard = (overrides?: Partial<Board>): Board => ({
  authority: new PublicKey('11111111111111111111111111111112'),
  pricePerSquare: new BN(1_000_000),
  squares: Array(100)
    .fill(null)
    .map(() => ({ owner: null, purchasedAt: null })),
  homeHeaders: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  awayHeaders: [9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
  state: BoardState.Active,
  createdAt: new BN(Date.now()),
  ...overrides,
});

// Use test utilities
export const testUtils = {
  async deployTestProgram(): Promise<Program> {
    // Deploy program for testing
  },

  async createTestWallet(): Promise<Keypair> {
    // Create funded test wallet
  },

  async setupTestBoard(): Promise<PublicKey> {
    // Create and configure test board
  },
};
```

## Debugging and Troubleshooting

### Common Issues and Solutions

#### Smart Contract Debugging

```bash
# View program logs
solana logs <PROGRAM_ID>

# Decode transaction error
anchor decode-error <ERROR_CODE>

# Inspect account data
solana account <ACCOUNT_ADDRESS> --output json

# Check program deployment
solana program show <PROGRAM_ID>
```

#### Frontend Debugging

```typescript
// Add debug logging
const debug = require('debug')('footballsquares:component');

export const SquaresGrid = () => {
  const [squares, setSquares] = useState([]);

  useEffect(() => {
    debug('Squares updated:', squares);
  }, [squares]);

  // Component implementation
};

// Use React DevTools
// Install React Developer Tools extension
// Use Profiler to identify performance issues
```

#### WebSocket Debugging

```typescript
// Add connection logging
const ws = new WebSocket(wsUrl);

ws.addEventListener('open', () => {
  console.log('WebSocket connected');
});

ws.addEventListener('error', (error) => {
  console.error('WebSocket error:', error);
});

ws.addEventListener('message', (event) => {
  console.log('Received message:', JSON.parse(event.data));
});

// Monitor connection health
setInterval(() => {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ type: 'ping' }));
  }
}, 30000);
```

### Performance Profiling

#### Frontend Performance

```bash
# Analyze bundle size
npm run analyze

# Lighthouse audit
npx lighthouse http://localhost:3000

# Profile React components
# Use React DevTools Profiler
```

#### Smart Contract Performance

```rust
// Add compute unit logging
msg!("Compute units consumed: {}",
      ctx.remaining_accounts.len() * 1000);

// Optimize account access
#[account(
    mut,
    constraint = board.authority == authority.key(),
    // Use has_one for faster validation
    has_one = authority
)]
pub board: Account<'info, Board>,
```

## Contributing

### Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally
3. **Create a feature branch** from `main`
4. **Make your changes** following coding standards
5. **Write tests** for new functionality
6. **Update documentation** as needed
7. **Submit a pull request**

### Pull Request Guidelines

#### PR Title Format

```
type(scope): description

Examples:
feat(squares): add multi-game support
fix(websocket): resolve connection issues
docs(api): update smart contract examples
```

#### PR Description Template

```markdown
## Description

Brief description of changes made.

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing

- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed
- [ ] Performance impact assessed

## Checklist

- [ ] Code follows project standards
- [ ] Self-review completed
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] No breaking changes (or breaking changes documented)
```

### Code Review Process

1. **Automated Checks**: CI pipeline must pass
2. **Peer Review**: At least one approving review required
3. **Testing**: All tests must pass
4. **Documentation**: Updates must be included
5. **Security**: Security implications considered

### Review Criteria

- **Functionality**: Does it work as intended?
- **Performance**: Is it efficient?
- **Security**: Are there any vulnerabilities?
- **Maintainability**: Is the code easy to understand and modify?
- **Testing**: Is it adequately tested?

## Release Process

### Version Management

We follow [Semantic Versioning](https://semver.org/):

- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### Release Steps

#### 1. Prepare Release

```bash
# Update version
npm version patch|minor|major

# Update CHANGELOG.md
# Document all changes since last release

# Create release branch
git checkout -b release/v1.2.3
```

#### 2. Testing

```bash
# Run full test suite
npm run test:all

# Deploy to staging
npm run deploy:staging

# Manual testing
# Performance testing
# Security testing
```

#### 3. Deploy

```bash
# Merge to main
git checkout main
git merge release/v1.2.3

# Tag release
git tag v1.2.3

# Deploy to production
npm run deploy:production

# Create GitHub release
# Upload artifacts
# Update documentation
```

### Hotfix Process

```bash
# Create hotfix branch from main
git checkout -b hotfix/critical-issue main

# Make minimal fix
# Test thoroughly

# Deploy immediately
git checkout main
git merge hotfix/critical-issue
git tag v1.2.4
npm run deploy:production
```

## Best Practices

### Security Best Practices

#### Smart Contract Security

```rust
// Always validate inputs
#[access_control(validate_inputs(&square_index, &payment_amount))]
pub fn purchase_square(
    ctx: Context<PurchaseSquare>,
    square_index: u8,
) -> Result<()> {
    // Implementation
}

// Use proper account constraints
#[account(
    mut,
    constraint = board.squares[square_index as usize].owner.is_none(),
    constraint = board.state == BoardState::Active
)]
pub board: Account<'info, Board>,

// Implement proper error handling
require!(
    square_index < 100,
    ErrorCode::InvalidSquareIndex
);
```

#### Frontend Security

```typescript
// Validate user inputs
const validateSquareIndex = (index: number): boolean => {
  return index >= 0 && index < 100;
};

// Sanitize display data
const sanitizeAddress = (address: string): string => {
  return address.slice(0, 8) + '...';
};

// Use environment variables for sensitive data
const rpcEndpoint = process.env.NEXT_PUBLIC_RPC_ENDPOINT!;
```

### Performance Best Practices

#### React Optimization

```typescript
// Memoize expensive calculations
const expensiveValue = useMemo(() => {
  return calculateComplexValue(data);
}, [data]);

// Optimize re-renders
const MemoizedSquare = memo(Square);

// Lazy load components
const LazyGameBoard = lazy(() => import('./GameBoard'));
```

#### Smart Contract Optimization

```rust
// Minimize account allocations
#[account(zero)]
pub board: Account<'info, Board>,

// Use efficient data structures
pub struct Board {
    // Use fixed-size arrays instead of Vec where possible
    pub squares: [Square; 100],
}

// Batch operations when possible
pub fn purchase_multiple_squares(
    ctx: Context<PurchaseSquares>,
    square_indices: Vec<u8>,
) -> Result<()> {
    // Process multiple squares in one transaction
}
```

### Code Organization

#### File Structure

```
components/
├── ui/              # Reusable UI components
├── game/            # Game-specific components
├── layout/          # Layout components
└── forms/           # Form components

lib/
├── utils/           # General utilities
├── hooks/           # Custom React hooks
├── types/           # TypeScript type definitions
└── constants/       # Application constants

agents/
├── base/            # Base agent class
├── types/           # Agent type definitions
└── utils/           # Agent utilities
```

#### Import Organization

```typescript
// External libraries first
import React, { useState, useEffect } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';

// Internal utilities
import { cn, formatAddress } from '@/lib/utils';

// Components
import { Button } from '@/components/ui/button';
import { SquaresGrid } from '@/components/game/squares-grid';

// Types
import type { BoardState, Square } from '@/types/game';
```

### Documentation Standards

#### Code Documentation

````typescript
/**
 * Calculates the payout amount for a quarter winner
 *
 * @param totalPot - Total pot amount in lamports
 * @param quarter - Quarter number (1-4)
 * @returns Payout amount for the quarter
 *
 * @example
 * ```typescript
 * const payout = calculateQuarterPayout(1000000000, 1);
 * console.log(payout); // 250000000
 * ```
 */
export function calculateQuarterPayout(
  totalPot: number,
  quarter: number,
): number {
  return totalPot / 4;
}
````

#### API Documentation

```typescript
/**
 * @api {post} /api/boards Create Board
 * @apiName CreateBoard
 * @apiGroup Boards
 *
 * @apiParam {Number} pricePerSquare Price per square in lamports
 * @apiParam {String} authority Board authority public key
 *
 * @apiSuccess {String} boardId Created board ID
 * @apiSuccess {String} transactionId Transaction hash
 *
 * @apiError {String} error Error message
 */
```

---

## Getting Help

### Resources

- **Documentation**: [docs/](../docs/)
- **GitHub Issues**: [Repository Issues](https://github.com/your-repo/issues)
- **Discord**: [Developer Channel](https://discord.gg/your-server)
- **Email**: dev-support@footballsquares.dev

### Community Guidelines

- Be respectful and inclusive
- Provide detailed information when asking for help
- Search existing issues before creating new ones
- Follow up on your issues and PRs

---

_Happy coding! 🚀_

_Last updated: January 2025_
