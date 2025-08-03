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
      'Sure, I can help with that.',
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
      "Great question! Here's how to buy a square...",
    );

    expect(result.actions).toHaveLength(1);
    expect(result.actions[0].type).toBe('log_interaction');
    expect(result.response).toBe(
      "Great question! Here's how to buy a square...",
    );
  });

  test('adds warnings for medium threats', async () => {
    const result = await securityLayer.processMessage(
      'Trainer_Reviva',
      'test-user-123',
      'I need help recovering my lost wallet',
      'I can help you with wallet recovery.',
    );

    expect(result.actions[0].type).toBe('elevated_monitoring');
    expect(result.response).toContain('official process');
  });
});
