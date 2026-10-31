/**
 * ===================================================================
 * J & M — THE WEDDING EXPERIENCE
 * Countdown Experience (Cuenta Regresiva Oficial)
 * Target: 06/11/2027 21:00 hs — America/Argentina/Buenos_Aires (UTC-3)
 * ===================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
  const daysEl = document.getElementById("countdown-days");
  const hoursEl = document.getElementById("countdown-hours");
  const minutesEl = document.getElementById("countdown-minutes");
  const secondsEl = document.getElementById("countdown-seconds");
  const messageEl = document.getElementById("countdown-message");

  if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

  // Fecha del casamiento: 6 de Noviembre de 2027 a las 21:00 hora de Buenos Aires (UTC-3)
  // Date.parse con offset explícito -03:00 garantiza precisión absoluta
  const targetTime = new Date("2027-11-06T21:00:00-03:00").getTime();

  let prevVals = { days: -1, hours: -1, minutes: -1, seconds: -1 };

  function animateDigitChange(element, newVal) {
    if (element.textContent !== newVal) {
      element.textContent = newVal;
      element.classList.remove("digit-pulse");
      void element.offsetWidth; // Trigger reflow
      element.classList.add("digit-pulse");
    }
  }

  function updateCountdown() {
    const now = new Date().getTime();
    const diff = targetTime - now;

    if (diff <= 0) {
      daysEl.textContent = "00";
      hoursEl.textContent = "00";
      minutesEl.textContent = "00";
      secondsEl.textContent = "00";
      if (messageEl) {
        messageEl.textContent = "¡Llegó el gran día! Hoy celebramos nuestro amor.";
        messageEl.classList.add("gold-gradient-text");
      }
      return;
    }

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);

    const dStr = String(d).padStart(2, "0");
    const hStr = String(h).padStart(2, "0");
    const mStr = String(m).padStart(2, "0");
    const sStr = String(s).padStart(2, "0");

    animateDigitChange(daysEl, dStr);
    animateDigitChange(hoursEl, hStr);
    animateDigitChange(minutesEl, mStr);
    animateDigitChange(secondsEl, sStr);
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);
});
