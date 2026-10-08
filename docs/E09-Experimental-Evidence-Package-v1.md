# PHINA E-09 — Experimental Evidence Package v1

## Purpose

E-09 is the ecosystem-level **L2 Experimental Validation Gate** for PHINA, the Automation Technology Development Ecosystem. It is research-item agnostic: a research item may be a complete technology, subsystem, material, component, control system, energy system, sensor, AI/automation method, or another legitimate PHINA research program.

**PHINA does not perform the physical experiment. PHINA validates the evidence package and makes a bounded engineering decision.**

## Decision boundary

- **PASS / L2**: only when real measured experimental evidence is present, integrity is established, the evidence is reproducible enough for the stated claim, independent corroboration is present, uncertainty is addressed, and human safety/technical review requirements are satisfied.
- **INCONCLUSIVE / LOCK_AND_RESEARCH**: missing, synthetic, unverifiable, contradictory, or insufficient evidence.
- Software fixtures are **E-09-S validation evidence**, never physical L2 evidence.

## Evidence pipeline

Research Subject → Requirement → Claim/Hypothesis → Pre-registered Protocol → Acceptance Criteria → Safety Review → Instrumentation → Calibration/Traceability → Physical Experiment → Raw Evidence → Integrity → Repeat/Replication → Uncertainty → Independent Corroboration → Reproducible Analysis → Human Technical Review → E-09 Decision.

## Required package

`experimentId`
`technologyId`
`researchQuestion`
`claimOrHypothesis`
`objective`
`measurand`
`kpis`
`instrumentation`
`calibrationTraceability`
`units`
`rawMeasurements`
`rawArtifactRefs`
`environment`
`preconditions`
`protocolVersion`
`procedure`
`operatorOrSystem`
`timestamp`
`uncertainty`
`controls`
`acceptanceCriteria`
`repeatabilityReplication`
`independentCorroboration`
`analysis`
`provenance`
`humanSafetyReview`

### Provenance classes

Only these classes are valid:

- observed
- reported
- corroborated
- inferred
- projected
- unknown

Provenance does not turn a claim into evidence by itself. It records where the information came from and what remains uncertain.

## 18-stage gate

1. E09-01 E-08 prerequisite
2. E09-02 Research identity
3. E09-03 Claim/hypothesis
4. E09-04 Measurand/KPI
5. E09-05 Acceptance criterion pre-locked
6. E09-06 Protocol versioned
7. E09-07 Safety review
8. E09-08 Instrumentation
9. E09-09 Calibration/verification/traceability
10. E09-10 Experiment actually performed
11. E09-11 Raw evidence captured
12. E09-12 Raw evidence integrity
13. E09-13 Repeatability/replication
14. E09-14 Uncertainty
15. E09-15 Independent corroboration
16. E09-16 Analysis reproducible
17. E09-17 Human technical review
18. E09-18 L2 decision

No stage may silently promote missing evidence to PASS.

## Anti-fabrication boundary

A JSON payload containing plausible field names is **not proof that an experiment occurred**. The implementation must distinguish:

1. **Evidence intake** — syntactic/schema acceptance.
2. **Evidence validation** — provenance, integrity, reproducibility, uncertainty, corroboration and review checks.
3. **L2 establishment** — bounded decision for the named research item.

Where physical raw artifacts are required, the package must reference durable artifacts and their hashes rather than treating copied values in JSON as the authoritative raw record.

## Recorder requirements

The authoritative recorder must accept E-09 records in addition to E-04/E-06/E-07/E-08, while retaining:

- authenticated writes
- immutable/idempotent run identity
- SHA-256 evidence hashing
- durable persistence
- read-back capability
- no write exposure through the PHINA MCP server

## Required negative tests

- missing experiment identity → INCONCLUSIVE
- synthetic fixture → INCONCLUSIVE
- empty raw measurements → INCONCLUSIVE
- invalid measurement value/unit → INCONCLUSIVE
- missing provenance → INCONCLUSIVE
- missing uncertainty → INCONCLUSIVE
- missing independent corroboration → INCONCLUSIVE
- missing human safety review → INCONCLUSIVE
- changed evidence after hashing → integrity failure
- duplicate run with same content → idempotent success
- duplicate run with different content → conflict
- unauthenticated recorder write → 401
- MCP write/autonomous tool exposure → must remain absent

## Claim boundary

An E-09 PASS means **L2 experimental evidence is established for the specific research item and experiment package**. It does not certify commercial readiness, field safety, mass-production readiness, or L3 field evidence.

PHINA remains an expandable ecosystem.
