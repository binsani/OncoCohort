# Contributing to OncoCohort

Thank you for helping improve OncoCohort.

## Before contributing

- Never include real patient information or protected health information.
- Never commit credentials, tokens, private keys, or environment files.
- Open an issue before starting a large architectural or product change.
- Keep changes focused and consistent with the oncology research-workspace scope.

## Development

```bash
npm install
npm run dev
```

Before submitting a pull request:

```bash
npm run build
npm run lint
npm test
```

If the database schema changes, run `npm run db:generate` and include the reviewed migration.

## Pull requests

Describe:

- the problem being solved
- the approach used
- user-visible or developer impact
- validation performed
- screenshots for meaningful interface changes

By submitting a contribution, you agree that it is licensed under the Apache License 2.0.
