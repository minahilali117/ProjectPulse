#!/bin/bash

BASE=http://localhost:5000

test_endpoint() {
  local path=$1
  echo "🧪 Checking $BASE$path"
  
  response=$(curl -s -w "\n%{http_code}" "$BASE$path")
  body=$(echo "$response" | head -n -1)
  status=$(echo "$response" | tail -n1)

  if [[ "$status" -ge 200 && "$status" -lt 300 ]]; then
    echo "✅ $path responded with $status"
  else
    echo "❌ $path failed with status $status"
    echo "Response body: $body"
    exit 1
  fi
}

test_endpoint "/api/users"
test_endpoint "/api/projects"
test_endpoint "/api/tasks"

echo "✅ All whitebox API tests passed."
