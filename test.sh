#!/bin/bash

# ERIFY™ Incident Relay Worker Test Script
echo "🔥 ERIFY™ Incident Relay Worker Test Suite"
echo "==========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test URL (defaults to local development)
WORKER_URL=${1:-"http://localhost:8787"}

echo -e "${BLUE}Testing worker at: ${WORKER_URL}${NC}"
echo ""

# Test 1: Health Check
echo -e "${YELLOW}Test 1: Health Check${NC}"
response=$(curl -s -w "%{http_code}" "${WORKER_URL}/health")
http_code="${response: -3}"
body="${response%???}"

if [ "$http_code" == "200" ]; then
    echo -e "${GREEN}✅ Health check passed${NC}"
    echo "Response: $body"
else
    echo -e "${RED}❌ Health check failed (HTTP $http_code)${NC}"
fi
echo ""

# Test 2: Investigating Status
echo -e "${YELLOW}Test 2: Investigating Status Alert${NC}"
response=$(curl -s -w "%{http_code}" -X POST "${WORKER_URL}/relay" \
    -H "Content-Type: application/json" \
    -d @samples/investigating.json)
http_code="${response: -3}"
body="${response%???}"

if [ "$http_code" == "200" ] || [ "$http_code" == "207" ]; then
    echo -e "${GREEN}✅ Investigating alert processed${NC}"
    echo "Response: $body"
else
    echo -e "${RED}❌ Investigating alert failed (HTTP $http_code)${NC}"
    echo "Response: $body"
fi
echo ""

# Test 3: Monitoring Status
echo -e "${YELLOW}Test 3: Monitoring Status Alert${NC}"
response=$(curl -s -w "%{http_code}" -X POST "${WORKER_URL}/relay" \
    -H "Content-Type: application/json" \
    -d @samples/monitoring.json)
http_code="${response: -3}"
body="${response%???}"

if [ "$http_code" == "200" ] || [ "$http_code" == "207" ]; then
    echo -e "${GREEN}✅ Monitoring alert processed${NC}"
    echo "Response: $body"
else
    echo -e "${RED}❌ Monitoring alert failed (HTTP $http_code)${NC}"
    echo "Response: $body"
fi
echo ""

# Test 4: Resolved Status
echo -e "${YELLOW}Test 4: Resolved Status Alert${NC}"
response=$(curl -s -w "%{http_code}" -X POST "${WORKER_URL}/relay" \
    -H "Content-Type: application/json" \
    -d @samples/resolved.json)
http_code="${response: -3}"
body="${response%???}"

if [ "$http_code" == "200" ] || [ "$http_code" == "207" ]; then
    echo -e "${GREEN}✅ Resolved alert processed${NC}"
    echo "Response: $body"
else
    echo -e "${RED}❌ Resolved alert failed (HTTP $http_code)${NC}"
    echo "Response: $body"
fi
echo ""

# Test 5: Statuspage.io Format
echo -e "${YELLOW}Test 5: Statuspage.io Format${NC}"
response=$(curl -s -w "%{http_code}" -X POST "${WORKER_URL}/relay" \
    -H "Content-Type: application/json" \
    -d @samples/statuspage-format.json)
http_code="${response: -3}"
body="${response%???}"

if [ "$http_code" == "200" ] || [ "$http_code" == "207" ]; then
    echo -e "${GREEN}✅ Statuspage.io format processed${NC}"
    echo "Response: $body"
else
    echo -e "${RED}❌ Statuspage.io format failed (HTTP $http_code)${NC}"
    echo "Response: $body"
fi
echo ""

# Test 6: Invalid Method
echo -e "${YELLOW}Test 6: Invalid Method (GET)${NC}"
response=$(curl -s -w "%{http_code}" "${WORKER_URL}/relay")
http_code="${response: -3}"

if [ "$http_code" == "405" ]; then
    echo -e "${GREEN}✅ Method validation working${NC}"
else
    echo -e "${RED}❌ Method validation failed (HTTP $http_code)${NC}"
fi
echo ""

# Test 7: Invalid JSON
echo -e "${YELLOW}Test 7: Invalid JSON${NC}"
response=$(curl -s -w "%{http_code}" -X POST "${WORKER_URL}/relay" \
    -H "Content-Type: application/json" \
    -d "invalid json")
http_code="${response: -3}"

if [ "$http_code" == "400" ]; then
    echo -e "${GREEN}✅ JSON validation working${NC}"
else
    echo -e "${RED}❌ JSON validation failed (HTTP $http_code)${NC}"
fi
echo ""

echo -e "${BLUE}🏁 Test suite completed!${NC}"
echo ""
echo -e "${YELLOW}💡 Tips:${NC}"
echo "• To test against a deployed worker: ./test.sh https://your-worker.workers.dev"
echo "• Configure webhook URLs in Wrangler secrets for full testing"
echo "• Check Slack/Discord channels for actual message delivery"