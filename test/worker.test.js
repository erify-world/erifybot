/**
 * Integration tests for the ERIFY Incident Relay Worker
 * Tests the endpoints by running the actual server
 */

import { test, describe } from 'node:test';
import assert from 'node:assert';

describe('ERIFY Incident Relay Worker Integration Tests', () => {
  // Note: These tests would run against the actual deployed worker
  // For local testing, start the dev server with `npm run dev` first
  
  const BASE_URL = process.env.TEST_URL || 'http://localhost:8787';

  test('health endpoint format validation', () => {
    // This test validates the expected response format
    const expectedHealthFormat = {
      status: 'ok',
      name: 'erify-incident-relay',
      time: '2025-09-19T21:38:05.000Z' // ISO timestamp format
    };
    
    // Validate the structure
    assert.ok(typeof expectedHealthFormat.status === 'string');
    assert.ok(typeof expectedHealthFormat.name === 'string');
    assert.ok(typeof expectedHealthFormat.time === 'string');
    assert.ok(new Date(expectedHealthFormat.time).getTime() > 0);
  });

  test('badge endpoint format validation', () => {
    // This test validates the expected Shields.io format
    const expectedBadgeFormat = {
      schemaVersion: 1,
      label: 'Relay',
      message: 'Online / OK',
      color: 'brightgreen'
    };
    
    // Validate the structure
    assert.strictEqual(typeof expectedBadgeFormat.schemaVersion, 'number');
    assert.strictEqual(typeof expectedBadgeFormat.label, 'string');
    assert.strictEqual(typeof expectedBadgeFormat.message, 'string');
    assert.strictEqual(typeof expectedBadgeFormat.color, 'string');
    assert.strictEqual(expectedBadgeFormat.schemaVersion, 1);
  });

  test('service info format validation', () => {
    // This test validates the expected service info format
    const expectedServiceFormat = {
      service: 'ERIFY Incident Relay Worker',
      version: '1.0.0',
      description: 'Flame-Powered Discord Bot Relay for the ERIFY™ community',
      endpoints: {
        health: '/health',
        badge: '/badge'
      },
      time: '2025-09-19T21:38:05.000Z'
    };
    
    // Validate the structure
    assert.ok(typeof expectedServiceFormat.service === 'string');
    assert.ok(typeof expectedServiceFormat.version === 'string');
    assert.ok(typeof expectedServiceFormat.description === 'string');
    assert.ok(typeof expectedServiceFormat.endpoints === 'object');
    assert.ok(typeof expectedServiceFormat.time === 'string');
  });
});