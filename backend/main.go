package main

import (
	"encoding/json"
	"log"
	"net/http"
	"time"
)

// Estructuras para el CV
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
	Level int    `json:"level"` // 1-5
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

// Datos de ejemplo del CV
func getSampleCV() CV {
	return CV{
		Personal: PersonalInfo{
			Name:     "Ana García López",
			Title:    "Desarrolladora Full Stack",
			Email:    "ana.garcia@email.com",
			Phone:    "+34 123 456 789",
			Location: "Madrid, España",
			LinkedIn: "linkedin.com/in/ana-garcia",
			GitHub:   "github.com/anagarcia",
			Summary:  "Desarrolladora Full Stack con 5+ años de experiencia en tecnologías web modernas. Especializada en JavaScript, React, Node.js y Go. Apasionada por crear soluciones escalables y experiencias de usuario excepcionales.",
			Photo:    "https://images.unsplash.com/photo-1494790108755-2616b612b77c?w=300&h=300&fit=crop&crop=face",
		},
		Experience: []Experience{
			{
				Company:     "TechCorp Solutions",
				Position:    "Senior Full Stack Developer",
				StartDate:   "2022",
				EndDate:     "Presente",
				Description: "Lidero el desarrollo de aplicaciones web complejas utilizando React, Node.js y MongoDB. Implementé arquitecturas de microservicios que mejoraron el rendimiento en un 40%. Mentorizo a desarrolladores junior y colaboro en decisiones técnicas estratégicas.",
				Location:    "Madrid, España",
			},
			{
				Company:     "StartupTech",
				Position:    "Frontend Developer",
				StartDate:   "2020",
				EndDate:     "2022",
				Description: "Desarrollé interfaces de usuario responsivas con React y TypeScript. Implementé testing automatizado con Jest y Cypress. Colaboré estrechamente con diseñadores UX/UI para crear experiencias de usuario intuitivas.",
				Location:    "Barcelona, España",
			},
			{
				Company:     "WebAgency Pro",
				Position:    "Junior Developer",
				StartDate:   "2019",
				EndDate:     "2020",
				Description: "Participé en el desarrollo de sitios web corporativos y e-commerce. Aprendí tecnologías modernas de desarrollo web y buenas prácticas de programación. Colaboré en proyectos utilizando metodologías ágiles.",
				Location:    "Valencia, España",
			},
		},
		Education: []Education{
			{
				Institution: "Universidad Politécnica de Madrid",
				Degree:      "Grado en Ingeniería Informática",
				Year:        "2015-2019",
				Location:    "Madrid, España",
			},
			{
				Institution: "Bootcamp FullStack",
				Degree:      "Certificado en Desarrollo Web Full Stack",
				Year:        "2019",
				Location:    "Madrid, España",
			},
		},
		Skills: []Skill{
			{"JavaScript", 5},
			{"React", 5},
			{"Node.js", 4},
			{"Go", 4},
			{"TypeScript", 4},
			{"MongoDB", 4},
			{"PostgreSQL", 3},
			{"Docker", 3},
			{"AWS", 3},
			{"Git", 5},
		},
		Projects: []Project{
			{
				Name:         "E-commerce Platform",
				Description:  "Plataforma de comercio electrónico completa con panel de administración, gestión de inventario y procesamiento de pagos.",
				Technologies: []string{"React", "Node.js", "MongoDB", "Stripe"},
				URL:          "https://github.com/anagarcia/ecommerce-platform",
			},
			{
				Name:         "Task Management App",
				Description:  "Aplicación de gestión de tareas con colaboración en tiempo real y notificaciones push.",
				Technologies: []string{"React", "Socket.io", "Express", "PostgreSQL"},
				URL:          "https://github.com/anagarcia/task-manager",
			},
			{
				Name:         "Weather Dashboard",
				Description:  "Dashboard meteorológico con predicciones, mapas interactivos y análisis histórico de datos.",
				Technologies: []string{"Vue.js", "D3.js", "Go", "Redis"},
				URL:          "https://github.com/anagarcia/weather-dashboard",
			},
		},
		Languages: []Skill{
			{"Español", 5},
			{"Inglés", 4},
			{"Francés", 2},
		},
	}
}

// Handlers HTTP
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

	if err := json.NewEncoder(w).Encode(cv); err != nil {
		http.Error(w, "Error encoding JSON", http.StatusInternalServerError)
		return
	}
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

	// Rutas de la API
	mux.HandleFunc("/api/cv", cvHandler)
	mux.HandleFunc("/api/health", healthHandler)

	// Middleware de logging
	loggedMux := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()
		mux.ServeHTTP(w, r)
		log.Printf("%s %s %v", r.Method, r.URL.Path, time.Since(start))
	})

	port := ":8080"
	log.Printf("🚀 Servidor iniciado en http://localhost%s", port)
	log.Printf("📋 CV API disponible en http://localhost%s/api/cv", port)
	log.Printf("💚 Health check en http://localhost%s/api/health", port)

	if err := http.ListenAndServe(port, loggedMux); err != nil {
		log.Fatal("Error starting server:", err)
	}
}
