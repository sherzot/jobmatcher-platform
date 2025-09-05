#!/bin/bash

# JobMatcher Platform - Complete Deployment Script
# GitHub > Docker > K8s Pipeline

set -e

echo "🚀 JobMatcher Platform - Complete Deployment"
echo "============================================="
echo ""

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

# Check if we're in the right directory
if [ ! -f "docker-compose.yml" ] && [ ! -f "docker/docker-compose.yml" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    print_error "Docker is not running. Please start Docker and try again."
    exit 1
fi

# Check if kubectl is available (optional)
if command -v kubectl &> /dev/null; then
    K8S_AVAILABLE=true
    print_status "Kubernetes (kubectl) is available"
else
    K8S_AVAILABLE=false
    print_warning "Kubernetes (kubectl) is not available. K8s deployment will be skipped."
fi

# Function to deploy to GitHub
deploy_github() {
    print_status "Deploying to GitHub..."
    
    # Check if git is clean
    if [ -n "$(git status --porcelain)" ]; then
        print_status "Committing changes..."
        git add .
        git commit -m "feat: Deploy to production - $(date '+%Y-%m-%d %H:%M:%S')"
    fi
    
    # Push to GitHub
    print_status "Pushing to GitHub..."
    git push origin main
    
    print_success "GitHub deployment completed!"
    print_status "GitHub Actions will automatically build and push Docker images"
}

# Function to deploy locally with Docker
deploy_docker() {
    print_status "Deploying with Docker Compose..."
    
    # Stop existing containers
    print_status "Stopping existing containers..."
    docker-compose -f docker/docker-compose.yml down 2>/dev/null || true
    
    # Build and start containers
    print_status "Building and starting containers..."
    docker-compose -f docker/docker-compose.yml up -d --build
    
    # Wait for services to be ready
    print_status "Waiting for services to be ready..."
    sleep 10
    
    # Check if services are running
    print_status "Checking service status..."
    docker-compose -f docker/docker-compose.yml ps
    
    print_success "Docker deployment completed!"
    print_status "Services available at:"
    print_status "  - Web Frontend: http://localhost:3001"
    print_status "  - Agent Frontend: http://localhost:3002"
    print_status "  - Admin Frontend: http://localhost:3003"
    print_status "  - API Gateway: http://localhost:8080"
}

# Function to deploy to Kubernetes
deploy_k8s() {
    if [ "$K8S_AVAILABLE" = false ]; then
        print_warning "Skipping K8s deployment - kubectl not available"
        return
    fi
    
    print_status "Deploying to Kubernetes..."
    
    # Check if we have a K8s cluster
    if ! kubectl cluster-info > /dev/null 2>&1; then
        print_warning "No Kubernetes cluster available. Skipping K8s deployment."
        return
    fi
    
    # Apply K8s configurations
    print_status "Applying Kubernetes configurations..."
    
    # Create namespace
    kubectl apply -f k8s/namespace.yaml
    
    # Apply secrets (if they exist)
    if [ -f "k8s/secrets.yaml" ]; then
        kubectl apply -f k8s/secrets.yaml
    else
        print_warning "k8s/secrets.yaml not found. Please create it with your secrets."
    fi
    
    # Apply configmap
    kubectl apply -f k8s/configmap.yaml
    
    # Apply MySQL
    kubectl apply -f k8s/mysql-deployment.yaml
    
    # Apply Redis
    kubectl apply -f k8s/redis-deployment.yaml
    
    # Apply MinIO
    kubectl apply -f k8s/minio-deployment.yaml
    
    # Apply Backend Services
    kubectl apply -f k8s/backend-services.yaml
    
    # Apply Frontend Services
    kubectl apply -f k8s/frontend-services.yaml
    
    # Apply Ingress
    kubectl apply -f k8s/ingress.yaml
    
    print_success "Kubernetes deployment completed!"
    print_status "Check deployment status with: kubectl get pods -n jobmatcher"
}

# Main deployment function
main() {
    echo "Select deployment option:"
    echo "1) GitHub only (push code, trigger CI/CD)"
    echo "2) Docker only (local deployment)"
    echo "3) K8s only (Kubernetes deployment)"
    echo "4) All (GitHub + Docker + K8s)"
    echo "5) Quick Docker (stop, build, start)"
    echo ""
    read -p "Enter your choice (1-5): " choice
    
    case $choice in
        1)
            deploy_github
            ;;
        2)
            deploy_docker
            ;;
        3)
            deploy_k8s
            ;;
        4)
            deploy_github
            echo ""
            print_status "Waiting for GitHub Actions to complete..."
            print_status "You can check progress at: https://github.com/sherzot/jobmatcher-platform/actions"
            echo ""
            read -p "Press Enter when GitHub Actions is complete, or Ctrl+C to skip Docker/K8s deployment..."
            deploy_docker
            deploy_k8s
            ;;
        5)
            print_status "Quick Docker deployment..."
            docker-compose -f docker/docker-compose.yml down
            docker-compose -f docker/docker-compose.yml up -d --build
            print_success "Quick Docker deployment completed!"
            ;;
        *)
            print_error "Invalid choice. Please run the script again."
            exit 1
            ;;
    esac
    
    echo ""
    print_success "🎉 Deployment completed successfully! 🎉"
    echo ""
    print_status "Next steps:"
    print_status "1. Check service status: docker-compose -f docker/docker-compose.yml ps"
    print_status "2. View logs: docker-compose -f docker/docker-compose.yml logs -f"
    print_status "3. Access application: http://localhost:3001"
    if [ "$K8S_AVAILABLE" = true ]; then
        print_status "4. Check K8s pods: kubectl get pods -n jobmatcher"
    fi
    echo ""
}

# Run main function
main
