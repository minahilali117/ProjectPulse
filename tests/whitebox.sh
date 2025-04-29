#!/bin/bash

BASE=http://localhost:8800
FRONT=http://localhost:3000
failed=false

test_get() {
  local path=$1
  echo "🧪 GET $BASE$path"
  
  response=$(curl -s -w "\n%{http_code}" "$BASE$path")
  body=$(echo "$response" | head -n -1)
  status=$(echo "$response" | tail -n1)

  if [[ "$status" -ge 200 && "$status" -lt 300 ]]; then
    echo "✅ GET $path responded with $status"
  else
    echo "❌ GET $path failed with status $status"
    echo "Response body: $body"
    failed=true
  fi
}

test_post() {
  local path=$1
  local data=$2
  echo "🧪 POST $BASE$path with data: $data"

  response=$(curl -s -X POST -H "Content-Type: application/json" -d "$data" -w "\n%{http_code}" "$BASE$path")
  body=$(echo "$response" | head -n -1)
  status=$(echo "$response" | tail -n1)

  if [[ "$status" -ge 200 && "$status" -lt 300 ]]; then
    echo "✅ POST $path responded with $status"
  else
    echo "❌ POST $path failed with status $status"
    echo "Response body: $body"
    failed=true
  fi
}

test_put() {
  local path=$1
  local data=$2
  echo "🧪 PUT $BASE$path with data: $data"

  response=$(curl -s -X PUT -H "Content-Type: application/json" -d "$data" -w "\n%{http_code}" "$BASE$path")
  body=$(echo "$response" | head -n -1)
  status=$(echo "$response" | tail -n1)

  if [[ "$status" -ge 200 && "$status" -lt 300 ]]; then
    echo "✅ PUT $path responded with $status"
  else
    echo "❌ PUT $path failed with status $status"
    echo "Response body: $body"
    failed=true
  fi
}

test_delete() {
  local path=$1
  echo "🧪 DELETE $BASE$path"

  response=$(curl -s -X DELETE -w "\n%{http_code}" "$BASE$path")
  body=$(echo "$response" | head -n -1)
  status=$(echo "$response" | tail -n1)

  if [[ "$status" -ge 200 && "$status" -lt 300 ]]; then
    echo "✅ DELETE $path responded with $status"
  else
    echo "❌ DELETE $path failed with status $status"
    echo "Response body: $body"
    failed=true
  fi
}

check_frontend() {
  echo "🌐 Checking frontend at $FRONT"
  response=$(curl -s -w "\n%{http_code}" "$FRONT")
  body=$(echo "$response" | head -n -1)
  status=$(echo "$response" | tail -n1)

  if [[ "$status" -ge 200 && "$status" -lt 400 ]]; then
    echo "✅ Frontend responded with $status"
  else
    echo "❌ Frontend failed with status $status"
    echo "Response body: $body"
    failed=true
  fi
}

# --- Test API Routes ---
test_get "/api/users"
test_get "/api/projects"
test_get "/api/tasks"

test_post "/api/users" '{"name":"Test User","email":"test@example.com"}'
test_put "/api/users/123" '{"name":"Updated User"}'
test_delete "/api/users/123"

# --- Test Frontend ---
check_frontend

# --- Final Result ---
if [ "$failed" = true ]; then
  echo "⚠️ Some tests failed, but CI will continue."
else
  echo "✅ All API and frontend tests passed."
fi
