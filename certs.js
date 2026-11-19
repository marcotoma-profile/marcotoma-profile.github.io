// Carica certifications.json. Ogni voce è una certificazione: il campo "type" non serve.
// Se però una voce ha un type diverso da "certification" (es. dati importati in futuro da Microsoft Learn,
// con badge ed esami mescolati) viene scartata. Le scadute restano, marcate come tali.
window.Certs = (() => {
  "use strict";

  const VERIFY_HOSTS = ["learn.microsoft.com"];
  const DATE = /^\d{4}-\d{2}-\d{2}$/;
  const MONTH = /^\d{4}-\d{2}$/;
  const MONTHS = ["gen", "feb", "mar", "apr", "mag", "giu", "lug", "ago", "set", "ott", "nov", "dic"];

  const today = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  };

  function addDays(iso, days) {
    const [y, m, d] = iso.split("-").map(Number);
    const t = new Date(Date.UTC(y, m - 1, d + days));
    return t.toISOString().slice(0, 10);
  }

  function safeUrl(value) {
    if (typeof value !== "string" || !value) return null;
    try {
      const url = new URL(value);
      return url.protocol === "https:" && VERIFY_HOSTS.includes(url.hostname) ? url.href : null;
    } catch (e) {
      return null;
    }
  }

  function formatMonth(value) {
    if (typeof value !== "string") return "";
    const [y, m] = value.split("-");
    const i = Number(m) - 1;
    return i >= 0 && i < 12 ? `${MONTHS[i]} ${y}` : "";
  }

  function formatDay(value) {
    if (typeof value !== "string") return "";
    const [y, m, d] = value.split("-");
    return `${Number(d)} ${formatMonth(`${y}-${m}`)}`;
  }

  // "Microsoft Certified: Identity and Access Administrator Associate" → "Identity and Access Administrator Associate"
  const shortName = (name) => name.replace(/^Microsoft Certified:\s*/i, "");

  async function load(path = "certifications.json") {
    const empty = { valid: [], planned: [], transcript: null };
    let data;
    try {
      const res = await fetch(path, { cache: "no-cache" });
      if (!res.ok) return empty;
      data = await res.json();
    } catch (e) {
      return empty;
    }
    const list = Array.isArray(data && data.certifications) ? data.certifications : [];
    const now = today();
    const valid = [];
    const planned = [];

    for (const c of list) {
      if (!c || typeof c.name !== "string" || !c.name.trim()) continue;
      if (c.type !== undefined && c.type !== "certification") {
        console.info(`Ignorato “${c.name}”: tipo ${c.type}, non è una certificazione.`);
        continue;
      }
      const code = typeof c.code === "string" ? c.code.trim() : "";

      if (c.status === "planned") {
        if (data.showPlanned === true) planned.push({ name: c.name.trim(), short: shortName(c.name.trim()), code, target: MONTH.test(c.target || "") ? c.target : "" });
        continue;
      }
      if (!DATE.test(c.earned || "")) continue;
      if (c.expires && !DATE.test(c.expires)) continue;
      const expired = Boolean(c.expires && c.expires < now);
      // Il rinnovo Microsoft si apre nei 180 giorni prima della scadenza.
      const renewFrom = c.expires ? addDays(c.expires, -180) : null;
      const renewOpen = Boolean(c.expires && !expired && renewFrom <= now);

      valid.push({
        expired,
        renewOpen,
        name: c.name.trim(),
        short: shortName(c.name.trim()),
        code,
        earned: c.earned,
        expires: c.expires || null,
        verify: safeUrl(c.verify),
      });
    }

    // Prima le valide, poi le scadute; dentro ciascun gruppo dalla più recente.
    valid.sort((a, b) => (a.expired - b.expired) || b.earned.localeCompare(a.earned));
    return { valid, planned, transcript: safeUrl(data.transcript) };
  }

  return { load, formatMonth, formatDay };
})();
