// scripts/health-check.ts
import { Connection, PublicKey } from '@solana/web3.js';
import { Program, AnchorProvider, Wallet } from '@coral-xyz/anchor';
import { readFileSync } from 'fs';
import { join } from 'path';
import WebSocket from 'ws';

interface HealthCheckResult {
  service: string;
  status: 'healthy' | 'unhealthy' | 'degraded';
  responseTime: number;
  details?: string;
  error?: string;
}

class HealthChecker {
  private rpcEndpoint: string;
  private wsPort: number;

  constructor() {
    this.rpcEndpoint = process.env.RPC_ENDPOINT || 'http://localhost:8899';
    this.wsPort = parseInt(process.env.WS_PORT || '8080');
  }

  async runAllChecks(): Promise<HealthCheckResult[]> {
    console.log('🏥 Running Football Squares Health Checks');
    console.log('==========================================\n');

    const checks = [
      this.checkSolanaRPC(),
      this.checkAnchorProgram(),
      this.checkWebSocketServer(),
      this.checkAgentSystem(),
      this.checkCeramicIntegration(),
      this.checkEmailSystem(),
      this.checkClockworkThread(),
      this.checkDatabaseConnection()
    ];

    const results = await Promise.all(checks);
    
    this.printResults(results);
    return results;
  }

  private async checkSolanaRPC(): Promise<HealthCheckResult> {
    const startTime = Date.now();
    
    try {
      const connection = new Connection(this.rpcEndpoint, 'confirmed');
      const version = await connection.getVersion();
      const slot = await connection.getSlot();
      
      const responseTime = Date.now() - startTime;
      
      return {
        service: 'Solana RPC',
        status: 'healthy',
        responseTime,
        details: `Version: ${version['solana-core']}, Slot: ${slot}`
      };
    } catch (error) {
      return {
        service: 'Solana RPC',
        status: 'unhealthy',
        responseTime: Date.now() - startTime,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  private async checkAnchorProgram(): Promise<HealthCheckResult> {
    const startTime = Date.now();
    
    try {
      // Check if program is deployed by trying to fetch program account
      const connection = new Connection(this.rpcEndpoint, 'confirmed');
      
      // Load program ID from Anchor.toml or target/deploy
      let programId: PublicKey;
      try {
        const deployPath = join(process.cwd(), 'target', 'deploy', 'squares-keypair.json');
        const keypairData = JSON.parse(readFileSync(deployPath, 'utf8'));
        programId = new PublicKey(keypairData);
      } catch {
        // Fallback to a default program ID for testing
        programId = new PublicKey('11111111111111111111111111111112');
      }

      const accountInfo = await connection.getAccountInfo(programId);
      const responseTime = Date.now() - startTime;

      if (accountInfo) {
        return {
          service: 'Anchor Program',
          status: 'healthy',
          responseTime,
          details: `Program deployed at ${programId.toString()}`
        };
      } else {
        return {
          service: 'Anchor Program',
          status: 'degraded',
          responseTime,
          details: 'Program not deployed or using default keypair'
        };
      }
    } catch (error) {
      return {
        service: 'Anchor Program',
        status: 'unhealthy',
        responseTime: Date.now() - startTime,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  private async checkWebSocketServer(): Promise<HealthCheckResult> {
    const startTime = Date.now();
    
    return new Promise((resolve) => {
      const ws = new WebSocket(`ws://localhost:${this.wsPort}`);
      
      const timeout = setTimeout(() => {
        ws.terminate();
        resolve({
          service: 'WebSocket Server',
          status: 'unhealthy',
          responseTime: Date.now() - startTime,
          error: 'Connection timeout'
        });
      }, 5000);

      ws.on('open', () => {
        clearTimeout(timeout);
        const responseTime = Date.now() - startTime;
        ws.close();
        
        resolve({
          service: 'WebSocket Server',
          status: 'healthy',
          responseTime,
          details: `Connected to ws://localhost:${this.wsPort}`
        });
      });

      ws.on('error', (error) => {
        clearTimeout(timeout);
        resolve({
          service: 'WebSocket Server',
          status: 'unhealthy',
          responseTime: Date.now() - startTime,
          error: error.message
        });
      });
    });
  }

  private async checkAgentSystem(): Promise<HealthCheckResult> {
    const startTime = Date.now();
    
    try {
      // Check if agent processes are running by looking for their files
      const agentPaths = [
        'agents/OrchestratorAgent/index.ts',
        'agents/BoardAgent/index.ts',
        'agents/RandomizerAgent/index.ts',
        'agents/OracleAgent/index.ts',
        'agents/WinnerAgent/index.ts',
        'agents/EmailAgent/index.ts'
      ];

      const missingAgents = [];
      for (const agentPath of agentPaths) {
        try {
          readFileSync(join(process.cwd(), agentPath), 'utf8');
        } catch {
          missingAgents.push(agentPath);
        }
      }

      const responseTime = Date.now() - startTime;

      if (missingAgents.length === 0) {
        return {
          service: 'Agent System',
          status: 'healthy',
          responseTime,
          details: `All ${agentPaths.length} agents available`
        };
      } else {
        return {
          service: 'Agent System',
          status: 'degraded',
          responseTime,
          details: `Missing agents: ${missingAgents.join(', ')}`
        };
      }
    } catch (error) {
      return {
        service: 'Agent System',
        status: 'unhealthy',
        responseTime: Date.now() - startTime,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  private async checkCeramicIntegration(): Promise<HealthCheckResult> {
    const startTime = Date.now();
    
    try {
      // Check if Ceramic client files exist
      const ceramicPaths = [
        'ceramic/client.ts',
        'lib/ceramic-integration.ts'
      ];

      for (const ceramicPath of ceramicPaths) {
        readFileSync(join(process.cwd(), ceramicPath), 'utf8');
      }

      const responseTime = Date.now() - startTime;
      
      return {
        service: 'Ceramic Integration',
        status: 'healthy',
        responseTime,
        details: 'Ceramic client files available'
      };
    } catch (error) {
      return {
        service: 'Ceramic Integration',
        status: 'unhealthy',
        responseTime: Date.now() - startTime,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  private async checkEmailSystem(): Promise<HealthCheckResult> {
    const startTime = Date.now();
    
    try {
      // Check Proton Bridge configuration
      const protonEmail = process.env.PROTON_EMAIL;
      const protonPassword = process.env.PROTON_PASSWORD;
      
      if (!protonEmail || !protonPassword) {
        return {
          service: 'Email System',
          status: 'degraded',
          responseTime: Date.now() - startTime,
          details: 'Proton Bridge environment variables not configured'
        };
      }

      // Check if email templates exist
      const emailAgent = readFileSync(join(process.cwd(), 'agents/EmailAgent/index.ts'), 'utf8');
      
      const responseTime = Date.now() - startTime;
      
      return {
        service: 'Email System',
        status: 'healthy',
        responseTime,
        details: 'Email agent and configuration available'
      };
    } catch (error) {
      return {
        service: 'Email System',
        status: 'unhealthy',
        responseTime: Date.now() - startTime,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  private async checkClockworkThread(): Promise<HealthCheckResult> {
    const startTime = Date.now();
    
    try {
      // Check if Clockwork thread script exists
      readFileSync(join(process.cwd(), 'scripts/create_thread.ts'), 'utf8');
      
      const responseTime = Date.now() - startTime;
      
      return {
        service: 'Clockwork Thread',
        status: 'healthy',
        responseTime,
        details: 'Clockwork thread script available'
      };
    } catch (error) {
      return {
        service: 'Clockwork Thread',
        status: 'unhealthy',
        responseTime: Date.now() - startTime,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  private async checkDatabaseConnection(): Promise<HealthCheckResult> {
    const startTime = Date.now();
    
    try {
      // Since we're using Solana as our primary data store and Ceramic for logging,
      // this check validates our data layer components
      const connection = new Connection(this.rpcEndpoint, 'confirmed');
      await connection.getSlot();
      
      const responseTime = Date.now() - startTime;
      
      return {
        service: 'Database Connection',
        status: 'healthy',
        responseTime,
        details: 'Solana blockchain connection healthy'
      };
    } catch (error) {
      return {
        service: 'Database Connection',
        status: 'unhealthy',
        responseTime: Date.now() - startTime,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  private printResults(results: HealthCheckResult[]): void {
    console.log('\n📊 Health Check Results');
    console.log('=======================\n');

    const healthy = results.filter(r => r.status === 'healthy').length;
    const degraded = results.filter(r => r.status === 'degraded').length;
    const unhealthy = results.filter(r => r.status === 'unhealthy').length;

    results.forEach(result => {
      const statusIcon = {
        'healthy': '✅',
        'degraded': '⚠️',
        'unhealthy': '❌'
      }[result.status];

      console.log(`${statusIcon} ${result.service} (${result.responseTime}ms)`);
      
      if (result.details) {
        console.log(`   ${result.details}`);
      }
      
      if (result.error) {
        console.log(`   Error: ${result.error}`);
      }
      
      console.log('');
    });

    console.log('Summary:');
    console.log(`✅ Healthy: ${healthy}`);
    console.log(`⚠️ Degraded: ${degraded}`);
    console.log(`❌ Unhealthy: ${unhealthy}`);
    
    const overallStatus = unhealthy > 0 ? 'CRITICAL' : degraded > 0 ? 'WARNING' : 'HEALTHY';
    console.log(`\n🏥 Overall Status: ${overallStatus}`);

    if (unhealthy > 0) {
      console.log('\n🚨 Critical issues detected! Please fix unhealthy services.');
      process.exit(1);
    } else if (degraded > 0) {
      console.log('\n⚠️ Some services are degraded. Consider investigating.');
    } else {
      console.log('\n🎉 All systems operational!');
    }
  }

  async checkSingleService(serviceName: string): Promise<void> {
    const serviceMap: { [key: string]: () => Promise<HealthCheckResult> } = {
      'rpc': this.checkSolanaRPC.bind(this),
      'solana': this.checkSolanaRPC.bind(this),
      'anchor': this.checkAnchorProgram.bind(this),
      'program': this.checkAnchorProgram.bind(this),
      'websocket': this.checkWebSocketServer.bind(this),
      'ws': this.checkWebSocketServer.bind(this),
      'agents': this.checkAgentSystem.bind(this),
      'ceramic': this.checkCeramicIntegration.bind(this),
      'email': this.checkEmailSystem.bind(this),
      'clockwork': this.checkClockworkThread.bind(this),
      'database': this.checkDatabaseConnection.bind(this),
      'db': this.checkDatabaseConnection.bind(this)
    };

    const checkFunction = serviceMap[serviceName.toLowerCase()];
    
    if (!checkFunction) {
      console.error(`❌ Unknown service: ${serviceName}`);
      console.log('Available services:', Object.keys(serviceMap).join(', '));
      process.exit(1);
    }

    const result = await checkFunction();
    this.printResults([result]);
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  const checker = new HealthChecker();

  if (command === 'single' && args[1]) {
    await checker.checkSingleService(args[1]);
  } else if (command === 'help' || command === '--help') {
    console.log('Football Squares Health Checker');
    console.log('Usage:');
    console.log('  npm run health                  # Check all services');
    console.log('  npm run health single <service> # Check specific service');
    console.log('');
    console.log('Available services:');
    console.log('  rpc, solana     - Solana RPC connection');
    console.log('  anchor, program - Anchor program deployment');
    console.log('  websocket, ws   - WebSocket server');
    console.log('  agents          - Agent system');
    console.log('  ceramic         - Ceramic integration');
    console.log('  email           - Email system');
    console.log('  clockwork       - Clockwork threads');
    console.log('  database, db    - Database connection');
  } else {
    const results = await checker.runAllChecks();
    
    // Exit with error code if any services are unhealthy
    const unhealthy = results.filter(r => r.status === 'unhealthy').length;
    if (unhealthy > 0) {
      process.exit(1);
    }
  }
}

if (require.main === module) {
  main().catch(console.error);
}

export { HealthChecker };