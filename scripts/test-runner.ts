// scripts/test-runner.ts
import { spawn, ChildProcess } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

interface TestSuite {
  name: string;
  command: string;
  args: string[];
  timeout: number;
  env?: Record<string, string>;
}

interface TestResult {
  suite: string;
  passed: boolean;
  duration: number;
  output: string;
  error?: string;
}

class TestRunner {
  private testSuites: TestSuite[] = [
    {
      name: 'Anchor Program Tests',
      command: 'anchor',
      args: ['test', '--skip-local-validator'],
      timeout: 120000, // 2 minutes
      env: {
        RPC_ENDPOINT: 'http://localhost:8899',
      },
    },
    {
      name: 'TypeScript Compilation',
      command: 'npx',
      args: ['tsc', '--noEmit'],
      timeout: 60000, // 1 minute
    },
    {
      name: 'ESLint',
      command: 'npm',
      args: ['run', 'lint'],
      timeout: 60000, // 1 minute
    },
    {
      name: 'Unit Tests',
      command: 'npx',
      args: ['mocha', 'tests/anchor.test.ts', '--require', 'ts-node/register'],
      timeout: 180000, // 3 minutes
      env: {
        NODE_ENV: 'test',
        RPC_ENDPOINT: 'http://localhost:8899',
      },
    },
    {
      name: 'Integration Tests',
      command: 'npx',
      args: [
        'mocha',
        'tests/integration.test.ts',
        '--require',
        'ts-node/register',
      ],
      timeout: 300000, // 5 minutes
      env: {
        NODE_ENV: 'test',
        RPC_ENDPOINT: 'http://localhost:8899',
        WS_PORT: '8081',
      },
    },
    {
      name: 'Agent Health Checks',
      command: 'npx',
      args: ['ts-node', 'scripts/health-check.ts'],
      timeout: 60000, // 1 minute
    },
    {
      name: 'Security Audit',
      command: 'npm',
      args: ['audit', '--audit-level=high'],
      timeout: 120000, // 2 minutes
    },
  ];

  private results: TestResult[] = [];

  async runAllTests(): Promise<void> {
    console.log('🧪 Starting Football Squares Test Suite');
    console.log('=====================================\n');

    const startTime = Date.now();

    for (const suite of this.testSuites) {
      await this.runTestSuite(suite);
    }

    const endTime = Date.now();
    const totalDuration = endTime - startTime;

    this.printResults(totalDuration);
    this.generateReport();

    const failed = this.results.filter((r) => !r.passed);
    if (failed.length > 0) {
      process.exit(1);
    }
  }

  private async runTestSuite(suite: TestSuite): Promise<void> {
    console.log(`🔍 Running: ${suite.name}`);

    const startTime = Date.now();
    let output = '';
    let error = '';

    try {
      const result = await this.executeCommand(suite);
      const endTime = Date.now();
      const duration = endTime - startTime;

      this.results.push({
        suite: suite.name,
        passed: result.success,
        duration,
        output: result.output,
        error: result.error,
      });

      if (result.success) {
        console.log(`✅ ${suite.name} - PASSED (${duration}ms)\n`);
      } else {
        console.log(`❌ ${suite.name} - FAILED (${duration}ms)`);
        console.log(`Error: ${result.error}\n`);
      }
    } catch (error) {
      const endTime = Date.now();
      const duration = endTime - startTime;

      this.results.push({
        suite: suite.name,
        passed: false,
        duration,
        output: '',
        error: error.toString(),
      });

      console.log(`❌ ${suite.name} - FAILED (${duration}ms)`);
      console.log(`Error: ${error}\n`);
    }
  }

  private executeCommand(
    suite: TestSuite,
  ): Promise<{ success: boolean; output: string; error: string }> {
    return new Promise((resolve) => {
      const env = { ...process.env, ...suite.env };
      const child = spawn(suite.command, suite.args, {
        env,
        cwd: process.cwd(),
      });

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
          error: `Test timed out after ${suite.timeout}ms`,
        });
      }, suite.timeout);

      child.on('close', (code) => {
        clearTimeout(timeout);
        resolve({
          success: code === 0,
          output,
          error: code !== 0 ? error : '',
        });
      });

      child.on('error', (err) => {
        clearTimeout(timeout);
        resolve({
          success: false,
          output,
          error: err.message,
        });
      });
    });
  }

  private printResults(totalDuration: number): void {
    console.log('\n📊 Test Results Summary');
    console.log('=======================');

    const passed = this.results.filter((r) => r.passed).length;
    const failed = this.results.filter((r) => !r.passed).length;
    const total = this.results.length;

    console.log(`Total Tests: ${total}`);
    console.log(`Passed: ${passed} ✅`);
    console.log(`Failed: ${failed} ❌`);
    console.log(`Success Rate: ${((passed / total) * 100).toFixed(1)}%`);
    console.log(`Total Duration: ${totalDuration}ms`);

    if (failed > 0) {
      console.log('\n❌ Failed Tests:');
      this.results
        .filter((r) => !r.passed)
        .forEach((result) => {
          console.log(`  - ${result.suite}: ${result.error}`);
        });
    }

    console.log('\n⏱️ Test Durations:');
    this.results.forEach((result) => {
      const status = result.passed ? '✅' : '❌';
      console.log(`  ${status} ${result.suite}: ${result.duration}ms`);
    });
  }

  private generateReport(): void {
    const reportPath = path.join(process.cwd(), 'test-results.json');
    const report = {
      timestamp: new Date().toISOString(),
      totalTests: this.results.length,
      passed: this.results.filter((r) => r.passed).length,
      failed: this.results.filter((r) => !r.passed).length,
      totalDuration: this.results.reduce((sum, r) => sum + r.duration, 0),
      results: this.results,
    };

    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`\n📄 Test report saved to: ${reportPath}`);
  }

  async runSingleTest(suiteName: string): Promise<void> {
    const suite = this.testSuites.find((s) =>
      s.name.toLowerCase().includes(suiteName.toLowerCase()),
    );

    if (!suite) {
      console.error(`❌ Test suite "${suiteName}" not found`);
      console.log('Available test suites:');
      this.testSuites.forEach((s) => console.log(`  - ${s.name}`));
      process.exit(1);
    }

    await this.runTestSuite(suite);
    this.printResults(this.results[0]?.duration || 0);
  }

  async validateEnvironment(): Promise<boolean> {
    console.log('🔍 Validating test environment...\n');

    const checks = [
      {
        name: 'Node.js version',
        check: () => {
          const version = process.version;
          const major = parseInt(version.slice(1).split('.')[0]);
          return major >= 16;
        },
      },
      {
        name: 'Solana CLI',
        check: async () => {
          try {
            const result = await this.executeCommand({
              name: 'solana-version',
              command: 'solana',
              args: ['--version'],
              timeout: 10000,
            });
            return result.success;
          } catch {
            return false;
          }
        },
      },
      {
        name: 'Anchor CLI',
        check: async () => {
          try {
            const result = await this.executeCommand({
              name: 'anchor-version',
              command: 'anchor',
              args: ['--version'],
              timeout: 10000,
            });
            return result.success;
          } catch {
            return false;
          }
        },
      },
      {
        name: 'Required environment variables',
        check: () => {
          const required = ['RPC_ENDPOINT'];
          return required.every((key) => process.env[key]);
        },
      },
      {
        name: 'Test dependencies',
        check: () => {
          const packageJsonPath = path.join(process.cwd(), 'package.json');
          if (!fs.existsSync(packageJsonPath)) return false;

          const packageJson = JSON.parse(
            fs.readFileSync(packageJsonPath, 'utf8'),
          );
          const devDeps = packageJson.devDependencies || {};

          return ['mocha', 'chai', 'ts-node'].every((dep) => devDeps[dep]);
        },
      },
    ];

    let allPassed = true;

    for (const check of checks) {
      try {
        const passed = await check.check();
        console.log(`${passed ? '✅' : '❌'} ${check.name}`);
        if (!passed) allPassed = false;
      } catch (error) {
        console.log(`❌ ${check.name} - ${error}`);
        allPassed = false;
      }
    }

    console.log(
      `\n${allPassed ? '✅' : '❌'} Environment validation ${allPassed ? 'passed' : 'failed'}\n`,
    );
    return allPassed;
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  const runner = new TestRunner();

  switch (command) {
    case 'all':
    case undefined:
      const envValid = await runner.validateEnvironment();
      if (!envValid) {
        console.error(
          '❌ Environment validation failed. Please fix the issues above.',
        );
        process.exit(1);
      }
      await runner.runAllTests();
      break;

    case 'validate':
      await runner.validateEnvironment();
      break;

    case 'single':
      if (args.length < 2) {
        console.error('Usage: npm run test single <test-name>');
        process.exit(1);
      }
      await runner.runSingleTest(args[1]);
      break;

    default:
      console.log('Football Squares Test Runner');
      console.log('Usage:');
      console.log('  npm run test              # Run all tests');
      console.log('  npm run test all          # Run all tests');
      console.log('  npm run test validate     # Validate environment');
      console.log('  npm run test single <name> # Run specific test');
      break;
  }
}

if (require.main === module) {
  main().catch(console.error);
}

export { TestRunner };
