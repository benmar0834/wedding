/**
 * ===================================================================
 * J & M — THE WEDDING EXPERIENCE
 * Scratch-to-Reveal Experience (Nocturne Gold Foil Edition)
 * ===================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("scratch-canvas");
  const stage = document.getElementById("scratch-stage");
  const progressFill = document.getElementById("scratch-progress-fill");
  const progressText = document.getElementById("scratch-progress-text");
  const revealMessage = document.getElementById("scratch-reveal-message");
  const btnRevealAlt = document.getElementById("btn-scratch-reveal-alt");

  if (!canvas || !stage) return;

  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  let isDrawing = false;
  let isRevealed = false;
  let lastCheckTime = 0;
  const brushRadius = 34;

  // Ajustar dimensiones del Canvas al tamaño real del contenedor
  function resizeCanvas() {
    const rect = stage.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    drawOverlay(rect.width, rect.height);
  }

  // Capa dorada metálica de oro satinado con estrellas nocturnas
  function drawOverlay(width, height) {
    if (isRevealed) return;

    // Gradiente de Oro Foil
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, "#FFF9E6");
    grad.addColorStop(0.2, "#F5D884");
    grad.addColorStop(0.45, "#D4AF37");
    grad.addColorStop(0.7, "#FFE699");
    grad.addColorStop(0.9, "#AA7E24");
    grad.addColorStop(1, "#6B4E12");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Patrón celestial de estrellas doradas y constelaciones finas
    ctx.fillStyle = "rgba(255, 255, 255, 0.45)";
    for (let x = 20; x < width; x += 35) {
      for (let y = 20; y < height; y += 35) {
        ctx.beginPath();
        ctx.arc(x, y, 1.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Marco interior dorado fino
    ctx.strokeStyle = "rgba(255, 255, 255, 0.75)";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(14, 14, width - 28, height - 28);

    // Emblema central sutil
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.font = "italic 32px 'Alex Brush', cursive";
    ctx.fillStyle = "#2D1505";
    ctx.fillText("Juliana & Marcos", width / 2, height / 2 - 10);

    ctx.font = "bold 11px 'Montserrat', sans-serif";
    ctx.fillStyle = "#523707";
    ctx.fillText("✨  DESCUBRIR NUESTRA HISTORIA  ✨", width / 2, height / 2 + 24);
  }

  function getPosition(e) {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  }

  function scratch(pos) {
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, brushRadius, 0, Math.PI * 2, false);
    ctx.fill();

    const now = Date.now();
    if (now - lastCheckTime > 150) {
      lastCheckTime = now;
      checkProgress();
    }
  }

  function checkProgress() {
    if (isRevealed) return;
    const rect = stage.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const w = Math.floor(rect.width * dpr);
    const h = Math.floor(rect.height * dpr);

    const imgData = ctx.getImageData(0, 0, w, h);
    const data = imgData.data;
    let transparentCount = 0;
    const step = 16 * 4;
    const totalSamples = data.length / step;

    for (let i = 3; i < data.length; i += step) {
      if (data[i] === 0) {
        transparentCount++;
      }
    }

    const percentage = Math.round((transparentCount / totalSamples) * 100);

    if (progressFill) {
      progressFill.style.width = `${Math.min(percentage, 100)}%`;
    }
    if (progressText) {
      progressText.textContent = `${percentage}% descubierto`;
    }

    // Auto-revelar al superar el 38%
    if (percentage >= 38) {
      revealFullPhoto();
    }
  }

  function revealFullPhoto() {
    if (isRevealed) return;
    isRevealed = true;

    canvas.classList.add("revealed");
    if (progressFill) progressFill.style.width = "100%";
    if (progressText) progressText.textContent = "100% descubierto";
    if (revealMessage) revealMessage.classList.add("active");
    if (btnRevealAlt) btnRevealAlt.style.display = "none";

    createGoldNightStardust();
  }

  // Destellos dorados celestiales de celebración
  function createGoldNightStardust() {
    const container = stage;
    const count = 40;
    for (let i = 0; i < count; i++) {
      const star = document.createElement("div");
      star.style.position = "absolute";
      star.style.width = `${4 + Math.random() * 8}px`;
      star.style.height = star.style.width;
      star.style.backgroundColor = i % 3 === 0 ? "#FFF8E7" : (i % 2 === 0 ? "#E5C158" : "#C5A059");
      star.style.borderRadius = "50%";
      star.style.boxShadow = "0 0 10px rgba(229, 193, 88, 0.8)";
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = "-10px";
      star.style.zIndex = "10";
      star.style.pointerEvents = "none";
      container.appendChild(star);

      const anim = star.animate([
        { transform: "translateY(0) scale(1)", opacity: 1 },
        { transform: `translateY(${stage.clientHeight + 40}px) scale(0)`, opacity: 0 }
      ], {
        duration: 1600 + Math.random() * 1200,
        easing: "cubic-bezier(0.25, 0.46, 0.45, 0.94)"
      });

      anim.onfinish = () => star.remove();
    }
  }

  // Event Listeners
  function onPointerDown(e) {
    if (isRevealed) return;
    isDrawing = true;
    scratch(getPosition(e));
  }

  function onPointerMove(e) {
    if (!isDrawing || isRevealed) return;
    scratch(getPosition(e));
  }

  function onPointerUp() {
    isDrawing = false;
  }

  canvas.addEventListener("mousedown", onPointerDown);
  window.addEventListener("mousemove", onPointerMove);
  window.addEventListener("mouseup", onPointerUp);

  canvas.addEventListener("touchstart", (e) => {
    e.preventDefault();
    onPointerDown(e);
  }, { passive: false });

  window.addEventListener("touchmove", (e) => {
    if (!isDrawing) return;
    onPointerMove(e);
  }, { passive: false });

  window.addEventListener("touchend", onPointerUp);

  if (btnRevealAlt) {
    btnRevealAlt.addEventListener("click", revealFullPhoto);
  }

  resizeCanvas();
  window.addEventListener("resize", () => {
    if (!isRevealed) resizeCanvas();
  });
});
