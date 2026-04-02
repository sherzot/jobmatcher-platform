# JobMatch Platform — AI Context & Development Guide

## 1. Project Overview

**JobMatch Platform** is a production-grade, AI-assisted career operating system — not a simple job board. It combines:

- Job marketplace
- ATS (Applicant Tracking System) workflow
- AI assistant & document automation
- Matching engine & recruiter tools
- Candidate career OS

**Target markets:** Japan (JP) and Uzbekistan (UZ), with cross-market support (JP ↔ UZ, remote, relocation, visa).

**AI role:** Write production-quality code, follow the architecture strictly, ask clarifying questions when requirements are ambiguous, and never skip error handling, validation, or security.

---

## 2. Tech Stack (Strict)

| Layer | Technology |
|---|---|
| Frontend | Next.js 14+ (App Router) + TypeScript + TailwindCSS + React Hook Form + TanStack Query |
| Backend | NestJS (TypeScript) + Prisma ORM + class-validator + class-transformer + Passport.js (JWT) |
| AI Service | Python FastAPI (separate container) — resume parsing, job parsing, embeddings, matching, recommendation |
| Database | MySQL 8.0 (primary) + Redis (cache, session, rate-limit, queue) + OpenSearch (full-text search) |
| Vector DB | Qdrant or Milvus — semantic search, AI matching, resume/job embeddings |
| Queue | Bull (Redis-based) — resume parsing, email, notifications, async matching, analytics |
| File Storage | S3-compatible (MinIO for local dev, AWS S3 for production) |
| Auth | JWT (access + refresh tokens) + Passport.js strategies + RBAC Guards |
| i18n | Japanese (日本語) / Uzbek (O'zbek) / English — next-intl (frontend) + nestjs-i18n (backend) |
| Containerization | Docker + docker-compose |
| CI/CD | GitHub Actions + ArgoCD (future K8s) |
| Monitoring | Prometheus + Grafana + OpenTelemetry (future) |
| Testing | Jest + Supertest (backend) + Playwright/Cypress (E2E) + pytest (AI service) |

---

## 3. Architecture: Modular Monolith

The project is built as a modular monolith. Each domain lives as a separate NestJS module. Microservices are **not** required at this stage (MVP). In the future, matching, parsing, notifications, and analytics may be extracted into separate services.

### 3.1 Project Structure

```
jobmatch-platform/
├── apps/
│   ├── web/                    # Next.js frontend (App Router)
│   │   ├── app/
│   │   │   ├── (candidate)/    # Candidate pages (job search, profile, apply)
│   │   │   ├── (agent)/        # Agent/Recruiter dashboard
│   │   │   ├── (company)/      # Company dashboard
│   │   │   ├── (admin)/        # Platform admin console
│   │   │   └── (public)/       # Public pages (landing, job search without auth)
│   │   ├── components/
│   │   ├── lib/
│   │   └── hooks/
│   ├── api/                    # NestJS backend (modular monolith)
│   │   ├── src/
│   │   │   ├── modules/
│   │   │   │   ├── auth/        # JWT, login, register, email verification, MFA
│   │   │   │   ├── user/        # Profile, personal info, preferences, visa
│   │   │   │   ├── resume/      # Resume CRUD, upload, versioning, PDF generation
│   │   │   │   ├── job/         # Vacancy CRUD, requirements, salary, location
│   │   │   │   ├── application/ # Apply flow, status tracking, interview pipeline
│   │   │   │   ├── company/     # Company registration, editing, profiles
│   │   │   │   ├── agent/       # Agent operations, candidate filtering, shortlist
│   │   │   │   ├── admin/       # System management, moderation, analytics
│   │   │   │   ├── matching/    # AI matching integration, scoring, ranking
│   │   │   │   ├── search/      # OpenSearch integration, faceted search
│   │   │   │   ├── chat/        # User-Agent messaging, WebSocket gateway
│   │   │   │   └── notification/# Email, push, in-app notifications
│   │   │   ├── common/          # Shared DTOs, decorators, guards, interceptors
│   │   │   ├── config/          # Environment config, validation
│   │   │   └── prisma/          # Schema, migrations, seed
│   │   └── test/
│   └── ai-service/             # Python FastAPI (separate container)
│       ├── app/
│       │   ├── routers/         # resume_parser, job_parser, matching, recommendation
│       │   ├── services/        # parsing, embedding, scoring logic
│       │   ├── models/          # Pydantic schemas
│       │   └── core/            # Config, dependencies
│       ├── tests/
│       └── Dockerfile
├── packages/
│   └── shared-types/           # Shared TypeScript types/interfaces
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
├── docker/
│   ├── docker-compose.yml
│   ├── docker-compose.dev.yml
│   ├── Dockerfile.api
│   ├── Dockerfile.web
│   └── Dockerfile.ai
├── docs/
├── .github/workflows/
├── turbo.json                  # Turborepo config (monorepo)
├── package.json
└── README.md
```

---

## 4. Roles & Permissions (RBAC)

| Role | Permissions | Dashboard |
|---|---|---|
| **Admin** | Full system control. Creates agents. Manages agents, companies, jobs, users. System settings, moderation, fraud detection, analytics. | `/admin/*` |
| **Agent** | Creates/manages assigned companies. Creates/edits/starts/stops jobs for companies. Filters candidates. Communicates with users via chat/email. | `/agent/*` |
| **Company** | Creates/manages own jobs (start/stop). Communicates with agent via chat/email. Manages own company profile. | `/company/*` |
| **User (Candidate)** | Browses and filters jobs without auth. Registration + resume required to apply. Chat with agent. Apply history and status tracking. | `/candidate/*` |

> **CRITICAL:** Users never communicate directly with Companies. All communication goes through the Agent.

---

## 5. Database Indexing & Auto-Increment Codes

Every entity has:
- `id` — AUTO_INCREMENT integer (Primary Key)
- `code` — unique, human-readable string generated from `id` after creation

| Entity | Code Format | Example | Generation |
|---|---|---|---|
| User (Candidate) | `U` + 7-digit zero-padded | `U0000001` | Hook: on create |
| Job | `J` + 7-digit zero-padded | `J0000001` | Hook: on create |
| Company | `C` + 7-digit zero-padded | `C0000001` | Hook: on create |
| Agent | `A` + 7-digit zero-padded | `A0000001` | Hook: on create |
| Admin | `admin` + sequential | `admin1` | Manual / Seed |
| Application | `APP` + 7-digit zero-padded | `APP0000001` | Hook: on create |

> `code` is **never** AUTO_INCREMENT — only `id` is. `code` is computed from `id` after the record is created.

**Implementation via Prisma middleware:**

```typescript
prisma.$use(async (params, next) => {
  const result = await next(params);
  if (params.action === 'create' && params.model === 'User') {
    await prisma.user.update({
      where: { id: result.id },
      data: { code: `U${String(result.id).padStart(7, '0')}` },
    });
  }
  return result;
});
```

---

## 6. Core Business Flows

### 6.1 Candidate Onboarding Flow

1. User browses jobs — **no auth required**
2. Filters by: location, category, salary, date, contract type
3. Clicks "Apply" → registration is required
4. Fills in 基本情報 (basic info)
5. Creates 履歴書・職務経歴書 (resume):
   - **Manual entry:** 学歴 max 3 entries, 経歴 max 10 entries, スキル unlimited, 資格 unlimited
   - **Upload PDF/DOCX** → AI Parser (FastAPI) → auto-fills fields
6. Apply submitted → resume auto-generated → company matched → forwarded to Agent
7. Agent receives: automatic email + chatbot notification

> **Goal:** Get the user to "job search ready" state within 3 minutes.

### 6.2 Application Pipeline (Status Tracking)

```
カジュアル面談 → 書類選考 → 一次面接 → 二次面接 → 三次面接 → 最終面接 → 内定
(casual_interview → screening → first_interview → second_interview
 → third_interview → final_interview → offer)
```

- Every status change triggers: notification (email + in-app + chatbot)
- User dashboard shows full apply history and all pipeline statuses

### 6.3 AI Matching Flow

1. Candidate profile is loaded
2. Matching service runs rule-based + semantic hybrid scoring:
   - **Hard filters:** location, language, work permit, visa
   - **Soft score:** skill similarity, years of experience, seniority fit
3. Search + vector similarity + rule filters applied
4. Top jobs returned with **explainable scores**, e.g.:
   - "85% match"
   - "React + Laravel experience matches"
   - "Japanese level insufficient"
   - "Salary expectation matches"

### 6.4 Agent/Recruiter Operations Flow

1. Agent creates a company and adds vacancies
2. System provides AI-matched candidate shortlist
3. Agent views and filters candidates
4. Agent communicates with users via chat/email
5. Agent schedules interviews
6. Agent manages application status

> **Communication rules:**
> - Company ↔ Agent: ongoing chat/email
> - User ↔ Agent: chat/email only
> - User **never** communicates directly with Company

---

## 7. AI Layer (Python FastAPI Service)

This is real operational AI — not marketing.

### 7.1 AI Sub-modules

| Module | Description |
|---|---|
| **Resume Parser** | PDF/image/text upload → OCR → extracts education, experience, skills. Supports Japanese 履歴書・職務経歴書 structure. Uses OpenAI GPT-4o / Google Document AI. |
| **Job Description Parser** | Extracts structured fields from job postings: skill, level, language, visa, location, salary. |
| **Matching Engine** | Rule-based + semantic hybrid. Hard filters (location, language, work permit) + soft score (skill similarity, experience, seniority). Explainable scoring output. |
| **Recommendation Engine** | Identifies best vacancies, missing skills, and resume improvement areas. |
| **AI Assistant** | Guides candidates ("Resume 80% complete, apply to 3 new jobs"). Summarizes candidates for recruiters. Provides shortlists for agents. |

### 7.2 AI Service API Endpoints

```
POST /api/ai/parse-resume       # PDF/DOCX → structured JSON
POST /api/ai/parse-job          # Job post → structured fields
POST /api/ai/match              # candidate + jobs → ranked results
POST /api/ai/recommend          # profile → recommendations
POST /api/ai/embed              # text → vector embedding
GET  /api/ai/assistant/guidance # AI guidance for candidate
```

---

## 8. Resume Format (履歴書・職務経歴書)

| Field | Constraint |
|---|---|
| 学歴 (Education) | Maximum 3 entries |
| 経歴 (Work Experience / Career) | Maximum 10 entries |
| スキル (Skills) | Unlimited — add/remove freely |
| 資格 (Qualifications/Certificates) | Unlimited — add/remove freely |
| Date format | Japanese-style: `YYYY年MM月` |
| 志望動機・絡り込み・強み | Motivation, approach, strengths — free text |

- Resume must be **downloadable and printable as PDF**
- Full CRUD: insert, update, delete individual fields

---

## 9. Candidate Dashboard Features

- Messaging/chatbot with Agent
- Recently viewed jobs history
- Applied jobs history with full pipeline status per job
- Edit 基本情報 (basic info) — insert, update, delete
- Edit 履歴書・職務経歴書 (resume) — insert, update, delete
- Edit 志望動機・絡り込み・強み (motivation, approach, strengths)
- New job recommendations matching 経験 (experience) and 希望条件 (preferences)

---

## 10. Data Architecture

| Storage | Technology | Data |
|---|---|---|
| Operational DB | MySQL 8.0 + Prisma ORM | users, profiles, resumes, jobs, applications, companies, messages, interviews, offers |
| Search Engine | OpenSearch / Elasticsearch | Full-text job search, filters, ranking, faceted search |
| Cache | Redis | Session, rate limit, frequently accessed lists, matching results cache |
| File Storage | S3 / MinIO | Resume PDFs, profile images, company logos, generated documents |
| Vector Store | Qdrant / Milvus | Semantic search, AI matching, resume/job embeddings |
| Event Queue | Bull (Redis) | Resume parsing, email, notifications, analytics events, async matching |
| Analytics (V2) | ClickHouse / BigQuery | Application funnel, conversion, recruiter response time, job performance |

---

## 11. Security & Compliance

- OAuth / JWT (access + refresh tokens) with `httpOnly` cookies
- RBAC (Role-Based Access Control) with NestJS Guards
- Input validation: `class-validator` on backend DTOs, Zod on frontend forms
- File scanning on upload (resumes, images)
- Rate limiting (Redis-based)
- Audit logs for all admin/agent actions
- Encryption at rest and in transit (TLS)
- Candidate resumes are **PRIVATE** — recruiters can only access explicitly permitted profiles
- Consent-based sharing + data retention policy

---

## 12. Roadmap

### MVP — Phase 1 (Ship First)

- [ ] User registration + email verification + JWT auth
- [ ] Profile creation (基本情報)
- [ ] Resume upload + manual entry (education 3, career 10, skills, qualifications)
- [ ] Job search (filter, sort, pagination) — public, no auth required
- [ ] Apply flow (register on apply if not logged in)
- [ ] Agent dashboard (company CRUD, job CRUD, start/stop, candidate list)
- [ ] Company dashboard (own jobs, agent chat)
- [ ] Admin dashboard (agents, companies, users, system settings)
- [ ] DB auto-increment codes (U0000001, J0000001, etc.)
- [ ] CSV data import (initial MySQL data migration)

### V1 — Phase 2 (AI + Communication)

- [ ] AI resume parsing (PDF/DOCX → structured JSON via FastAPI)
- [ ] AI job matching (rule-based + semantic hybrid, explainable score)
- [ ] Japanese resume (履歴書・職務経歴書) auto-generation + PDF download
- [ ] Notifications (email + in-app on apply, status change)
- [ ] Chat/messaging (User ↔ Agent, Company ↔ Agent via WebSocket)
- [ ] Analytics (basic recruiter/job performance metrics)
- [ ] OpenSearch integration (full-text search, faceted filters)

### V2 — Phase 3 (Scale & Automate)

- [ ] Agent workflow automation (AI-assisted candidate shortlisting)
- [ ] Multi-tenant company portal
- [ ] Recommendation engine (skill gap, career path)
- [ ] Semantic search (vector DB integration)
- [ ] Interview scheduling + offer management
- [ ] Automated document generation (履歴書・職務経歴書, offer letters)
- [ ] Cross-market: JP ↔ UZ, remote, relocation, visa support
- [ ] Kubernetes deployment + ArgoCD + monitoring

---

## 13. Development Rules (Strict)

These rules are **mandatory** — no exceptions.

| Rule | Requirement |
|---|---|
| **ARCHITECTURE** | Modular monolith. Each domain = separate NestJS module. Modules communicate only via service injection. No circular dependencies. |
| **NAMING** | `camelCase` (variables, functions), `PascalCase` (classes, interfaces, DTOs), `UPPER_SNAKE_CASE` (constants, env vars), `kebab-case` (file names, folders) |
| **ERROR HANDLING** | Global exception filter + custom domain exceptions. Never throw raw strings. Always use `HttpException` subclasses with proper HTTP status codes. |
| **VALIDATION** | `class-validator` decorators on ALL DTOs. Zod on frontend forms. Never trust client input. |
| **AUTH** | Every endpoint must have `@UseGuards(JwtAuthGuard)` unless explicitly public (`@Public()` decorator). RBAC via `@Roles()` decorator. |
| **DATABASE** | All queries through Prisma. No raw SQL unless absolutely necessary (add comment explaining why). Migrations required for every schema change. |
| **API DESIGN** | RESTful. Consistent response format: `{ success: boolean, data?: T, error?: { code, message } }`. Pagination: `{ items, total, page, limit }`. |
| **TESTING** | Every service must have unit tests. Every controller must have integration tests. Minimum 80% coverage target. |
| **GIT** | Conventional commits (`feat:`, `fix:`, `chore:`, `refactor:`, `docs:`, `test:`). Feature branches. PR required for main. |
| **ENV** | All secrets in `.env`. Never hardcode credentials. Use `@nestjs/config` with validation schema. |
| **i18n** | All user-facing strings must be translatable. Support JP/UZ/EN from day one. |
| **DOCKER** | `docker-compose.dev.yml` for local dev (api + web + mysql + redis + ai-service + minio). Single command: `docker-compose up`. |
| **NO SHORTCUTS** | No `console.log` in production (use `Logger`). No `any` types. No `TODO` without a linked issue. No commented-out code. |

---

## 14. AI Interaction Rules

1. Always ask clarifying questions when requirements are ambiguous — before writing code.
2. Show a brief plan (which files to create/modify) before executing.
3. Never delete files without explicit user approval.
4. When creating a new module, always generate: module, controller, service, DTOs, entity/model, tests.
5. Commit after each logical unit of work with a conventional commit message.
6. If you encounter a bug, fix it. If unsure, explain the issue and ask.
7. Write code as if it will be reviewed by a senior engineer. Production-quality only.
8. `README.md` must always reflect the current project state, setup instructions, and architecture.

---

## 15. Event-Driven Design (Async Operations)

The following operations **must** be async via Bull queue:

| Event | Queue Flow |
|---|---|
| Resume upload | → AI parser queue → parse → save structured data → generate embedding |
| Application submit | → notification queue → email to agent + chatbot message |
| Status change | → notification queue → email + in-app notification to candidate |
| PDF resume generation | → generation queue → save to S3 |
| Analytics events | → event collector queue → write to analytics DB |
