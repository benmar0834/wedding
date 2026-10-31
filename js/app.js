/**
 * ===================================================================
 * J & M — THE WEDDING EXPERIENCE
 * Nocturne Celestial Night Sky & Application Orchestrator
 * ===================================================================
 */

window.WeddingApp = (function() {
  function init() {
    initCelestialNightSky();
    initNavigation();
    initScrollAnimations();
    initCopyActions();
    populateDynamicContent();
  }

  // 1. Cielo Animado: Estrellas de Noche o Luz Dorada Ambiental de Día
  function initCelestialNightSky() {
    const canvas = document.getElementById("ambient-particles");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener("resize", () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    // Partículas doradas flotantes
    const stars = [];
    const starCount = Math.min(Math.floor(width / 18), 75);

    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2.2 + 0.6,
        alpha: Math.random() * 0.8 + 0.2,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinkleDirection: Math.random() > 0.5 ? 1 : -1,
        vy: -Math.random() * 0.25 - 0.05
      });
    }

    // Estrella fugaz (solo activa en modo noche)
    let shootingStar = null;
    let nextShootingStarTime = Date.now() + 4000;

    function triggerShootingStar() {
      shootingStar = {
        x: Math.random() * (width * 0.7),
        y: Math.random() * (height * 0.4),
        length: 80 + Math.random() * 50,
        speed: 12 + Math.random() * 8,
        angle: Math.PI / 4 + (Math.random() - 0.5) * 0.2,
        opacity: 1
      };
      nextShootingStarTime = Date.now() + 10000 + Math.random() * 12000;
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);

      const isDay = document.documentElement.getAttribute("data-theme") === "day";

      // Dibujar partículas doradas (estrellas o motas de luz solar)
      stars.forEach(s => {
        s.alpha += s.twinkleSpeed * s.twinkleDirection;
        if (s.alpha > 0.95) {
          s.alpha = 0.95;
          s.twinkleDirection = -1;
        } else if (s.alpha < 0.2) {
          s.alpha = 0.2;
          s.twinkleDirection = 1;
        }

        s.y += s.vy;
        if (s.y < 0) {
          s.y = height + 5;
          s.x = Math.random() * width;
        }

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);

        if (isDay) {
          // Luz solar cálida dorada de día
          ctx.fillStyle = `rgba(212, 175, 55, ${s.alpha * 0.55})`;
          ctx.shadowBlur = 4;
          ctx.shadowColor = "rgba(212, 175, 55, 0.35)";
        } else {
          // Estrellas doradas nocturnas
          ctx.fillStyle = `rgba(229, 193, 88, ${s.alpha})`;
          ctx.shadowBlur = 6;
          ctx.shadowColor = "rgba(229, 193, 88, 0.5)";
        }

        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Dibujar estrella fugaz solo en modo noche
      if (!isDay) {
        const now = Date.now();
        if (!shootingStar && now > nextShootingStarTime) {
          triggerShootingStar();
        }

        if (shootingStar) {
          ctx.save();
          ctx.beginPath();
          const tailX = shootingStar.x - Math.cos(shootingStar.angle) * shootingStar.length;
          const tailY = shootingStar.y - Math.sin(shootingStar.angle) * shootingStar.length;

          const grad = ctx.createLinearGradient(tailX, tailY, shootingStar.x, shootingStar.y);
          grad.addColorStop(0, "rgba(229, 193, 88, 0)");
          grad.addColorStop(1, `rgba(255, 248, 231, ${shootingStar.opacity})`);

          ctx.strokeStyle = grad;
          ctx.lineWidth = 1.8;
          ctx.shadowBlur = 8;
          ctx.shadowColor = "#FFF8E7";
          ctx.moveTo(tailX, tailY);
          ctx.lineTo(shootingStar.x, shootingStar.y);
          ctx.stroke();
          ctx.restore();

          shootingStar.x += Math.cos(shootingStar.angle) * shootingStar.speed;
          shootingStar.y += Math.sin(shootingStar.angle) * shootingStar.speed;
          shootingStar.opacity -= 0.015;

          if (shootingStar.opacity <= 0 || shootingStar.x > width || shootingStar.y > height) {
            shootingStar = null;
          }
        }
      }

      requestAnimationFrame(animate);
    }

    animate();
  }

  // 2. Barra de Navegación y Enlaces
  function initNavigation() {
    const toggleBtn = document.getElementById("nav-toggle-btn");
    const menu = document.getElementById("nav-menu");
    const links = document.querySelectorAll(".nav-link, .mobile-quick-btn");

    if (toggleBtn && menu) {
      toggleBtn.addEventListener("click", () => {
        menu.classList.toggle("active");
        toggleBtn.setAttribute("aria-expanded", menu.classList.contains("active"));
      });
    }

    links.forEach(link => {
      link.addEventListener("click", () => {
        if (menu) menu.classList.remove("active");
        if (toggleBtn) toggleBtn.setAttribute("aria-expanded", "false");
      });
    });
  }

  // 3. Animaciones al Scrollear (IntersectionObserver)
  function initScrollAnimations() {
    const timelineItems = document.querySelectorAll(".timeline-item");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: "0px 0px -50px 0px"
    });

    timelineItems.forEach(item => observer.observe(item));
  }

  // 4. Copiar CBU / Alias
  function initCopyActions() {
    const copyBtns = document.querySelectorAll(".btn-copy-data");
    copyBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        const textToCopy = btn.getAttribute("data-copy");
        if (!textToCopy) return;

        navigator.clipboard.writeText(textToCopy).then(() => {
          const originalText = btn.textContent;
          btn.textContent = "¡Copiado!";
          btn.style.backgroundColor = "var(--color-gold)";
          btn.style.color = "#120A1A";
          setTimeout(() => {
            btn.textContent = originalText;
            btn.style.backgroundColor = "";
            btn.style.color = "";
          }, 2200);
        }).catch(err => {
          console.error("Error al copiar:", err);
        });
      });
    });
  }

  // 5. Poblar contenidos dinámicos desde config.js si es necesario
  function populateDynamicContent() {
    const config = window.WEDDING_CONFIG;
    if (!config) return;

    const timelineContainer = document.getElementById("timeline-container");
    if (timelineContainer && config.story) {
      timelineContainer.innerHTML = "";
      config.story.forEach((item, index) => {
        const div = document.createElement("div");
        div.className = "timeline-item";
        div.innerHTML = `
          <div class="timeline-node"></div>
          <div class="timeline-content">
            <div class="timeline-image-wrapper">
              <img src="${item.image}" alt="${item.title}" loading="lazy" />
            </div>
            <span class="timeline-date">${item.date}</span>
            <h3 class="timeline-title">${item.title}</h3>
            <p class="timeline-desc">${item.description}</p>
          </div>
        `;
        timelineContainer.appendChild(div);
      });
      initScrollAnimations();
    }
  }

  function onSiteRevealed() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  document.addEventListener("DOMContentLoaded", init);

  return {
    onSiteRevealed
  };
})();
