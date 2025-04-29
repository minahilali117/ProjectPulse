#!/bin/bash

BASE=http://localhost:3000

echo "🧪 Checking /api/users"
curl -s -f "$BASE/api/users" || exit 1

echo "🧪 Checking /api/projects"
curl -s -f "$BASE/api/projects" || exit 1

echo "🧪 Checking /api/tasks"
curl -s -f "$BASE/api/tasks" || exit 1

echo "✅ All whitebox tests passed."
