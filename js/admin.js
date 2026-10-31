/**
 * ===================================================================
 * J & M — THE WEDDING EXPERIENCE
 * Private Admin Dashboard Controller (Panel Privado para los Novios)
 * ===================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("admin-modal");
  const loginScreen = document.getElementById("admin-login-screen");
  const dashboardScreen = document.getElementById("admin-dashboard-screen");
  const pinInput = document.getElementById("admin-pin-input");
  const btnLogin = document.getElementById("admin-btn-login");
  const loginError = document.getElementById("admin-login-error");
  const btnClose = document.getElementById("admin-close-btn");
  const openLinks = document.querySelectorAll(".open-admin-trigger");

  const statTotalConfirmed = document.getElementById("admin-stat-confirmed");
  const statTotalDeclined = document.getElementById("admin-stat-declined");
  const statTotalGuests = document.getElementById("admin-stat-total-people");
  const statDietary = document.getElementById("admin-stat-dietary");

  const guestTableBody = document.getElementById("admin-guest-table-body");
  const searchInput = document.getElementById("admin-search-guests");
  const btnExportCsv = document.getElementById("admin-btn-export-csv");

  // Generador de códigos
  const newCodeName = document.getElementById("admin-code-name");
  const newCodeMax = document.getElementById("admin-code-max");
  const btnGenerateCode = document.getElementById("admin-btn-generate-code");
  const codeResultBox = document.getElementById("admin-code-result");

  if (!modal) return;

  const config = window.WEDDING_CONFIG || {};
  const ADMIN_PIN = (config.admin && config.admin.pin) || "2027";
  const rsvpStorageKey = (config.supabase && config.supabase.storageKeyRsvp) || "jm_wedding_rsvps_v1";

  // Abrir y cerrar modal
  openLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      modal.classList.add("active");
      document.body.style.overflow = "hidden";
      if (sessionStorage.getItem(config.admin.sessionKey) === "authenticated") {
        showDashboard();
      } else {
        showLogin();
      }
    });
  });

  if (btnClose) {
    btnClose.addEventListener("click", closeModal);
  }

  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  function closeModal() {
    modal.classList.remove("active");
    document.body.style.overflow = "auto";
  }

  function showLogin() {
    loginScreen.style.display = "block";
    dashboardScreen.style.display = "none";
    if (pinInput) {
      pinInput.value = "";
      pinInput.focus();
    }
    if (loginError) loginError.style.display = "none";
  }

  function showDashboard() {
    loginScreen.style.display = "none";
    dashboardScreen.style.display = "block";
    loadDashboardData();
  }

  // Login con PIN
  if (btnLogin && pinInput) {
    btnLogin.addEventListener("click", handleLogin);
    pinInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") handleLogin();
    });
  }

  function handleLogin() {
    const enteredPin = pinInput.value.trim();
    if (enteredPin === ADMIN_PIN) {
      sessionStorage.setItem(config.admin.sessionKey, "authenticated");
      showDashboard();
    } else {
      if (loginError) {
        loginError.textContent = "PIN incorrecto. Por favor, verificá la clave.";
        loginError.style.display = "block";
      }
    }
  }

  // Cargar datos de RSVPs
  function getRsvps() {
    try {
      return JSON.parse(localStorage.getItem(rsvpStorageKey)) || [];
    } catch (e) {
      return [];
    }
  }

  function loadDashboardData() {
    const rsvps = getRsvps();

    // 1. Calcular métricas
    let confirmedCount = 0;
    let declinedCount = 0;
    let totalPeopleCount = 0;
    const dietaryMap = {};

    rsvps.forEach(r => {
      if (r.attending) {
        confirmedCount++;
        totalPeopleCount += (r.totalGuests || 1);
        if (r.dietary && r.dietary !== "Ninguna" && r.dietary !== "No aplica") {
          dietaryMap[r.dietary] = (dietaryMap[r.dietary] || 0) + 1;
        }
      } else {
        declinedCount++;
      }
    });

    if (statTotalConfirmed) statTotalConfirmed.textContent = confirmedCount;
    if (statTotalDeclined) statTotalDeclined.textContent = declinedCount;
    if (statTotalGuests) statTotalGuests.textContent = totalPeopleCount;

    if (statDietary) {
      const dietaryKeys = Object.keys(dietaryMap);
      if (dietaryKeys.length === 0) {
        statDietary.textContent = "Ninguna";
      } else {
        statDietary.textContent = dietaryKeys.map(k => `${k}: ${dietaryMap[k]}`).join(", ");
      }
    }

    // 2. Renderizar Tabla
    renderTable(rsvps);
  }

  function renderTable(list) {
    if (!guestTableBody) return;
    guestTableBody.innerHTML = "";

    if (list.length === 0) {
      guestTableBody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align: center; color: var(--color-text-muted); padding: 2rem;">
            Aún no se han recibido confirmaciones de asistencia.
          </td>
        </tr>
      `;
      return;
    }

    list.forEach(r => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><strong>${r.name}</strong></td>
        <td>
          <span class="${r.attending ? 'badge-attending-yes' : 'badge-attending-no'}">
            ${r.attending ? 'Asistirá' : 'No asistirá'}
          </span>
        </td>
        <td>${r.attending ? (r.totalGuests || 1) : 0} personas</td>
        <td>${r.dietary || 'Ninguna'}</td>
        <td>${r.song ? `<em>"${r.song}"</em>` : '-'}</td>
        <td>${r.formattedDate || '-'}</td>
      `;
      guestTableBody.appendChild(tr);
    });
  }

  // Búsqueda en la tabla
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const term = e.target.value.toLowerCase().trim();
      const all = getRsvps();
      const filtered = all.filter(r => 
        r.name.toLowerCase().includes(term) ||
        (r.dietary && r.dietary.toLowerCase().includes(term)) ||
        (r.song && r.song.toLowerCase().includes(term))
      );
      renderTable(filtered);
    });
  }

  // Exportar a CSV (Compatible con Excel Argentina)
  if (btnExportCsv) {
    btnExportCsv.addEventListener("click", () => {
      const rsvps = getRsvps();
      if (rsvps.length === 0) {
        alert("No hay confirmaciones para exportar todavía.");
        return;
      }

      // Encabezados en español
      let csvContent = "\uFEFF"; // BOM para acentos en Excel
      csvContent += "Nombre;Asistencia;Acompañantes;Total Personas;Menú Especial;Canción Sugerida;Mensaje;Fecha\r\n";

      rsvps.forEach(r => {
        const row = [
          `"${r.name.replace(/"/g, '""')}"`,
          r.attending ? "Asiste" : "No asiste",
          r.companions || 0,
          r.totalGuests || (r.attending ? 1 : 0),
          `"${(r.dietary || '').replace(/"/g, '""')}"`,
          `"${(r.song || '').replace(/"/g, '""')}"`,
          `"${(r.message || '').replace(/"/g, '""')}"`,
          r.formattedDate || ""
        ];
        csvContent += row.join(";") + "\r\n";
      });

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `casamiento_JM_invitados_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }

  // Generador de Código de Invitación
  if (btnGenerateCode && newCodeName && newCodeMax && codeResultBox) {
    btnGenerateCode.addEventListener("click", () => {
      const name = newCodeName.value.trim();
      const max = parseInt(newCodeMax.value, 10) || 2;
      if (!name) {
        alert("Ingresá el nombre del invitado para generar su código.");
        return;
      }

      const code = name.toUpperCase().replace(/[^A-Z0-9]/g, "-").replace(/-+/g, "-");
      const currentUrl = window.location.origin + window.location.pathname;
      const shareUrl = `${currentUrl}?invitacion=${encodeURIComponent(code)}`;

      // Guardar en config en memoria
      if (config.guestCodes) {
        config.guestCodes[code] = { name, maxGuests: max };
      }

      codeResultBox.innerHTML = `
        <div style="margin-top: 1rem; padding: 1rem; background: #FAF7F2; border: 1px solid var(--color-gold); border-radius: 8px;">
          <p style="font-size: 0.85rem; color: var(--color-text-muted); margin-bottom: 0.3rem;">Código creado: <strong>${code}</strong> (Hasta ${max} personas)</p>
          <p style="font-size: 0.82rem; word-break: break-all; margin-bottom: 0.6rem;"><strong>Enlace personal:</strong> <a href="${shareUrl}" target="_blank" style="color: var(--color-antique-rose-dark);">${shareUrl}</a></p>
          <button type="button" class="btn-outline-gold" style="font-size: 0.75rem; padding: 0.4rem 1rem;" onclick="navigator.clipboard.writeText('${shareUrl}').then(() => alert('¡Enlace copiado al portapapeles!'))">Copiar Enlace</button>
        </div>
      `;
    });
  }
});
