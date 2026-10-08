# PHINA E-09 L2 Automation Work Process

Purpose: automate the evidence-controlled path from a real physical experiment to an E-09 L2 decision and, only after an authoritative PASS, unlock E-10.

PHINA is an expandable Automation Technology Development Ecosystem. This process is research-item agnostic.

## No-bypass boundary

Automation may validate schema, hashes, provenance, measurements, uncertainty, replication, corroboration records, safety-review records, acceptance criteria, contradictions and missing evidence. It may preserve failures and derive PASS or INCONCLUSIVE.

Automation may NOT invent measurements, generate physical evidence, promote synthetic or simulated data to physical L2, approve safety or technical review, impersonate reviewers/operators, alter raw evidence, bypass missing evidence, accept a client-supplied unlock flag, or unlock E-10 from chat/admin instructions.

## State machine

LOCKED_RESEARCH -> EXPERIMENT_DESIGN_LOCKED -> SAFETY_REVIEW_REQUIRED -> READY_FOR_EXPERIMENT -> EXPERIMENT_PERFORMED -> RAW_EVIDENCE_CAPTURED -> INTEGRITY_VALIDATED -> REPLICATION_VALIDATED -> INDEPENDENT_CORROBORATION -> TECHNICAL_REVIEW -> E09_L2_VALIDATION -> PASS or INCONCLUSIVE.

Any failed mandatory condition produces INCONCLUSIVE / LOCK_AND_RESEARCH. Failed records remain historical evidence.

## Required work sequence

1. Register the research item, question, claim/hypothesis, measurable measurands and KPIs.
2. Lock the protocol, instrumentation, calibration/traceability plan, environment, preconditions, acceptance criteria, analysis method and replication plan before the experiment.
3. Obtain human safety review before physical execution. Automation records this; it does not approve it.
4. Perform the real physical experiment outside PHINA. Capture original raw measurements, artifacts, timestamps, environment and instrumentation identity.
5. Submit Experimental Evidence Package v1 with immutable raw-artifact references and hashes.
6. Automated validation checks all mandatory fields, measurements, artifacts, hashes, provenance, contradictions and evidence completeness.
7. Validate repeatability/replication against the pre-registered protocol. Automation evaluates evidence; it cannot manufacture runs.
8. Record independent corroboration. Automation verifies its presence; it cannot create corroboration.
9. Obtain human technical review. Automation records the review; it cannot substitute for the reviewer.
10. Run all E-09 mandatory checks. PASS requires every mandatory condition.
11. Persist only an authenticated PASS/L2 record. Same run/package is idempotent; same run ID with a different hash is a conflict.
12. Derive E-10 unlock exclusively from the authoritative E-09 PASS record.

## E-09 PASS contract

PASS requires:
- status = PASS
- evidenceLevel = L2
- decision = UNLOCK_NEXT_GATE
- real measurements present
- raw artifacts present and hash-verified
- pre-registered acceptance criteria satisfied
- repeatability/replication satisfied
- independent corroboration present
- human safety review present
- human technical review present
- evidence not superseded or revoked
- authoritative persistence successful

E-10 unlock is the logical AND of those authoritative conditions. There is no separate bypass flag.

## Important boundary

Software fixtures test the automation only. They can never become physical L2 evidence.

A genuine L2 PASS requires actual experimental measurements and evidence from the real research activity.

## Recovery

On failure: preserve the failed run, classify the failure, identify corrective evidence, create a new version where necessary, and rerun the full E-09 gate. Never retroactively convert a failed record to PASS.

## E-10 protection

E-10 must consume only the authoritative persisted E-09 decision. It must not trust a UI flag, client field, branch state, test fixture, chat command, or administrator override.
