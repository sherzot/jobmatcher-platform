#!/bin/bash

# K8s Deploy Script for Jobmatcher Platform
# This script deploys the platform to a Kubernetes cluster

set -e

echo "🚀 Deploying Jobmatcher Platform to Kubernetes..."

# Check if kubectl is available
if ! command -v kubectl &> /dev/null; then
    echo "❌ kubectl is not installed or not in PATH"
    echo "Please install kubectl and configure it for your cluster"
    exit 1
fi

# Check if cluster is accessible
if ! kubectl cluster-info &> /dev/null; then
    echo "❌ Cannot connect to Kubernetes cluster"
    echo "Please ensure your cluster is running and kubectl is configured"
    exit 1
fi

echo "✅ Kubernetes cluster is accessible"

# Create namespace
echo "📦 Creating namespace..."
kubectl apply -f k8s/namespace.yaml

# Apply configurations
echo "⚙️  Applying configurations..."
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secrets.yaml

# Deploy infrastructure
echo "🏗️  Deploying infrastructure..."
kubectl apply -f k8s/mysql-deployment.yaml
kubectl apply -f k8s/redis-deployment.yaml
kubectl apply -f k8s/minio-deployment.yaml

# Deploy backend services
echo "🔧 Deploying backend services..."
kubectl apply -f k8s/backend-services.yaml

# Deploy frontend services
echo "🎨 Deploying frontend services..."
kubectl apply -f k8s/frontend-services.yaml

# Deploy ingress
echo "🌐 Deploying ingress..."
kubectl apply -f k8s/ingress.yaml

echo "⏳ Waiting for deployments to be ready..."
kubectl wait --for=condition=available --timeout=300s deployment/mysql-deployment -n jobmatcher || true
kubectl wait --for=condition=available --timeout=300s deployment/auth-service-deployment -n jobmatcher || true
kubectl wait --for=condition=available --timeout=300s deployment/web-frontend-deployment -n jobmatcher || true

echo "📊 Deployment Status:"
kubectl get pods -n jobmatcher
kubectl get services -n jobmatcher
kubectl get ingress -n jobmatcher

echo ""
echo "🎉 Deployment completed successfully!"
echo ""
echo "📋 Access URLs:"
echo "   - Web Frontend: Check ingress configuration"
echo "   - Admin Frontend: Check ingress configuration"
echo "   - Agent Frontend: Check ingress configuration"
echo ""
echo "🔧 Management Commands:"
echo "   - View pods: kubectl get pods -n jobmatcher"
echo "   - View services: kubectl get services -n jobmatcher"
echo "   - View logs: kubectl logs -f deployment/<service-name> -n jobmatcher"
echo "   - Delete deployment: kubectl delete namespace jobmatcher"
