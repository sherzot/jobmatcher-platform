# Frontend E2E test plan

## Maqsad

Critical user journey’larni real API va seeded database bilan repeatable browser testga aylantirish.

## Birinchi smoke flows

1. Candidate: login → `/jobs` → job detail → apply → `/applications`.
2. Candidate: application history → withdraw → `WITHDRAWN` status.
3. Agent: login → company approvals → detail → approve/reject.
4. Agent: company select → job create → job list refresh.
5. Company: login → job list → create/edit → publish/pause.

## Test prerequisites

- API: `http://localhost:3011`.
- Web: `http://localhost:3010`.
- `npm run db:seed` completed.
- Browser context must start clean so httpOnly JWT cookies are not confused with role-hint localStorage.

## Acceptance criteria

- Each flow asserts URL, visible success state and at least one backend state transition.
- Failed API requests expose response body, not generic `Failed to fetch` only.
- Tests run serially against isolated seed data or resettable fixtures.
