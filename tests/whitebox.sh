#!/bin/bash

BASE=http://localhost:5000

echo "Checking /api/users"
curl -f "$BASE/api/users" || exit 1

echo "Checking /api/projects"
curl -f "$BASE/api/projects" || exit 1

echo "Checking /api/tasks"
curl -f "$BASE/api/tasks" || exit 1

echo "✅ All endpoints passed"
