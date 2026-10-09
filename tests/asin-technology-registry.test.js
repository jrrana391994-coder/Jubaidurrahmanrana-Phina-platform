'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const {
  STATUS, TECHNOLOGIES, GATE_REQUIREMENTS,
  evaluateAsinIntegrationGate, countVerifiedIntegrated, invalidateDependents,
} = require('../src/asin-technology-registry.js');

test('registry lists 15 core candidates plus 3 infrastructure entries', () => {
  assert.equal(TECHNOLOGIES.length, 18);
  assert.equal(TECHNOLOGIES.filter((t) => t.status === STATUS.INTEGRATED_VERIFIED).length, 0);
});

test('no integration is counted without integration evidence', () => {
  assert.equal(countVerifiedIntegrated(), 0);
  assert.equal(countVerifiedIntegrated([{ status: STATUS.INTEGRATED_VERIFIED }]), 0);
});

test('incomplete evidence fails closed', () => {
  const result = evaluateAsinIntegrationGate({});
  assert.equal(result.decision, 'HOLD');
  assert.equal(result.integrated, false);
  assert.deepEqual(result.missing, GATE_REQUIREMENTS);
});

test('revision-bound passing evidence still requires explicit authority', () => {
  const evidence = Object.fromEntries(GATE_REQUIREMENTS.map((key) => [key, { revision: 'r1', resultRef: `evidence:${key}`, verdict: 'PASS' }]));
  evidence.productionChange = false;
  assert.equal(evaluateAsinIntegrationGate(evidence).decision, 'HOLD');
  evidence.authorization = 'EXPLICIT';
  assert.equal(evaluateAsinIntegrationGate(evidence).decision, 'ELIGIBLE_FOR_SEPARATE_HUMAN_APPROVAL');
  assert.equal(evaluateAsinIntegrationGate(evidence).integrated, false);
});

test('changed upstream stage invalidates transitive dependents only', () => {
  const graph = { WI: [], RI: [], 'WI-RI': ['WI', 'RI'], ASIN: ['WI-RI'], AB: ['ASIN'], independent: [] };
  const invalidated = invalidateDependents(graph, 'RI');
  for (const stage of ['RI', 'WI-RI', 'ASIN', 'AB']) assert.ok(invalidated.includes(stage));
  assert.equal(invalidated.includes('WI'), false);
  assert.equal(invalidated.includes('independent'), false);
});

test('deployed read-only component alone is not integrated', () => {
  const entry = TECHNOLOGIES.find((t) => t.id === 'RI-001');
  assert.equal(entry.status, STATUS.DEPLOYED_READ_ONLY_COMPONENT);
  assert.equal(countVerifiedIntegrated([entry]), 0);
});
