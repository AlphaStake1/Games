/**
 * Testing Orchestrator Agent for Football Squares Platform
 *
 * Coordinates automated testing across the platform focusing on:
 * - Integration testing between components
 * - Agent workflow validation
 * - Frontend component testing
 * - API endpoint testing
 * - Performance benchmarking (non-security critical)
 */

import { EventEmitter } from 'events';
import * as fs from 'fs/promises';
import * as path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as dotenv from 'dotenv';

dotenv.config();

const execAsync = promisify(exec);

interface TestSuite {
  name: string;
  type: 'unit' | 'integration' | 'component' | 'api' | 'performance';
  files: string[];
  commands: string[];
  environment: 'localnet' | 'devnet' | 'testnet';
  dependencies: string[];
  timeout: number;
}

interface TestResult {
  suite: string;
  status: 'passed' | 'failed' | 'skipped' | 'timeout';
  duration: number;
  details: {
    total: number;
    passed: number;
    failed: number;
    skipped: number;
  };
  coverage?: number;
  output: string;
  errors: string[];
}

interface TestPlan {
  suites: TestSuite[];
  schedule: 'immediate' | 'nightly' | 'on_change';
  parallel: boolean;
  maxConcurrency: number;
}

export class TestingOrchestrator extends EventEmitter {
  private activeSuites: Map<string, TestSuite> = new Map();
  private testResults: Map<string, TestResult[]> = new Map();
  private runningTests: Set<string> = new Set();
  private testHistory: TestResult[] = [];

  constructor() {
    super();
    this.initializeTestSuites();
    console.log('TestingOrchestrator initialized');
  }

  /**
   * Initialize predefined test suites for the platform
   */
  private initializeTestSuites(): void {
    const suites: TestSuite[] = [
      {
        name: 'agent_integration',
        type: 'integration',
        files: ['agents/*/index.ts'],
        commands: ['pnpm test:agents'],
        environment: 'localnet',
        dependencies: [],
        timeout: 300000, // 5 minutes
      },
      {
        name: 'frontend_components',
        type: 'component',
        files: ['app/**/*.tsx', 'components/**/*.tsx'],
        commands: ['pnpm test:components'],
        environment: 'testnet',
        dependencies: [],
        timeout: 180000, // 3 minutes
      },
      {
        name: 'api_endpoints',
        type: 'api',
        files: ['api/**/*.ts', 'app/api/**/*.ts'],
        commands: ['pnpm test:api'],
        environment: 'localnet',
        dependencies: [],
        timeout: 120000, // 2 minutes
      },
      {
        name: 'documentation_generation',
        type: 'integration',
        files: ['agents/DocumentationAgent/index.ts'],
        commands: ['pnpm test:docs'],
        environment: 'localnet',
        dependencies: [],
        timeout: 240000, // 4 minutes
      },
      {
        name: 'code_review_validation',
        type: 'integration',
        files: ['agents/CodeReviewAgent/index.ts'],
        commands: ['pnpm test:review'],
        environment: 'localnet',
        dependencies: [],
        timeout: 180000, // 3 minutes
      },
      {
        name: 'orchestrator_coordination',
        type: 'integration',
        files: ['agents/OrchestratorAgent/index.ts'],
        commands: ['pnpm test:orchestrator'],
        environment: 'localnet',
        dependencies: ['agent_integration'],
        timeout: 360000, // 6 minutes
      },
      {
        name: 'performance_benchmark',
        type: 'performance',
        files: ['**/*.ts', '**/*.tsx'],
        commands: ['pnpm test:performance'],
        environment: 'localnet',
        dependencies: ['frontend_components', 'api_endpoints'],
        timeout: 600000, // 10 minutes
      },
    ];

    suites.forEach((suite) => {
      this.activeSuites.set(suite.name, suite);
    });

    console.log(`Initialized ${suites.length} test suites`);
  }

  /**
   * Run a specific test suite
   */
  async runTestSuite(suiteName: string): Promise<TestResult> {
    const suite = this.activeSuites.get(suiteName);
    if (!suite) {
      throw new Error(`Test suite not found: ${suiteName}`);
    }

    if (this.runningTests.has(suiteName)) {
      throw new Error(`Test suite already running: ${suiteName}`);
    }

    this.runningTests.add(suiteName);
    this.emit('testSuiteStarted', { suite: suiteName });

    try {
      console.log(`Starting test suite: ${suiteName}`);
      const startTime = Date.now();

      // Check dependencies
      await this.validateDependencies(suite.dependencies);

      // Setup environment
      await this.setupTestEnvironment(suite.environment);

      // Run tests
      const result = await this.executeTestSuite(suite);
      result.duration = Date.now() - startTime;

      // Store results
      this.storeTestResult(suiteName, result);
      this.testHistory.push(result);

      this.emit('testSuiteCompleted', { suite: suiteName, result });
      console.log(`Test suite completed: ${suiteName} - ${result.status}`);

      return result;
    } catch (error) {
      const errorResult: TestResult = {
        suite: suiteName,
        status: 'failed',
        duration: Date.now() - Date.now(),
        details: { total: 0, passed: 0, failed: 1, skipped: 0 },
        output: '',
        errors: [error instanceof Error ? error.message : String(error)],
      };

      this.storeTestResult(suiteName, errorResult);
      this.emit('testSuiteFailed', { suite: suiteName, error });
      console.error(`Test suite failed: ${suiteName}`, error);

      return errorResult;
    } finally {
      this.runningTests.delete(suiteName);
    }
  }

  /**
   * Run multiple test suites in sequence or parallel
   */
  async runTestPlan(plan: TestPlan): Promise<TestResult[]> {
    console.log(`Executing test plan with ${plan.suites.length} suites`);

    if (plan.parallel) {
      return this.runTestsInParallel(plan.suites, plan.maxConcurrency);
    } else {
      return this.runTestsInSequence(plan.suites);
    }
  }

  /**
   * Run tests for changed files
   */
  async runTestsForChangedFiles(changedFiles: string[]): Promise<TestResult[]> {
    const relevantSuites = this.findRelevantTestSuites(changedFiles);

    console.log(`Running tests for ${changedFiles.length} changed files`);
    console.log(`Found ${relevantSuites.length} relevant test suites`);

    const results: TestResult[] = [];
    for (const suite of relevantSuites) {
      try {
        const result = await this.runTestSuite(suite.name);
        results.push(result);
      } catch (error) {
        console.error(`Failed to run test suite ${suite.name}:`, error);
      }
    }

    return results;
  }

  /**
   * Generate comprehensive test report
   */
  async generateTestReport(): Promise<string> {
    const allResults = Array.from(this.testResults.values()).flat();
    const recentResults = this.testHistory.slice(-20); // Last 20 test runs

    const report = `# Football Squares Platform Test Report

## Summary
- **Total Test Suites**: ${this.activeSuites.size}
- **Recent Test Runs**: ${recentResults.length}
- **Success Rate**: ${this.calculateSuccessRate(recentResults)}%
- **Average Duration**: ${this.calculateAverageDuration(recentResults)}ms

## Test Suite Status
${Array.from(this.activeSuites.entries())
  .map(([name, suite]) => {
    const latestResult = this.getLatestResult(name);
    return `### ${name} (${suite.type})
- **Status**: ${latestResult?.status || 'Not Run'}
- **Last Run**: ${latestResult ? new Date(Date.now() - latestResult.duration).toISOString() : 'Never'}
- **Coverage**: ${latestResult?.coverage || 'N/A'}%
- **Files**: ${suite.files.length}
- **Environment**: ${suite.environment}`;
  })
  .join('\n\n')}

## Performance Metrics
${this.generatePerformanceMetrics()}

## Recent Failures
${this.generateFailureAnalysis(recentResults)}

## Recommendations
${this.generateRecommendations()}

---
*Generated by TestingOrchestrator on ${new Date().toISOString()}*
`;

    // Save report to file
    const reportsDir = path.join(process.cwd(), 'reports', 'testing');
    await fs.mkdir(reportsDir, { recursive: true });

    const reportFile = path.join(reportsDir, `test-report-${Date.now()}.md`);
    await fs.writeFile(reportFile, report, 'utf-8');

    console.log(`Test report generated: ${reportFile}`);
    return report;
  }

  /**
   * Watch for file changes and trigger relevant tests
   */
  async startWatchMode(patterns: string[]): Promise<void> {
    console.log(
      `Starting test watch mode for patterns: ${patterns.join(', ')}`,
    );

    // Simple file watching implementation
    // In production, use a proper file watcher like chokidar
    setInterval(async () => {
      try {
        const changedFiles = await this.detectChangedFiles(patterns);
        if (changedFiles.length > 0) {
          console.log(`Detected changes in ${changedFiles.length} files`);
          await this.runTestsForChangedFiles(changedFiles);
        }
      } catch (error) {
        console.error('Error in watch mode:', error);
      }
    }, 30000); // Check every 30 seconds
  }

  /**
   * Execute a single test suite
   */
  private async executeTestSuite(suite: TestSuite): Promise<TestResult> {
    const result: TestResult = {
      suite: suite.name,
      status: 'failed',
      duration: 0,
      details: { total: 0, passed: 0, failed: 0, skipped: 0 },
      output: '',
      errors: [],
    };

    try {
      // Create test-specific environment variables
      const testEnv = {
        ...process.env,
        NODE_ENV: 'test',
        SOLANA_CLUSTER: suite.environment,
      };

      const outputs: string[] = [];
      const errors: string[] = [];

      // Execute each command in the suite
      for (const command of suite.commands) {
        try {
          console.log(`Executing: ${command}`);

          const { stdout, stderr } = await execAsync(command, {
            timeout: suite.timeout,
            env: testEnv,
            cwd: process.cwd(),
          });

          outputs.push(stdout);
          if (stderr) {
            errors.push(stderr);
          }

          // Parse test results from output
          const testStats = this.parseTestOutput(stdout);
          result.details.total += testStats.total;
          result.details.passed += testStats.passed;
          result.details.failed += testStats.failed;
          result.details.skipped += testStats.skipped;
        } catch (error: any) {
          console.error(`Command failed: ${command}`, error);
          errors.push(error.message || String(error));
          result.details.failed += 1;
        }
      }

      result.output = outputs.join('\n');
      result.errors = errors;

      // Determine overall status
      if (result.details.failed === 0) {
        result.status = result.details.total === 0 ? 'skipped' : 'passed';
      } else {
        result.status = 'failed';
      }

      // Extract coverage if available
      result.coverage = this.extractCoverage(result.output);
    } catch (error) {
      result.errors.push(
        error instanceof Error ? error.message : String(error),
      );
      result.status = 'failed';
    }

    return result;
  }

  /**
   * Run tests in parallel with concurrency limit
   */
  private async runTestsInParallel(
    suites: TestSuite[],
    maxConcurrency: number,
  ): Promise<TestResult[]> {
    const results: TestResult[] = [];
    const semaphore = new Array(maxConcurrency).fill(null);

    const runSuite = async (suite: TestSuite): Promise<void> => {
      const result = await this.runTestSuite(suite.name);
      results.push(result);
    };

    const promises = suites.map((suite) => runSuite(suite));
    await Promise.allSettled(promises);

    return results;
  }

  /**
   * Run tests in sequence
   */
  private async runTestsInSequence(suites: TestSuite[]): Promise<TestResult[]> {
    const results: TestResult[] = [];

    for (const suite of suites) {
      const result = await this.runTestSuite(suite.name);
      results.push(result);
    }

    return results;
  }

  /**
   * Find test suites relevant to changed files
   */
  private findRelevantTestSuites(changedFiles: string[]): TestSuite[] {
    const relevantSuites: TestSuite[] = [];

    for (const suite of this.activeSuites.values()) {
      const isRelevant = suite.files.some((pattern) =>
        changedFiles.some((file) => this.matchesPattern(file, pattern)),
      );

      if (isRelevant) {
        relevantSuites.push(suite);
      }
    }

    return relevantSuites;
  }

  /**
   * Simple pattern matching for file paths
   */
  private matchesPattern(filePath: string, pattern: string): boolean {
    // Convert glob pattern to regex (simplified)
    const regexPattern = pattern
      .replace(/\*\*/g, '.*')
      .replace(/\*/g, '[^/]*')
      .replace(/\?/g, '[^/]');

    const regex = new RegExp(`^${regexPattern}$`);
    return regex.test(filePath);
  }

  /**
   * Validate test dependencies
   */
  private async validateDependencies(dependencies: string[]): Promise<void> {
    for (const dep of dependencies) {
      const latestResult = this.getLatestResult(dep);
      if (!latestResult || latestResult.status !== 'passed') {
        throw new Error(`Dependency test suite failed or not run: ${dep}`);
      }
    }
  }

  /**
   * Setup test environment
   */
  private async setupTestEnvironment(environment: string): Promise<void> {
    console.log(`Setting up test environment: ${environment}`);

    // Environment-specific setup
    switch (environment) {
      case 'localnet':
        // Ensure localnet is running
        try {
          await execAsync(
            'pgrep solana-test-validator || echo "validator not running"',
          );
        } catch (error) {
          console.warn('Localnet validator may not be running');
        }
        break;
      case 'devnet':
      case 'testnet':
        // Verify network connectivity
        break;
    }
  }

  /**
   * Parse test output to extract statistics
   */
  private parseTestOutput(output: string): {
    total: number;
    passed: number;
    failed: number;
    skipped: number;
  } {
    // Simple parsing - in production, use proper test result parsers
    const lines = output.split('\n');

    let total = 0,
      passed = 0,
      failed = 0,
      skipped = 0;

    for (const line of lines) {
      if (line.includes('passing')) {
        const match = line.match(/(\d+) passing/);
        if (match) passed += parseInt(match[1]);
      }
      if (line.includes('failing')) {
        const match = line.match(/(\d+) failing/);
        if (match) failed += parseInt(match[1]);
      }
      if (line.includes('pending')) {
        const match = line.match(/(\d+) pending/);
        if (match) skipped += parseInt(match[1]);
      }
    }

    total = passed + failed + skipped;

    return { total, passed, failed, skipped };
  }

  /**
   * Extract coverage percentage from output
   */
  private extractCoverage(output: string): number | undefined {
    const coverageMatch = output.match(/coverage[:\s]*(\d+(?:\.\d+)?)/i);
    return coverageMatch ? parseFloat(coverageMatch[1]) : undefined;
  }

  /**
   * Store test result
   */
  private storeTestResult(suiteName: string, result: TestResult): void {
    if (!this.testResults.has(suiteName)) {
      this.testResults.set(suiteName, []);
    }

    const results = this.testResults.get(suiteName)!;
    results.push(result);

    // Keep only last 50 results per suite
    if (results.length > 50) {
      results.shift();
    }
  }

  /**
   * Get latest result for a test suite
   */
  private getLatestResult(suiteName: string): TestResult | undefined {
    const results = this.testResults.get(suiteName);
    return results ? results[results.length - 1] : undefined;
  }

  /**
   * Calculate success rate
   */
  private calculateSuccessRate(results: TestResult[]): number {
    if (results.length === 0) return 0;
    const passed = results.filter((r) => r.status === 'passed').length;
    return Math.round((passed / results.length) * 100);
  }

  /**
   * Calculate average duration
   */
  private calculateAverageDuration(results: TestResult[]): number {
    if (results.length === 0) return 0;
    const total = results.reduce((sum, r) => sum + r.duration, 0);
    return Math.round(total / results.length);
  }

  /**
   * Generate performance metrics
   */
  private generatePerformanceMetrics(): string {
    const perfResults = this.testHistory.filter((r) =>
      r.suite.includes('performance'),
    );

    if (perfResults.length === 0) {
      return 'No performance test results available.';
    }

    return `- **Performance Tests Run**: ${perfResults.length}
- **Average Performance Test Duration**: ${this.calculateAverageDuration(perfResults)}ms
- **Last Performance Test**: ${perfResults[perfResults.length - 1]?.status || 'N/A'}`;
  }

  /**
   * Generate failure analysis
   */
  private generateFailureAnalysis(results: TestResult[]): string {
    const failures = results.filter((r) => r.status === 'failed');

    if (failures.length === 0) {
      return 'No recent failures detected.';
    }

    return failures
      .slice(-5)
      .map((failure) => `- **${failure.suite}**: ${failure.errors.join(', ')}`)
      .join('\n');
  }

  /**
   * Generate recommendations
   */
  private generateRecommendations(): string {
    const recommendations: string[] = [];

    const recentResults = this.testHistory.slice(-10);
    const successRate = this.calculateSuccessRate(recentResults);

    if (successRate < 80) {
      recommendations.push(
        '- Test success rate is below 80%. Review failing tests and improve stability.',
      );
    }

    const avgDuration = this.calculateAverageDuration(recentResults);
    if (avgDuration > 300000) {
      // 5 minutes
      recommendations.push(
        '- Test suite duration is high. Consider optimizing test performance.',
      );
    }

    if (recommendations.length === 0) {
      recommendations.push(
        '- Test suite is performing well. Continue monitoring.',
      );
    }

    return recommendations.join('\n');
  }

  /**
   * Detect changed files (simplified implementation)
   */
  private async detectChangedFiles(patterns: string[]): Promise<string[]> {
    // In production, use proper git diff or file watching
    // This is a simplified implementation
    try {
      const { stdout } = await execAsync('git diff --name-only HEAD~1');
      const changedFiles = stdout.trim().split('\n').filter(Boolean);

      return changedFiles.filter((file) =>
        patterns.some((pattern) => this.matchesPattern(file, pattern)),
      );
    } catch (error) {
      console.warn('Could not detect changed files:', error);
      return [];
    }
  }

  /**
   * Get comprehensive testing statistics
   */
  getTestingStats(): {
    totalSuites: number;
    activeSuites: number;
    recentRuns: number;
    successRate: number;
    averageDuration: number;
    coverage: number;
  } {
    const recentResults = this.testHistory.slice(-20);
    const coverageResults = recentResults.filter(
      (r) => r.coverage !== undefined,
    );
    const avgCoverage =
      coverageResults.length > 0
        ? coverageResults.reduce((sum, r) => sum + (r.coverage || 0), 0) /
          coverageResults.length
        : 0;

    return {
      totalSuites: this.activeSuites.size,
      activeSuites: this.activeSuites.size,
      recentRuns: this.testHistory.length,
      successRate: this.calculateSuccessRate(recentResults),
      averageDuration: this.calculateAverageDuration(recentResults),
      coverage: Math.round(avgCoverage),
    };
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<boolean> {
    try {
      // Test basic Node.js functionality
      await execAsync('node --version', { timeout: 5000 });

      // Test package manager
      await execAsync('pnpm --version', { timeout: 5000 });

      return true;
    } catch (error) {
      console.error('TestingOrchestrator health check failed:', error);
      return false;
    }
  }
}

export default TestingOrchestrator;
