#!/bin/bash
set -e

echo "🔧 Iniciando Backend..."

# Limpiar puerto 8080
lsof -ti:8080 | xargs kill -9 2>/dev/null || true

cd backend

# Verificar go.mod
if [ ! -f "go.mod" ]; then
    echo "📦 Inicializando módulo Go..."
    go mod init cv-web-app
fi

# Verificar main.go
if [ ! -f "main.go" ]; then
    echo "❌ Error: backend/main.go no existe"
    exit 1
fi

echo "🚀 Compilando y ejecutando servidor Go..."
echo "   URL: http://localhost:8080"

go run main.go
