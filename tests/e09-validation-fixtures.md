# E-09 software validation fixtures

These fixtures validate the gate implementation only. They are **not physical experimental evidence**.

## Expected outcomes

| Fixture | Expected |
|---|---|
| complete synthetic package | INCONCLUSIVE (synthetic evidence rejected) |
| missing rawMeasurements | INCONCLUSIVE |
| invalid measurement value | INCONCLUSIVE |
| missing uncertainty | INCONCLUSIVE |
| missing independent corroboration | INCONCLUSIVE |
| missing human safety review | INCONCLUSIVE |
| tampered artifact/hash | INCONCLUSIVE |
| same runId + same evidence | idempotent recorder success |
| same runId + different evidence | recorder conflict |
| valid real package with all required evidence | PASS/L2, subject to human technical review |

The positive fixture must never be used as a claim that a physical experiment occurred.
