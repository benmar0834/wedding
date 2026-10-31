/**
 * ===================================================================
 * J & M — THE WEDDING EXPERIENCE
 * Envelope & Wax Seal Opening Interaction
 * ===================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
  const overlay = document.getElementById("envelope-overlay");
  const container = document.getElementById("envelope-container");
  const waxSeal = document.getElementById("wax-seal");
  const promptBottom = document.getElementById("envelope-prompt-bottom");

  if (!overlay || !container || !waxSeal) return;

  let isOpening = false;

  // Función para crear destellos dorados al romper el lacre
  function createSparkles(x, y) {
    const sparkleCount = 20;
    for (let i = 0; i < sparkleCount; i++) {
      const sparkle = document.createElement("div");
      sparkle.className = "sparkle-burst";
      document.body.appendChild(sparkle);

      const angle = (Math.PI * 2 * i) / sparkleCount;
      const distance = 40 + Math.random() * 80;
      const destX = x + Math.cos(angle) * distance;
      const destY = y + Math.sin(angle) * distance;

      sparkle.style.left = `${x}px`;
      sparkle.style.top = `${y}px`;
      sparkle.style.opacity = "1";

      sparkle.animate([
        { transform: "translate(0, 0) scale(1)", opacity: 1 },
        { transform: `translate(${destX - x}px, ${destY - y}px) scale(0)`, opacity: 0 }
      ], {
        duration: 800 + Math.random() * 400,
        easing: "cubic-bezier(0.2, 0.8, 0.2, 1)"
      }).onfinish = () => {
        sparkle.remove();
      };
    }
  }

  // Secuencia de Apertura
  function openEnvelope(e) {
    if (isOpening) return;
    isOpening = true;

    // Obtener coordenadas del centro del sello para las chispas
    const rect = waxSeal.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // 1. Romper el lacre
    waxSeal.classList.add("breaking");
    createSparkles(centerX, centerY);

    // 2. Animar solapa y tarjeta
    container.classList.add("animating");

    // 3. Iniciar o desbloquear la música con la interacción
    if (window.WeddingMusic && typeof window.WeddingMusic.startOnUserInteraction === "function") {
      window.WeddingMusic.startOnUserInteraction();
    }

    // 4. Tras ver emerger la tarjeta, transición al sitio web
    setTimeout(() => {
      overlay.classList.add("opened");
      document.body.style.overflow = "auto";

      // Desencadenar animación de bienvenida
      if (window.WeddingApp && typeof window.WeddingApp.onSiteRevealed === "function") {
        window.WeddingApp.onSiteRevealed();
      }
    }, 2200);
  }

  // Eventos de interacción (Touch y Click)
  container.addEventListener("click", openEnvelope);
  waxSeal.addEventListener("click", (e) => {
    e.stopPropagation();
    openEnvelope(e);
  });

  if (promptBottom) {
    promptBottom.addEventListener("click", openEnvelope);
  }

  // Permitir reabrir el sobre desde cualquier parte del sitio
  window.reopenEnvelope = function() {
    isOpening = false;
    overlay.classList.remove("opened");
    container.classList.remove("animating");
    waxSeal.classList.remove("breaking");
    document.body.style.overflow = "hidden";
  };
});
