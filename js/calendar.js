/**
 * ===================================================================
 * J & M — THE WEDDING EXPERIENCE
 * Save the Date / Calendar Controller (Guardar la Fecha)
 * ===================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
  const btnGoogle = document.getElementById("btn-add-google-cal");
  const btnIcs = document.getElementById("btn-download-ics");

  const config = window.WEDDING_CONFIG || {};
  const couple = config.couple || {};
  const venue = config.venue || {};

  const title = `Casamiento de ${couple.names || 'Juliana & Marcos'}`;
  const description = `¡Nos casamos! Te esperamos para celebrar nuestra noche especial en Av. Crisólogo Larralde 1050, Crucecita (Ref. Shopping de Avellaneda). Vestimenta: Elegante.`;
  const location = venue.address || "Av. Crisólogo Larralde 1050, B1873 Crucecita, Provincia de Buenos Aires, Argentina";

  // Fecha 06/11/2027 21:00 a 07/11/2027 05:00 UTC-3
  // En formato UTC (Z): 21:00 UTC-3 equivale a 20271107T000000Z
  const startUtc = "20271107T000000Z";
  const endUtc = "20271107T080000Z";

  // 1. Google Calendar
  if (btnGoogle) {
    btnGoogle.addEventListener("click", () => {
      const gcalUrl = new URL("https://calendar.google.com/calendar/render");
      gcalUrl.searchParams.set("action", "TEMPLATE");
      gcalUrl.searchParams.set("text", title);
      gcalUrl.searchParams.set("dates", `${startUtc}/${endUtc}`);
      gcalUrl.searchParams.set("details", description);
      gcalUrl.searchParams.set("location", location);
      gcalUrl.searchParams.set("ctz", "America/Argentina/Buenos_Aires");

      window.open(gcalUrl.toString(), "_blank", "noopener,noreferrer");
    });
  }

  // 2. Archivo Estándar iCalendar (.ics)
  if (btnIcs) {
    btnIcs.addEventListener("click", () => {
      const icsContent = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//J & M Wedding Experience//ES",
        "CALSCALE:GREGORIAN",
        "METHOD:PUBLISH",
        "BEGIN:VTIMEZONE",
        "TZID:America/Argentina/Buenos_Aires",
        "BEGIN:STANDARD",
        "DTSTART:19700101T000000",
        "TZOFFSETFROM:-0300",
        "TZOFFSETTO:-0300",
        "TZNAME:-03",
        "END:STANDARD",
        "END:VTIMEZONE",
        "BEGIN:VEVENT",
        `UID:wedding-jm-20271106@invitacion`,
        `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").split(".")[0]}Z`,
        "DTSTART;TZID=America/Argentina/Buenos_Aires:20271106T210000",
        "DTEND;TZID=America/Argentina/Buenos_Aires:20271107T050000",
        `SUMMARY:${title}`,
        `DESCRIPTION:${description.replace(/\n/g, "\\n")}`,
        `LOCATION:${location}`,
        "STATUS:CONFIRMED",
        "BEGIN:VALARM",
        "TRIGGER:-P1D",
        "ACTION:DISPLAY",
        "DESCRIPTION:¡Mañana es el casamiento de Juliana & Marcos!",
        "END:VALARM",
        "END:VEVENT",
        "END:VCALENDAR"
      ].join("\r\n");

      const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "Casamiento_Juliana_y_Marcos.ics";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }
});
