/**
 * ===================================================================
 * J & M — THE WEDDING EXPERIENCE
 * Venue Carousel Controller (Carrusel del Salón de Eventos)
 * ===================================================================
 * Soporta navegación táctil swipe, botones prev/next, dots,
 * rotación automática y apertura en Lightbox a pantalla completa.
 * ===================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
  const carousel = document.getElementById("venue-carousel");
  const track = document.getElementById("venue-carousel-track");
  const btnPrev = document.getElementById("venue-btn-prev");
  const btnNext = document.getElementById("venue-btn-next");
  const dotsContainer = document.getElementById("venue-carousel-dots");
  const counter = document.getElementById("venue-carousel-counter");

  if (!carousel || !track) return;

  const slides = Array.from(track.querySelectorAll(".venue-slide"));
  const totalSlides = slides.length;
  if (totalSlides === 0) return;

  let currentIndex = 0;
  let autoPlayTimer = null;
  const AUTO_PLAY_INTERVAL = 5500; // 5.5 segundos

  // Actualiza la vista del carrusel
  function goToSlide(index) {
    if (index < 0) {
      currentIndex = totalSlides - 1;
    } else if (index >= totalSlides) {
      currentIndex = 0;
    } else {
      currentIndex = index;
    }

    // Desplazar pista
    track.style.transform = `translateX(-${currentIndex * 100}%)`;

    // Actualizar clases activas de slides
    slides.forEach((slide, idx) => {
      slide.classList.toggle("active", idx === currentIndex);
    });

    // Actualizar dots
    if (dotsContainer) {
      const dots = dotsContainer.querySelectorAll(".venue-dot");
      dots.forEach((dot, idx) => {
        dot.classList.toggle("active", idx === currentIndex);
        dot.setAttribute("aria-selected", idx === currentIndex);
      });
    }

    // Actualizar contador
    if (counter) {
      counter.textContent = `Foto ${currentIndex + 1} de ${totalSlides}`;
    }
  }

  function nextSlide() {
    goToSlide(currentIndex + 1);
  }

  function prevSlide() {
    goToSlide(currentIndex - 1);
  }

  // Auto-play
  function startAutoPlay() {
    stopAutoPlay();
    autoPlayTimer = setInterval(nextSlide, AUTO_PLAY_INTERVAL);
  }

  function stopAutoPlay() {
    if (autoPlayTimer) {
      clearInterval(autoPlayTimer);
      autoPlayTimer = null;
    }
  }

  // Event listeners de controles
  if (btnPrev) {
    btnPrev.addEventListener("click", (e) => {
      e.stopPropagation();
      prevSlide();
      startAutoPlay();
    });
  }

  if (btnNext) {
    btnNext.addEventListener("click", (e) => {
      e.stopPropagation();
      nextSlide();
      startAutoPlay();
    });
  }

  if (dotsContainer) {
    dotsContainer.addEventListener("click", (e) => {
      const dot = e.target.closest(".venue-dot");
      if (!dot) return;
      const idx = parseInt(dot.getAttribute("data-index"), 10);
      if (!isNaN(idx)) {
        goToSlide(idx);
        startAutoPlay();
      }
    });
  }

  // Pausar en hover
  carousel.addEventListener("mouseenter", stopAutoPlay);
  carousel.addEventListener("mouseleave", startAutoPlay);

  // Soporte para gestos táctiles (Swipe) en smartphones
  let touchStartX = 0;
  let touchStartY = 0;
  let isSwiping = false;

  carousel.addEventListener("touchstart", (e) => {
    stopAutoPlay();
    const touch = e.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
    isSwiping = true;
  }, { passive: true });

  carousel.addEventListener("touchmove", (e) => {
    if (!isSwiping) return;
  }, { passive: true });

  carousel.addEventListener("touchend", (e) => {
    if (!isSwiping) return;
    isSwiping = false;
    const touch = e.changedTouches[0];
    const diffX = touch.clientX - touchStartX;
    const diffY = touch.clientY - touchStartY;

    // Solo considerar swipe horizontal si fue más dominante que el vertical
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 40) {
      if (diffX < 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
    startAutoPlay();
  });

  // Soporte de navegación por teclado (flechas)
  carousel.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      prevSlide();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      nextSlide();
    }
  });

  // Clic en la foto activa para abrir en Lightbox
  slides.forEach((slide, idx) => {
    slide.addEventListener("click", () => {
      // Si la galería principal tiene lightbox disponible, abrirlo
      const lightbox = document.getElementById("gallery-lightbox");
      const lightboxImg = document.getElementById("lightbox-img");
      const lightboxCaption = document.getElementById("lightbox-caption");
      const lightboxCounter = document.getElementById("lightbox-counter");

      if (lightbox && lightboxImg) {
        const img = slide.querySelector("img");
        const text = slide.querySelector(".venue-slide-text");

        lightboxImg.src = img ? img.src : "";
        lightboxImg.alt = img ? img.alt : "";
        if (lightboxCaption) {
          lightboxCaption.textContent = text ? text.textContent : "Salón de Eventos";
        }
        if (lightboxCounter) {
          lightboxCounter.textContent = `Salón · Foto ${idx + 1} de ${totalSlides}`;
        }

        lightbox.classList.add("active");
        document.body.style.overflow = "hidden";
      }
    });
  });

  // Iniciar carrusel
  goToSlide(0);
  startAutoPlay();
});
