# ElizaOS V2 - CLI Reference

**Source:** https://eliza.how/cli-reference/overview

## Installation

Install globally using Bun:

```bash
bun install -g @elizaos/cli
```

## Available Commands

1. `create`: Initialize new project, plugin, or agent
2. `monorepo`: Clone ElizaOS monorepo
3. `plugins`: Manage ElizaOS plugins
4. `agent`: Manage ElizaOS agents
5. `tee`: Manage TEE deployments
6. `start`: Start Eliza agent with configurable plugins
7. `update`: Update CLI and project dependencies
8. `test`: Run tests for agent projects and plugins
9. `env`: Manage environment variables
10. `dev`: Start project in development mode
11. `publish`: Publish a plugin to registry

## Global Options

- `--help`, `-h`: Display help information
- `--version`, `-v`: Show version
- `--no-emoji`: Disable emoji output
- `--no-auto-install`: Disable automatic Bun installation prompt

## Example Usage

```bash
# Check CLI version
elizaos --version

# Create a new project
elizaos create my-agent-project

# Start a project
elizaos start

# Run in development mode
elizaos dev
```

## Key Features

- Interactive project creation
- Environment configuration management
- Development and production modes
- Plugin management
- Comprehensive testing support

The CLI provides a comprehensive toolkit for developing, managing, and deploying ElizaOS agents and plugins.
