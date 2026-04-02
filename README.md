# JobMatch Platform

**AI-Assisted Career Operating System** — Japan (JP) & Uzbekistan (UZ) job market

> Production-grade platform combining: Job Marketplace + ATS Workflow + AI Matching + Document Automation + Recruiter Tools + Candidate Career OS

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16 (App Router) + TypeScript + TailwindCSS |
| Backend | NestJS (TypeScript) + Prisma ORM + Passport.js (JWT) |
| AI Service | Python FastAPI — resume parsing, matching, embeddings |
| Database | MySQL 8.0 + Redis + OpenSearch |
| Vector DB | Qdrant / Milvus |
| Queue | Bull (Redis-based) |
| File Storage | MinIO (dev) / AWS S3 (prod) |
| Auth | JWT (access + refresh) + RBAC |
| i18n | Japanese / Uzbek / English |
| Infra | Docker + docker-compose |

---

## Project Structure

```
jobmatcher-platform/
├── apps/
│   ├── web/              # Next.js 16 frontend (App Router)
│   ├── api/              # NestJS backend (modular monolith)
│   └── ai-service/       # Python FastAPI (planned)
├── packages/
│   └── shared-types/     # Shared TypeScript interfaces
├── prisma/
│   └── schema.prisma     # Full DB schema (MySQL)
├── docker/
│   └── docker-compose.dev.yml
└── .env.example
```

---

## Quick Start

### 1. Clone & install dependencies

```bash
git clone https://github.com/sherzot/jobmatcher-platform.git
cd jobmatcher-platform
npm install
```

### 2. Set up environment

```bash
cp .env.example .env
# Edit .env with your values
```

### 3. Start infrastructure (MySQL + Redis + MinIO)

```bash
npm run docker:dev
# or directly:
docker-compose -f docker/docker-compose.dev.yml up -d
```

### 4. Run database migrations

```bash
npm run db:migrate
```

### 5. Start development servers

```bash
# Start all apps (web + api)
npm run dev

# Or individually:
cd apps/web && npm run dev   # http://localhost:3000
cd apps/api && npm run dev   # http://localhost:3001
```

---

## What's Built (Current State)

### ✅ Phase 0 — Foundation

- [x] Monorepo setup (npm workspaces + Turborepo)
- [x] Next.js 16 app bootstrapped (`apps/web`)
- [x] NestJS app bootstrapped (`apps/api`)
- [x] Docker Compose — MySQL 8, Redis 7, MinIO
- [x] Prisma schema — all core entities (12 models)
- [x] `shared-types` package — TypeScript interfaces + JP labels
- [x] `.env.example` — all required variables documented

### ✅ Phase 1 — Candidate UI Prototype (mock data)

| Route | Description |
|---|---|
| `/jobs` | Public job search with filters (keyword, prefecture, type, visa, JP level) |
| `/jobs/[id]` | Job detail page — full info + apply CTA |
| `/register` | 2-step registration (account → 基本情報) |
| `/login` | Login form |
| `/dashboard` | Candidate dashboard — stats, pipeline cards, recommended jobs |
| `/applications` | Application history with 7-stage pipeline visualization |
| `/profile` | 基本情報 edit — 氏名, 居住地, 言語/ビザ, 希望条件, 志望動機 |
| `/resume` | 履歴書・職務経歴書 CRUD — 学歴 max 3, 経歴 max 10, スキル/資格 unlimited |

### ✅ Phase 2 — Agent Dashboard Prototype (mock data)

| Route | Description |
|---|---|
| `/agent/dashboard` | Overview — stats, active jobs, candidates in progress, companies |
| `/agent/companies` | Company CRUD with modal (create / edit / toggle active) |
| `/agent/jobs` | Job list with status badges + start/stop/publish actions |
| `/agent/jobs/new` | **2-step:** select company first → then fill job form (no company = no job) |
| `/agent/jobs/[id]` | Job detail + candidates list (match score, status, actions) |
| `/agent/candidates` | Full candidate list with filters (status, job, search) + match score |

### ✅ Phase 3 — Company Dashboard Prototype (mock data)

| Route | Description |
|---|---|
| `/company/dashboard` | Overview — stats, job list, agent card, recent applications |
| `/company/jobs` | Own job list with **start / stop** controls (agent creates jobs, company controls them) |
| `/company/jobs/[id]` | Job detail + applicant list (read-only, agent contact button) |
| `/company/messages` | Real-time chat UI with assigned agent |
| `/company/profile` | Company info edit — name, industry, location, description |

### 🔄 In Progress

- [ ] Admin dashboard prototype

### 📋 Roadmap

#### MVP — Phase 2 (Real Backend)
- [ ] Auth module — register, login, JWT, email verification
- [ ] User + Profile module
- [ ] Resume module (CRUD + upload)
- [ ] Job module (CRUD + search)
- [ ] Application module (apply flow + status tracking)
- [ ] Agent module (company + job management)

#### V1 — Phase 3 (AI + Communication)
- [ ] AI resume parsing (PDF → structured JSON)
- [ ] AI job matching (rule-based + semantic hybrid)
- [ ] Japanese resume (履歴書) PDF generation
- [ ] Chat/messaging (WebSocket)
- [ ] Notifications (email + in-app)
- [ ] OpenSearch integration

#### V2 — Phase 4 (Scale)
- [ ] Recommendation engine
- [ ] Semantic search (vector DB)
- [ ] Interview scheduling
- [ ] Cross-market: JP ↔ UZ, visa support
- [ ] Kubernetes + monitoring

---

## Database Schema

Core entities and their auto-increment codes:

| Entity | Code Format | Example |
|---|---|---|
| User (Candidate) | `U` + 7 digits | `U0000001` |
| Job | `J` + 7 digits | `J0000001` |
| Company | `C` + 7 digits | `C0000001` |
| Agent | `A` + 7 digits | `A0000001` |
| Application | `APP` + 7 digits | `APP0000001` |

Full schema: [`prisma/schema.prisma`](./prisma/schema.prisma)

---

## Application Pipeline

```
応募済み → カジュアル面談 → 書類選考 → 一次面接 → 二次面接 → 最終面接 → 内定
(PENDING → CASUAL_INTERVIEW → SCREENING → FIRST_INTERVIEW → SECOND_INTERVIEW → FINAL_INTERVIEW → OFFER)
```

---

## Roles

| Role | Access | Dashboard |
|---|---|---|
| **Candidate** | Job search (public), apply, manage resume | `/dashboard`, `/applications`, `/profile`, `/resume` |
| **Agent** | Create companies/jobs, manage candidates, chat | `/agent/*` |
| **Company** | View own jobs, chat with agent | `/company/*` |
| **Admin** | Full system control | `/admin/*` |

> Users never communicate directly with Companies — all communication goes through the Agent.

---

## Environment Variables

See [`.env.example`](./.env.example) for all required variables.

Key variables:

```env
DATABASE_URL="mysql://user:pass@localhost:3306/jobmatcher_db"
JWT_ACCESS_SECRET=...
JWT_REFRESH_SECRET=...
REDIS_HOST=localhost
MINIO_ROOT_USER=...
OPENAI_API_KEY=...
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

---

## Contributing

1. Branch naming: `feat/`, `fix/`, `chore/`, `refactor/`
2. Commit style: Conventional Commits (`feat:`, `fix:`, `docs:`, etc.)
3. PR required for `main` branch

---

*Built with Claude Code — [JobMatch Platform](https://github.com/sherzot/jobmatcher-platform)*
