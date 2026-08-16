# OncoCohort

OncoCohort is a private oncology research workspace for organizing clinical cohorts, demonstration patient records, enrollment activity, and operational reports across participating sites.

**Live application:** [oncocohort-workspace.salimsaniexclusive.chatgpt.site](https://oncocohort-workspace.salimsaniexclusive.chatgpt.site)

> OncoCohort is currently a demonstration workspace. Do not enter real patient-identifying information or protected health information until the required organizational, legal, privacy, and security controls have been completed.

## Features

- Dashboard with enrollment, eligibility, cohort, and participating-site summaries
- Cohort creation and management by cancer type
- Demonstration patient directory with search and filtering
- Patient enrollment into saved cohorts
- Consent, treatment-status, biomarker, stage, and site tracking
- CSV export for authorized patient-directory data
- Reports for cancer types, disease stages, and enrollment indicators
- Append-only activity view for cohort, patient, enrollment, and export events
- Admin settings for workspace identity, regional defaults, notifications, governance, and session preferences
- Login, registration, and secure logout flows using Sign in with ChatGPT
- Responsive layouts for desktop, tablet, and mobile use

## Technology

- React 19
- TypeScript
- [vinext](https://github.com/cloudflare/vinext) and Vite
- Cloudflare Workers-compatible server output
- Cloudflare D1
- Drizzle ORM
- Tailwind CSS 4
- OpenAI Sites hosting and identity headers

## Application routes

| Route | Purpose |
| --- | --- |
| `/` | Main research dashboard |
| `/cohorts` | Create and manage cohorts |
| `/patients` | Manage demonstration patient records |
| `/reports` | Review cohort and patient summaries |
| `/activity` | View the workspace audit trail |
| `/settings` | Manage administrative preferences and logout |
| `/login` | Secure workspace sign-in |
| `/register` | Workspace access registration |
| `/logout` | Secure sign-out redirect |

The application also provides authenticated API routes under `/api` for cohorts, patients, enrollments, activity, and CSV export.

## Data model

The D1 database stores:

- `cohorts`: user-owned clinical cohort definitions
- `patients`: user-owned demonstration patient records
- `cohort_patients`: cohort enrollment relationships
- `audit_events`: activity records for important workspace actions

Every application query is scoped to the authenticated owner's stable user ID.

## Authentication

Hosted identity is provided by Sign in with ChatGPT. The platform injects authenticated identity headers, and `app/chatgpt-auth.ts` exposes helpers for:

- reading the current user
- requiring authentication
- creating safe sign-in and sign-out destinations

The reserved `/signin-with-chatgpt`, `/signout-with-chatgpt`, and `/callback` paths are owned by the hosting platform.

## Local development

### Requirements

- Node.js 22.13 or newer
- npm

### Setup

```bash
git clone https://github.com/binsani/OncoCohort.git
cd OncoCohort
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The local Vite configuration supplies development-compatible platform bindings. Hosted identity headers are only available through the deployed Sites environment, so authenticated API behavior may differ locally.

## Useful commands

```bash
npm run dev          # Start the local development server
npm run build        # Create and validate the production build
npm run start        # Run the production build locally
npm run test         # Build and run the rendered HTML test
npm run lint         # Run ESLint
npm run db:generate  # Generate Drizzle migrations after schema changes
```

## Database changes

Update `db/schema.ts`, then generate a migration:

```bash
npm run db:generate
```

Review every generated file in `drizzle/` before committing it. The Sites deployment packages these migrations with the application.

## Project structure

```text
app/
  api/                 Authenticated API routes
  activity/            Audit and activity page
  cohorts/             Cohort management page
  login/               Login experience
  logout/              Secure logout redirect
  patients/            Patient directory page
  register/            Access registration experience
  reports/             Reporting page
  settings/            Admin settings page
db/
  index.ts             D1 connection
  schema.ts            Drizzle schema
drizzle/               Generated D1 migrations
public/                Static and social-preview assets
.openai/hosting.json   Sites project and binding declaration
```

## Deployment

The application is deployed with OpenAI Sites as a private, Cloudflare Workers-compatible project. The hosting configuration declares the logical `DB` D1 binding in `.openai/hosting.json`.

Run a successful production build before publishing:

```bash
npm run build
```

## Privacy and governance

Before using OncoCohort with real clinical data, complete an appropriate security and governance review. At minimum, define access-control ownership, consent requirements, retention policy, audit review, incident response, export approval, backup and recovery, and all applicable regulatory obligations.

## Approval-readiness documentation

- [Intended use and product boundary](docs/INTENDED_USE.md)
- [Risk management file](docs/RISK_MANAGEMENT.md)
- [Software validation plan](docs/VALIDATION_PLAN.md)
- [Privacy and data-protection readiness](docs/PRIVACY_AND_DATA_PROTECTION.md)
- [Quality and release process](docs/QUALITY_AND_RELEASE.md)
- [Nigeria regulatory pathway](docs/REGULATORY_PATHWAY.md)

## Contributing

Contributions are welcome. Read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request. Please report vulnerabilities privately according to [SECURITY.md](SECURITY.md).

## License

OncoCohort is available under the [Apache License 2.0](LICENSE).
