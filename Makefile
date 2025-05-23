.PHONY: dev frontend backend kill test clean setup

# Comando principal
dev: kill
	@echo "🚀 Iniciando aplicación completa..."
	@./scripts/start-all.sh

# Solo frontend
frontend: 
	@./scripts/start-frontend.sh

# Solo backend
backend:
	@./scripts/start-backend.sh

# Limpiar procesos
kill:
	@./scripts/kill-servers.sh

# Probar conectividad
test:
	@echo "🧪 Probando servicios..."
	@curl -s http://localhost:8080/api/health || echo "❌ Backend no responde"
	@curl -s http://localhost:3000 || echo "❌ Frontend no responde"

# Limpiar archivos
clean:
	@rm -rf bin/
	@cd backend && go clean

# Configurar entorno
setup:
	@./robust-setup.sh
