document.addEventListener("DOMContentLoaded", function () {
  let isScrolling = false;
  let currentSection = 0;
  const sections = document.querySelectorAll(".landing-container, #cv-section");
  const totalSections = sections.length;

  // Función para el scroll suave
  function smoothScroll(targetSection) {
    if (isScrolling) return;
    isScrolling = true;

    window.scrollTo({
      top: sections[targetSection].offsetTop,
      behavior: "smooth",
    });

    setTimeout(() => {
      isScrolling = false;
    }, 1000); // Tiempo de la transición
  }

  // Detectar el scroll de la rueda del ratón
  window.addEventListener(
    "wheel",
    function (e) {
      e.preventDefault();

      if (isScrolling) return;

      if (e.deltaY > 0 && currentSection < totalSections - 1) {
        // Scroll hacia abajo
        currentSection++;
        smoothScroll(currentSection);
      } else if (e.deltaY < 0 && currentSection > 0) {
        // Scroll hacia arriba
        currentSection--;
        smoothScroll(currentSection);
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
    if (isScrolling) return;

    const swipeDistance = touchEndY - touchStartY;
    const minSwipeDistance = 50;

    if (Math.abs(swipeDistance) < minSwipeDistance) return;

    if (swipeDistance > 0 && currentSection > 0) {
      // Swipe hacia arriba
      currentSection--;
      smoothScroll(currentSection);
    } else if (swipeDistance < 0 && currentSection < totalSections - 1) {
      // Swipe hacia abajo
      currentSection++;
      smoothScroll(currentSection);
    }
  }

  // Prevenir el scroll por defecto
  document.body.style.overflow = "hidden";
});
