# JobMatch Platform

**AI-Assisted Career Operating System** — Japan (JP) & Uzbekistan (UZ)

> Production-grade platform combining: Job Marketplace · ATS Workflow · AI Matching · Document Automation · Recruiter Tools · Candidate Career OS

[日本語版 README →](./README.ja.md) | [Architecture & Rules →](./ARCHITECTURE.md)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16 (App Router) + TypeScript + TailwindCSS + React Hook Form + TanStack Query |
| Backend | NestJS (TypeScript) + Prisma ORM + class-validator + Passport.js (JWT) |
| AI Service | Python FastAPI — resume parsing, matching, embeddings *(planned)* |
| Database | MySQL 8.0 (primary) + Redis (cache/queue) + OpenSearch (search) |
| Vector DB | Qdrant / Milvus — semantic search & AI matching |
| Queue | Bull (Redis-based) — async jobs |
| File Storage | MinIO (dev) / AWS S3 (prod) |
| Auth | JWT (access + refresh tokens) + RBAC Guards |
| i18n | Japanese / Uzbek / English |
| Infra | Docker + docker-compose (Turborepo monorepo) |

---

## Project Structure

```
jobmatcher-platform/
├── apps/
│   ├── web/                    # Next.js 16 frontend (App Router)
│   │   ├── app/
│   │   │   ├── (public)/       # /jobs, /jobs/[id]  — no auth required
│   │   │   ├── (auth)/         # /login, /register, /register/company
│   │   │   ├── (candidate)/    # /dashboard, /profile, /resume, /applications
│   │   │   ├── (agent)/        # /agent/*
│   │   │   ├── (company)/      # /company/*
│   │   │   └── (admin)/        # /admin/*
│   │   ├── components/
│   │   ├── lib/
│   │   │   ├── auth/           # AuthContext, role-based routing
│   │   │   └── mock/           # Mock data (jobs, agents, companies, etc.)
│   │   └── middleware.ts        # Route protection by role
│   ├── api/                    # NestJS backend (modular monolith)
│   │   └── src/modules/
│   │       ├── auth/           # JWT, login, register (candidate + company)
│   │       ├── user/           # Candidate profile CRUD
│   │       ├── resume/         # Resume CRUD (education, experience, skills)
│   │       ├── job/            # Vacancy CRUD
│   │       ├── application/    # Apply flow + status pipeline
│   │       ├── company/        # Company management
│   │       ├── agent/          # Agent operations
│   │       └── admin/          # System management
│   └── ai-service/             # Python FastAPI (planned)
├── prisma/
│   ├── schema.prisma           # Full DB schema (MySQL 8)
│   ├── migrations/
│   └── seed.ts                 # Demo data (admin, agent, company, candidate)
├── docker/
│   └── docker-compose.dev.yml  # MySQL + Redis + MinIO + phpMyAdmin
├── ARCHITECTURE.md             # System rules & architecture decisions
├── README.ja.md                # Japanese README
└── turbo.json
```

---

## Quick Start

### Prerequisites
- Node.js ≥ 20, npm ≥ 10
- Docker Desktop

### 1. Clone & install

```bash
git clone https://github.com/sherzot/jobmatcher-platform.git
cd jobmatcher-platform
npm install
```

### 2. Environment

```bash
cp .env.example .env
# Edit .env — at minimum set DB passwords and JWT secrets
```

### 3. Start infrastructure

```bash
npm run docker:dev
# MySQL :3307 | Redis :6379 | MinIO :9000 | phpMyAdmin :8080
```

### 4. Push schema & seed

```bash
npx prisma db push --schema=./prisma/schema.prisma
npx tsx prisma/seed.ts
```

### 5. Start dev servers

```bash
# Terminal 1 — Frontend
cd apps/web && npm run dev        # http://localhost:3000

# Terminal 2 — Backend
cd apps/api && npm run start:dev  # http://localhost:3001
```

### Demo accounts (after seed)

| Role | Email | Password | Dashboard |
|---|---|---|---|
| Admin | `admin@jobmatch.com` | `Admin@123456` | `/admin/dashboard` |
| Agent | `agent@jobmatch.com` | `Agent@123456` | `/agent/dashboard` |
| Company | `company@jobmatch.com` | `Company@123456` | `/company/dashboard` |
| Candidate | `user@jobmatch.com` | `User@123456` | `/dashboard` |

---

## Current State

### ✅ Database & Backend

- Full Prisma schema — 6 role-specific tables with BUSINESS IDENTIFIER codes
- NestJS modular monolith — auth, user, resume, job, application, company, agent, admin modules
- JWT auth (access + refresh tokens) with role-based guards
- Prisma middleware — auto-generates BUSINESS IDENTIFIER after every record creation
- Company registration approval workflow (agent must approve before company can login)

### ✅ Frontend (mock data)

#### Public
| Route | Description |
|---|---|
| `/` | Landing page — hero search, stats, job cards, testimonials, company CTA |
| `/jobs` | Job search — keyword, prefecture, type, visa, JP level filters |
| `/jobs/[id]` | Job detail — full info + apply CTA |

#### Auth
| Route | Description |
|---|---|
| `/login` | Role-based login with demo account shortcuts |
| `/register` | 2-step candidate registration |
| `/register/company` | 3-step company registration → pending agent approval |

#### Candidate (`/dashboard`, `/profile`, `/resume`, `/applications`, `/messages`)
- Dashboard — stats, pipeline cards, recommended jobs
- Profile — 基本情報 CRUD (name, location, language, visa, preferences, motivation)
- Resume — 履歴書・職務経歴書 (学歴 max 3, 経歴 max 10, スキル/資格 unlimited)
- Applications — 7-stage pipeline visualization
- Messages — chat UI with agent

#### Agent (`/agent/*`)
| Route | Description |
|---|---|
| `/agent/dashboard` | Stats overview |
| `/agent/approvals` | **Company approval queue** — approve/reject with badge count |
| `/agent/approvals/[id]` | **Company detail** — full info + checklist + approve/reject |
| `/agent/companies` | Assigned companies list |
| `/agent/jobs` | Job management (start/stop/publish) |
| `/agent/candidates` | Candidate list with match scores |
| `/agent/messages` | Chat with candidates & companies |

#### Company (`/company/*`)
- Dashboard, jobs (start/stop), messages with agent, profile edit

#### Admin (`/admin/*`)
- Dashboard, agents, companies, users, messages monitor

---

## Business Identifier (BUSINESS CODE)

Every entity has an auto-increment `id` (PK) and a human-readable code generated after creation:

| Table | Field | Pattern | Example |
|---|---|---|---|
| `candidates` | `user_code` | `U` + 7-digit | `U0000001` |
| `companies` | `company_code` | `C` + 7-digit | `C0000001` |
| `agents` | `agent_code` | `A` + 7-digit | `A0000001` |
| `admins` | `admin_code` | `admin` + id | `admin1` |
| `jobs` | `job_code` | `J` + 7-digit | `J0000001` |
| `applications` | `app_code` | `APP` + 7-digit | `APP0000001` |

Generated via `PrismaService` middleware — runs automatically on every `create` action.

---

## Company Registration Flow

```
Company fills /register/company (3 steps)
        ↓
User created (status: PENDING_VERIFICATION)
Company created (status: PENDING_APPROVAL, isActive: false)
        ↓
Agent notified → reviews /agent/approvals/[id]
        ↓
    ┌───────────┬──────────────┐
 APPROVED              REJECTED
    ↓                      ↓
Company can login    Rejection email sent
isActive: true       Company must re-apply
```

---

## Application Pipeline

```
PENDING → CASUAL_INTERVIEW → SCREENING → FIRST_INTERVIEW
       → SECOND_INTERVIEW → THIRD_INTERVIEW → FINAL_INTERVIEW → OFFER → ACCEPTED
```

Every status change triggers: email + in-app notification + chatbot message *(notification module planned)*

---

## Roles & Permissions

| Role | Created By | Dashboard | Key Permissions |
|---|---|---|---|
| **Admin** | Seed / super admin | `/admin/*` | Full system control, creates agents |
| **Agent** | Admin | `/agent/*` | Approves companies, manages jobs & candidates |
| **Company** | Self-register + agent approval | `/company/*` | Own jobs (start/stop), chat with agent |
| **Candidate** | Self-register | `/dashboard` | Job search, apply, manage resume |

> **Rule:** Users never communicate directly with Companies — all goes through Agent.

---

## Environment Variables

```env
# Database
DATABASE_URL="mysql://jobmatch:jobmatch123@localhost:3307/jobmatcher_db"

# JWT
JWT_ACCESS_SECRET=your_access_secret_here
JWT_REFRESH_SECRET=your_refresh_secret_here
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# MinIO / S3
MINIO_ROOT_USER=jobmatch
MINIO_ROOT_PASSWORD=jobmatch123
MINIO_ENDPOINT=localhost
MINIO_PORT=9001

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:3001/api

# AI Service (planned)
OPENAI_API_KEY=sk-...
```

---

## Roadmap

### MVP — In Progress
- [x] Full DB schema (Prisma, MySQL 8)
- [x] Auth module (JWT, 4 roles, register/login)
- [x] Company registration + agent approval flow
- [x] Resume module (CRUD)
- [x] Job module (CRUD)
- [x] Application module (status pipeline)
- [x] Frontend — all role dashboards (mock data)
- [x] Role-based routing + middleware
- [x] BUSINESS IDENTIFIER auto-generation
- [ ] Connect frontend to real API (replace mock data)
- [ ] Email verification flow
- [ ] Admin dashboard — full functionality

### V1 — AI + Communication
- [ ] AI resume parsing (PDF → structured JSON via FastAPI)
- [ ] AI job matching (rule-based + semantic hybrid, explainable score)
- [ ] Japanese resume (履歴書) PDF generation
- [ ] WebSocket chat (User ↔ Agent, Company ↔ Agent)
- [ ] Email + in-app notifications
- [ ] OpenSearch integration (full-text search)

### V2 — Scale
- [ ] Recommendation engine (skill gap, career path)
- [ ] Semantic search (Qdrant/Milvus)
- [ ] Interview scheduling + offer management
- [ ] Cross-market: JP ↔ UZ, visa support
- [ ] Kubernetes + ArgoCD + monitoring

---

## Git Convention

- Branch: `feat/`, `fix/`, `chore/`, `refactor/`, `docs/`
- Commits: Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`, `refactor:`, `test:`)
- PR required for `main`

---

*Built with [Claude Code](https://claude.ai/claude-code)*
