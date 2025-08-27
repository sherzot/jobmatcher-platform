#!/bin/bash

# Jobmatcher Platform Quick Deployment Script
# This script deploys the entire platform using the all-in-one configuration

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

# Deploy everything using all-in-one configuration
deploy_all() {
    print_status "Deploying Jobmatcher Platform using all-in-one configuration..."
    
    kubectl apply -f all-in-one.yaml
    
    print_success "All-in-one deployment applied"
}

# Wait for deployment to be ready
wait_for_deployment() {
    print_status "Waiting for deployment to be ready..."
    
    # Wait for namespace
    kubectl wait --for=condition=active namespace/jobmatcher --timeout=60s
    
    # Wait for infrastructure services
    print_status "Waiting for infrastructure services..."
    kubectl wait --for=condition=ready pod -l app=mysql -n jobmatcher --timeout=300s
    kubectl wait --for=condition=ready pod -l app=redis -n jobmatcher --timeout=300s
    kubectl wait --for=condition=ready pod -l app=minio -n jobmatcher --timeout=300s
    
    # Wait for backend services
    print_status "Waiting for backend services..."
    kubectl wait --for=condition=ready pod -l tier=backend -n jobmatcher --timeout=600s
    
    # Wait for frontend services
    print_status "Waiting for frontend services..."
    kubectl wait --for=condition=ready pod -l tier=frontend -n jobmatcher --timeout=300s
    
    print_success "All services are ready!"
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

# Show access information
show_access_info() {
    print_status "Access Information:"
    echo ""
    
    # Get ingress host
    ingress_host=$(kubectl get ingress jobmatcher-ingress -n jobmatcher -o jsonpath='{.spec.rules[0].host}' 2>/dev/null || echo "jobmatcher.local")
    
    print_status "Platform URL: http://$ingress_host"
    print_status "Admin Panel: http://$ingress_host/admin"
    print_status "Agent Panel: http://$ingress_host/agent"
    print_status "API Base: http://$ingress_host/api"
    
    echo ""
    print_status "MinIO Console: http://$ingress_host/minio"
    print_status "Default MinIO credentials: minioadmin / minioadmin"
    
    echo ""
    print_warning "Note: You may need to add '$ingress_host' to your /etc/hosts file for local development"
    print_status "Run: echo '127.0.0.1 $ingress_host' | sudo tee -a /etc/hosts"
}

# Main deployment function
main() {
    print_status "Starting Jobmatcher Platform quick deployment..."
    echo ""
    
    check_kubectl
    check_cluster
    echo ""
    
    deploy_all
    echo ""
    
    wait_for_deployment
    echo ""
    
    show_status
    echo ""
    
    show_access_info
    echo ""
    
    print_success "Jobmatcher Platform deployment completed successfully!"
    print_status "Use 'kubectl get pods -n jobmatcher' to monitor the deployment"
    print_status "Use './status.sh' to check detailed status"
}

# Run main function
main "$@"
