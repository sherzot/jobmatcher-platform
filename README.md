# JobMatcher Platform

雇用主と求職者をつなぐプラットフォーム。(A platform for connecting employers and job seekers.)

## 🏗️ Architecture

このプラットフォームは、マイクロサービスアーキテクチャに基づいて構築されています。

- **認証サービス** - ユーザー認証と認可
- **求人サービス** - 求人管理
- **履歴書サービス** - 履歴書管理とPDF変換
- **企業サービス** - 企業管理
- **エージェントサービス** - 求人エージェント管理
- **管理者サービス** - プラットフォーム管理者向け
- **オファーサービス** - 求人管理
- **パーサーサービス** - PDFおよびその他の形式の解析
- **PDFワーカー** - PDFファイルの処理
  (
The platform is built on a microservices architecture:

- **Auth Service** - User authentication and authorization
- **Job Service** - Job management
- **Resume Service** - Resume management and PDF conversion
- **Company Service** - Company management
- **Agent Service** - Job agent management
- **Admin Service** - For platform administrators
- **Offer Service** - Job offer management
- **Parser Service** - Parsing PDF and other formats
- **PDF Worker** - PDF file processing
  )

## 🚀 Quick Start

### Development Environment

```bash
# Clone repository
git clone https://github.com/sherzot/jobmatcher-platform.git
cd jobmatcher-platform

# Start development environment
cd docker
docker-compose up -d

# Check services
docker-compose ps
```

### Production Deployment

```bash
# 1. 環境設定
cp docker/env.prod.example docker/.env.prod
# .env.prod ファイルを変更する

# 2. Docker Hub にアクセスする
docker login

# 3. 展開する
./scripts/deploy.sh
```

## 📋 Prerequisites

- Docker & Docker Compose
- Go 1.23+
- Node.js 18+
- MySQL 8.4
- MinIO (S3-compatible storage)
- NATS (Message broker)

## 🔧 Configuration

### Environment Variables

すべてのサービスは、次の環境変数を通じて構成されます。

```bash
# Database
MYSQL_ROOT_PASSWORD=your_password
MYSQL_DATABASE=jobmatcher
MYSQL_USER=jobmatcher_user
MYSQL_PASSWORD=your_password

# JWT
JWT_SECRET=your_secret_key

# MinIO
MINIO_ROOT_USER=minio_admin
MINIO_ROOT_PASSWORD=your_minio_password

# Docker Registry
DOCKER_REGISTRY=docker.io/sherzot
```

## 🐳 Docker

### Build Images

```bash
# Individual service
docker build -f docker/Dockerfile.auth -t jobmatcher/auth-service .

# All services
./scripts/deploy.sh
```

### Run Services

```bash
# Development
docker-compose up -d

# Production
docker-compose -f docker/docker-compose.prod.yml up -d
```

## 🧪 Testing

```bash
# Go services
cd backend/auth-service
go test ./...

# Frontend
cd frontend
npm test
```

## 📊 Monitoring

- **Health Check**: `/healthz` endpoint
- **Metrics**: Prometheus metrics (次のバージョンでは)
- **Logs**: Docker logs

## 🔒 Security

- JWT-based authentication
- Rate limiting (Nginx)
- HTTPS enforcement
- Security headers
- Input validation

## 📚 API Documentation

API エンドポイントの形式は次のとおりです。

- `POST /api/v1/auth/register` - 登録
- `POST /api/v1/auth/login` - ログイン
- `GET /api/v1/auth/me` - ユーザー情報
- `POST /api/v1/jobs/` - 求人情報の作成
- `GET /api/v1/jobs/` - 求人情報の取得
- `POST /api/v1/resume/upload` - 履歴書のアップロード

## 🤝 Contributing
1. フォーク
2. フィーチャーブランチを作成する (`git checkout -b feature/amazing-feature`)
3. 変更をコミットする (`git commit -m 'Add awesome feature'')
4. ブランチにプッシュする (`git push origin feature/amazing-feature`)
5. プルリクエストを作成する

## 📄 License

このプロジェクトはMITライセンスに基づいて配布されています。詳細については、`LICENSE`ファイルをご覧ください。

## 📞 Support

ご質問や問題がある場合は、GitHub Issues を開くか、メールでお問い合わせください。

## 🚀 Deployment Status

[![Deploy to Production](https://github.com/sherzot/jobmatcher-platform/actions/workflows/deploy.yml/badge.svg)](https://github.com/sherzot/jobmatcher-platform/actions/workflows/deploy.yml)

---

**JobMatcher Platform** - 雇用主と求職者をつなぐプラットフォーム(A platform for connecting employers and job seekers) 🚀
