#!/bin/bash
echo "🛑 Deteniendo todos los servidores..."
pkill -f "go run main.go" || true
pkill -f "live-server" || true
pkill -f "http-server" || true
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
lsof -ti:8080 | xargs kill -9 2>/dev/null || true
echo "✅ Servidores detenidos"
