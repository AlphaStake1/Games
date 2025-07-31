// agents/Dean/index.ts
/**
 * Dean - Head of Security Agent
 *
 * Responsibilities:
 * - Nightly codebase scan with Semgrep MCP (smart-contract ruleset)
 * - CVE feed polling (GitHub, NVD)
 * - Watches Solana RPC/webhooks for anomalies
 * - Logs to sys_internal and raises ⚠ alerts to Orchestrator
 *
 * Memory Scope: sys_internal only
 * Channels: Discord #alerts (optional)
 */

import { EventEmitter } from 'events';
import { exec } from 'child_process';
import { promisify } from 'util';
import { MEMORY_SCOPES } from '../../lib/memory';

const execAsync = promisify(exec);

export interface SecurityScanResult {
  timestamp: Date;
  scanType: 'semgrep' | 'cve' | 'rpc_anomaly';
  findings: SecurityFinding[];
  summary: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
}

export interface SecurityFinding {
  id: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  title: string;
  description: string;
  file?: string;
  line?: number;
  rule?: string;
  cve?: string;
  remediation?: string;
}

export interface DeanConfig {
  semgrepEnabled: boolean;
  cvePollingEnabled: boolean;
  rpcMonitoringEnabled: boolean;
  alertChannelWebhook?: string;
  scanSchedule: string; // cron format
}

export class DeanSecurityAgent extends EventEmitter {
  private config: DeanConfig;
  private memoryManager: any; // Will be IMemoryManager when fully integrated
  private isScanning: boolean = false;

  constructor(config: Partial<DeanConfig> = {}) {
    super();

    this.config = {
      semgrepEnabled: true,
      cvePollingEnabled: true,
      rpcMonitoringEnabled: true,
      scanSchedule: '0 2 * * *', // 2 AM daily
      ...config,
    };

    console.log('🛡️ Dean Security Agent initialized');
    this.setupMemoryManager();
  }

  private setupMemoryManager() {
    // TODO: Initialize with actual ElizaOS memory manager
    // this.memoryManager = createSystemMemory(baseMemoryManager, 'Dean_Security');
    console.log('📝 Memory manager setup (placeholder)');
  }

  /**
   * Run comprehensive security scan
   */
  async runSecurityScan(): Promise<SecurityScanResult> {
    if (this.isScanning) {
      throw new Error('Security scan already in progress');
    }

    this.isScanning = true;
    console.log('🔍 Starting security scan...');

    try {
      const findings: SecurityFinding[] = [];

      // Semgrep static analysis
      if (this.config.semgrepEnabled) {
        const semgrepFindings = await this.runSemgrepScan();
        findings.push(...semgrepFindings);
      }

      // CVE monitoring
      if (this.config.cvePollingEnabled) {
        const cveFindings = await this.checkCVEFeeds();
        findings.push(...cveFindings);
      }

      // RPC anomaly detection
      if (this.config.rpcMonitoringEnabled) {
        const rpcFindings = await this.checkRPCAnomalies();
        findings.push(...rpcFindings);
      }

      const result: SecurityScanResult = {
        timestamp: new Date(),
        scanType: 'semgrep', // Primary scan type
        findings,
        summary: this.summarizeFindings(findings),
      };

      await this.logScanResult(result);

      if (result.summary.critical > 0 || result.summary.high > 0) {
        await this.raiseAlert(result);
      }

      console.log(`✅ Security scan completed: ${findings.length} findings`);
      return result;
    } finally {
      this.isScanning = false;
    }
  }

  /**
   * Run Semgrep static analysis scan
   */
  private async runSemgrepScan(): Promise<SecurityFinding[]> {
    console.log('🔬 Running Semgrep analysis...');

    try {
      // Use the configured security scan commands
      const commands = [
        'pnpm run security:rust', // Scan Anchor programs
        'pnpm run security:frontend', // Scan TypeScript/React
        'pnpm run security:secrets', // Check for exposed secrets
      ];

      const findings: SecurityFinding[] = [];

      for (const command of commands) {
        try {
          const { stdout, stderr } = await execAsync(command, {
            timeout: 120000, // 2 minute timeout
          });

          // Parse Semgrep JSON output (if available)
          const commandFindings = this.parseSemgrepOutput(stdout, stderr);
          findings.push(...commandFindings);
        } catch (error) {
          // Semgrep returns non-zero exit code when findings exist
          if (error.code === 1 && error.stdout) {
            const commandFindings = this.parseSemgrepOutput(
              error.stdout,
              error.stderr,
            );
            findings.push(...commandFindings);
          } else {
            console.error(`Semgrep command failed: ${command}`, error);
            findings.push({
              id: `semgrep-error-${Date.now()}`,
              severity: 'HIGH',
              title: 'Semgrep Scan Failed',
              description: `Command: ${command}\nError: ${error.message}`,
              remediation: 'Check Semgrep configuration and Docker setup',
            });
          }
        }
      }

      return findings;
    } catch (error) {
      console.error('Semgrep scan failed:', error);
      return [
        {
          id: `semgrep-failure-${Date.now()}`,
          severity: 'CRITICAL',
          title: 'Security Scan System Failure',
          description: `Semgrep scanning system is not functional: ${error.message}`,
          remediation: 'Investigate Semgrep MCP setup and Docker configuration',
        },
      ];
    }
  }

  /**
   * Parse Semgrep output into security findings
   */
  private parseSemgrepOutput(
    stdout: string,
    stderr: string,
  ): SecurityFinding[] {
    const findings: SecurityFinding[] = [];

    try {
      // Try to parse as JSON first
      const jsonMatch = stdout.match(/\{.*\}/s);
      if (jsonMatch) {
        const results = JSON.parse(jsonMatch[0]);
        if (results.results) {
          return results.results.map((result: any) => ({
            id: result.check_id || `semgrep-${Date.now()}`,
            severity: this.mapSemgrepSeverity(result.extra?.severity),
            title: result.extra?.message || 'Security Issue Detected',
            description:
              result.extra?.message || 'Semgrep detected a security issue',
            file: result.path,
            line: result.start?.line,
            rule: result.check_id,
            remediation:
              result.extra?.fix || 'Review and fix the identified issue',
          }));
        }
      }

      // Fallback: parse text output
      const lines = stdout.split('\n');
      let currentFile = '';

      for (const line of lines) {
        if (line.includes('-->')) {
          const fileMatch = line.match(/([^:]+):(\d+)/);
          if (fileMatch) {
            currentFile = fileMatch[1];
            findings.push({
              id: `semgrep-text-${Date.now()}-${Math.random()}`,
              severity: 'MEDIUM',
              title: 'Security Issue Detected',
              description: line.trim(),
              file: currentFile,
              line: parseInt(fileMatch[2]),
              remediation: 'Review the flagged code section',
            });
          }
        }
      }
    } catch (parseError) {
      console.error('Failed to parse Semgrep output:', parseError);
      findings.push({
        id: `semgrep-parse-error-${Date.now()}`,
        severity: 'MEDIUM',
        title: 'Semgrep Output Parse Error',
        description: 'Could not parse Semgrep scan results',
        remediation: 'Check Semgrep output format configuration',
      });
    }

    return findings;
  }

  /**
   * Map Semgrep severity to our enum
   */
  private mapSemgrepSeverity(severity: string): SecurityFinding['severity'] {
    switch (severity?.toUpperCase()) {
      case 'ERROR':
        return 'CRITICAL';
      case 'WARNING':
        return 'HIGH';
      case 'INFO':
        return 'MEDIUM';
      default:
        return 'MEDIUM';
    }
  }

  /**
   * Check CVE feeds for vulnerabilities in dependencies
   */
  private async checkCVEFeeds(): Promise<SecurityFinding[]> {
    console.log('📊 Checking CVE feeds...');

    // TODO: Implement CVE feed monitoring
    // - GitHub Security Advisories API
    // - NVD API integration
    // - npm audit for Node.js dependencies
    // - cargo audit for Rust dependencies

    return [];
  }

  /**
   * Monitor Solana RPC for anomalies
   */
  private async checkRPCAnomalies(): Promise<SecurityFinding[]> {
    console.log('⛓️ Checking RPC anomalies...');

    // TODO: Implement RPC anomaly detection
    // - Unusual transaction patterns
    // - Suspicious account activities
    // - Rate limiting violations
    // - Failed transaction analysis

    return [];
  }

  /**
   * Summarize findings by severity
   */
  private summarizeFindings(findings: SecurityFinding[]) {
    return findings.reduce(
      (summary, finding) => {
        switch (finding.severity) {
          case 'CRITICAL':
            summary.critical++;
            break;
          case 'HIGH':
            summary.high++;
            break;
          case 'MEDIUM':
            summary.medium++;
            break;
          case 'LOW':
            summary.low++;
            break;
        }
        return summary;
      },
      { critical: 0, high: 0, medium: 0, low: 0 },
    );
  }

  /**
   * Log scan results to memory system
   */
  private async logScanResult(result: SecurityScanResult) {
    const logEntry = {
      timestamp: result.timestamp,
      agent: 'Dean_Security',
      action: 'security_scan',
      result: {
        findingsCount: result.findings.length,
        summary: result.summary,
        criticalFindings: result.findings
          .filter((f) => f.severity === 'CRITICAL')
          .map((f) => ({ id: f.id, title: f.title, file: f.file })),
      },
    };

    // TODO: Log to sys_internal memory scope
    console.log('📝 Logged scan result:', JSON.stringify(logEntry, null, 2));
  }

  /**
   * Raise alert for critical/high severity findings
   */
  private async raiseAlert(result: SecurityScanResult) {
    const alertLevel = result.summary.critical > 0 ? 'CRITICAL' : 'HIGH';
    const message =
      `🚨 SECURITY ALERT [${alertLevel}]\n` +
      `Critical: ${result.summary.critical}, High: ${result.summary.high}\n` +
      `Scan completed at: ${result.timestamp.toISOString()}`;

    console.log(message);

    // TODO: Send to Discord webhook if configured
    if (this.config.alertChannelWebhook) {
      await this.sendDiscordAlert(message, result);
    }

    // Emit event for Orchestrator
    this.emit('securityAlert', {
      level: alertLevel,
      summary: result.summary,
      findings: result.findings.filter(
        (f) => f.severity === 'CRITICAL' || f.severity === 'HIGH',
      ),
    });
  }

  /**
   * Send alert to Discord channel
   */
  private async sendDiscordAlert(message: string, result: SecurityScanResult) {
    // TODO: Implement Discord webhook integration
    console.log('💬 Discord alert (placeholder):', message);
  }

  /**
   * Health check
   */
  async healthCheck() {
    return {
      status: 'healthy',
      agent: 'Dean_Security',
      capabilities: [
        'semgrep_scanning',
        'cve_monitoring',
        'rpc_anomaly_detection',
        'alert_system',
      ],
      config: this.config,
      isScanning: this.isScanning,
    };
  }

  /**
   * Start scheduled security scanning
   */
  startScheduledScanning() {
    // TODO: Implement with Clockwork scheduler
    console.log(`📅 Scheduled scanning enabled: ${this.config.scanSchedule}`);
  }
}

export default DeanSecurityAgent;
