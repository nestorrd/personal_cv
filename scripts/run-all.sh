#!/bin/bash
echo "🚀 Iniciando aplicación completa..."
concurrently \
  "cd backend && go run main.go" \
  "cd frontend && live-server --port=3000 --host=0.0.0.0 --no-browser" \
  --names "Backend,Frontend" \
  --prefix-colors "blue,green" \
  --kill-others-on-fail
