# Risk Management File

This is an initial software-risk register inspired by ISO 14971 principles. It is not an ISO certification.

| ID | Hazard | Potential harm | Existing control | Residual status |
| --- | --- | --- | --- | --- |
| R-001 | Unauthorized access | Disclosure of sensitive research data | Hosted identity, private deployment, owner-scoped queries | Needs independent access-control testing |
| R-002 | Cross-user data access | Confidentiality breach | Every database query uses authenticated owner ID | Add automated tenant-isolation tests |
| R-003 | Incorrect patient or cohort entry | Research-data error | Required fields, constrained choices, audit events | Add field validation and correction workflow |
| R-004 | Export misuse | Data disclosure | Authenticated export, audit event, optional admin approval preference | Enforce approval server-side before production |
| R-005 | Missing or altered audit history | Loss of accountability | Append-only application interface | Add integrity monitoring and retention policy |
| R-006 | Data loss | Research interruption | Managed D1 persistence | Define tested backup and recovery procedure |
| R-007 | Session misuse | Unauthorized activity | Hosted authentication and secure logout | Validate timeout enforcement at platform level |
| R-008 | Misinterpretation as clinical advice | Patient-safety risk | Intended-use exclusions and compliance notice | Maintain visible non-clinical labeling |
| R-009 | Dependency vulnerability | Compromise or outage | Lockfile, Dependabot, CodeQL and CI | Establish remediation service levels |
| R-010 | Availability failure | Delayed research operations | Managed hosting | Define availability target and downtime process |
| R-011 | Invalid consent state | Use beyond permission | Consent-status field | Add institution-approved consent workflow |
| R-012 | Unreviewed software change | New safety/privacy risk | Pull-request and release checklist | Require named release approver |

## Review rule

Review this register before every production release and whenever intended use, data categories, integrations, hosting, authentication, or clinical functionality changes.
