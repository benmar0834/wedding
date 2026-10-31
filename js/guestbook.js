/**
 * ===================================================================
 * J & M — THE WEDDING EXPERIENCE
 * Digital Guestbook Controller (Libro de Firmas y Deseos)
 * ===================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("guestbook-form");
  const messagesGrid = document.getElementById("guestbook-messages-grid");
  const nameInput = document.getElementById("guestbook-name");
  const messageInput = document.getElementById("guestbook-message");
  const alertBox = document.getElementById("guestbook-alert");

  if (!form || !messagesGrid) return;

  const config = window.WEDDING_CONFIG || {};
  const storageKey = (config.supabase && config.supabase.storageKeyGuestbook) || "jm_wedding_guestbook_v1";

  // Mensajes de bienvenida pre-cargados
  const defaultMessages = [
    {
      id: "msg_init_1",
      name: "Tía Marcela y Familia",
      message: "¡Qué emoción tan grande verlos dar este paso! Son una pareja maravillosa. ¡Que Dios bendiga su unión siempre!",
      date: "28/10/2026",
      approved: true
    },
    {
      id: "msg_init_2",
      name: "Facu y Sofi",
      message: "¡Amigos queridos! No vemos la hora de que llegue el 6 de noviembre para romper la pista y brindar por su felicidad.",
      date: "30/10/2026",
      approved: true
    }
  ];

  function getMessages() {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error("Error reading guestbook:", e);
    }
    // Inicializar con los mensajes por defecto
    localStorage.setItem(storageKey, JSON.stringify(defaultMessages));
    return defaultMessages;
  }

  function saveMessages(msgs) {
    localStorage.setItem(storageKey, JSON.stringify(msgs));
  }

  function renderMessages() {
    const messages = getMessages();
    messagesGrid.innerHTML = "";

    // Filtrar sólo aprobados para la vista pública
    const approvedList = messages.filter(m => m.approved !== false);

    if (approvedList.length === 0) {
      messagesGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; color: var(--color-text-muted); font-style: italic; padding: 2rem;">
          Sé el primero en dejarle un mensaje lleno de cariño a Juliana y Marcos.
        </div>
      `;
      return;
    }

    approvedList.forEach(item => {
      const card = document.createElement("div");
      card.className = "guestbook-message-card";
      card.innerHTML = `
        <p class="guestbook-msg-text">"${item.message}"</p>
        <div class="guestbook-msg-author">${item.name}</div>
        <div class="guestbook-msg-date">${item.date}</div>
      `;
      messagesGrid.appendChild(card);
    });
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = nameInput.value.trim();
    const message = messageInput.value.trim();

    if (!name || !message) {
      if (alertBox) {
        alertBox.textContent = "Por favor, completá tu nombre y tu mensaje.";
        alertBox.style.display = "block";
      }
      return;
    }

    const newMsg = {
      id: "msg_" + Date.now(),
      name,
      message,
      date: new Date().toLocaleDateString("es-AR"),
      approved: true // Visible inmediatamente con moderación disponible en el panel
    };

    const msgs = getMessages();
    msgs.unshift(newMsg);
    saveMessages(msgs);

    if (alertBox) {
      alertBox.textContent = "¡Muchas gracias! Tu mensaje ya se encuentra en el libro de firmas.";
      alertBox.style.display = "block";
      alertBox.className = "rsvp-alert success";
      setTimeout(() => { alertBox.style.display = "none"; }, 4000);
    }

    form.reset();
    renderMessages();
  });

  // Exponer render para que el panel de administración pueda actualizarlo si modera
  window.refreshGuestbook = renderMessages;

  renderMessages();
});
