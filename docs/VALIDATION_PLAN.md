# Software Validation Plan

## Objective

Demonstrate that OncoCohort consistently satisfies its documented administrative research requirements without making clinical decisions.

## Required evidence

| Requirement | Verification |
| --- | --- |
| REQ-001 Authenticated access | Anonymous and authenticated access tests |
| REQ-002 Owner isolation | Cross-user API and database tests |
| REQ-003 Cohort lifecycle | Create, list, validate, and delete tests |
| REQ-004 Patient lifecycle | Create, list, update-status, and validation tests |
| REQ-005 Enrollment | Valid, duplicate, wrong-owner, and missing-record tests |
| REQ-006 Audit trail | Event creation and ordering tests |
| REQ-007 Export | Authorization, content, escaping, and audit tests |
| REQ-008 Logout | Session termination and login redirect test |
| REQ-009 Accessibility | Keyboard, labels, focus, contrast, and screen-reader review |
| REQ-010 Resilience | Database, network, malformed input, and empty-state tests |

## Environments

- local development with simulated platform bindings
- preview environment with non-sensitive synthetic data
- production-like validation environment with hosted identity and D1

## Acceptance criteria

- all automated checks pass from a clean checkout
- no unresolved critical or high-severity vulnerabilities
- all high-risk requirements have documented test evidence
- no real patient data is used during testing
- release approver signs the release checklist
- backup restoration and incident-response exercises are recorded

## Records

Store test results, reviewer, date, application version, environment, failures, deviations, and approval decision with each release.
