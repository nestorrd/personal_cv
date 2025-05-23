#!/bin/bash
set -e

echo "🎨 Iniciando Frontend..."

# Limpiar puertos
lsof -ti:3000 | xargs kill -9 2>/dev/null || true

cd frontend

# Verificar que index.html existe
if [ ! -f "index.html" ]; then
    echo "❌ Error: frontend/index.html no existe"
    exit 1
fi

echo "📁 Archivos en frontend:"
ls -la

echo "🌐 Iniciando live-server en puerto 3000..."
echo "   URL: http://localhost:3000"

# Intentar con live-server primero
if command -v live-server &> /dev/null; then
    live-server --port=3000 --host=0.0.0.0 --no-browser --cors
else
    echo "⚠️  live-server no disponible, usando http-server..."
    http-server -p 3000 -a 0.0.0.0 --cors
fi
