#!/bin/bash

# JobMatcher Platform Deployment Script
set -e

echo "🚀 JobMatcher Platform deployment boshlandi..."

# Environment variables
if [ -f "docker/.env.prod" ]; then
    echo "📁 Production environment fayli topildi"
    export $(cat docker/.env.prod | grep -v '^#' | xargs)
else
    echo "⚠️  docker/.env.prod fayli topilmadi. docker/env.prod.example faylini nusxalab, sozlang."
    exit 1
fi

# Docker login
echo "🔐 Docker Hub-ga kirish..."
docker login

# Build and push all services
echo "🏗️  Barcha xizmatlar build qilinmoqda..."

# Auth Service
echo "🔐 Auth Service build qilinmoqda..."
docker build -f docker/Dockerfile.auth -t ${DOCKER_REGISTRY}/jobmatcher/auth-service:latest .
docker push ${DOCKER_REGISTRY}/jobmatcher/auth-service:latest

# Resume Service
echo "📄 Resume Service build qilinmoqda..."
docker build -f docker/Dockerfile.resume -t ${DOCKER_REGISTRY}/jobmatcher/resume-service:latest .
docker push ${DOCKER_REGISTRY}/jobmatcher/resume-service:latest

# Job Service
echo "💼 Job Service build qilinmoqda..."
docker build -f docker/Dockerfile.job -t ${DOCKER_REGISTRY}/jobmatcher/job-service:latest .
docker push ${DOCKER_REGISTRY}/jobmatcher/job-service:latest

# PDF Worker
echo "📊 PDF Worker build qilinmoqda..."
docker build -f docker/Dockerfile.pdfworker -t ${DOCKER_REGISTRY}/jobmatcher/pdf-worker:latest .
docker push ${DOCKER_REGISTRY}/jobmatcher/pdf-worker:latest

# Parser Service
echo "🔍 Parser Service build qilinmoqda..."
docker build -f docker/Dockerfile.parser -t ${DOCKER_REGISTRY}/jobmatcher/parser-service:latest .
docker push ${DOCKER_REGISTRY}/jobmatcher/parser-service:latest

# Admin Service
echo "👨‍💼 Admin Service build qilinmoqda..."
docker build -f docker/Dockerfile.admin -t ${DOCKER_REGISTRY}/jobmatcher/admin-service:latest .
docker push ${DOCKER_REGISTRY}/jobmatcher/admin-service:latest

# Agent Service
echo "🤖 Agent Service build qilinmoqda..."
docker build -f docker/Dockerfile.agent -t ${DOCKER_REGISTRY}/jobmatcher/agent-service:latest .
docker push ${DOCKER_REGISTRY}/jobmatcher/agent-service:latest

# Company Service
echo "🏢 Company Service build qilinmoqda..."
docker build -f docker/Dockerfile.company -t ${DOCKER_REGISTRY}/jobmatcher/company-service:latest .
docker push ${DOCKER_REGISTRY}/jobmatcher/company-service:latest

# Offer Service
echo "💝 Offer Service build qilinmoqda..."
docker build -f docker/Dockerfile.offer -t ${DOCKER_REGISTRY}/jobmatcher/offer-service:latest .
docker push ${DOCKER_REGISTRY}/jobmatcher/offer-service:latest

echo "✅ Barcha xizmatlar muvaffaqiyatli build va push qilindi!"

# Production deployment
echo "🚀 Production environment-ga deploy qilinmoqda..."
cd docker
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d

echo "🎉 Deployment muvaffaqiyatli yakunlandi!"
echo "📊 Xizmatlar quyidagi portlarda ishga tushdi:"
echo "   - Auth Service: ${AUTH_SERVICE_PORT:-8081}"
echo "   - Resume Service: ${RESUME_SERVICE_PORT:-8082}"
echo "   - Job Service: ${JOB_SERVICE_PORT:-8083}"
echo "   - Admin Service: ${ADMIN_SERVICE_PORT:-8084}"
echo "   - Agent Service: ${AGENT_SERVICE_PORT:-8085}"
echo "   - Company Service: ${COMPANY_SERVICE_PORT:-8086}"
echo "   - Offer Service: ${OFFER_SERVICE_PORT:-8087}"
echo "   - Parser Service: ${PARSER_SERVICE_PORT:-8089}"
echo ""
echo "🔍 Xizmatlarni tekshirish: docker-compose -f docker-compose.prod.yml logs -f"
