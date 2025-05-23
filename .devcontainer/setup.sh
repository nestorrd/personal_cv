#!/bin/bash

set -e  # Salir si hay errores

echo "🚀 CONFIGURACIÓN ROBUSTA DEL DEVCONTAINER"
echo "========================================"

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 1. Verificar y configurar Node.js
log_info "Verificando Node.js y npm..."
if ! command -v node &> /dev/null; then
    log_error "Node.js no está instalado"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    log_error "npm no está instalado"
    exit 1
fi

log_success "Node.js $(node --version) y npm $(npm --version) disponibles"

# 2. Instalar dependencias globales necesarias
log_info "Instalando dependencias globales..."
sudo npm install -g live-server http-server concurrently nodemon --silent

# 3. Verificar Go
log_info "Verificando Go..."
if ! command -v go &> /dev/null; then
    log_error "Go no está instalado"
    exit 1
fi
log_success "Go $(go version | cut -d' ' -f3) disponible"

# 4. Crear estructura de directorios
log_info "Creando estructura de directorios..."
mkdir -p {backend,frontend,scripts,docs,bin}

# 5. Configurar backend
log_info "Configurando backend..."
cd backend

if [ ! -f "go.mod" ]; then
    log_info "Inicializando módulo Go..."
    go mod init cv-web-app
fi

# Crear main.go si no existe (versión completa)
if [ ! -f "main.go" ]; then
    log_info "Creando main.go..."
    cat > main.go << 'EOF'
package main

import (
	"encoding/json"
	"log"
	"net/http"
	"time"
)

type PersonalInfo struct {
	Name     string `json:"name"`
	Title    string `json:"title"`
	Email    string `json:"email"`
	Phone    string `json:"phone"`
	Location string `json:"location"`
	LinkedIn string `json:"linkedin"`
	GitHub   string `json:"github"`
	Summary  string `json:"summary"`
	Photo    string `json:"photo"`
}

type Experience struct {
	Company     string `json:"company"`
	Position    string `json:"position"`
	StartDate   string `json:"startDate"`
	EndDate     string `json:"endDate"`
	Description string `json:"description"`
	Location    string `json:"location"`
}

type Education struct {
	Institution string `json:"institution"`
	Degree      string `json:"degree"`
	Year        string `json:"year"`
	Location    string `json:"location"`
}

type Skill struct {
	Name  string `json:"name"`
	Level int    `json:"level"`
}

type Project struct {
	Name         string   `json:"name"`
	Description  string   `json:"description"`
	Technologies []string `json:"technologies"`
	URL          string   `json:"url"`
}

type CV struct {
	Personal   PersonalInfo `json:"personal"`
	Experience []Experience `json:"experience"`
	Education  []Education  `json:"education"`
	Skills     []Skill      `json:"skills"`
	Projects   []Project    `json:"projects"`
	Languages  []Skill      `json:"languages"`
}

func getSampleCV() CV {
	return CV{
		Personal: PersonalInfo{
			Name:     "Desarrollador DevContainer",
			Title:    "Full Stack Developer",
			Email:    "dev@example.com",
			Phone:    "+1 234 567 890",
			Location: "Remote",
			LinkedIn: "linkedin.com/in/developer",
			GitHub:   "github.com/developer",
			Summary:  "Desarrollador Full Stack especializado en aplicaciones web modernas con Go y JavaScript.",
			Photo:    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
		},
		Experience: []Experience{
			{
				Company:     "Tech Company",
				Position:    "Senior Developer",
				StartDate:   "2022",
				EndDate:     "Presente",
				Description: "Desarrollo de aplicaciones web con Go y JavaScript.",
				Location:    "Remote",
			},
		},
		Education: []Education{
			{
				Institution: "Universidad Tecnológica",
				Degree:      "Ingeniería en Sistemas",
				Year:        "2018-2022",
				Location:    "Ciudad",
			},
		},
		Skills: []Skill{
			{"JavaScript", 5},
			{"Go", 4},
			{"React", 4},
			{"Node.js", 4},
			{"Docker", 3},
		},
		Projects: []Project{
			{
				Name:         "CV Web App",
				Description:  "Aplicación web de CV con Go backend y frontend vanilla JS.",
				Technologies: []string{"Go", "JavaScript", "HTML", "CSS"},
				URL:          "https://github.com/example/cv-app",
			},
		},
		Languages: []Skill{
			{"Español", 5},
			{"Inglés", 4},
		},
	}
}

func enableCORS(w http.ResponseWriter) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
}

func cvHandler(w http.ResponseWriter, r *http.Request) {
	enableCORS(w)
	if r.Method == "OPTIONS" {
		return
	}

	cv := getSampleCV()
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(cv)
}

func healthHandler(w http.ResponseWriter, r *http.Request) {
	enableCORS(w)
	response := map[string]interface{}{
		"status":    "OK",
		"timestamp": time.Now().Format(time.RFC3339),
		"service":   "CV Backend API",
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func main() {
	mux := http.NewServeMux()
	mux.HandleFunc("/api/cv", cvHandler)
	mux.HandleFunc("/api/health", healthHandler)

	loggedMux := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()
		mux.ServeHTTP(w, r)
		log.Printf("%s %s %v", r.Method, r.URL.Path, time.Since(start))
	})

	port := ":8080"
	log.Printf("🚀 Servidor iniciado en http://localhost%s", port)
	log.Printf("📋 CV API: http://localhost%s/api/cv", port)
	log.Printf("💚 Health: http://localhost%s/api/health", port)

	if err := http.ListenAndServe(port, loggedMux); err != nil {
		log.Fatal("Error starting server:", err)
	}
}
EOF
fi

cd ..

# 6. Configurar frontend (usando el HTML completo existente)
log_info "Configurando frontend..."
cd frontend

# Si no existe index.html, crear uno básico
if [ ! -f "index.html" ]; then
    log_info "Creando index.html básico de prueba..."
    cat > index.html << 'EOF'
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CV Test - DevContainer</title>
    <style>
        body {
            font-family: 'Segoe UI', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-align: center;
            padding: 50px;
            min-height: 100vh;
            margin: 0;
        }
        .container {
            background: rgba(255,255,255,0.1);
            padding: 40px;
            border-radius: 15px;
            backdrop-filter: blur(10px);
            max-width: 800px;
            margin: 0 auto;
        }
        .status {
            padding: 10px;
            margin: 10px 0;
            border-radius: 5px;
        }
        .success { background: rgba(46, 204, 113, 0.3); }
        .loading { background: rgba(52, 152, 219, 0.3); }
        .error { background: rgba(231, 76, 60, 0.3); }
        button {
            background: #3498db;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            margin: 10px;
        }
        button:hover { background: #2980b9; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 DevContainer CV App</h1>
        <div id="status" class="status loading">Probando conexión...</div>
        <button onclick="testBackend()">Probar Backend</button>
        <button onclick="loadFullCV()">Cargar CV Completo</button>
        <div id="result"></div>
    </div>

    <script>
        const API_URL = 'http://localhost:8080/api';
        
        async function testBackend() {
            const status = document.getElementById('status');
            const result = document.getElementById('result');
            
            status.className = 'status loading';
            status.textContent = '🔄 Probando conexión con backend...';
            
            try {
                const response = await fetch(`${API_URL}/health`);
                const data = await response.json();
                
                status.className = 'status success';
                status.textContent = '✅ Backend funcionando correctamente!';
                result.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
            } catch (error) {
                status.className = 'status error';
                status.textContent = `❌ Error: ${error.message}`;
                result.innerHTML = `
                    <p>No se pudo conectar al backend. Asegúrate de que esté ejecutándose:</p>
                    <code>cd backend && go run main.go</code>
                `;
            }
        }
        
        async function loadFullCV() {
            const result = document.getElementById('result');
            try {
                const response = await fetch(`${API_URL}/cv`);
                const cv = await response.json();
                
                result.innerHTML = `
                    <div style="text-align: left; background: rgba(255,255,255,0.1); padding: 20px; border-radius: 10px; margin-top: 20px;">
                        <h2>${cv.personal.name}</h2>
                        <p><strong>${cv.personal.title}</strong></p>
                        <p>${cv.personal.summary}</p>
                        <h3>Experiencia:</h3>
                        ${cv.experience.map(exp => `
                            <div style="margin-bottom: 15px;">
                                <strong>${exp.position}</strong> en ${exp.company}<br>
                                <em>${exp.startDate} - ${exp.endDate}</em><br>
                                ${exp.description}
                            </div>
                        `).join('')}
                    </div>
                `;
            } catch (error) {
                result.innerHTML = `<p>Error cargando CV: ${error.message}</p>`;
            }
        }
        
        // Probar conexión automáticamente
        document.addEventListener('DOMContentLoaded', testBackend);
    </script>
</body>
</html>
EOF
else
    log_success "index.html ya existe"
fi

cd ..

# 7. Crear scripts de inicio robustos
log_info "Creando scripts de inicio..."

# Script para matar procesos existentes
cat > scripts/kill-servers.sh << 'EOF'
#!/bin/bash
echo "🛑 Deteniendo todos los servidores..."
pkill -f "go run main.go" || true
pkill -f "live-server" || true
pkill -f "http-server" || true
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
lsof -ti:8080 | xargs kill -9 2>/dev/null || true
echo "✅ Servidores detenidos"
EOF

# Script frontend robusto
cat > scripts/start-frontend.sh << 'EOF'
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
EOF

# Script backend robusto
cat > scripts/start-backend.sh << 'EOF'
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
EOF

# Script combinado
cat > scripts/start-all.sh << 'EOF'
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
EOF

# Hacer ejecutables
chmod +x scripts/*.sh

# 8. Crear Makefile actualizado
log_info "Creando Makefile..."
cat > Makefile << 'EOF'
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
EOF

# 9. Crear archivo de verificación
log_info "Creando script de verificación..."
cat > verify-setup.sh << 'EOF'
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
EOF

chmod +x verify-setup.sh

log_success "Configuración completada!"

# 10. Ejecutar verificación
log_info "Ejecutando verificación final..."
./verify-setup.sh

echo ""
log_success "🎉 CONFIGURACIÓN COMPLETADA"
echo "=========================="
echo ""
echo "📋 Comandos disponibles:"
echo "   make dev      - Iniciar aplicación completa"
echo "   make frontend - Solo frontend"
echo "   make backend  - Solo backend"
echo "   make kill     - Detener todos los servicios"
echo "   make test     - Probar conectividad"
echo ""
echo "🚀 Para empezar: make dev"