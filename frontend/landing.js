document.addEventListener("DOMContentLoaded", function () {
  const landingSection = document.querySelector(".landing-container");
  const cvSection = document.getElementById("cv-section");
  let isInLanding = true;
  let isScrolling = false;

  // Función para el scroll suave a la sección del CV
  function scrollToCV() {
    if (isScrolling) return;
    isScrolling = true;
    window.scrollTo({
      top: cvSection.offsetTop,
      behavior: "smooth",
    });
    setTimeout(() => {
      isScrolling = false;
    }, 1000);
  }

  // Función para el scroll suave a la landing
  function scrollToLanding() {
    if (isScrolling) return;
    isScrolling = true;
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    setTimeout(() => {
      isScrolling = false;
    }, 1000);
  }

  // Detectar el scroll de la rueda del ratón
  window.addEventListener(
    "wheel",
    function (e) {
      if (isScrolling) return;

      // Si estamos en la parte superior del CV y scrolleamos hacia arriba
      if (
        !isInLanding &&
        window.scrollY <= cvSection.offsetTop + 50 &&
        e.deltaY < 0
      ) {
        e.preventDefault();
        scrollToLanding();
        return;
      }

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
    if (isScrolling) return;

    // Si estamos en la parte superior del CV y hacemos swipe hacia arriba
    if (
      !isInLanding &&
      window.scrollY <= cvSection.offsetTop + 50 &&
      touchEndY > touchStartY
    ) {
      scrollToLanding();
      return;
    }

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

  // Función para actualizar el indicador de scroll
  function updateScrollIndicator() {
    const scrollIndicator = document.querySelector(".scroll-indicator");
    const scrollText = scrollIndicator.querySelector("span");
    const scrollIcon = scrollIndicator.querySelector("i");

    if (window.scrollY > landingSection.offsetHeight / 2) {
      scrollText.textContent = "Scroll para volver arriba";
      scrollIcon.className = "fas fa-chevron-up";
      scrollIcon.style.animation = "bounceUp 2s infinite";
    } else {
      scrollText.textContent = "Scroll para ver mi CV";
      scrollIcon.className = "fas fa-chevron-down";
      scrollIcon.style.animation = "bounce 2s infinite";
    }
  }

  // Función para manejar el clic en el indicador de scroll
  function handleScrollIndicatorClick() {
    const scrollIndicator = document.querySelector(".scroll-indicator");
    scrollIndicator.addEventListener("click", () => {
      if (window.scrollY > landingSection.offsetHeight / 2) {
        // Si estamos en el CV, volver arriba
        scrollToLanding();
      } else {
        // Si estamos en la landing, ir al CV
        scrollToCV();
      }
    });
  }

  // Agregar los eventos
  window.addEventListener("scroll", () => {
    updateScrollIndicator();
  });

  // Inicializar
  updateScrollIndicator();
  handleScrollIndicatorClick();
});
