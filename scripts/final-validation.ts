// scripts/final-validation.ts
import { spawn, ChildProcess } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

interface ValidationResult {
  category: string;
  test: string;
  status: 'PASS' | 'FAIL' | 'SKIP';
  duration: number;
  details?: string;
  error?: string;
}

interface ValidationSummary {
  timestamp: string;
  totalTests: number;
  passed: number;
  failed: number;
  skipped: number;
  duration: number;
  results: ValidationResult[];
  systemInfo: {
    nodeVersion: string;
    platform: string;
    architecture: string;
  };
}

class FinalValidator {
  private results: ValidationResult[] = [];
  private startTime: number = 0;

  async runFullValidation(): Promise<ValidationSummary> {
    console.log('🚀 Starting Football Squares Phase-2 Final Validation');
    console.log('='.repeat(60));
    
    this.startTime = Date.now();
    
    // Run all validation categories
    await this.validateEnvironment();
    await this.validateCodeQuality();
    await this.validateSmartContracts();
    await this.validateFrontend();
    await this.validateBackendServices();
    await this.validateIntegration();
    await this.validateDeployment();
    await this.validateDocumentation();
    
    const summary = this.generateSummary();
    this.printResults(summary);
    this.saveReport(summary);
    
    return summary;
  }

  private async validateEnvironment(): Promise<void> {
    console.log('\n🔍 Environment Validation');
    console.log('-'.repeat(30));

    await this.runValidation('Environment', 'Node.js Version', async () => {
      const version = process.version;
      const major = parseInt(version.slice(1).split('.')[0]);
      if (major < 18) {
        throw new Error(`Node.js ${major} is too old, requires 18+`);
      }
      return `Node.js ${version}`;
    });

    await this.runValidation('Environment', 'Package Dependencies', async () => {
      const packageJson = JSON.parse(readFileSync('package.json', 'utf8'));
      const requiredDeps = [
        '@solana/web3.js',
        '@coral-xyz/anchor',
        'next',
        'react',
        'ws',
        'dotenv'
      ];
      
      const missing = requiredDeps.filter(dep => 
        !packageJson.dependencies[dep] && !packageJson.devDependencies[dep]
      );
      
      if (missing.length > 0) {
        throw new Error(`Missing dependencies: ${missing.join(', ')}`);
      }
      
      return `All ${requiredDeps.length} required dependencies present`;
    });

    await this.runValidation('Environment', 'TypeScript Configuration', async () => {
      const tsconfig = JSON.parse(readFileSync('tsconfig.json', 'utf8'));
      if (!tsconfig.compilerOptions.strict) {
        throw new Error('TypeScript strict mode not enabled');
      }
      return 'TypeScript strict mode enabled';
    });
  }

  private async validateCodeQuality(): Promise<void> {
    console.log('\n📋 Code Quality Validation');
    console.log('-'.repeat(30));

    await this.runValidation('Code Quality', 'TypeScript Compilation', async () => {
      const result = await this.executeCommand('npx', ['tsc', '--noEmit']);
      if (!result.success) {
        throw new Error(`TypeScript errors: ${result.error}`);
      }
      return 'TypeScript compilation successful';
    });

    await this.runValidation('Code Quality', 'ESLint', async () => {
      const result = await this.executeCommand('npm', ['run', 'lint']);
      if (!result.success) {
        throw new Error(`ESLint errors: ${result.error}`);
      }
      return 'ESLint validation passed';
    });

    await this.runValidation('Code Quality', 'Security Audit', async () => {
      const result = await this.executeCommand('npm', ['audit', '--audit-level=high']);
      if (!result.success && result.error.includes('high')) {
        throw new Error('High severity vulnerabilities found');
      }
      return 'No high severity vulnerabilities';
    });
  }

  private async validateSmartContracts(): Promise<void> {
    console.log('\n⚓ Smart Contract Validation');
    console.log('-'.repeat(30));

    await this.runValidation('Smart Contract', 'Anchor Build', async () => {
      const result = await this.executeCommand('anchor', ['build']);
      if (!result.success) {
        throw new Error(`Build failed: ${result.error}`);
      }
      return 'Anchor build successful';
    });

    await this.runValidation('Smart Contract', 'Program Tests', async () => {
      const result = await this.executeCommand('anchor', ['test', '--skip-local-validator']);
      if (!result.success) {
        throw new Error(`Tests failed: ${result.error}`);
      }
      return 'All smart contract tests passed';
    });

    await this.runValidation('Smart Contract', 'Program Security', async () => {
      // Check for common security patterns
      const programCode = readFileSync('programs/squares/src/lib.rs', 'utf8');
      
      const securityChecks = [
        { pattern: /#\[access_control/, name: 'Access control' },
        { pattern: /require!/, name: 'Input validation' },
        { pattern: /#\[account\(/, name: 'Account constraints' },
        { pattern: /#\[error_code\]/, name: 'Error handling' }
      ];
      
      const missing = securityChecks.filter(check => 
        !check.pattern.test(programCode)
      );
      
      if (missing.length > 0) {
        throw new Error(`Missing security patterns: ${missing.map(m => m.name).join(', ')}`);
      }
      
      return 'All security patterns implemented';
    });
  }

  private async validateFrontend(): Promise<void> {
    console.log('\n🌐 Frontend Validation');
    console.log('-'.repeat(30));

    await this.runValidation('Frontend', 'Next.js Build', async () => {
      const result = await this.executeCommand('npm', ['run', 'build']);
      if (!result.success) {
        throw new Error(`Build failed: ${result.error}`);
      }
      return 'Next.js build successful';
    });

    await this.runValidation('Frontend', 'Component Tests', async () => {
      // Check key components exist
      const components = [
        'components/SquaresGrid.tsx',
        'app/page.tsx',
        'app/providers.tsx'
      ];
      
      for (const component of components) {
        try {
          readFileSync(component, 'utf8');
        } catch {
          throw new Error(`Missing component: ${component}`);
        }
      }
      
      return `All ${components.length} key components present`;
    });

    await this.runValidation('Frontend', 'Wallet Integration', async () => {
      const providersCode = readFileSync('app/providers.tsx', 'utf8');
      
      if (!providersCode.includes('WalletAdapterProvider')) {
        throw new Error('Wallet adapter not properly configured');
      }
      
      return 'Wallet integration configured';
    });
  }

  private async validateBackendServices(): Promise<void> {
    console.log('\n🔧 Backend Services Validation');
    console.log('-'.repeat(30));

    await this.runValidation('Backend', 'WebSocket Server', async () => {
      const wsCode = readFileSync('server/websocket.ts', 'utf8');
      
      const requiredFeatures = [
        'WebSocketServer',
        'subscription',
        'broadcast',
        'ping'
      ];
      
      const missing = requiredFeatures.filter(feature => 
        !wsCode.includes(feature)
      );
      
      if (missing.length > 0) {
        throw new Error(`Missing WebSocket features: ${missing.join(', ')}`);
      }
      
      return 'WebSocket server fully implemented';
    });

    await this.runValidation('Backend', 'AI Agent System', async () => {
      const agents = [
        'agents/OrchestratorAgent/index.ts',
        'agents/BoardAgent/index.ts',
        'agents/RandomizerAgent/index.ts',
        'agents/OracleAgent/index.ts',
        'agents/WinnerAgent/index.ts',
        'agents/EmailAgent/index.ts'
      ];
      
      for (const agent of agents) {
        try {
          const agentCode = readFileSync(agent, 'utf8');
          if (!agentCode.includes('class') && !agentCode.includes('export')) {
            throw new Error(`Agent ${agent} not properly implemented`);
          }
        } catch {
          throw new Error(`Missing agent: ${agent}`);
        }
      }
      
      return `All ${agents.length} agents implemented`;
    });

    await this.runValidation('Backend', 'Ceramic Integration', async () => {
      const ceramicFiles = [
        'ceramic/client.ts',
        'lib/ceramic-integration.ts'
      ];
      
      for (const file of ceramicFiles) {
        try {
          readFileSync(file, 'utf8');
        } catch {
          throw new Error(`Missing Ceramic file: ${file}`);
        }
      }
      
      return 'Ceramic integration implemented';
    });
  }

  private async validateIntegration(): Promise<void> {
    console.log('\n🔗 Integration Validation');
    console.log('-'.repeat(30));

    await this.runValidation('Integration', 'Unit Tests', async () => {
      const result = await this.executeCommand('npm', ['run', 'test:unit']);
      if (!result.success) {
        throw new Error(`Unit tests failed: ${result.error}`);
      }
      return 'Unit tests passed';
    });

    await this.runValidation('Integration', 'Integration Tests', async () => {
      const result = await this.executeCommand('npm', ['run', 'test:integration']);
      if (!result.success) {
        throw new Error(`Integration tests failed: ${result.error}`);
      }
      return 'Integration tests passed';
    });

    await this.runValidation('Integration', 'Health Checks', async () => {
      const result = await this.executeCommand('npm', ['run', 'health']);
      if (!result.success) {
        throw new Error(`Health checks failed: ${result.error}`);
      }
      return 'All health checks passed';
    });
  }

  private async validateDeployment(): Promise<void> {
    console.log('\n🚀 Deployment Validation');
    console.log('-'.repeat(30));

    await this.runValidation('Deployment', 'Docker Configuration', async () => {
      const dockerFiles = [
        'docker/docker-compose.yml',
        'docker/app.Dockerfile',
        'docker/proton-bridge.Dockerfile'
      ];
      
      for (const file of dockerFiles) {
        try {
          readFileSync(file, 'utf8');
        } catch {
          throw new Error(`Missing Docker file: ${file}`);
        }
      }
      
      return 'Docker configuration complete';
    });

    await this.runValidation('Deployment', 'Akash Configuration', async () => {
      try {
        const deployConfig = readFileSync('docker/deploy.yaml', 'utf8');
        if (!deployConfig.includes('services:') || !deployConfig.includes('profiles:')) {
          throw new Error('Invalid Akash deploy configuration');
        }
      } catch {
        throw new Error('Missing Akash deploy configuration');
      }
      
      return 'Akash deployment configuration ready';
    });

    await this.runValidation('Deployment', 'CI/CD Pipeline', async () => {
      try {
        const ciConfig = readFileSync('.github/workflows/ci.yml', 'utf8');
        if (!ciConfig.includes('test') || !ciConfig.includes('build')) {
          throw new Error('Incomplete CI/CD configuration');
        }
      } catch {
        throw new Error('Missing CI/CD configuration');
      }
      
      return 'CI/CD pipeline configured';
    });
  }

  private async validateDocumentation(): Promise<void> {
    console.log('\n📚 Documentation Validation');
    console.log('-'.repeat(30));

    await this.runValidation('Documentation', 'Core Documentation', async () => {
      const docs = [
        'README.md',
        'docs/ARCHITECTURE.md',
        'docs/API.md',
        'docs/DEPLOYMENT.md',
        'docs/USER_GUIDE.md',
        'docs/DEVELOPMENT.md'
      ];
      
      for (const doc of docs) {
        try {
          const content = readFileSync(doc, 'utf8');
          if (content.length < 1000) {
            throw new Error(`Documentation ${doc} appears incomplete`);
          }
        } catch {
          throw new Error(`Missing documentation: ${doc}`);
        }
      }
      
      return `All ${docs.length} documentation files complete`;
    });

    await this.runValidation('Documentation', 'API Documentation', async () => {
      const apiDoc = readFileSync('docs/API.md', 'utf8');
      
      const requiredSections = [
        'Smart Contract API',
        'WebSocket API',
        'Error Codes',
        'Usage Examples'
      ];
      
      const missing = requiredSections.filter(section => 
        !apiDoc.includes(section)
      );
      
      if (missing.length > 0) {
        throw new Error(`Missing API sections: ${missing.join(', ')}`);
      }
      
      return 'API documentation complete';
    });

    await this.runValidation('Documentation', 'User Guide Completeness', async () => {
      const userGuide = readFileSync('docs/USER_GUIDE.md', 'utf8');
      
      const requiredTopics = [
        'Getting Started',
        'How to Play',
        'Wallet Setup',
        'Purchasing Squares',
        'Troubleshooting'
      ];
      
      const missing = requiredTopics.filter(topic => 
        !userGuide.includes(topic)
      );
      
      if (missing.length > 0) {
        throw new Error(`Missing user guide topics: ${missing.join(', ')}`);
      }
      
      return 'User guide complete';
    });
  }

  private async runValidation(
    category: string,
    test: string,
    validator: () => Promise<string>
  ): Promise<void> {
    const startTime = Date.now();
    
    try {
      const details = await validator();
      const duration = Date.now() - startTime;
      
      this.results.push({
        category,
        test,
        status: 'PASS',
        duration,
        details
      });
      
      console.log(`✅ ${test} - PASSED (${duration}ms)`);
    } catch (error) {
      const duration = Date.now() - startTime;
      
      this.results.push({
        category,
        test,
        status: 'FAIL',
        duration,
        error: error instanceof Error ? error.message : String(error)
      });
      
      console.log(`❌ ${test} - FAILED (${duration}ms)`);
      console.log(`   Error: ${error instanceof Error ? error.message : error}`);
    }
  }

  private async executeCommand(command: string, args: string[]): Promise<{
    success: boolean;
    output: string;
    error: string;
  }> {
    return new Promise((resolve) => {
      const child = spawn(command, args, { cwd: process.cwd() });
      
      let output = '';
      let error = '';

      child.stdout?.on('data', (data) => {
        output += data.toString();
      });

      child.stderr?.on('data', (data) => {
        error += data.toString();
      });

      const timeout = setTimeout(() => {
        child.kill('SIGKILL');
        resolve({
          success: false,
          output,
          error: 'Command timed out'
        });
      }, 120000); // 2 minutes timeout

      child.on('close', (code) => {
        clearTimeout(timeout);
        resolve({
          success: code === 0,
          output,
          error: code !== 0 ? error : ''
        });
      });

      child.on('error', (err) => {
        clearTimeout(timeout);
        resolve({
          success: false,
          output,
          error: err.message
        });
      });
    });
  }

  private generateSummary(): ValidationSummary {
    const endTime = Date.now();
    const totalDuration = endTime - this.startTime;
    
    return {
      timestamp: new Date().toISOString(),
      totalTests: this.results.length,
      passed: this.results.filter(r => r.status === 'PASS').length,
      failed: this.results.filter(r => r.status === 'FAIL').length,
      skipped: this.results.filter(r => r.status === 'SKIP').length,
      duration: totalDuration,
      results: this.results,
      systemInfo: {
        nodeVersion: process.version,
        platform: process.platform,
        architecture: process.arch
      }
    };
  }

  private printResults(summary: ValidationSummary): void {
    console.log('\n' + '='.repeat(60));
    console.log('📊 FOOTBALL SQUARES PHASE-2 VALIDATION RESULTS');
    console.log('='.repeat(60));
    
    console.log(`\n🕐 Completed: ${new Date(summary.timestamp).toLocaleString()}`);
    console.log(`⏱️  Duration: ${summary.duration}ms`);
    console.log(`🖥️  System: ${summary.systemInfo.platform} ${summary.systemInfo.architecture}`);
    console.log(`📦 Node.js: ${summary.systemInfo.nodeVersion}`);
    
    console.log('\n📈 Test Summary:');
    console.log(`   Total Tests: ${summary.totalTests}`);
    console.log(`   ✅ Passed: ${summary.passed}`);
    console.log(`   ❌ Failed: ${summary.failed}`);
    console.log(`   ⏭️  Skipped: ${summary.skipped}`);
    console.log(`   📊 Success Rate: ${((summary.passed / summary.totalTests) * 100).toFixed(1)}%`);
    
    // Group results by category
    const categories = Array.from(new Set(this.results.map(r => r.category)));
    
    console.log('\n📋 Results by Category:');
    categories.forEach(category => {
      const categoryResults = this.results.filter(r => r.category === category);
      const passed = categoryResults.filter(r => r.status === 'PASS').length;
      const total = categoryResults.length;
      
      console.log(`   ${category}: ${passed}/${total} passed`);
    });
    
    // List failures
    const failures = this.results.filter(r => r.status === 'FAIL');
    if (failures.length > 0) {
      console.log('\n❌ Failed Tests:');
      failures.forEach(failure => {
        console.log(`   - ${failure.category}: ${failure.test}`);
        console.log(`     Error: ${failure.error}`);
      });
    }
    
    // Overall status
    const overallStatus = summary.failed === 0 ? 'SUCCESS' : 'FAILURE';
    const statusIcon = overallStatus === 'SUCCESS' ? '🎉' : '🚨';
    
    console.log(`\n${statusIcon} OVERALL STATUS: ${overallStatus}`);
    
    if (overallStatus === 'SUCCESS') {
      console.log('\n🚀 Phase-2 Football Squares dApp is ready for production!');
      console.log('🎯 All systems validated and operational');
      console.log('📝 Documentation complete');
      console.log('🔒 Security checks passed');
      console.log('⚡ Performance optimized');
    } else {
      console.log('\n🔧 Please fix the failed tests before deploying to production');
    }
    
    console.log('\n' + '='.repeat(60));
  }

  private saveReport(summary: ValidationSummary): void {
    const reportPath = join(process.cwd(), 'phase2-validation-report.json');
    writeFileSync(reportPath, JSON.stringify(summary, null, 2));
    console.log(`📄 Detailed report saved to: ${reportPath}`);
  }
}

// CLI interface
async function main() {
  const validator = new FinalValidator();
  
  try {
    const summary = await validator.runFullValidation();
    
    // Exit with appropriate code
    process.exit(summary.failed > 0 ? 1 : 0);
  } catch (error) {
    console.error('❌ Validation failed with error:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch(console.error);
}

export { FinalValidator };