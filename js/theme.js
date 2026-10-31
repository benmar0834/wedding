/**
 * ===================================================================
 * J & M — THE WEDDING EXPERIENCE
 * Day / Night Dual Luxury Theme Engine (100% Automático por Horario)
 * ===================================================================
 * Zona Horaria Oficial: America/Argentina/Buenos_Aires (UTC-3)
 * Horario de Día: 08:00 a 20:00 hs (Papelería Marfil, Champán & Oro)
 * Horario de Noche: 20:00 a 08:00 hs (Luxury Night: Terciopelo Negro & Polvo de Estrellas)
 * ===================================================================
 */

window.WeddingTheme = (function() {
  const TIMEZONE = "America/Argentina/Buenos_Aires";

  // Obtiene la hora actual exacta en Argentina (0 a 23)
  function getArgentinaHour() {
    try {
      const formatter = new Intl.DateTimeFormat("en-US", {
        timeZone: TIMEZONE,
        hour: "numeric",
        hour12: false
      });
      return parseInt(formatter.format(new Date()), 10);
    } catch (e) {
      // Fallback en caso de navegadores antiguos: UTC - 3
      const now = new Date();
      return (now.getUTCHours() - 3 + 24) % 24;
    }
  }

  // Determina si actualmente es de día en Argentina (08 a 20 hs)
  function isDaytime() {
    const hour = getArgentinaHour();
    return hour >= 8 && hour < 20;
  }

  function getCalculatedTheme() {
    return isDaytime() ? "day" : "night";
  }

  let currentTheme = getCalculatedTheme();

  // Aplica el tema correspondiente de forma silenciosa y automática
  function applyTheme(theme) {
    currentTheme = theme;
    document.documentElement.setAttribute("data-theme", theme);
    if (document.body) {
      document.body.setAttribute("data-theme", theme);
    }

    // Actualizar meta theme-color del navegador
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.setAttribute("content", theme === "day" ? "#FAF7F2" : "#08050C");
    }

    // Notificar al sistema para actualizar partículas y fondos
    window.dispatchEvent(new CustomEvent("wedding-theme-changed", {
      detail: {
        theme,
        hour: getArgentinaHour(),
        isDaytime: theme === "day"
      }
    }));
  }

  function checkAndSyncTheme() {
    const expectedTheme = getCalculatedTheme();
    if (expectedTheme !== currentTheme) {
      applyTheme(expectedTheme);
    }
  }

  function init() {
    applyTheme(getCalculatedTheme());
    // Monitoreo silencioso cada 60 segundos
    setInterval(checkAndSyncTheme, 60000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  return {
    getCurrentTheme: () => currentTheme,
    isDaytime,
    getArgentinaHour,
    sync: checkAndSyncTheme
  };
})();
