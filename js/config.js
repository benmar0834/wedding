/**
 * ===================================================================
 * J & M — THE WEDDING EXPERIENCE
 * Archivo de Configuración Centralizada del Casamiento
 * ===================================================================
 * Toda la información, fechas, textos, imágenes y configuraciones
 * del sitio web se centralizan aquí para facilitar modificaciones futuras.
 */

const WEDDING_CONFIG = {
  // 1. INFORMACIÓN OFICIAL DE LA BODA
  couple: {
    monogram: "J & M",
    brideName: "Juliana",
    groomName: "Marcos",
    brideInitials: "J",
    groomInitials: "M",
    names: "Juliana & Marcos",
    monogramDisplay: "J & M",
    fullName: "Juliana & Marcos",
    subtitle: "El comienzo de una nueva historia"
  },

  // Fecha y hora oficial: 6 de Noviembre de 2027 a las 21:00 hs
  event: {
    // Formato ISO con zona horaria de Argentina (UTC-3)
    targetDateTime: "2027-11-06T21:00:00-03:00",
    dateFormatted: "06/11/2027",
    dayName: "Sábado",
    timeFormatted: "21:00 hs",
    timezone: "America/Argentina/Buenos_Aires",
    year: 2027,
    month: 11,
    day: 6
  },

  // 2. LUGAR Y DIRECCIÓN
  venue: {
    title: "El lugar donde celebraremos nuestra historia",
    name: "Salón de Eventos",
    address: "Av. Crisólogo Larralde 1050, B1873 Crucecita, Provincia de Buenos Aires",
    reference: "Shopping de Avellaneda",
    city: "Avellaneda, Buenos Aires, Argentina",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Av.+Cris%C3%B3logo+Larralde+1050,+B1873+Crucecita,+Provincia+de+Buenos+Aires",
    wazeUrl: "https://waze.com/ul?q=Av.+Cris%C3%B3logo+Larralde+1050+Avellaneda",
    // Embed interactivo centrado en Av. Crisólogo Larralde 1050
    embedMapUrl: "https://maps.google.com/maps?q=Av.%20Cris%C3%B3logo%20Larralde%201050%2C%20B1873%20Crucecita%2C%20Provincia%20de%20Buenos%20Aires&t=&z=16&ie=UTF8&iwloc=&output=embed"
  },

  // 3. DRESS CODE
  dressCode: {
    title: "Una noche para brillar",
    code: "ELEGANTE",
    description: "Te invitamos a vestir de gala formal para celebrar esta noche inolvidable. Traje o esmoquin formal para los caballeros y vestido largo o de fiesta elegante para las damas.",
    recommendations: [
      {
        title: "Ellas",
        text: "Vestido largo o midi elegante, tonos sofisticados o florales. ¡No olvides calzado cómodo para bailar toda la noche!"
      },
      {
        title: "Ellos",
        text: "Traje formal con corbata o moño, camisa clásica y zapatos de vestir."
      }
    ],
    image: "assets/images/dress-code.jpg"
  },

  // 4. MÚSICA OFICIAL
  music: {
    title: "All of Me",
    artist: "John Legend",
    localAudioUrl: "assets/music.mp3",
    durationFormatted: "4:14",
    autoplayPrompt: "Hacé clic en el sobre para abrir la invitación y comenzar la música"
  },

  // 5. CARTA DE BIENVENIDA
  welcomeLetter: {
    greeting: "Hay momentos en la vida que se vuelven inolvidables no solamente por lo que sucede, sino por las personas con quienes tenemos la suerte de compartirlos.",
    paragraphs: [
      "Hoy estamos a punto de comenzar uno de los capítulos más hermosos de nuestra historia, y no imaginamos vivirlo sin las personas que forman parte de nuestras vidas.",
      "Por eso, queremos invitarte a ser parte de una noche muy especial. Una noche llena de amor, sonrisas, abrazos, música y recuerdos que esperamos guardar para siempre en nuestro corazón.",
      "Cada persona que nos acompaña tiene un lugar único en nuestra historia, y sería una alegría inmensa poder compartir este momento con vos.",
      "Preparamos esta noche con muchísimo cariño, soñando con cada detalle y esperando que también se convierta en un recuerdo inolvidable para quienes nos acompañen.",
      "Porque las historias más lindas no se celebran en soledad, sino rodeados de quienes queremos."
    ],
    signaturePrefix: "Con todo nuestro cariño,",
    signature: "J & M",
    closing: "¡Te esperamos para celebrar el comienzo de nuestra nueva aventura!"
  },

  // 6. HISTORIA DE AMOR — TIMELINE
  story: [
    {
      year: "2021",
      date: "14/02/2021",
      title: "Cómo nos conocimos",
      description: "Una tarde cualquiera que cambió nuestras vidas para siempre. Una mirada cómplice, una charla interminable de café y la certeza inmediata de haber encontrado a la persona indicada.",
      image: "assets/images/story-first-date.jpg"
    },
    {
      year: "2021",
      date: "28/03/2021",
      title: "Nuestra primera cita",
      description: "Caminamos por las callecitas de la ciudad sin notar el paso de las horas. Entre risas, anécdotas compartidas y un helado artesanal, supimos que esto era apenas el comienzo.",
      image: "assets/images/story-first-date.jpg"
    },
    {
      year: "2023",
      date: "15/09/2023",
      title: "Recuerdos inolvidables",
      description: "Viajes, proyectos compartidos, aprender a armar un hogar y descubrir que juntos cualquier día común se convierte en una fiesta de felicidad y compañerismo.",
      image: "assets/images/gallery-2.jpg"
    },
    {
      year: "2025",
      date: "20/12/2025",
      title: "El compromiso",
      description: "Con el atardecer dorado de fondo y el corazón latiendo a mil, llegó la gran pregunta. Un '¡Sí, quiero!' entre lágrimas de emoción que selló nuestra promesa eterna.",
      image: "assets/images/story-proposal.jpg"
    },
    {
      year: "2027",
      date: "06/11/2027",
      title: "Nuestro futuro juntos",
      description: "El día en que celebramos nuestro amor rodeados de las personas que más queremos en el mundo. El capítulo más mágico que estamos listos para escribir junto a vos.",
      image: "assets/images/couple-hero.jpg"
    }
  ],

  // 7. GALERÍAS DE FOTOS
  galleries: {
    memories: [
      {
        src: "assets/images/couple-hero.jpg",
        caption: "Nuestros días más felices",
        tag: "Editorial"
      },
      {
        src: "assets/images/scratch-reveal.jpg",
        caption: "Cómplices de cada sonrisa",
        tag: "Amor"
      },
      {
        src: "assets/images/story-first-date.jpg",
        caption: "Caminando juntos siempre",
        tag: "Paseos"
      },
      {
        src: "assets/images/story-proposal.jpg",
        caption: "El atardecer en que dijimos sí",
        tag: "Compromiso"
      }
    ],
    venue: [
      {
        src: "assets/images/salon1.webp",
        caption: "El gran salón donde celebraremos nuestra noche soñada",
        tag: "Principal"
      },
      {
        src: "assets/images/salon2.webp",
        caption: "Iluminación cálida y ambientación exclusiva",
        tag: "Recepción"
      },
      {
        src: "assets/images/salon3.webp",
        caption: "Espacio amplio para brindar y festejar juntos",
        tag: "Celebración"
      },
      {
        src: "assets/images/salon4.webp",
        caption: "Pista y detalles preparados para bailar toda la noche",
        tag: "Fiesta"
      },
      {
        src: "assets/images/salon5.webp",
        caption: "Un escenario mágico a metros del Shopping de Avellaneda",
        tag: "Espacio"
      }
    ]
  },

  // 8. RASPÁ PARA DESCUBRIR (SCRATCH CARD)
  scratchCard: {
    overlayColor: "linear-gradient(135deg, #ECC665 0%, #D4AF37 50%, #B8860B 100%)",
    instruction: "Raspá suavemente con tu dedo o cursor para descubrir la sorpresa ✨",
    revealMessage: "¡Nos casamos! Y queremos compartir esta noche tan especial con vos.",
    hiddenImage: "assets/images/scratch-reveal.jpg",
    threshold: 0.45 // porcentaje de raspado requerido para revelar automáticamente
  },

  // 9. REGALOS / TRANSFERENCIA (TRADICIÓN ARGENTINA)
  gifts: {
    title: "Muestra de Cariño",
    subtitle: "El mejor regalo es tu presencia y compartir esta noche con nosotros. Si deseás hacernos un presente para nuestra luna de miel, podés hacerlo a través de nuestra cuenta:",
    bank: "Banco Galicia",
    alias: "BODA.JULI.MARCOS",
    cbu: "0070043630004018291054",
    holder: "J & M",
    copySuccessMessage: "¡CBU copiado al portapapeles!"
  },

  // 10. CALENDARIO
  calendar: {
    title: "Casamiento de J & M",
    description: "¡Nos casamos! Celebramos nuestro casamiento en Av. Crisólogo Larralde 1050, Crucecita, Buenos Aires (Ref. Shopping de Avellaneda). ¡Te esperamos para una noche inolvidable!",
    location: "Av. Crisólogo Larralde 1050, B1873 Crucecita, Provincia de Buenos Aires, Argentina",
    startIso: "20271106T210000",
    endIso: "20271107T050000"
  },

  // 11. BASE DE DATOS SUPABASE & FALLBACK
  supabase: {
    url: "https://your-supabase-project.supabase.co",
    anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder",
    // Base de datos local automática para que funcione de inmediato al 100%
    useLocalStorageFallback: true,
    storageKeyRsvp: "jm_wedding_rsvps_v1",
    storageKeyGuestbook: "jm_wedding_guestbook_v1",
    storageKeyCodes: "jm_wedding_guest_codes_v1"
  },

  // 12. CÓDIGOS DE INVITACIÓN PRE-CONFIGURADOS (Demostración y personalización)
  guestCodes: {
    "FAMILIA-PEREZ": { name: "Familia Pérez", maxGuests: 4 },
    "MARTIN-GARCIA": { name: "Martín García", maxGuests: 2 },
    "LUCIA-SANCHEZ": { name: "Lucía Sánchez", maxGuests: 1 },
    "TEST-VIP": { name: "Invitado Especial", maxGuests: 2 }
  },

  // 13. PANEL DE ADMINISTRACIÓN
  admin: {
    // PIN de acceso al panel privado (se puede cambiar)
    pin: "2027",
    sessionKey: "jm_admin_session_auth"
  }
};

// Congelamos la configuración para evitar mutaciones accidentales
if (typeof Object.freeze === "function") {
  Object.freeze(WEDDING_CONFIG);
}

// Exportación compatible tanto con módulos ES como scripts globales
if (typeof module !== "undefined" && module.exports) {
  module.exports = WEDDING_CONFIG;
}
