# JobMatch Platform — Architecture & System Rules

> This document defines the architecture decisions, coding standards, and business rules for the JobMatch Platform. All contributors must follow these rules without exceptions.

---

## 1. Architecture Overview

### Pattern: Modular Monolith

The backend is a **modular monolith** — not microservices. Each business domain is a self-contained NestJS module. Modules communicate only via service injection (no direct DB cross-module queries, no circular dependencies).

```
apps/api/src/modules/
├── auth/         → JWT, register, login, token refresh
├── user/         → Candidate profile CRUD
├── resume/       → 履歴書・職務経歴書 CRUD
├── job/          → Vacancy CRUD + search
├── application/  → Apply flow + 7-stage pipeline
├── company/      → Company CRUD + approval
├── agent/        → Agent operations + company approval actions
└── admin/        → System management + moderation
```

**Future extraction candidates** (when traffic justifies): matching engine, AI parsing, notifications, analytics.

---

## 2. Database Design Rules

### 2.1 Table Structure

Every entity table **must** have:

| Field | Type | Rule |
|---|---|---|
| `id` | `INT AUTO_INCREMENT` | Primary Key — never expose to users |
| `{entity}_code` | `VARCHAR(12-20) UNIQUE` | BUSINESS IDENTIFIER — use in URLs, API responses, UI |
| `created_at` | `DATETIME` | Always present |
| `updated_at` | `DATETIME` | Always present (auto-update) |

### 2.2 BUSINESS IDENTIFIER Codes

Each role table has its own code field. Codes are **never** AUTO_INCREMENT — they are generated from `id` after record creation via Prisma middleware.

| Table | Field | Pattern | Example | Rule |
|---|---|---|---|---|
| `candidates` | `user_code` | `U` + 7-digit zero-padded | `U0000001` | Auto-generated |
| `companies` | `company_code` | `C` + 7-digit zero-padded | `C0000001` | Auto-generated |
| `agents` | `agent_code` | `A` + 7-digit zero-padded | `A0000001` | Auto-generated |
| `admins` | `admin_code` | `admin` + sequential id | `admin1` | Auto-generated |
| `jobs` | `job_code` | `J` + 7-digit zero-padded | `J0000001` | Auto-generated |
| `applications` | `app_code` | `APP` + 7-digit zero-padded | `APP0000001` | Auto-generated |

**Implementation:** `PrismaService.registerCodeMiddleware()` in `apps/api/src/prisma/prisma.service.ts`

```typescript
// Pattern:
prisma.$use(async (params, next) => {
  const result = await next(params);
  if (params.action === 'create' && result?.id) {
    // update { [codeField]: generateCode(result.id) }
  }
  return result;
});
```

### 2.3 Role-Table Separation

The `users` table is **auth-only** (email, password, role, status). Business data lives in role-specific tables:

```
users (auth) ─── 1:1 ──→ candidates  (role = CANDIDATE)
             ─── 1:1 ──→ companies   (role = COMPANY)
             ─── 1:1 ──→ agents      (role = AGENT)
             ─── 1:1 ──→ admins      (role = ADMIN)
```

**Rule:** Never store business data (name, profile info, codes) in the `users` table.

### 2.4 All DB Queries Through Prisma

- No raw SQL unless absolutely necessary (add comment explaining why)
- Every schema change requires a Prisma migration
- Use `db push` in development, `migrate deploy` in production

---

## 3. Authentication & Authorization

### 3.1 JWT Structure

```typescript
interface JwtPayload {
  sub: number;           // users.id
  email: string;
  role: UserRole;        // CANDIDATE | AGENT | COMPANY | ADMIN
  businessCode: string;  // U0000001 | C0000001 | A0000001 | admin1
}
```

- **Access token**: 15 minutes (httpOnly cookie + Authorization header)
- **Refresh token**: 7 days (stored hashed in `refresh_tokens` table, rotated on use)

### 3.2 Route Protection Rules

```typescript
// Every endpoint must have one of these:
@UseGuards(JwtAuthGuard)           // requires valid JWT
@UseGuards(JwtAuthGuard, RolesGuard) @Roles(UserRole.ADMIN)  // role-specific
@Public()                           // explicitly opt-out of auth
```

**Never** leave an endpoint unprotected by default.

### 3.3 RBAC — Role Access Matrix

| Resource | ADMIN | AGENT | COMPANY | CANDIDATE |
|---|---|---|---|---|
| All users | ✅ Full | ❌ | ❌ | ❌ |
| Agents | ✅ CRUD | Self only | ❌ | ❌ |
| Companies | ✅ Full | ✅ Assigned only | Self only | ❌ |
| Jobs | ✅ Full | ✅ Assigned companies | Own jobs (start/stop) | Read only |
| Applications | ✅ Full | ✅ Assigned | ✅ Own company | Own only |
| Candidates/Profiles | ✅ Full | ✅ Applied to assigned | ❌ | Self only |
| Messages | ✅ Monitor | ✅ Own | ✅ Own | ✅ Own |

### 3.4 Company Login Rule

A Company account can **only** login when `company.status = APPROVED`. The login endpoint checks this and throws `COMPANY_PENDING_APPROVAL` or `COMPANY_REJECTED` errors otherwise.

---

## 4. Role Hierarchy & Account Creation

| Role | Created By | Method |
|---|---|---|
| Admin | Seed / super admin | Manual / `prisma/seed.ts` |
| Agent | Admin only | Admin dashboard → POST /api/admin/agents |
| Company | Self-register | POST /api/auth/register/company → agent approval |
| Candidate | Self-register | POST /api/auth/register/candidate |

**Rule:** Agents cannot self-register. Companies cannot operate without agent approval.

---

## 5. Company Registration & Approval Flow

```
1. Company POSTs /api/auth/register/company
   → User created (status: PENDING_VERIFICATION)
   → Company created (status: PENDING_APPROVAL, isActive: false)
   → All agents receive COMPANY_REGISTRATION notification

2. Agent reviews at /agent/approvals/[id]
   → Checks: company name, registration number, message, legitimacy

3a. Agent approves → PATCH /api/agent/companies/:id/approve
    → company.status = APPROVED
    → company.isActive = true
    → user.status = ACTIVE
    → Company email notification sent (COMPANY_APPROVED)

3b. Agent rejects → PATCH /api/agent/companies/:id/reject + { reason }
    → company.status = REJECTED
    → company.rejectionReason = reason
    → Company email notification sent (COMPANY_REJECTED)
```

---

## 6. Communication Rules (Critical)

```
Candidate ←→ Agent      ✅ Chat + email
Agent     ←→ Company    ✅ Chat + email
Candidate ←→ Company    ❌ NEVER direct — agent mediates
```

All `Conversation` records enforce this via `ConversationType` enum. Direct candidate-company conversations require `agentEnabled: true` (set by agent only).

---

## 7. Application Pipeline

7-stage pipeline — stages in order:

```
PENDING → CASUAL_INTERVIEW → SCREENING → FIRST_INTERVIEW
       → SECOND_INTERVIEW  → THIRD_INTERVIEW → FINAL_INTERVIEW
       → OFFER → ACCEPTED
              → REJECTED (from any stage)
              → WITHDRAWN (candidate withdraws)
```

**Rules:**
- Only Agent can advance/change status
- Every change is recorded in `application_status_history`
- Every change triggers: email + in-app notification + chatbot message (async via Bull queue)

---

## 8. Frontend Architecture

### 8.1 Route Groups (Next.js App Router)

```
app/
├── page.tsx                → Home (smart redirect if logged in)
├── (public)/               → No auth required
│   └── jobs/               → Public job search
├── (auth)/                 → Auth pages (no sidebar)
│   ├── login/
│   ├── register/           → Candidate registration
│   └── register/company/   → Company registration (3-step)
├── (candidate)/            → Role: CANDIDATE — sidebar layout
├── (agent)/                → Role: AGENT — sidebar layout
├── (company)/              → Role: COMPANY — sidebar layout
└── (admin)/                → Role: ADMIN — sidebar layout
```

### 8.2 Auth Context

- `lib/auth/auth-context.tsx` — `AuthProvider` wraps the app
- Stores user (role, businessCode, name) in `localStorage` + cookie for middleware
- `useAuth()` hook provides: `user`, `login()`, `logout()`, `isLoading`

### 8.3 Middleware (Route Protection)

`middleware.ts` runs on every request to protected paths:
1. Reads `jobmatch_user` cookie (set on login)
2. Checks role against allowed roles for the route prefix
3. Redirects unauthorized users to `/login` or their own dashboard

### 8.4 Role → Dashboard Map

```typescript
const ROLE_DASHBOARD = {
  ADMIN:     '/admin/dashboard',
  AGENT:     '/agent/dashboard',
  COMPANY:   '/company/dashboard',
  CANDIDATE: '/dashboard',
}
```

---

## 9. API Design Standards

### 9.1 Response Format

All API responses follow this structure:

```typescript
// Success
{ success: true, data: T }

// Paginated
{ success: true, data: { items: T[], total: number, page: number, limit: number } }

// Error
{ success: false, error: { code: string, message: string } }
```

### 9.2 HTTP Status Codes

| Situation | Code |
|---|---|
| Success (read) | 200 |
| Created | 201 |
| Bad input | 400 |
| Unauthenticated | 401 |
| Forbidden (wrong role) | 403 |
| Not found | 404 |
| Conflict (duplicate email) | 409 |
| Server error | 500 |

### 9.3 URL Patterns

```
GET    /api/{resource}          → list
GET    /api/{resource}/:id      → get one (use businessCode where possible)
POST   /api/{resource}          → create
PATCH  /api/{resource}/:id      → partial update
DELETE /api/{resource}/:id      → delete
POST   /api/{resource}/:id/{action}  → state change (approve, reject, publish)
```

---

## 10. Async Operations (Bull Queue)

These operations **must** be async via Bull queue — never block the HTTP response:

| Trigger | Queue | Action |
|---|---|---|
| Resume uploaded | `resume-parse` | AI parser → save structured data → generate embedding |
| Application submitted | `notification` | Email to agent + chatbot notification |
| Application status changed | `notification` | Email + in-app to candidate |
| Company approved/rejected | `notification` | Email to company |
| PDF resume requested | `pdf-generation` | Generate → save to S3 |
| Analytics event | `analytics` | Write to analytics DB |

---

## 11. Naming Conventions

| Context | Convention | Example |
|---|---|---|
| Variables / Functions | `camelCase` | `getUserById`, `isActive` |
| Classes / Interfaces / DTOs | `PascalCase` | `UserService`, `CreateJobDto` |
| Constants / Env vars | `UPPER_SNAKE_CASE` | `JWT_SECRET`, `MAX_EDUCATIONS` |
| Files / Folders | `kebab-case` | `auth.service.ts`, `pending-companies.ts` |
| DB tables | `snake_case` | `agent_companies`, `application_status_history` |
| DB columns | `camelCase` (Prisma) → `snake_case` (MySQL) | `firstName` → `first_name` |

---

## 12. Code Quality Rules (Non-Negotiable)

| Rule | Requirement |
|---|---|
| **No `console.log`** | Use `Logger` from `@nestjs/common` in backend |
| **No `any` types** | Use proper TypeScript types always |
| **No raw strings in errors** | Use `HttpException` subclasses with error codes |
| **No TODO without issue** | Link all TODOs to a GitHub issue |
| **No commented-out code** | Delete it, git history preserves it |
| **No hardcoded secrets** | All secrets in `.env` via `@nestjs/config` |
| **Validation on all DTOs** | `class-validator` decorators required on every DTO field |
| **Auth on every endpoint** | `@UseGuards` or `@Public()` — nothing unguarded |
| **Test coverage ≥ 80%** | Unit tests for services, integration for controllers |

---

## 13. Security Checklist

- [ ] JWT tokens in `httpOnly` cookies (not localStorage for tokens)
- [ ] Passwords hashed with bcrypt (min 12 rounds)
- [ ] Input sanitized via `class-validator` + `class-transformer`
- [ ] File uploads scanned before saving
- [ ] Rate limiting on auth endpoints (Redis-based)
- [ ] SQL injection prevented (Prisma ORM — no raw SQL)
- [ ] XSS prevented (Next.js default escaping + Zod on forms)
- [ ] CSRF protection (SameSite cookie + custom header)
- [ ] Candidate resumes are PRIVATE — agents access only explicitly shared profiles
- [ ] All admin/agent actions logged in audit log
- [ ] Refresh tokens rotated on every use
- [ ] Suspicious login detected (new device/IP) → verification email

---

## 14. File Storage Rules

All user-uploaded and generated files go to S3/MinIO:

| File type | Bucket | Path pattern |
|---|---|---|
| Profile photos | `avatars` | `/{userId}/{timestamp}.{ext}` |
| Uploaded resumes | `resumes-raw` | `/{userId}/{timestamp}.pdf` |
| Generated resume PDFs | `resumes-generated` | `/{userId}/{resumeId}.pdf` |
| Company logos | `company-logos` | `/{companyId}/{timestamp}.{ext}` |

**Rules:**
- Never store files locally on the server
- All URLs are pre-signed (expire in 1 hour for private files)
- Max upload size: resumes 10MB, images 5MB

---

## 15. i18n Rules

- All user-facing strings in frontend: use `next-intl` keys, never hardcode
- All user-facing strings in backend errors: use Japanese as primary language
- Support: `ja` (Japanese), `uz` (Uzbek), `en` (English)
- Date format: `YYYY年MM月DD日` (Japanese style) in UI, ISO 8601 in API

---

## 16. Git & PR Rules

```
Branch naming:
  feat/short-description
  fix/bug-description
  chore/task-description
  refactor/what-refactored
  docs/what-documented

Commit format (Conventional Commits):
  feat: add company approval endpoint
  fix: correct JWT expiry check
  chore: update prisma schema
  refactor: extract business code generation to service
  docs: update architecture rules
  test: add auth service unit tests

PR rules:
  - PR required for main (no direct push)
  - At least 1 reviewer
  - All CI checks must pass
  - Description must include: what changed, why, how to test
```

---

*Last updated: 2026-04-03 | Maintained by the JobMatch Platform team*
