/**
 * ===================================================================
 * J & M — THE WEDDING EXPERIENCE
 * RSVP Controller (Confirmación de Asistencia)
 * ===================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("rsvp-form");
  const codeBox = document.getElementById("invitation-code-box");
  const codeName = document.getElementById("invitation-code-name");
  const codeInput = document.getElementById("invitation-code-input");
  const btnApplyCode = document.getElementById("btn-apply-code");
  const companionsInput = document.getElementById("rsvp-companions");
  const companionsHelp = document.getElementById("rsvp-companions-help");
  const alertBox = document.getElementById("rsvp-alert");
  const radioLabels = document.querySelectorAll(".attendance-radio-label");
  const fullNameInput = document.getElementById("rsvp-name");

  if (!form) return;

  const config = window.WEDDING_CONFIG || {};
  const guestCodes = config.guestCodes || {};
  let currentMaxGuests = 2; // Por defecto

  // Manejar estilos de Radio Buttons
  radioLabels.forEach(label => {
    label.addEventListener("click", () => {
      radioLabels.forEach(l => l.classList.remove("selected"));
      label.classList.add("selected");
    });
  });

  // Aplicar código de invitación
  function applyGuestCode(code) {
    if (!code) return;
    const cleanCode = code.trim().toUpperCase();
    const guestData = guestCodes[cleanCode];

    if (guestData) {
      currentMaxGuests = guestData.maxGuests || 2;
      if (fullNameInput && !fullNameInput.value) {
        fullNameInput.value = guestData.name;
      }
      if (codeName) {
        codeName.textContent = `${guestData.name} (Hasta ${currentMaxGuests} personas)`;
      }
      if (companionsInput) {
        companionsInput.max = currentMaxGuests - 1; // El invitado principal + acompañantes
      }
      if (companionsHelp) {
        companionsHelp.textContent = `Tu invitación incluye hasta ${currentMaxGuests} personas en total (${currentMaxGuests - 1} acompañante${currentMaxGuests > 2 ? 's' : ''}).`;
      }
      if (codeBox) codeBox.style.display = "flex";
      showAlert(`¡Hola ${guestData.name}! Tu invitación ha sido reconocida.`, "success");
    } else {
      showAlert("El código ingresado no fue encontrado, pero podés confirmar con tus datos normalmente.", "error");
    }
  }

  // Detectar código en la URL (ej. ?invitacion=FAMILIA-PEREZ)
  const urlParams = new URLSearchParams(window.location.search);
  const codeFromUrl = urlParams.get("invitacion") || urlParams.get("codigo");
  if (codeFromUrl) {
    applyGuestCode(codeFromUrl);
  }

  if (btnApplyCode && codeInput) {
    btnApplyCode.addEventListener("click", () => {
      applyGuestCode(codeInput.value);
    });
  }

  // Enviar Formulario RSVP
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    alertBox.style.display = "none";

    const name = fullNameInput.value.trim();
    const attendingRadio = document.querySelector('input[name="attending"]:checked');
    const companions = parseInt(companionsInput ? companionsInput.value : 0, 10) || 0;
    const dietary = document.getElementById("rsvp-dietary").value;
    const song = document.getElementById("rsvp-song") ? document.getElementById("rsvp-song").value.trim() : "";
    const message = document.getElementById("rsvp-message") ? document.getElementById("rsvp-message").value.trim() : "";

    // Validaciones
    if (!name) {
      showAlert("Por favor, ingresá tu nombre y apellido.", "error");
      return;
    }
    if (!attendingRadio) {
      showAlert("Por favor, confirmá si vas a asistir o no al casamiento.", "error");
      return;
    }

    const attending = attendingRadio.value === "si";

    const rsvpData = {
      id: "rsvp_" + Date.now(),
      name,
      attending,
      companions: attending ? companions : 0,
      totalGuests: attending ? (1 + companions) : 0,
      dietary: attending ? dietary : "No aplica",
      song,
      message,
      createdAt: new Date().toISOString(),
      formattedDate: new Date().toLocaleDateString("es-AR")
    };

    // Guardar en Supabase o LocalStorage Fallback
    try {
      saveRsvpRecord(rsvpData);

      if (attending) {
        showAlert(`¡Muchas gracias, ${name}! Tu asistencia ha sido confirmada con alegría. ¡Te esperamos para celebrar!`, "success");
      } else {
        showAlert(`Gracias por avisarnos, ${name}. Lamentamos que no puedas venir, ¡pero te tendremos muy presente en nuestros corazones!`, "success");
      }

      form.reset();
      radioLabels.forEach(l => l.classList.remove("selected"));

      // Notificar a la aplicación si hay observadores
      if (window.WeddingApp && typeof window.WeddingApp.onRsvpSubmitted === "function") {
        window.WeddingApp.onRsvpSubmitted(rsvpData);
      }
    } catch (err) {
      console.error("Error guardando confirmación:", err);
      showAlert("Ocurrió un error al enviar tu respuesta. Por favor, intentá nuevamente.", "error");
    }
  });

  function showAlert(msg, type) {
    alertBox.textContent = msg;
    alertBox.className = `rsvp-alert ${type}`;
    alertBox.style.display = "block";
  }

  function saveRsvpRecord(data) {
    const storageKey = (config.supabase && config.supabase.storageKeyRsvp) || "jm_wedding_rsvps_v1";
    let existing = [];
    try {
      existing = JSON.parse(localStorage.getItem(storageKey)) || [];
    } catch (e) {
      existing = [];
    }

    // Si ya confirmó antes con el mismo nombre, actualizar
    const existingIdx = existing.findIndex(r => r.name.toLowerCase() === data.name.toLowerCase());
    if (existingIdx >= 0) {
      existing[existingIdx] = data;
    } else {
      existing.push(data);
    }

    localStorage.setItem(storageKey, JSON.stringify(existing));
  }
});
