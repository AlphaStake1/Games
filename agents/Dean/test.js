// Quick test for Dean Security Agent
const { DeanSecurityAgent } = require('./index.js');

console.log('🛡️ Testing Dean Security Agent...\n');

async function testDean() {
  const dean = new DeanSecurityAgent({
    semgrepEnabled: true,
    cvePollingEnabled: false, // Skip for quick test
    rpcMonitoringEnabled: false, // Skip for quick test
  });

  console.log('1. Health Check:');
  const health = await dean.healthCheck();
  console.log(JSON.stringify(health, null, 2));

  console.log('\n2. Starting security scan...');
  try {
    const result = await dean.runSecurityScan();
    console.log(`\n✅ Scan completed:`);
    console.log(`   Findings: ${result.findings.length}`);
    console.log(`   Critical: ${result.summary.critical}`);
    console.log(`   High: ${result.summary.high}`);
    console.log(`   Medium: ${result.summary.medium}`);
    console.log(`   Low: ${result.summary.low}`);

    if (result.findings.length > 0) {
      console.log('\n📋 Sample findings:');
      result.findings.slice(0, 3).forEach((finding, i) => {
        console.log(`   ${i + 1}. [${finding.severity}] ${finding.title}`);
        if (finding.file)
          console.log(`      File: ${finding.file}:${finding.line || '?'}`);
      });
    }
  } catch (error) {
    console.log(`❌ Scan failed: ${error.message}`);
  }
}

testDean().catch(console.error);
