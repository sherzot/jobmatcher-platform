#!/bin/bash

# Jobmatcher Platform Kubernetes Deployment Script
# This script deploys the entire Jobmatcher platform to Kubernetes

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if kubectl is installed
check_kubectl() {
    if ! command -v kubectl &> /dev/null; then
        print_error "kubectl is not installed. Please install kubectl first."
        exit 1
    fi
    print_success "kubectl found"
}

# Check if kubectl can connect to cluster
check_cluster() {
    if ! kubectl cluster-info &> /dev/null; then
        print_error "Cannot connect to Kubernetes cluster. Please check your kubeconfig."
        exit 1
    fi
    print_success "Connected to Kubernetes cluster"
}

# Create namespace
create_namespace() {
    print_status "Creating namespace..."
    kubectl apply -f namespace.yaml
    print_success "Namespace created"
}

# Apply configurations
apply_configs() {
    print_status "Applying ConfigMaps and Secrets..."
    kubectl apply -f configmap.yaml
    kubectl apply -f secrets.yaml
    print_success "ConfigMaps and Secrets applied"
}

# Deploy infrastructure services
deploy_infrastructure() {
    print_status "Deploying infrastructure services..."
    
    print_status "Deploying MySQL..."
    kubectl apply -f mysql-deployment.yaml
    
    print_status "Deploying Redis..."
    kubectl apply -f redis-deployment.yaml
    
    print_status "Deploying MinIO..."
    kubectl apply -f minio-deployment.yaml
    
    print_success "Infrastructure services deployed"
}

# Wait for infrastructure to be ready
wait_for_infrastructure() {
    print_status "Waiting for infrastructure services to be ready..."
    
    print_status "Waiting for MySQL..."
    kubectl wait --for=condition=ready pod -l app=mysql -n jobmatcher --timeout=300s
    
    print_status "Waiting for Redis..."
    kubectl wait --for=condition=ready pod -l app=redis -n jobmatcher --timeout=300s
    
    print_status "Waiting for MinIO..."
    kubectl wait --for=condition=ready pod -l app=minio -n jobmatcher --timeout=300s
    
    print_success "Infrastructure services are ready"
}

# Deploy backend services
deploy_backend() {
    print_status "Deploying backend services..."
    kubectl apply -f backend-services.yaml
    print_success "Backend services deployed"
}

# Deploy frontend services
deploy_frontend() {
    print_status "Deploying frontend services..."
    kubectl apply -f frontend-services.yaml
    print_success "Frontend services deployed"
}

# Deploy ingress
deploy_ingress() {
    print_status "Deploying ingress..."
    kubectl apply -f ingress.yaml
    print_success "Ingress deployed"
}

# Wait for all services to be ready
wait_for_services() {
    print_status "Waiting for all services to be ready..."
    
    # Wait for backend services
    kubectl wait --for=condition=ready pod -l tier=backend -n jobmatcher --timeout=600s
    
    # Wait for frontend services
    kubectl wait --for=condition=ready pod -l tier=frontend -n jobmatcher --timeout=300s
    
    print_success "All services are ready"
}

# Show deployment status
show_status() {
    print_status "Deployment completed! Here's the current status:"
    echo ""
    
    print_status "Pods:"
    kubectl get pods -n jobmatcher
    
    echo ""
    print_status "Services:"
    kubectl get services -n jobmatcher
    
    echo ""
    print_status "Ingress:"
    kubectl get ingress -n jobmatcher
    
    echo ""
    print_status "Persistent Volume Claims:"
    kubectl get pvc -n jobmatcher
}

# Main deployment function
main() {
    print_status "Starting Jobmatcher Platform deployment..."
    echo ""
    
    check_kubectl
    check_cluster
    echo ""
    
    create_namespace
    echo ""
    
    apply_configs
    echo ""
    
    deploy_infrastructure
    echo ""
    
    wait_for_infrastructure
    echo ""
    
    deploy_backend
    echo ""
    
    deploy_frontend
    echo ""
    
    deploy_ingress
    echo ""
    
    wait_for_services
    echo ""
    
    show_status
    echo ""
    
    print_success "Jobmatcher Platform deployment completed successfully!"
    print_status "You can now access your platform through the ingress endpoints."
}

# Run main function
main "$@"
