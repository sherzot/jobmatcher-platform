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

#### Docker Compose Deployment

```bash
# 1. 環境設定
cp docker/env.prod.example docker/.env.prod
# .env.prod ファイルを変更する

# 2. Docker Hub にアクセスする
docker login

# 3. 展開する
cd docker
docker-compose -f docker-compose.prod.yml up -d
```

#### Kubernetes Deployment

```bash
# 1. Prerequisites
# - kubectl installed and configured
# - Kubernetes cluster running
# - nginx-ingress controller installed

# 2. Deploy to Kubernetes
cd k8s
./deploy.sh

# 3. Check deployment status
kubectl get pods -n jobmatcher
kubectl get services -n jobmatcher
kubectl get ingress -n jobmatcher
```

## 📋 Prerequisites

### Development
- Docker & Docker Compose
- Go 1.23+
- Node.js 18+
- MySQL 8.4
- MinIO (S3-compatible storage)
- NATS (Message broker)

### Production (Kubernetes)
- Kubernetes cluster (1.24+)
- kubectl CLI tool
- nginx-ingress controller
- cert-manager (for SSL certificates)
- Persistent volume support

## 🔧 Configuration

### Environment Variables

すべてのサービスは、次の環境変数を通じて構成されます。

```bash
# Database
MYSQL_ROOT_PASSWORD=your_password
MYSQL_DATABASE=jobmatcher
MYSQL_USER=jobmatcher_user
MYSQL_PASSWORD=your_password

# Redis
REDIS_PASSWORD=your_redis_password

# JWT
JWT_SECRET=your_secret_key

# MinIO
MINIO_ROOT_USER=minio_admin
MINIO_ROOT_PASSWORD=your_minio_password

# Docker Registry
DOCKER_REGISTRY=docker.io/sherdev
```

### Kubernetes Configuration

Kubernetes deployment uchun quyidagi fayllar mavjud:

- `k8s/namespace.yaml` - Namespace konfiguratsiyasi
- `k8s/configmap.yaml` - Umumiy konfiguratsiya
- `k8s/secrets.yaml` - Maxfiy ma'lumotlar
- `k8s/mysql-deployment.yaml` - MySQL deployment
- `k8s/redis-deployment.yaml` - Redis deployment
- `k8s/minio-deployment.yaml` - MinIO deployment
- `k8s/backend-services.yaml` - Backend servislari
- `k8s/frontend-services.yaml` - Frontend servislari
- `k8s/ingress.yaml` - Ingress konfiguratsiyasi

## 🐳 Docker

### Build Images

```bash
# Individual service
docker build -f docker/Dockerfile.auth -t jobmatcher/auth-service .

# All services via GitHub Actions
# Push to main branch triggers automatic build and push
```

### Run Services

```bash
# Development
docker-compose up -d

# Production
docker-compose -f docker-compose.prod.yml up -d
```

## ☸️ Kubernetes

### Manual Deployment

```bash
# 1. Create namespace
kubectl apply -f k8s/namespace.yaml

# 2. Apply configurations
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secrets.yaml

# 3. Deploy infrastructure
kubectl apply -f k8s/mysql-deployment.yaml
kubectl apply -f k8s/redis-deployment.yaml
kubectl apply -f k8s/minio-deployment.yaml

# 4. Deploy services
kubectl apply -f k8s/backend-services.yaml
kubectl apply -f k8s/frontend-services.yaml

# 5. Deploy ingress
kubectl apply -f k8s/ingress.yaml
```

### Automated Deployment

```bash
# Use the deployment script
cd k8s
./deploy.sh
```

### Scaling Services

```bash
# Scale backend services
kubectl scale deployment auth-service-deployment --replicas=3 -n jobmatcher
kubectl scale deployment admin-service-deployment --replicas=3 -n jobmatcher

# Scale frontend services
kubectl scale deployment web-frontend-deployment --replicas=3 -n jobmatcher
```

## 🔄 CI/CD Pipeline

GitHub Actions orqali avtomatik deployment:

1. **Test Stage**: Barcha servislarni test qilish
2. **Build Stage**: Docker image larni yaratish
3. **Push Stage**: Docker Hub ga push qilish
4. **Deploy Stage**: Production ga deploy qilish

### GitHub Secrets

Quyidagi secrets ni GitHub repository ga qo'shish kerak:

- `DOCKER_USERNAME`: Docker Hub username
- `DOCKER_PASSWORD`: Docker Hub password/token

## 📊 Monitoring & Logging

### Health Checks

Barcha servislarda health check endpoint lar mavjud:

- Backend: `/health`
- Frontend: `/`

### Logs

```bash
# Pod logs
kubectl logs -f deployment/auth-service-deployment -n jobmatcher

# Service logs
kubectl logs -f service/auth-service -n jobmatcher
```

## 🚨 Troubleshooting

### Common Issues

1. **Pod CrashLoopBackOff**: Check logs and resource limits
2. **Service Unavailable**: Verify service selectors and endpoints
3. **Ingress Not Working**: Check nginx-ingress controller
4. **Database Connection Failed**: Verify MySQL service and credentials

### Debug Commands

```bash
# Check pod status
kubectl get pods -n jobmatcher

# Check service endpoints
kubectl get endpoints -n jobmatcher

# Check ingress status
kubectl get ingress -n jobmatcher

# Check events
kubectl get events -n jobmatcher --sort-by='.lastTimestamp'
```

## 📚 Additional Resources

- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Docker Documentation](https://docs.docker.com/)
- [Nginx Ingress Controller](https://kubernetes.github.io/ingress-nginx/)
- [Cert Manager](https://cert-manager.io/docs/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
