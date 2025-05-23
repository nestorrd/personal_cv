#!/bin/bash

echo "🔍 VERIFICACIÓN DEL ENTORNO"
echo "=========================="

failed=0

# Verificar comandos
commands=("node" "npm" "go" "live-server")
for cmd in "${commands[@]}"; do
    if command -v $cmd &> /dev/null; then
        echo "✅ $cmd: $(which $cmd)"
    else
        echo "❌ $cmd: NO DISPONIBLE"
        failed=1
    fi
done

# Verificar puertos libres
ports=(3000 8080)
for port in "${ports[@]}"; do
    if lsof -i:$port &> /dev/null; then
        echo "⚠️  Puerto $port: EN USO"
    else
        echo "✅ Puerto $port: LIBRE"
    fi
done

# Verificar archivos
files=("frontend/index.html" "backend/main.go" "scripts/start-all.sh")
for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file: EXISTE"
    else
        echo "❌ $file: NO EXISTE"
        failed=1
    fi
done

if [ $failed -eq 0 ]; then
    echo ""
    echo "🎉 ¡Todo configurado correctamente!"
    echo "   Ejecuta: make dev"
else
    echo ""
    echo "❌ Hay problemas en la configuración"
    echo "   Ejecuta este script de nuevo para solucionarlos"
fi
