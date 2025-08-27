#!/bin/bash

# Jobmatcher Platform Status Check Script
# This script checks the status of all deployed services

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

# Check namespace
check_namespace() {
    print_status "Checking namespace..."
    if kubectl get namespace jobmatcher &> /dev/null; then
        print_success "Namespace 'jobmatcher' exists"
    else
        print_error "Namespace 'jobmatcher' not found"
        return 1
    fi
}

# Check pods status
check_pods() {
    print_status "Checking pods status..."
    echo ""
    
    # Get all pods in the namespace
    kubectl get pods -n jobmatcher -o wide
    
    echo ""
    
    # Check for pods not in Running state
    not_running=$(kubectl get pods -n jobmatcher --field-selector=status.phase!=Running --no-headers 2>/dev/null | wc -l)
    
    if [ "$not_running" -eq 0 ]; then
        print_success "All pods are running"
    else
        print_warning "Some pods are not running. Check the status above."
    fi
}

# Check services
check_services() {
    print_status "Checking services..."
    echo ""
    kubectl get services -n jobmatcher
}

# Check ingress
check_ingress() {
    print_status "Checking ingress..."
    echo ""
    kubectl get ingress -n jobmatcher
}

# Check persistent volumes
check_pvc() {
    print_status "Checking persistent volume claims..."
    echo ""
    kubectl get pvc -n jobmatcher
}

# Check endpoints
check_endpoints() {
    print_status "Checking service endpoints..."
    echo ""
    kubectl get endpoints -n jobmatcher
}

# Check events
check_events() {
    print_status "Checking recent events..."
    echo ""
    kubectl get events -n jobmatcher --sort-by='.lastTimestamp' | tail -10
}

# Check resource usage
check_resources() {
    print_status "Checking resource usage..."
    echo ""
    
    print_status "CPU and Memory requests/limits:"
    kubectl top pods -n jobmatcher 2>/dev/null || print_warning "Metrics server not available"
    
    echo ""
    print_status "Resource requests and limits:"
    kubectl describe nodes | grep -A 5 "Allocated resources" || print_warning "Could not get node resource info"
}

# Check logs for errors
check_logs() {
    print_status "Checking for recent errors in logs..."
    echo ""
    
    # Get all pods
    pods=$(kubectl get pods -n jobmatcher -o jsonpath='{.items[*].metadata.name}')
    
    for pod in $pods; do
        print_status "Checking logs for $pod..."
        error_count=$(kubectl logs $pod -n jobmatcher --tail=50 2>/dev/null | grep -i "error\|exception\|panic\|fatal" | wc -l)
        
        if [ "$error_count" -gt 0 ]; then
            print_warning "Found $error_count errors in $pod logs"
        else
            print_success "No errors found in $pod logs"
        fi
    done
}

# Health check endpoints
check_health() {
    print_status "Checking service health endpoints..."
    echo ""
    
    # Get service URLs
    services=(
        "auth-service:8080"
        "admin-service:8081"
        "agent-service:8082"
        "company-service:8083"
        "job-service:8084"
        "offer-service:8085"
        "resume-service:8086"
        "parser-service:8087"
        "pdf-worker:8088"
    )
    
    for service in "${services[@]}"; do
        name=$(echo $service | cut -d: -f1)
        port=$(echo $service | cut -d: -f2)
        
        # Try to port-forward and check health
        print_status "Checking $name health..."
        
        # Start port-forward in background
        kubectl port-forward service/$name $port:8080 -n jobmatcher > /dev/null 2>&1 &
        pf_pid=$!
        
        # Wait a bit for port-forward to establish
        sleep 2
        
        # Check health endpoint
        if curl -s http://localhost:$port/health > /dev/null 2>&1; then
            print_success "$name is healthy"
        else
            print_warning "$name health check failed"
        fi
        
        # Kill port-forward
        kill $pf_pid 2>/dev/null || true
    done
}

# Main function
main() {
    print_status "Starting Jobmatcher Platform status check..."
    echo ""
    
    # Check if kubectl is available
    if ! command -v kubectl &> /dev/null; then
        print_error "kubectl is not installed"
        exit 1
    fi
    
    # Check if connected to cluster
    if ! kubectl cluster-info &> /dev/null; then
        print_error "Cannot connect to Kubernetes cluster"
        exit 1
    fi
    
    echo ""
    
    # Run all checks
    check_namespace
    echo ""
    
    check_pods
    echo ""
    
    check_services
    echo ""
    
    check_ingress
    echo ""
    
    check_pvc
    echo ""
    
    check_endpoints
    echo ""
    
    check_events
    echo ""
    
    check_resources
    echo ""
    
    check_logs
    echo ""
    
    check_health
    echo ""
    
    print_success "Status check completed!"
    print_status "Use 'kubectl logs -f <pod-name> -n jobmatcher' to monitor specific pod logs"
}

# Run main function
main "$@"
