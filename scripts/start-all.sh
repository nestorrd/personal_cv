#!/bin/bash

echo "🚀 Iniciando aplicación completa..."

# Función de limpieza
cleanup() {
    echo ""
    echo "🛑 Deteniendo servicios..."
    kill $BACKEND_PID 2>/dev/null || true
    kill $FRONTEND_PID 2>/dev/null || true
    exit 0
}

trap cleanup INT TERM

# Limpiar puertos
./scripts/kill-servers.sh

# Iniciar backend
echo "🔧 Iniciando backend..."
./scripts/start-backend.sh &
BACKEND_PID=$!

# Esperar que el backend inicie
echo "⏳ Esperando backend..."
sleep 3

# Verificar que el backend está corriendo
if ! curl -s http://localhost:8080/api/health > /dev/null; then
    echo "❌ Backend no responde"
    kill $BACKEND_PID 2>/dev/null || true
    exit 1
fi

echo "✅ Backend funcionando"

# Iniciar frontend
echo "🎨 Iniciando frontend..."
./scripts/start-frontend.sh &
FRONTEND_PID=$!

# Esperar que el frontend inicie
sleep 2

echo ""
echo "🎉 ¡Aplicación iniciada exitosamente!"
echo "=================================="
echo "🔧 Backend:  http://localhost:8080"
echo "🎨 Frontend: http://localhost:3000"
echo "💚 Health:   http://localhost:8080/api/health"
echo "📋 CV API:   http://localhost:8080/api/cv"
echo ""
echo "Presiona Ctrl+C para detener ambos servicios"

# Esperar
wait $BACKEND_PID $FRONTEND_PID
