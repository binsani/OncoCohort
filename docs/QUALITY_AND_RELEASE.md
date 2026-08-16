# Quality and Release Process

## Change control

Every change should use a pull request that states its purpose, risk, validation, and user impact. Changes to authentication, authorization, exports, database schema, audit history, intended use, or clinical functionality require explicit risk review.

## Release checklist

- [ ] Intended use remains accurate
- [ ] Risk register reviewed
- [ ] Build, lint, and tests pass
- [ ] Database migrations reviewed
- [ ] Dependency and code scanning reviewed
- [ ] No secrets or real patient data are present
- [ ] Accessibility impact reviewed
- [ ] Privacy impact reviewed
- [ ] Rollback plan recorded
- [ ] Release owner and approver recorded
- [ ] User-facing documentation updated

## Incident handling

1. Contain the issue and preserve evidence.
2. Assess confidentiality, integrity, availability, and patient-safety impact.
3. Notify responsible organizational officers.
4. Follow applicable breach-notification requirements.
5. Correct, validate, release, and document the change.
6. Record root cause and preventive action.

## Vulnerability targets

- critical: assess immediately and remediate or disable affected functionality
- high: remediate on an expedited release
- medium and low: prioritize through normal maintenance based on exposure
