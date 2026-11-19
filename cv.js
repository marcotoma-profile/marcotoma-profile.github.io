(() => {
  "use strict";

  // Indirizzo del sito: usa il dominio da cui la pagina è servita.
  const host = document.querySelector(".site-host");
  if (host && location.protocol === "https:" && location.host) host.textContent = location.host;

  // Telefono: solo nella pagina aperta, non salvato da nessuna parte.
  const tel = document.getElementById("tel");
  const phone = document.querySelector(".contact .phone");
  if (tel && phone) {
    tel.addEventListener("input", () => {
      const v = tel.value.trim();
      phone.querySelector("span").textContent = v;
      phone.hidden = !v;
    });
  }

  const btn = document.getElementById("print");
  if (btn) btn.addEventListener("click", () => window.print());

  // Certificazioni dalla stessa fonte del sito.
  (async () => {
    if (!window.Certs) return;
    const wrap = document.querySelector(".certs-wrap");
    const list = wrap && wrap.querySelector(".certs-side");
    if (!list) return;
    const { valid, planned } = await Certs.load();
    if (!valid.length && !planned.length) return;

    const item = (c, when, cls) => {
      const li = document.createElement("li");
      if (cls) li.className = cls;
      const code = document.createElement("span");
      code.className = "code";
      code.textContent = c.code || "MS";
      const name = document.createElement("span");
      name.textContent = c.short;
      const w = document.createElement("span");
      w.className = "when";
      w.textContent = when;
      li.append(code, name, w);
      return li;
    };
    for (const c of valid) {
      const when = !c.expires
        ? `Dal ${Certs.formatMonth(c.earned)}`
        : c.expired
          ? `Scaduta a ${Certs.formatMonth(c.expires)}`
          : `${Certs.formatMonth(c.earned)} – ${Certs.formatMonth(c.expires)}`;
      list.append(item(c, when, c.expired ? "expired" : ""));
    }

    // Promemoria solo a schermo, nella barra in alto: non finisce nel PDF.
    const due = valid.filter((c) => c.renewOpen || c.expired);
    const bar = document.querySelector(".toolbar");
    if (due.length && bar) {
      const note = document.createElement("p");
      note.className = "reminder";
      note.textContent = "Promemoria: " + due.map((c) =>
        c.expired
          ? `${c.code || c.short} è scaduta il ${Certs.formatDay(c.expires)}, serve rifare l’esame`
          : `${c.code || c.short} scade il ${Certs.formatDay(c.expires)}, il rinnovo è già disponibile su Microsoft Learn`
      ).join(" · ");
      bar.append(note);
    }
    for (const c of planned) {
      list.append(item(c, c.target ? `In preparazione, esame ${Certs.formatMonth(c.target)}` : "In preparazione", "planned"));
    }
    wrap.hidden = false;
    document.body.classList.add("has-certs");
  })();
})();
