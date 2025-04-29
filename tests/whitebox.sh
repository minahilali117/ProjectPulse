#!/bin/bash

BASE=http://localhost:5000

echo "🧪 Checking /api/users"
curl -s -f "$BASE/api/users" || { echo "❌ /api/users failed"; exit 1; }

echo "🧪 Checking /api/projects"
curl -s -f "$BASE/api/projects" || { echo "❌ /api/projects failed"; exit 1; }

echo "🧪 Checking /api/tasks"
curl -s -f "$BASE/api/tasks" || { echo "❌ /api/tasks failed"; exit 1; }

echo "✅ All whitebox tests passed."
