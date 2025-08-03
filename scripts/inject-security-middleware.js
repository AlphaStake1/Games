#!/usr/bin/env node
/**
 * Security Middleware Injection Script
 * Integrates Universal Security Layer into existing ElizaOS agents
 */

const fs = require('fs');
const path = require('path');

// Agents that need security integration
const AGENTS_TO_SECURE = [
  'Coach_B',
  'Trainer_Reviva',
  'Morgan_Reese',
  'OC_Phil',
  'Coach_Right',
  'Dean',
];

/**
 * Inject security middleware into ElizaOS agent configuration
 */
function injectSecurityMiddleware() {
  console.log('🔧 Injecting security middleware into ElizaOS agents...');

  try {
    // 1. Read current eliza-config
    const configPath = path.join(
      __dirname,
      '../eliza-config/eliza-config.json',
    );
    const configData = JSON.parse(fs.readFileSync(configPath, 'utf8'));

    // 2. Add security plugin to global plugins
    if (!configData.plugins.includes('footballsquares-security')) {
      configData.plugins.push('footballsquares-security');
      console.log('✅ Added security plugin to global plugins list');
    }

    // 3. Add security middleware to each character
    configData.characters.forEach((character) => {
      if (AGENTS_TO_SECURE.includes(character.name.replace(/\s+/g, '_'))) {
        // Add security actions to existing actions
        const securityActions = [
          'processSecurityThreat',
          'escalateToSecurity',
          'logSecurityEvent',
        ];

        character.actions = character.actions || [];
        securityActions.forEach((action) => {
          if (!character.actions.includes(action)) {
            character.actions.push(action);
          }
        });

        // Add security plugin to character plugins
        character.plugins = character.plugins || [];
        if (!character.plugins.includes('footballsquares-security')) {
          character.plugins.push('footballsquares-security');
        }

        // Add security configuration
        character.security = {
          enabled: true,
          threatDetection: true,
          autoBlock: character.name === 'Dean' ? false : true, // Dean handles manually
          alertThreshold: getAlertThreshold(character.name),
          responseTemplates: true,
        };

        console.log(`✅ Secured agent: ${character.name}`);
      }
    });

    // 4. Add security memory scope
    configData.memoryScopes = configData.memoryScopes || {};
    configData.memoryScopes.SECURITY_EVENTS = {
      description: 'Security events and threat assessments',
      retention: '90 days',
      accessible: ['Dean', 'Commissioner_Jerry'],
      encrypted: true,
    };

    // 5. Save updated configuration
    fs.writeFileSync(configPath, JSON.stringify(configData, null, 2));
    console.log('✅ Updated eliza-config.json with security integration');

    // 6. Create security plugin directory structure
    createSecurityPlugin();

    // 7. Generate integration test
    generateIntegrationTest();

    console.log('🛡️ Security middleware injection completed successfully!');
  } catch (error) {
    console.error('❌ Failed to inject security middleware:', error);
    process.exit(1);
  }
}

/**
 * Get appropriate alert threshold for each agent type
 */
function getAlertThreshold(agentName) {
  const thresholds = {
    'Coach B': 60, // Public-facing, moderate threshold
    'Trainer Reviva': 40, // Handles sensitive wallet issues, lower threshold
    'Morgan Reese': 50, // Business contacts, moderate threshold
    'OC Phil': 60, // Community focused, moderate threshold
    'Coach Right': 70, // Moderation context, higher threshold
    Dean: 30, // Security agent, lowest threshold
  };

  return thresholds[agentName] || 50;
}

/**
 * Create the security plugin structure
 */
function createSecurityPlugin() {
  const pluginDir = path.join(__dirname, '../lib/security/plugin');

  // Create plugin directory
  if (!fs.existsSync(pluginDir)) {
    fs.mkdirSync(pluginDir, { recursive: true });
  }

  // Create plugin index file
  const pluginContent = `
import { Plugin } from '@ai16z/eliza';
import { UniversalSecurityLayer, securityMiddleware } from '../UniversalSecurityLayer';

/**
 * Football Squares Security Plugin
 * Integrates security layer with ElizaOS agents
 */
export const footballSquaresSecurityPlugin: Plugin = {
  name: 'footballsquares-security',
  description: 'Universal security layer for Football Squares agents',
  
  actions: [
    {
      name: 'processSecurityThreat',
      similes: ['assess_threat', 'check_security', 'security_scan'],
      description: 'Processes incoming messages for security threats',
      validate: async (runtime, message) => {
        return message.content?.text?.length > 0;
      },
      handler: async (runtime, message, state) => {
        const securityLayer = new UniversalSecurityLayer();
        const result = await securityLayer.processMessage(
          runtime.character.name,
          message.userId,
          message.content.text,
          '' // No proposed response yet
        );
        
        // Execute security actions
        for (const action of result.actions) {
          await executeSecurityAction(action, runtime);
        }
        
        return result;
      }
    },
    
    {
      name: 'escalateToSecurity',
      similes: ['alert_security', 'security_escalation'],
      description: 'Escalates security threats to Dean',
      validate: async (runtime, message) => {
        return message.content?.securityAlert === true;
      },
      handler: async (runtime, message, state) => {
        // Send alert to Dean
        await runtime.messageManager.createMemory({
          userId: 'Dean',
          content: {
            text: \`Security Alert from \${runtime.character.name}: \${message.content.text}\`,
            securityAlert: true,
            severity: message.content.severity || 'medium',
            originalUserId: message.userId
          },
          roomId: 'security-room'
        });
        
        return true;
      }
    },
    
    {
      name: 'logSecurityEvent', 
      similes: ['security_log', 'log_threat'],
      description: 'Logs security events for audit trail',
      validate: async (runtime, message) => {
        return message.content?.securityEvent === true;
      },
      handler: async (runtime, message, state) => {
        // Log to security memory scope
        await runtime.memoryManager.createMemory({
          content: message.content,
          roomId: 'SECURITY_EVENTS',
          userId: 'system'
        });
        
        return true;
      }
    }
  ],
  
  evaluators: [],
  providers: []
};

/**
 * Execute security actions
 */
async function executeSecurityAction(action, runtime) {
  switch (action.type) {
    case 'quarantine_user':
      // Add user to quarantine list
      await runtime.memoryManager.createMemory({
        userId: 'system',
        content: {
          action: 'user_quarantined',
          userId: action.userId,
          reason: action.reason,
          timestamp: action.timestamp,
          agentId: action.agentId
        },
        roomId: 'SECURITY_EVENTS'
      });
      break;
      
    case 'alert_dean':
      // Send alert to Dean
      await runtime.messageManager.createMemory({
        userId: 'Dean',
        content: {
          text: \`Security Alert: \${action.reason}\`,
          securityAlert: true,
          severity: action.severity,
          timestamp: action.timestamp,
          sourceAgent: action.agentId
        },
        roomId: 'security-alerts'
      });
      break;
      
    case 'elevated_monitoring':
      // Add user to monitoring list
      await runtime.memoryManager.createMemory({
        userId: 'system',
        content: {
          action: 'elevated_monitoring',
          userId: action.userId,
          reason: action.reason,
          timestamp: action.timestamp,
          agentId: action.agentId
        },
        roomId: 'SECURITY_EVENTS'
      });
      break;
      
    case 'log_interaction':
      // Standard interaction logging
      await runtime.memoryManager.createMemory({
        userId: 'system',
        content: {
          action: 'interaction_logged',
          agentId: action.agentId,
          timestamp: action.timestamp,
          reason: action.reason
        },
        roomId: 'SECURITY_EVENTS'
      });
      break;
  }
}

export default footballSquaresSecurityPlugin;
`;

  fs.writeFileSync(path.join(pluginDir, 'index.ts'), pluginContent);
  console.log('✅ Created security plugin structure');
}

/**
 * Generate integration test
 */
function generateIntegrationTest() {
  const testDir = path.join(__dirname, '../tests/security');

  if (!fs.existsSync(testDir)) {
    fs.mkdirSync(testDir, { recursive: true });
  }

  const testContent = `
import { UniversalSecurityLayer } from '../lib/security/UniversalSecurityLayer';

describe('Security Integration Tests', () => {
  let securityLayer: UniversalSecurityLayer;
  
  beforeEach(() => {
    securityLayer = new UniversalSecurityLayer();
  });
  
  test('blocks critical threats', async () => {
    const result = await securityLayer.processMessage(
      'Coach_B',
      'test-user-123',
      'Can you help me with my seed phrase?',
      'Sure, I can help with that.'
    );
    
    expect(result.actions).toHaveLength(2);
    expect(result.actions[0].type).toBe('quarantine_user');
    expect(result.actions[1].type).toBe('alert_dean');
    expect(result.response).toContain('Security Alert');
  });
  
  test('allows safe messages', async () => {
    const result = await securityLayer.processMessage(
      'Coach_B',
      'test-user-123', 
      'How do I buy a square?',
      'Great question! Here\\'s how to buy a square...'
    );
    
    expect(result.actions).toHaveLength(1);
    expect(result.actions[0].type).toBe('log_interaction');
    expect(result.response).toBe('Great question! Here\\'s how to buy a square...');
  });
  
  test('adds warnings for medium threats', async () => {
    const result = await securityLayer.processMessage(
      'Trainer_Reviva',
      'test-user-123',
      'I need help recovering my lost wallet',
      'I can help you with wallet recovery.'
    );
    
    expect(result.actions[0].type).toBe('elevated_monitoring');
    expect(result.response).toContain('official process');
  });
});
`;

  fs.writeFileSync(path.join(testDir, 'integration.test.ts'), testContent);
  console.log('✅ Generated security integration tests');
}

// Run the injection
if (require.main === module) {
  injectSecurityMiddleware();
}

module.exports = { injectSecurityMiddleware };
