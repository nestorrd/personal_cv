document.addEventListener("DOMContentLoaded", function () {
  const landingSection = document.querySelector(".landing-container");
  const cvSection = document.getElementById("cv-section");
  let isInLanding = true;

  // Función para el scroll suave a la sección del CV
  function scrollToCV() {
    window.scrollTo({
      top: cvSection.offsetTop,
      behavior: "smooth",
    });
  }

  // Función para el scroll suave a la landing
  function scrollToLanding() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  // Detectar el scroll de la rueda del ratón
  window.addEventListener(
    "wheel",
    function (e) {
      // Solo controlar el scroll en la landing page
      if (!isInLanding) return;

      e.preventDefault();

      if (e.deltaY > 0) {
        // Scroll hacia abajo en landing -> ir al CV
        isInLanding = false;
        scrollToCV();
      }
    },
    { passive: false }
  );

  // Detectar el scroll táctil
  let touchStartY = 0;
  let touchEndY = 0;

  window.addEventListener(
    "touchstart",
    function (e) {
      touchStartY = e.touches[0].clientY;
    },
    { passive: true }
  );

  window.addEventListener(
    "touchend",
    function (e) {
      touchEndY = e.changedTouches[0].clientY;
      handleSwipe();
    },
    { passive: true }
  );

  function handleSwipe() {
    // Solo controlar el swipe en la landing page
    if (!isInLanding) return;

    const swipeDistance = touchEndY - touchStartY;
    const minSwipeDistance = 50;

    if (Math.abs(swipeDistance) < minSwipeDistance) return;

    if (swipeDistance < 0) {
      // Swipe hacia abajo en landing -> ir al CV
      isInLanding = false;
      scrollToCV();
    }
  }

  // Observar cambios en el scroll para actualizar el estado
  window.addEventListener("scroll", function () {
    if (window.scrollY <= 10) {
      isInLanding = true;
    }
  });

  // Agregar botón para volver arriba
  const scrollToTopButton = document.createElement("button");
  scrollToTopButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
  scrollToTopButton.className = "scroll-to-top";
  scrollToTopButton.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #1d1d1f;
    color: white;
    border: none;
    cursor: pointer;
    display: none;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    opacity: 0.8;
    transition: opacity 0.3s;
  `;
  scrollToTopButton.addEventListener("mouseover", () => {
    scrollToTopButton.style.opacity = "1";
  });
  scrollToTopButton.addEventListener("mouseout", () => {
    scrollToTopButton.style.opacity = "0.8";
  });
  scrollToTopButton.addEventListener("click", scrollToLanding);
  document.body.appendChild(scrollToTopButton);

  // Mostrar/ocultar botón según el scroll
  window.addEventListener("scroll", function () {
    if (window.scrollY > 300) {
      scrollToTopButton.style.display = "flex";
    } else {
      scrollToTopButton.style.display = "none";
    }
  });
});
