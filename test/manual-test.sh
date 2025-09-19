#!/bin/bash

# ERIFY Incident Relay Worker - Manual Testing Script
# This script tests all the endpoints to ensure they're working correctly

echo "🔥 ERIFY Incident Relay Worker - Endpoint Testing"
echo "================================================="

# Set the base URL (can be overridden with environment variable)
BASE_URL=${TEST_URL:-"http://localhost:8787"}

echo "Testing against: $BASE_URL"
echo ""

# Test health endpoint
echo "📊 Testing /health endpoint..."
echo "curl $BASE_URL/health"
curl -s "$BASE_URL/health" | jq .
echo ""

# Test badge endpoint
echo "🏷️  Testing /badge endpoint..."
echo "curl $BASE_URL/badge"
curl -s "$BASE_URL/badge" | jq .
echo ""

# Test root endpoint
echo "🏠 Testing / (root) endpoint..."
echo "curl $BASE_URL/"
curl -s "$BASE_URL/" | jq .
echo ""

# Test 404 endpoint
echo "❌ Testing 404 response..."
echo "curl $BASE_URL/nonexistent"
response=$(curl -s -w "%{http_code}" "$BASE_URL/nonexistent")
echo "Response: $response"
echo ""

# Test method not allowed
echo "🚫 Testing method not allowed..."
echo "curl -X POST $BASE_URL/health"
response=$(curl -s -w "%{http_code}" -X POST "$BASE_URL/health")
echo "Response: $response"
echo ""

echo "✅ Testing complete!"

# Production testing instructions
echo ""
echo "🌍 To test against production:"
echo "TEST_URL=https://relay.erifyteam.com ./test/manual-test.sh"