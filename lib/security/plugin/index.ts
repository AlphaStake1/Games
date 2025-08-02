import { Plugin } from '@elizaos/core';
import { createUniversalSecurityLayer } from '../UniversalSecurityLayer.js';
import { createEnhancedSecurityLayer } from '../EnhancedSecurityLayer.js';
import { createBotMonitoringSystem } from '../BotMonitoringSystem.js';

/**
 * Football Squares Security Plugin
 * Enhanced security layer with bot detection and policy enforcement
 */
export const footballSquaresSecurityPlugin: Plugin = {
  name: 'footballsquares-security',
  description:
    'Comprehensive bot detection and security enforcement for Football Squares platform',

  actions: [
    {
      name: 'assess_bot_risk',
      similes: ['check_bot', 'bot_detection', 'security_scan'],
      description:
        'Assess bot probability and risk level for user interactions',
      validate: async (runtime, message) => {
        return message.content?.text?.length > 0;
      },
      handler: async (runtime, message, state) => {
        const securityLayer = createEnhancedSecurityLayer();
        const result = await securityLayer.processMessage(
          runtime.character.name,
          message.userId,
          message.content.text,
          state.recentMessages?.[0]?.content?.text || '',
        );

        // Log bot detection event
        const monitoring = createBotMonitoringSystem();
        await monitoring.recordBotDetection({
          userId: message.userId,
          agentId: runtime.character.name,
          confidence:
            result.escalationLevel === 'critical'
              ? 0.9
              : result.escalationLevel === 'high'
                ? 0.7
                : result.escalationLevel === 'medium'
                  ? 0.5
                  : 0.3,
          riskLevel: result.escalationLevel.toUpperCase(),
          indicators: result.actions.map((a) => a.reason),
          action: result.blockPurchases ? 'restrict' : 'monitor',
          timestamp: new Date(),
        });

        return result;
      },
    },

    {
      name: 'processSecurityThreat',
      similes: ['assess_threat', 'security_scan'],
      description: 'Processes incoming messages for security threats',
      validate: async (runtime, message) => {
        return message.content?.text?.length > 0;
      },
      handler: async (runtime, message, state) => {
        const securityLayer = createUniversalSecurityLayer();
        const result = await securityLayer.processMessage(
          runtime.character.name,
          message.userId,
          message.content.text,
          '', // No proposed response yet
        );

        // Execute security actions
        for (const action of result.actions) {
          await executeSecurityAction(action, runtime);
        }

        return result;
      },
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
            text: `Security Alert from ${runtime.character.name}: ${message.content.text}`,
            securityAlert: true,
            severity: message.content.severity || 'medium',
            originalUserId: message.userId,
          },
          roomId: 'security-room',
        });

        return true;
      },
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
          userId: 'system',
        });

        return true;
      },
    },
  ],

  evaluators: [],
  providers: [],
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
          agentId: action.agentId,
        },
        roomId: 'SECURITY_EVENTS',
      });
      break;

    case 'alert_dean':
      // Send alert to Dean
      await runtime.messageManager.createMemory({
        userId: 'Dean',
        content: {
          text: `Security Alert: ${action.reason}`,
          securityAlert: true,
          severity: action.severity,
          timestamp: action.timestamp,
          sourceAgent: action.agentId,
        },
        roomId: 'security-alerts',
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
          agentId: action.agentId,
        },
        roomId: 'SECURITY_EVENTS',
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
          reason: action.reason,
        },
        roomId: 'SECURITY_EVENTS',
      });
      break;
  }
}

export default footballSquaresSecurityPlugin;
