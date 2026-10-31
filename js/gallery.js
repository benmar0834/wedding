/**
 * ===================================================================
 * J & M — THE WEDDING EXPERIENCE
 * Photo Gallery & Lightbox Controller
 * ===================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("gallery-grid");
  const tabBtns = document.querySelectorAll(".gallery-tab-btn");
  const lightbox = document.getElementById("gallery-lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxCaption = document.getElementById("lightbox-caption");
  const lightboxCounter = document.getElementById("lightbox-counter");
  const btnClose = document.getElementById("lightbox-close");
  const btnPrev = document.getElementById("lightbox-prev");
  const btnNext = document.getElementById("lightbox-next");

  if (!grid || !lightbox) return;

  // Cargar fotos desde WEDDING_CONFIG
  const memoriesPhotos = (window.WEDDING_CONFIG && window.WEDDING_CONFIG.galleries.memories) || [];
  const venuePhotos = (window.WEDDING_CONFIG && window.WEDDING_CONFIG.galleries.venue) || [];

  const allPhotos = [
    ...memoriesPhotos.map(p => ({ ...p, category: "memories" })),
    ...venuePhotos.map(p => ({ ...p, category: "venue" }))
  ];

  let currentCategory = "all";
  let activePhotos = [...allPhotos];
  let currentIndex = 0;

  // Renderizar tarjetas de fotos
  function renderGallery(photos) {
    grid.innerHTML = "";
    photos.forEach((photo, idx) => {
      const card = document.createElement("div");
      card.className = "polaroid-card";
      card.setAttribute("role", "button");
      card.setAttribute("tabindex", "0");
      card.setAttribute("aria-label", `Ver ${photo.caption}`);

      card.innerHTML = `
        <div class="polaroid-img-wrapper">
          <img src="${photo.src}" alt="${photo.caption}" loading="lazy" />
        </div>
        <div class="polaroid-caption">${photo.caption}</div>
        <span class="polaroid-tag">${photo.tag || ""}</span>
      `;

      card.addEventListener("click", () => openLightbox(idx));
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openLightbox(idx);
        }
      });

      grid.appendChild(card);
    });
  }

  // Filtrar pestañas
  tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      tabBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentCategory = btn.dataset.tab;

      if (currentCategory === "all") {
        activePhotos = [...allPhotos];
      } else {
        activePhotos = allPhotos.filter(p => p.category === currentCategory);
      }
      renderGallery(activePhotos);
    });
  });

  // Lightbox
  function openLightbox(index) {
    currentIndex = index;
    updateLightbox();
    lightbox.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    lightbox.classList.remove("active");
    document.body.style.overflow = "auto";
  }

  function updateLightbox() {
    const photo = activePhotos[currentIndex];
    if (!photo) return;
    lightboxImg.src = photo.src;
    lightboxImg.alt = photo.caption;
    if (lightboxCaption) lightboxCaption.textContent = photo.caption;
    if (lightboxCounter) {
      lightboxCounter.textContent = `Foto ${currentIndex + 1} de ${activePhotos.length}`;
    }
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % activePhotos.length;
    updateLightbox();
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + activePhotos.length) % activePhotos.length;
    updateLightbox();
  }

  // Event Listeners Lightbox
  if (btnClose) btnClose.addEventListener("click", closeLightbox);
  if (btnNext) btnNext.addEventListener("click", showNext);
  if (btnPrev) btnPrev.addEventListener("click", showPrev);

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  window.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("active")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowRight") showNext();
    if (e.key === "ArrowLeft") showPrev();
  });

  // Soporte de Gestos Swipe (Táctil)
  let touchStartX = 0;
  let touchEndX = 0;

  lightbox.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  lightbox.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });

  function handleSwipe() {
    const diff = touchEndX - touchStartX;
    if (Math.abs(diff) > 50) {
      if (diff < 0) {
        showNext(); // Swipe a la izquierda -> siguiente
      } else {
        showPrev(); // Swipe a la derecha -> anterior
      }
    }
  }

  // Inicializar
  renderGallery(activePhotos);
});
