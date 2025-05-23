.PHONY: dev backend frontend build clean install test fmt

# Desarrollo
dev:
	@echo "🚀 Iniciando entorno de desarrollo..."
	@concurrently \
		"cd backend && go run main.go" \
		"cd frontend && live-server --port=3000 --host=0.0.0.0 --no-browser" \
		--names "Backend,Frontend" \
		--prefix-colors "blue,green" \
		--kill-others-on-fail

# Solo backend
backend:
	@echo "🔧 Iniciando backend..."
	@cd backend && go run main.go

# Solo frontend
frontend:
	@echo "🎨 Iniciando frontend..."
	@cd frontend && live-server --port=3000 --host=0.0.0.0 --no-browser

# Construcción
build:
	@echo "📦 Construyendo aplicación..."
	@mkdir -p bin
	@cd backend && go build -o ../bin/cv-backend main.go
	@echo "✅ Backend construido en bin/cv-backend"

# Limpieza
clean:
	@echo "🧹 Limpiando archivos generados..."
	@rm -rf bin/
	@cd backend && go clean

# Instalación de dependencias
install:
	@echo "📥 Instalando dependencias..."
	@cd backend && go mod tidy

# Tests
test:
	@echo "🧪 Ejecutando tests..."
	@cd backend && go test ./...

# Formateo de código
fmt:
	@echo "✨ Formateando código Go..."
	@cd backend && go fmt ./...

# Health check
health:
	@echo "💚 Verificando estado del backend..."
	@curl -f http://localhost:8080/api/health || echo "❌ Backend no está ejecutándose"
