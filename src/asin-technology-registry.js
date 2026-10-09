'use strict';

/**
 * ASIN integration registry scaffold.
 * This is a source-control/test artifact, not a live ASIN runtime registration.
 * Only INTEGRATED_VERIFIED entries with revision-bound independent evidence count
 * as integrated. Names or deployed services alone do not satisfy that gate.
 */
const STATUS = Object.freeze({
  INTEGRATED_VERIFIED: 'INTEGRATED_VERIFIED',
  DEPLOYED_READ_ONLY_COMPONENT: 'DEPLOYED_READ_ONLY_COMPONENT',
  PROTOTYPE_ONLY: 'PROTOTYPE_ONLY',
  DESIGN_ONLY: 'DESIGN_ONLY',
  RESEARCH_ONLY: 'RESEARCH_ONLY',
  HOST_BLOCKED: 'HOST_BLOCKED',
  NOT_VERIFIED: 'NOT_VERIFIED',
});

const TECHNOLOGIES = Object.freeze([
  { id: 'ASIN-CORE', name: 'ASIN Verification Core', category: 'core', status: STATUS.NOT_VERIFIED, evidence: ['Saved library artifact exists; runtime integration not independently established.'] },
  { id: 'CI-001', name: 'Check Interface', category: 'verification', status: STATUS.NOT_VERIFIED, evidence: ['Logic exists in saved ASIN artifact; current deployed binding not verified.'] },
  { id: 'WI-001', name: 'Work Interface', category: 'orchestration', status: STATUS.DESIGN_ONLY, evidence: ['Specification exists; WI-01 through WI-12 not tested against implementation.'] },
  { id: 'RI-001', name: 'Relation Interface RI-001', category: 'reconciliation', status: STATUS.DEPLOYED_READ_ONLY_COMPONENT, evidence: ['Read-only tools reported in deployed PHINA MCP source; fresh invocation not tested in this turn.'] },
  { id: 'RKI-001', name: 'Rank Interface', category: 'sequencing', status: STATUS.PROTOTYPE_ONLY, evidence: ['Local prototype reported 10 tests passed; not integrated with ASIN runtime.'] },
  { id: 'PAT-001', name: 'PHINA Automation Technology', category: 'automation-framework', status: STATUS.NOT_VERIFIED, evidence: ['Architecture/research framework present; no verified WI/RKI runtime binding.'] },
  { id: 'AB-001', name: 'PHINA Account Bridge', category: 'host-connector', status: STATUS.HOST_BLOCKED, evidence: ['Prior direct Plugin Management result was not_installed; host invocation not verified.'] },
  { id: 'PA-001', name: 'Permission Access Resolver', category: 'access-diagnostics', status: STATUS.RESEARCH_ONLY, evidence: ['Research catalogue item; not ASIN-integrated.'] },
  { id: 'PI-001', name: 'Point Interface', category: 'checkpoint-recovery', status: STATUS.RESEARCH_ONLY, evidence: ['Research catalogue item; not ASIN-integrated.'] },
  { id: 'CS-001', name: 'CyberSafe', category: 'security-research', status: STATUS.RESEARCH_ONLY, evidence: ['Priority research item; no integration certification.'] },
  { id: 'FR-001', name: 'Fuel-less Rocket Automation Engine', category: 'physical-technology-research', status: STATUS.RESEARCH_ONLY, evidence: ['Research item; no physical or ASIN integration validation.'] },
  { id: 'MV-001', name: 'Magnetic Automation Vehicle', category: 'physical-technology-research', status: STATUS.RESEARCH_ONLY, evidence: ['Research item; no physical or ASIN integration validation.'] },
  { id: 'AA-001', name: 'Automation Aircraft', category: 'physical-technology-research', status: STATUS.RESEARCH_ONLY, evidence: ['Research item; no physical or ASIN integration validation.'] },
  { id: 'MR-001', name: 'Automation Medical Rehabilitation Equipment', category: 'physical-technology-research', status: STATUS.RESEARCH_ONLY, evidence: ['Research item; no clinical or ASIN integration validation.'] },
  { id: 'SN-001', name: 'Automation Safety Networks', category: 'safety-research', status: STATUS.RESEARCH_ONLY, evidence: ['Research item; no ASIN integration certification.'] },
  { id: 'E04-REC', name: 'E-04 Evidence Recorder', category: 'evidence-infrastructure', status: STATUS.DEPLOYED_READ_ONLY_COMPONENT, evidence: ['Railway service exists; ASIN binding and end-to-end test not established.'] },
  { id: 'E04-CLIENT', name: 'E-04 Client Runner', category: 'test-infrastructure', status: STATUS.DEPLOYED_READ_ONLY_COMPONENT, evidence: ['Railway service exists; ASIN binding and end-to-end test not established.'] },
  { id: 'PHINA-PLATFORM', name: 'PHINA Platform / Ecosystem Interface', category: 'platform-infrastructure', status: STATUS.DEPLOYED_READ_ONLY_COMPONENT, evidence: ['Railway service/source exists; it does not prove ASIN integration.'] },
]);

const GATE_REQUIREMENTS = Object.freeze([
  'wiImplementationRevision',
  'riImplementationRevision',
  'wiTestEvidence',
  'riTestEvidence',
  'combinedTestEvidence',
  'independentReviewEvidence',
]);

function hasRevisionBoundEvidence(item) {
  return Boolean(item && typeof item === 'object' &&
    typeof item.revision === 'string' && item.revision.trim() &&
    typeof item.resultRef === 'string' && item.resultRef.trim() &&
    item.verdict === 'PASS');
}

function evaluateAsinIntegrationGate(evidence = {}) {
  const missing = GATE_REQUIREMENTS.filter((key) => !hasRevisionBoundEvidence(evidence[key]));
  const passed = missing.length === 0 &&
    evidence.authorization === 'EXPLICIT' &&
    evidence.productionChange === false;
  return Object.freeze({
    technology: 'ASIN Integration Gate',
    decision: passed ? 'ELIGIBLE_FOR_SEPARATE_HUMAN_APPROVAL' : 'HOLD',
    integrated: false,
    missing,
    reason: passed
      ? 'Evidence gates are met; separate approval and deployment verification are still required.'
      : 'Do not mark integrated while implementation/test/review evidence or explicit authority is missing.',
  });
}

function countVerifiedIntegrated(technologies = TECHNOLOGIES) {
  return technologies.filter((technology) =>
    technology.status === STATUS.INTEGRATED_VERIFIED &&
    Array.isArray(technology.integrationEvidence) &&
    technology.integrationEvidence.length > 0
  ).length;
}

function invalidateDependents(graph, changedId) {
  const invalidated = new Set([changedId]);
  let changed = true;
  while (changed) {
    changed = false;
    for (const [stageId, dependencies] of Object.entries(graph)) {
      if (!invalidated.has(stageId) && dependencies.some((dependency) => invalidated.has(dependency))) {
        invalidated.add(stageId);
        changed = true;
      }
    }
  }
  return [...invalidated];
}

module.exports = {
  STATUS, TECHNOLOGIES, GATE_REQUIREMENTS,
  evaluateAsinIntegrationGate, countVerifiedIntegrated, invalidateDependents,
};
