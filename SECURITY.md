# Security Policy

## Supported versions

Security fixes target the default branch and the latest production release.

## Reporting a vulnerability

Please do not open a public issue for security vulnerabilities. Report privately to the repository maintainers with:

Use the repository’s **Security → Advisories → Report a vulnerability** private channel when available. If private reporting is not enabled, contact the maintainers through the repository owner’s private channel before sharing details.

- affected component and version/commit;
- reproducible steps or proof of concept;
- impact assessment;
- suggested mitigation, if known.

Do not include real user data, credentials, tokens or production URLs in a report.

## Response targets

- Acknowledge report: 2 business days
- Initial triage: 5 business days
- Critical mitigation: as soon as practicable, with an emergency patch when required

## Engineering requirements

- Secrets must come from environment/secret manager, never source control.
- Authentication and authorization changes require regression tests.
- Dependency changes must pass lockfile, lint, test and build gates.
- Production logs must not contain passwords, tokens or unnecessary PII.
