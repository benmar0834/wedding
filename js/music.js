/**
 * ===================================================================
 * J & M — THE WEDDING EXPERIENCE
 * Wedding Music Player (Música Oficial del Casamiento)
 * Song: "All of Me" — John Legend
 * File: assets/music.mp3 (Trimmed duration: 4:14)
 * ===================================================================
 */

window.WeddingMusic = (function() {
  let isPlaying = false;
  let audio = null;

  const config = (window.WEDDING_CONFIG && window.WEDDING_CONFIG.music) || {};
  const songTitle = config.title || "All of Me";
  const songArtist = config.artist || "John Legend";
  const audioSrc = config.localAudioUrl || "assets/music.mp3";

  function init() {
    const toggleBtn = document.getElementById("music-toggle-btn");
    const titleEl = document.getElementById("music-title-text");
    const artistEl = document.getElementById("music-artist-text");

    if (titleEl) titleEl.textContent = songTitle;
    if (artistEl) artistEl.textContent = songArtist;

    // Crear el elemento de Audio local
    audio = new Audio();
    audio.src = audioSrc;
    audio.loop = true;
    audio.preload = "auto";
    audio.volume = 0.7;

    // Control de eventos del audio
    audio.addEventListener("play", () => {
      isPlaying = true;
      updateUi();
    });

    audio.addEventListener("pause", () => {
      isPlaying = false;
      updateUi();
    });

    audio.addEventListener("ended", () => {
      isPlaying = false;
      updateUi();
    });

    // Asegura el límite exacto de 4:14 minutos (254 segundos)
    audio.addEventListener("timeupdate", () => {
      if (audio.currentTime >= 254) {
        audio.currentTime = 0;
      }
    });

    if (toggleBtn) {
      toggleBtn.addEventListener("click", togglePlay);
    }
  }

  function play() {
    if (!audio) return;
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        isPlaying = true;
        updateUi();
      }).catch(err => {
        console.log("Autoplay requiere interacción de usuario:", err);
      });
    }
  }

  function pause() {
    if (!audio) return;
    audio.pause();
    isPlaying = false;
    updateUi();
  }

  function togglePlay() {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }

  function startOnUserInteraction() {
    if (!isPlaying) {
      play();
    }
  }

  function setVolume(val) {
    if (audio) {
      audio.volume = Math.max(0, Math.min(1, val));
    }
  }

  function updateUi() {
    const widget = document.getElementById("music-player-widget");
    const toggleIcon = document.getElementById("music-toggle-icon");

    if (widget) {
      if (isPlaying) {
        widget.classList.add("playing");
      } else {
        widget.classList.remove("playing");
      }
    }

    if (toggleIcon) {
      if (isPlaying) {
        // Icono de Pausa
        toggleIcon.innerHTML = `
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
            <rect x="6" y="5" width="4" height="14" rx="1.5"/>
            <rect x="14" y="5" width="4" height="14" rx="1.5"/>
          </svg>
        `;
      } else {
        // Icono de Play
        toggleIcon.innerHTML = `
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
            <polygon points="7 4 19 12 7 20 7 4"/>
          </svg>
        `;
      }
    }
  }

  document.addEventListener("DOMContentLoaded", init);

  return {
    play,
    pause,
    togglePlay,
    setVolume,
    startOnUserInteraction
  };
})();
