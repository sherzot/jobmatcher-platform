# JobMatcher Platform

Ish beruvchilar va ish qidirayotganlar o'rtasida bog'lanish platformasi.

## 🏗️ Architecture

Platforma microservices architecture asosida qurilgan:

- **Auth Service** - Foydalanuvchilar autentifikatsiyasi va avtorizatsiyasi
- **Job Service** - Ish o'rinlari boshqaruvi
- **Resume Service** - Rezyume boshqaruvi va PDF konvertatsiyasi
- **Company Service** - Kompaniyalar boshqaruvi
- **Agent Service** - Ish agentlari boshqaruvi
- **Admin Service** - Platforma administratorlari uchun
- **Offer Service** - Ish takliflari boshqaruvi
- **Parser Service** - PDF va boshqa formatlarni parse qilish
- **PDF Worker** - PDF fayllarni qayta ishlash

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
# 1. Environment sozlash
cp docker/env.prod.example docker/.env.prod
# .env.prod faylini o'zgartiring

# 2. Docker Hub-ga kirish
docker login

# 3. Deploy qilish
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

Barcha xizmatlar quyidagi environment variable-lar orqali sozlanadi:

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
- **Metrics**: Prometheus metrics (keyingi versiyada)
- **Logs**: Docker logs

## 🔒 Security

- JWT-based authentication
- Rate limiting (Nginx)
- HTTPS enforcement
- Security headers
- Input validation

## 📚 API Documentation

API endpoint-lar quyidagi formatda:

- `POST /api/v1/auth/register` - Ro'yxatdan o'tish
- `POST /api/v1/auth/login` - Kirish
- `GET /api/v1/auth/me` - Foydalanuvchi ma'lumotlari
- `POST /api/v1/jobs/` - Ish o'rinini yaratish
- `GET /api/v1/jobs/` - Ish o'rinlarini olish
- `POST /api/v1/resume/upload` - Rezyume yuklash

## 🤝 Contributing

1. Fork qiling
2. Feature branch yarating (`git checkout -b feature/amazing-feature`)
3. O'zgarishlarni commit qiling (`git commit -m 'Add amazing feature'`)
4. Branch-ga push qiling (`git push origin feature/amazing-feature`)
5. Pull Request yarating

## 📄 License

Bu loyiha MIT litsenziyasi ostida tarqatiladi. Batafsil ma'lumot uchun `LICENSE` faylini ko'ring.

## 📞 Support

Savollar yoki muammolar bo'lsa, GitHub Issues oching yoki email orqali bog'laning.

## 🚀 Deployment Status

[![Deploy to Production](https://github.com/sherzot/jobmatcher-platform/actions/workflows/deploy.yml/badge.svg)](https://github.com/sherzot/jobmatcher-platform/actions/workflows/deploy.yml)

---

**JobMatcher Platform** - Ish beruvchilar va ish qidirayotganlar o'rtasida bog'lanish platformasi 🚀
