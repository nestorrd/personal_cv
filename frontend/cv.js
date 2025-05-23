const API_BASE_URL = "http://localhost:8080/api";
let cvData = null;

// Funciones auxiliares para validar y sanitizar diferentes tipos de campos
function sanitizeText(text) {
  if (!text || text.trim() === "") return "";
  return text.trim();
}

function sanitizeDate(date, type = "experience") {
  console.log("Procesando fecha:", date, "tipo:", type);

  if (!date) {
    console.log("Fecha vacía o nula");
    return "";
  }

  // Para experiencia profesional
  if (type === "experience") {
    const start = date.startDate ? date.startDate.trim() : "";
    const end = date.endDate ? date.endDate.trim() : "";
    console.log("Start:", start, "End:", end);

    if (start && end) {
      return `${start} - ${end}`;
    } else if (start) {
      return `${start} - Presente`;
    }
    return "";
  }

  // Para educación
  if (type === "education") {
    return date.year ? date.year.trim() : "";
  }

  // Si es una cadena de texto
  console.log("Fecha es una cadena:", date);
  return String(date).trim();
}

function sanitizeCompany(company) {
  if (!company || company.trim() === "") return "";
  return company.trim();
}

function sanitizeDescription(description) {
  if (!description || description.trim() === "") return "";
  return description.trim();
}

function sanitizeLevel(level) {
  if (level === undefined || level === null) return "";
  return String(level);
}

async function fetchCV() {
  const loadingElement = document.getElementById("loading");
  const errorElement = document.getElementById("error");
  const cvContainer = document.getElementById("cv-container");

  try {
    console.log("Iniciando carga del CV...");

    // Mostrar loading
    loadingElement.style.display = "flex";
    errorElement.style.display = "none";
    cvContainer.style.display = "none";

    console.log("Realizando petición a:", `${API_BASE_URL}/cv`);
    const response = await fetch(`${API_BASE_URL}/cv`);

    if (!response.ok) {
      throw new Error(
        `Error HTTP: ${response.status} - ${response.statusText}`
      );
    }

    console.log("Respuesta recibida, procesando datos...");
    cvData = await response.json();
    console.log("Datos del CV recibidos:", cvData);

    // Validar la estructura de los datos
    if (!validateCVData(cvData)) {
      console.error("Datos recibidos:", cvData);
      throw new Error(
        "Estructura de datos del CV inválida. Por favor, verifica el formato de la respuesta del servidor."
      );
    }

    // Renderizar el CV
    console.log("Renderizando CV...");
    renderCV(cvData);

    // Ocultar loading y mostrar CV
    loadingElement.style.display = "none";
    cvContainer.style.display = "block";
    console.log("CV cargado y mostrado correctamente");
  } catch (error) {
    console.error("Error al cargar el CV:", error);
    showError(error.message);
  }
}

function validateCVData(data) {
  console.log("Validando estructura de datos...");

  if (!data) {
    console.error("No se recibieron datos");
    return false;
  }

  // Validar estructura básica
  const requiredFields = ["personal", "experience", "education"];
  const isValid = requiredFields.every((field) => {
    const hasField = data && data[field];
    if (!hasField) {
      console.error(`Campo requerido faltante: ${field}`);
    }
    return hasField;
  });

  if (!isValid) {
    console.error("Faltan campos requeridos");
    return false;
  }

  // Validar personal
  if (!data.personal.name || !data.personal.title) {
    console.error("Faltan campos requeridos en personal");
    return false;
  }

  // Validar experience
  if (!Array.isArray(data.experience) || data.experience.length === 0) {
    console.error("Experience debe ser un array no vacío");
    return false;
  }

  // Validar education
  if (!Array.isArray(data.education) || data.education.length === 0) {
    console.error("Education debe ser un array no vacío");
    return false;
  }

  // Validar campos opcionales
  if (data.skills && !Array.isArray(data.skills)) {
    console.error("Skills debe ser un array");
    return false;
  }

  if (data.languages && !Array.isArray(data.languages)) {
    console.error("Languages debe ser un array");
    return false;
  }

  if (data.projects && !Array.isArray(data.projects)) {
    console.error("Projects debe ser un array");
    return false;
  }

  console.log("Validación completada: OK");
  return true;
}

function showError(errorMessage) {
  console.error("Mostrando mensaje de error:", errorMessage);

  const loadingElement = document.getElementById("loading");
  const errorElement = document.getElementById("error");
  const cvContainer = document.getElementById("cv-container");

  if (!loadingElement || !errorElement || !cvContainer) {
    console.error(
      "No se encontraron elementos necesarios para mostrar el error"
    );
    return;
  }

  loadingElement.style.display = "none";
  cvContainer.style.display = "none";
  errorElement.style.display = "block";

  // Actualizar el mensaje de error
  const errorText = errorElement.querySelector("p");
  if (errorText) {
    errorText.textContent = `Error: ${errorMessage}`;
  } else {
    console.error(
      "No se encontró el elemento para mostrar el mensaje de error"
    );
  }
}

function renderCV(cvData) {
  console.log("Iniciando renderizado del CV...");
  console.log(
    "Datos de experiencia:",
    JSON.stringify(cvData.experience, null, 2)
  );
  console.log(
    "Datos de experiencia:",
    JSON.stringify(cvData.experience, null, 2)
  );
  console.log("Datos de educación:", JSON.stringify(cvData.education, null, 2));

  const cvContainer = document.getElementById("cv-container");
  if (!cvContainer) {
    throw new Error("No se encontró el contenedor del CV");
  }

  // Validar datos requeridos
  if (!cvData.personal || !cvData.experience || !cvData.education) {
    throw new Error("Faltan datos requeridos del CV");
  }

  try {
    cvContainer.innerHTML = `
      <div class="cv-card">
        <div class="cv-header">
          <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23CCCCCC'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'/%3E%3C/svg%3E" 
               alt="${sanitizeText(cvData.personal.name)}" 
               class="profile-photo">
          <h1 class="name">${sanitizeText(cvData.personal.name)}</h1>
          <h2 class="title">${sanitizeText(cvData.personal.title)}</h2>
          <div class="contact-info">
            ${
              cvData.personal.email
                ? `
              <div class="contact-item">
                <i class="fas fa-envelope"></i>
                <span>${sanitizeText(cvData.personal.email)}</span>
              </div>
            `
                : ""
            }
            ${
              cvData.personal.phone
                ? `
              <div class="contact-item">
                <i class="fas fa-phone"></i>
                <span>${sanitizeText(cvData.personal.phone)}</span>
              </div>
            `
                : ""
            }
            ${
              cvData.personal.location
                ? `
              <div class="contact-item">
                <i class="fas fa-map-marker-alt"></i>
                <span>${sanitizeText(cvData.personal.location)}</span>
              </div>
            `
                : ""
            }
          </div>
        </div>
        <div class="cv-content">
          <div class="sidebar">
            ${
              cvData.skills && cvData.skills.length > 0
                ? `
              <div class="section">
                <h3 class="section-title" data-section="skills">
                  <i class="fas fa-code"></i>
                  Habilidades
                </h3>
                <div class="skills-grid">
                  ${cvData.skills
                    .map(
                      (skill) => `
                    <div class="skill-item">
                      <div class="skill-name">
                        <span>${sanitizeText(skill.name)}</span>
                      </div>
                      <div class="skill-bar">
                        <div class="skill-progress" style="--progress-width: ${
                          skill.level || 0
                        }%"></div>
                      </div>
                    </div>
                  `
                    )
                    .join("")}
                </div>
              </div>
            `
                : ""
            }
            ${
              cvData.languages && cvData.languages.length > 0
                ? `
              <div class="section">
                <h3 class="section-title" data-section="languages">
                  <i class="fas fa-language"></i>
                  Idiomas
                </h3>
                <div class="languages-list">
                  ${cvData.languages
                    .map(
                      (lang) => `
                    <div class="language-item">
                      <div class="skill-name">
                        <span>${sanitizeText(lang.name)}</span>
                      </div>
                      <div class="skill-bar">
                        <div class="skill-progress" style="--progress-width: ${
                          lang.level || 0
                        }%"></div>
                      </div>
                    </div>
                  `
                    )
                    .join("")}
                </div>
              </div>
            `
                : ""
            }
          </div>
          <div class="main-content">
            ${
              cvData.experience && cvData.experience.length > 0
                ? `
              <div class="section">
                <h3 class="section-title" data-section="experience">
                  <i class="fas fa-briefcase"></i>
                  Experiencia Profesional
                </h3>
                ${cvData.experience
                  .map((exp) => {
                    console.log("Procesando experiencia:", exp);
                    const dateStr = sanitizeDate(exp, "experience");
                    console.log("Fecha procesada:", dateStr);
                    return `
                  <div class="experience-item">
                    <div class="item-header">
                      <div>
                        <h4 class="item-title">${sanitizeText(
                          exp.position
                        )}</h4>
                        ${
                          sanitizeCompany(exp.company)
                            ? `
                        <div class="item-company">${sanitizeCompany(
                          exp.company
                        )}</div>
                        `
                            : ""
                        }
                      </div>
                      ${
                        dateStr
                          ? `
                      <div class="item-date">${dateStr}</div>
                      `
                          : ""
                      }
                    </div>
                    ${
                      exp.location
                        ? `
                      <div class="item-location">
                        <i class="fas fa-map-marker-alt"></i>
                        ${sanitizeText(exp.location)}
                      </div>
                    `
                        : ""
                    }
                    ${
                      sanitizeDescription(exp.description)
                        ? `
                    <p class="item-description">${sanitizeDescription(
                      exp.description
                    )}</p>
                    `
                        : ""
                    }
                    ${
                      exp.technologies && exp.technologies.length > 0
                        ? `
                      <div class="technologies">
                        ${exp.technologies
                          .map(
                            (tech) => `
                          <span class="tech-tag">${sanitizeText(tech)}</span>
                        `
                          )
                          .join("")}
                      </div>
                    `
                        : ""
                    }
                  </div>
                `;
                  })
                  .join("")}
              </div>
            `
                : ""
            }
            ${
              cvData.education && cvData.education.length > 0
                ? `
              <div class="section">
                <h3 class="section-title" data-section="education">
                  <i class="fas fa-graduation-cap"></i>
                  Educación
                </h3>
                ${cvData.education
                  .map((edu) => {
                    console.log("Procesando educación:", edu);
                    const dateStr = sanitizeDate(edu, "education");
                    console.log("Fecha procesada:", dateStr);
                    return `
                  <div class="education-item">
                    <div class="item-header">
                      <div>
                        <h4 class="item-title">${sanitizeText(edu.degree)}</h4>
                        ${
                          sanitizeCompany(edu.institution)
                            ? `
                        <div class="item-company">${sanitizeCompany(
                          edu.institution
                        )}</div>
                        `
                            : ""
                        }
                      </div>
                      ${
                        dateStr
                          ? `
                      <div class="item-date">${dateStr}</div>
                      `
                          : ""
                      }
                    </div>
                    ${
                      edu.location
                        ? `
                      <div class="item-location">
                        <i class="fas fa-map-marker-alt"></i>
                        ${sanitizeText(edu.location)}
                      </div>
                    `
                        : ""
                    }
                    ${
                      sanitizeDescription(edu.description)
                        ? `
                    <p class="item-description">${sanitizeDescription(
                      edu.description
                    )}</p>
                    `
                        : ""
                    }
                  </div>
                `;
                  })
                  .join("")}
              </div>
            `
                : ""
            }
            ${
              cvData.projects && cvData.projects.length > 0
                ? `
              <div class="section">
                <h3 class="section-title" data-section="projects">
                  <i class="fas fa-project-diagram"></i>
                  Proyectos
                </h3>
                <div class="projects-grid">
                  ${cvData.projects
                    .map(
                      (project) => `
                    <div class="project-item">
                      <h4 class="item-title">${sanitizeText(project.name)}</h4>
                      ${
                        sanitizeDescription(project.description)
                          ? `
                      <p class="item-description">${sanitizeDescription(
                        project.description
                      )}</p>
                      `
                          : ""
                      }
                      ${
                        project.technologies && project.technologies.length > 0
                          ? `
                        <div class="technologies">
                          ${project.technologies
                            .map(
                              (tech) => `
                            <span class="tech-tag">${sanitizeText(tech)}</span>
                          `
                            )
                            .join("")}
                        </div>
                      `
                          : ""
                      }
                      ${
                        project.link
                          ? `
                        <a href="${project.link}" class="project-link" target="_blank">
                          <i class="fas fa-external-link-alt"></i>
                          Ver proyecto
                        </a>
                      `
                          : ""
                      }
                    </div>
                  `
                    )
                    .join("")}
                </div>
              </div>
            `
                : ""
            }
          </div>
        </div>
      </div>
    `;

    console.log("CV renderizado correctamente");

    // Animar barras de progreso
    setTimeout(() => {
      const progressBars = document.querySelectorAll(".skill-progress");
      progressBars.forEach((bar) => {
        const width = bar.style.getPropertyValue("--progress-width");
        bar.style.width = width;
      });
    }, 100);
  } catch (error) {
    console.error("Error al renderizar el CV:", error);
    throw new Error("Error al renderizar el CV: " + error.message);
  }
}

// Función para hacer scroll al CV
function scrollToCV() {
  const cvSection = document.getElementById("cv-section");
  cvSection.scrollIntoView({ behavior: "smooth" });
}

// Inicializar la aplicación
document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM cargado, iniciando aplicación...");
  fetchCV();
});
