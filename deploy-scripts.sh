#!/bin/bash
# Deployment automation scripts for CampusStream
# Maintained by DevOps team

# Color codes for terminal output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration variables
PROJECT_NAME="CampusStream"
DEPLOY_ENV=${1:-production}
BUILD_DIR="dist"
LOG_FILE="deploy.log"

echo -e "${GREEN}Starting deployment process for ${PROJECT_NAME}${NC}"
echo "Environment: ${DEPLOY_ENV}"
echo "Timestamp: $(date)"

# Function to check prerequisites
check_prerequisites() {
    echo -e "${YELLOW}Checking prerequisites...${NC}"
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        echo -e "${RED}Error: Node.js is not installed${NC}"
        exit 1
    fi
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        echo -e "${RED}Error: npm is not installed${NC}"
        exit 1
    fi
    
    # Check Vercel CLI
    if ! command -v vercel &> /dev/null; then
        echo -e "${YELLOW}Vercel CLI not found, installing...${NC}"
        npm install -g vercel
    fi
    
    echo -e "${GREEN}All prerequisites satisfied${NC}"
}

# Function to run tests
run_tests() {
    echo -e "${YELLOW}Running tests...${NC}"
    npm run test:unit
    if [ $? -ne 0 ]; then
        echo -e "${RED}Tests failed. Aborting deployment.${NC}"
        exit 1
    fi
    echo -e "${GREEN}All tests passed${NC}"
}

# Function to build project
build_project() {
    echo -e "${YELLOW}Building project...${NC}"
    
    # Clean previous build
    rm -rf ${BUILD_DIR}
    
    # Run build
    npm run build
    
    if [ $? -ne 0 ]; then
        echo -e "${RED}Build failed. Aborting deployment.${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}Build completed successfully${NC}"
}

# Function to deploy to Vercel
deploy_to_vercel() {
    echo -e "${YELLOW}Deploying to Vercel...${NC}"
    
    if [ "${DEPLOY_ENV}" == "production" ]; then
        vercel --prod --yes
    else
        vercel --yes
    fi
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}Deployment successful!${NC}"
    else
        echo -e "${RED}Deployment failed${NC}"
        exit 1
    fi
}

# Function to verify deployment
verify_deployment() {
    echo -e "${YELLOW}Verifying deployment...${NC}"
    
    # Check if site is accessible
    SITE_URL="https://campus-stream.vercel.app"
    HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" ${SITE_URL})
    
    if [ "${HTTP_STATUS}" == "200" ]; then
        echo -e "${GREEN}Site is accessible (HTTP ${HTTP_STATUS})${NC}"
    else
        echo -e "${RED}Warning: Site returned HTTP ${HTTP_STATUS}${NC}"
    fi
}

# Function to rollback deployment
rollback_deployment() {
    echo -e "${YELLOW}Rolling back to previous deployment...${NC}"
    vercel rollback
    echo -e "${GREEN}Rollback completed${NC}"
}

# Function to show deployment logs
show_logs() {
    echo -e "${YELLOW}Fetching deployment logs...${NC}"
    vercel logs
}

# Function to set environment variables
set_env_variables() {
    echo -e "${YELLOW}Configuring environment variables...${NC}"
    
    # Supabase configuration
    vercel env add VITE_SUPABASE_URL
    vercel env add VITE_SUPABASE_ANON_KEY
    
    echo -e "${GREEN}Environment variables configured${NC}"
}

# Function to optimize build
optimize_build() {
    echo -e "${YELLOW}Optimizing build...${NC}"
    
    # Analyze bundle size
    npm run build -- --analyze
    
    # Check for unused dependencies
    npx depcheck
    
    echo -e "${GREEN}Build optimization complete${NC}"
}

# Main deployment flow
main() {
    echo "=========================================="
    echo "  CampusStream Deployment Script"
    echo "=========================================="
    
    check_prerequisites
    run_tests
    build_project
    deploy_to_vercel
    verify_deployment
    
    echo -e "${GREEN}Deployment process completed successfully!${NC}"
    echo "Deployment log saved to ${LOG_FILE}"
}

# Handle script arguments
case "${1}" in
    rollback)
        rollback_deployment
        ;;
    logs)
        show_logs
        ;;
    env)
        set_env_variables
        ;;
    optimize)
        optimize_build
        ;;
    *)
        main
        ;;
esac
