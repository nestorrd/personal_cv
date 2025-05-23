// Traducciones para el CV
const translations = {
  es: {
    experience: "Experiencia Profesional",
    education: "Educación",
    projects: "Proyectos",
    skills: "Habilidades",
    languages: "Idiomas",
    loading: "Cargando CV...",
    error: "Error al cargar el CV. Por favor, inténtalo de nuevo.",
  },
  en: {
    experience: "Professional Experience",
    education: "Education",
    projects: "Projects",
    skills: "Skills",
    languages: "Languages",
    loading: "Loading CV...",
    error: "Error loading CV. Please try again.",
  },
};

// Función para cambiar el idioma
function changeLanguage(lang) {
  console.log("Cambiando idioma a:", lang);

  // Actualizar botones
  document.getElementById("btn-es").classList.toggle("active", lang === "es");
  document.getElementById("btn-en").classList.toggle("active", lang === "en");

  // Actualizar contenido principal
  document.getElementById("content-es").style.display =
    lang === "es" ? "" : "none";
  document.getElementById("content-en").style.display =
    lang === "en" ? "" : "none";

  // Actualizar mensajes de carga
  document.getElementById("loading-es").style.display =
    lang === "es" ? "" : "none";
  document.getElementById("loading-en").style.display =
    lang === "en" ? "" : "none";

  // Actualizar mensajes de error
  document.getElementById("error-title-es").style.display =
    lang === "es" ? "" : "none";
  document.getElementById("error-title-en").style.display =
    lang === "en" ? "" : "none";
  document.getElementById("error-text-es").style.display =
    lang === "es" ? "" : "none";
  document.getElementById("error-text-en").style.display =
    lang === "en" ? "" : "none";
  document.getElementById("error-list-es-1").style.display =
    lang === "es" ? "" : "none";
  document.getElementById("error-list-en-1").style.display =
    lang === "en" ? "" : "none";
  document.getElementById("error-list-es-2").style.display =
    lang === "es" ? "" : "none";
  document.getElementById("error-list-en-2").style.display =
    lang === "en" ? "" : "none";
  document.getElementById("error-list-es-3").style.display =
    lang === "es" ? "" : "none";
  document.getElementById("error-list-en-3").style.display =
    lang === "en" ? "" : "none";
  document.getElementById("retry-btn-es").style.display =
    lang === "es" ? "" : "none";
  document.getElementById("retry-btn-en").style.display =
    lang === "en" ? "" : "none";

  // Actualizar secciones del CV
  const sections = document.querySelectorAll(".section-title");
  sections.forEach((section) => {
    const key = section.getAttribute("data-section");
    if (key && translations[lang][key]) {
      const icon = section.querySelector("i");
      if (icon) {
        section.innerHTML = `${icon.outerHTML} ${translations[lang][key]}`;
      } else {
        section.textContent = translations[lang][key];
      }
    }
  });

  // Actualizar el atributo lang del HTML
  document.documentElement.lang = lang;

  // Guardar preferencia
  localStorage.setItem("preferredLanguage", lang);
}

// Inicialización
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM cargado");

  // Cargar idioma preferido o usar español por defecto
  const savedLanguage = localStorage.getItem("preferredLanguage") || "es";

  // Configurar event listeners para los botones
  document
    .getElementById("btn-es")
    .addEventListener("click", () => changeLanguage("es"));
  document
    .getElementById("btn-en")
    .addEventListener("click", () => changeLanguage("en"));

  // Aplicar el idioma guardado
  changeLanguage(savedLanguage);
});
