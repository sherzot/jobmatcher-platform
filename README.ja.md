# JobMatch プラットフォーム

**AI支援型キャリアオペレーティングシステム** — 日本（JP）・ウズベキスタン（UZ）

> 求人マーケットプレイス・ATS（採用管理）・AI マッチング・書類自動化・採用ツール・候補者キャリア管理を統合した本番品質のプラットフォーム

[English README →](./README.md) | [アーキテクチャ＆ルール →](./ARCHITECTURE.md)

---

## 技術スタック

| レイヤー | 技術 |
|---|---|
| フロントエンド | Next.js 16 (App Router) + TypeScript + TailwindCSS + React Hook Form + TanStack Query |
| バックエンド | NestJS (TypeScript) + Prisma ORM + class-validator + Passport.js (JWT) |
| AI サービス | Python FastAPI — 履歴書解析・マッチング・埋め込み *(計画中)* |
| データベース | MySQL 8.0（メイン）+ Redis（キャッシュ/キュー）+ OpenSearch（検索） |
| ベクトル DB | Qdrant / Milvus — セマンティック検索・AI マッチング |
| キュー | Bull (Redis) — 非同期ジョブ |
| ファイルストレージ | MinIO（開発）/ AWS S3（本番） |
| 認証 | JWT（アクセス + リフレッシュトークン）+ RBAC ガード |
| i18n | 日本語 / ウズベク語 / 英語 |
| インフラ | Docker + docker-compose（Turborepo モノレポ） |

---

## プロジェクト構造

```
jobmatcher-platform/
├── apps/
│   ├── web/                    # Next.js 16 フロントエンド
│   │   ├── app/
│   │   │   ├── (public)/       # /jobs, /jobs/[id] — 認証不要
│   │   │   ├── (auth)/         # /login, /register, /register/company
│   │   │   ├── (candidate)/    # /dashboard, /profile, /resume, /applications
│   │   │   ├── (agent)/        # /agent/*
│   │   │   ├── (company)/      # /company/*
│   │   │   └── (admin)/        # /admin/*
│   │   ├── components/
│   │   ├── lib/
│   │   │   ├── auth/           # AuthContext・ロールベースルーティング
│   │   │   └── mock/           # モックデータ（求人・エージェント・企業など）
│   │   └── middleware.ts        # ロール別ルート保護
│   ├── api/                    # NestJS バックエンド（モジュラーモノリス）
│   │   └── src/modules/
│   │       ├── auth/           # JWT・ログイン・登録（候補者・企業）
│   │       ├── user/           # 候補者プロフィール CRUD
│   │       ├── resume/         # 履歴書・職務経歴書 CRUD
│   │       ├── job/            # 求人 CRUD
│   │       ├── application/    # 応募フロー・ステータス管理
│   │       ├── company/        # 企業管理
│   │       ├── agent/          # エージェント操作
│   │       └── admin/          # システム管理
│   └── ai-service/             # Python FastAPI（計画中）
├── prisma/
│   ├── schema.prisma           # 完全な DB スキーマ（MySQL 8）
│   ├── migrations/
│   └── seed.ts                 # デモデータ（管理者・エージェント・企業・候補者）
├── docker/
│   └── docker-compose.dev.yml  # MySQL + Redis + MinIO + phpMyAdmin
├── ARCHITECTURE.md             # システムルール・アーキテクチャ決定事項
└── turbo.json
```

---

## クイックスタート

### 前提条件
- Node.js ≥ 20、npm ≥ 10
- Docker Desktop

### 1. クローン＆インストール

```bash
git clone https://github.com/sherzot/jobmatcher-platform.git
cd jobmatcher-platform
npm install
```

### 2. 環境設定

```bash
cp .env.example .env
# .env を編集（最低限: DB パスワード・JWT シークレット）
```

### 3. インフラ起動

```bash
npm run docker:dev
# MySQL :3307 | Redis :6379 | MinIO :9000 | phpMyAdmin :8080
```

### 4. スキーマ反映＆シード

```bash
npx prisma db push --schema=./prisma/schema.prisma
npx tsx prisma/seed.ts
```

### 5. 開発サーバー起動

```bash
# ターミナル 1 — フロントエンド
cd apps/web && npm run dev        # http://localhost:3000

# ターミナル 2 — バックエンド
cd apps/api && npm run start:dev  # http://localhost:3001
```

### デモアカウント（シード後）

| ロール | メール | パスワード | ダッシュボード |
|---|---|---|---|
| 管理者 | `admin@jobmatch.com` | `/admin/dashboard` |
| エージェント | `agent@jobmatch.com` | `/agent/dashboard` |
| 企業 | `company@jobmatch.com` | `/company/dashboard` |
| 候補者 | `user@jobmatch.com` | `/dashboard` |

> パスワードは `prisma/seed.ts` に定義されています。ローカルでご確認ください。

---

## 現在の状態

### ✅ データベース＆バックエンド

- 完全な Prisma スキーマ — ロール別 6 テーブル + BUSINESS IDENTIFIER コード
- NestJS モジュラーモノリス — 全 8 モジュール実装済み
- JWT 認証（アクセス + リフレッシュトークン）+ ロールガード
- Prisma ミドルウェア — レコード作成時に自動コード生成
- 企業登録審査フロー（エージェント承認後のみログイン可能）

### ✅ フロントエンド（モックデータ）

#### 公開ページ
| ルート | 説明 |
|---|---|
| `/` | ランディングページ — ヒーロー検索・統計・求人カード・企業向け CTA |
| `/jobs` | 求人検索 — キーワード・都道府県・雇用形態・ビザ・日本語レベルフィルター |
| `/jobs/[id]` | 求人詳細 — 全情報 + 応募 CTA |

#### 認証
| ルート | 説明 |
|---|---|
| `/login` | ロールベースログイン（デモアカウントショートカット付き） |
| `/register` | 2 ステップ候補者登録 |
| `/register/company` | 3 ステップ企業登録 → エージェント審査待ち |

#### 候補者（`/dashboard`, `/profile`, `/resume`, `/applications`, `/messages`）
- ダッシュボード — 統計・パイプラインカード・おすすめ求人
- プロフィール — 基本情報 CRUD（氏名・居住地・言語・ビザ・希望条件・志望動機）
- 履歴書・職務経歴書（学歴 最大 3 件・経歴 最大 10 件・スキル/資格 無制限）
- 応募履歴 — 7 段階パイプライン可視化
- メッセージ — エージェントとのチャット UI

#### エージェント（`/agent/*`）
| ルート | 説明 |
|---|---|
| `/agent/dashboard` | 統計概要 |
| `/agent/approvals` | **企業審査キュー** — 承認/否認（バッジカウント付き） |
| `/agent/approvals/[id]` | **企業詳細** — 全情報 + チェックリスト + 承認/否認 |
| `/agent/companies` | 担当企業一覧 |
| `/agent/jobs` | 求人管理（開始/停止/公開） |
| `/agent/candidates` | 候補者一覧（マッチスコア付き） |
| `/agent/messages` | 候補者・企業とのチャット |

#### 企業（`/company/*`）
- ダッシュボード・求人管理（開始/停止）・エージェントとのメッセージ・プロフィール編集

#### 管理者（`/admin/*`）
- ダッシュボード・エージェント管理・企業管理・ユーザー管理・メッセージ監視

---

## BUSINESS IDENTIFIER（ビジネスコード）

各エンティティは AUTO_INCREMENT の `id`（主キー）と、作成後に自動生成される人間可読コードを持ちます：

| テーブル | フィールド | パターン | 例 |
|---|---|---|---|
| `candidates` | `user_code` | `U` + 7 桁 | `U0000001` |
| `companies` | `company_code` | `C` + 7 桁 | `C0000001` |
| `agents` | `agent_code` | `A` + 7 桁 | `A0000001` |
| `admins` | `admin_code` | `admin` + id | `admin1` |
| `jobs` | `job_code` | `J` + 7 桁 | `J0000001` |
| `applications` | `app_code` | `APP` + 7 桁 | `APP0000001` |

`PrismaService` ミドルウェアが `create` アクションのたびに自動実行します。

---

## 企業登録フロー

```
企業が /register/company で登録（3 ステップ）
        ↓
User 作成（status: PENDING_VERIFICATION）
Company 作成（status: PENDING_APPROVAL, isActive: false）
        ↓
エージェント通知 → /agent/approvals/[id] で審査
        ↓
    ┌──────────────┬──────────────┐
  承認（APPROVED）          否認（REJECTED）
    ↓                          ↓
企業がログイン可能          否認メール送信
isActive: true              再申請が必要
```

---

## 応募パイプライン

```
応募済み → カジュアル面談 → 書類選考 → 一次面接
       → 二次面接 → 三次面接 → 最終面接 → 内定 → 承諾
```

ステータス変更のたびに通知（メール + アプリ内 + チャットボット）送信 *(通知モジュール計画中)*

---

## ロール＆権限

| ロール | 作成者 | ダッシュボード | 主な権限 |
|---|---|---|---|
| **Admin（管理者）** | シード / スーパー管理者 | `/admin/*` | 全システム制御・エージェント作成 |
| **Agent（エージェント）** | 管理者 | `/agent/*` | 企業審査・求人・候補者管理 |
| **Company（企業）** | 自己登録 + エージェント承認 | `/company/*` | 自社求人（開始/停止）・エージェントとの連絡 |
| **Candidate（候補者）** | 自己登録 | `/dashboard` | 求人検索・応募・履歴書管理 |

> **ルール:** 候補者と企業は直接連絡できません — すべてエージェント経由

---

## ロードマップ

### MVP — 進行中
- [x] 完全な DB スキーマ（Prisma、MySQL 8）
- [x] 認証モジュール（JWT、4 ロール）
- [x] 企業登録 + エージェント承認フロー
- [x] 全ロールのフロントエンド（モックデータ）
- [x] BUSINESS IDENTIFIER 自動生成
- [ ] フロントエンドと実 API の接続
- [ ] メール認証フロー

### V1 — AI + コミュニケーション
- [ ] AI 履歴書解析（PDF → 構造化 JSON）
- [ ] AI 求人マッチング（ルールベース + セマンティックハイブリッド）
- [ ] 履歴書 PDF 自動生成
- [ ] WebSocket チャット
- [ ] メール + アプリ内通知
- [ ] OpenSearch 統合

### V2 — スケール
- [ ] レコメンデーションエンジン
- [ ] セマンティック検索（Qdrant/Milvus）
- [ ] 面接スケジュール + オファー管理
- [ ] 日本 ↔ ウズベキスタン クロスマーケット対応
- [ ] Kubernetes + 監視

---

*[Claude Code](https://claude.ai/claude-code) で構築*
