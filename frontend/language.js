// Traducciones
const translations = {
  es: {
    landing: {
      title: "Desarrollador Full Stack",
      subtitle: "Apasionado por crear soluciones web innovadoras y eficientes",
      viewCV: "Ver mi CV",
      contact: "Contactar",
      scrollText: "Scroll para ver mi CV",
    },
    cv: {
      experience: "Experiencia Profesional",
      education: "Educación",
      projects: "Proyectos",
      skills: "Habilidades",
      languages: "Idiomas",
      loading: "Cargando CV...",
      error: "Error al cargar el CV. Por favor, inténtalo de nuevo.",
    },
  },
  en: {
    landing: {
      title: "Full Stack Developer",
      subtitle:
        "Passionate about creating innovative and efficient web solutions",
      viewCV: "View my CV",
      contact: "Contact",
      scrollText: "Scroll to view my CV",
    },
    cv: {
      experience: "Professional Experience",
      education: "Education",
      projects: "Projects",
      skills: "Skills",
      languages: "Languages",
      loading: "Loading CV...",
      error: "Error loading CV. Please try again.",
    },
  },
};

// Estado del idioma
let currentLanguage = "es";

// Elementos del DOM
const languageToggle = document.getElementById("languageToggle");
const languageText = languageToggle.querySelector(".language-text");
const scrollText = document.querySelector(".scroll-indicator span");

// Función para cambiar el idioma
function toggleLanguage() {
  currentLanguage = currentLanguage === "es" ? "en" : "es";
  languageText.textContent = currentLanguage.toUpperCase();
  updateContent();

  // Guardar preferencia en localStorage
  localStorage.setItem("preferredLanguage", currentLanguage);
}

// Función para actualizar el contenido
function updateContent() {
  const t = translations[currentLanguage];

  // Actualizar landing page
  document.querySelector(".landing-content h1").textContent = t.landing.title;
  document.querySelector(".landing-content p").textContent = t.landing.subtitle;
  document.querySelector(".btn-primary").textContent = t.landing.viewCV;
  document.querySelector(".btn-secondary").textContent = t.landing.contact;

  // Actualizar scroll indicator
  scrollText.textContent = t.landing.scrollText;

  // Actualizar secciones del CV
  const sections = document.querySelectorAll(".section-title");
  sections.forEach((section) => {
    const key = section.getAttribute("data-section");
    if (key && t.cv[key]) {
      section.textContent = t.cv[key];
    }
  });

  // Actualizar mensajes de carga y error
  const loadingText = document.querySelector(".loading-text");
  if (loadingText) loadingText.textContent = t.cv.loading;

  const errorMessage = document.querySelector(".error-message");
  if (errorMessage) errorMessage.textContent = t.cv.error;
}

// Inicialización
document.addEventListener("DOMContentLoaded", () => {
  // Cargar idioma preferido
  const savedLanguage = localStorage.getItem("preferredLanguage");
  if (savedLanguage) {
    currentLanguage = savedLanguage;
    languageText.textContent = currentLanguage.toUpperCase();
    updateContent();
  }

  // Añadir event listener al botón
  languageToggle.addEventListener("click", toggleLanguage);
});
