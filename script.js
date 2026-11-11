// Concatena le voci del percorso come una piccola hash chain (SHA-256, calcolato nel browser).
// La voce più vecchia è il blocco genesi; ogni hash include quello della voce precedente.
(() => {
  "use strict";

  if (!window.crypto || !crypto.subtle || !window.TextEncoder) return;

  const GENESIS = "0".repeat(64);
  const SHORT = 12;
  const blocks = Array.from(document.querySelectorAll(".chain .block")).reverse(); // dalla più vecchia
  const button = document.querySelector(".tamper");
  const note = document.querySelector(".chain-note");
  const status = document.querySelector(".verify");
  if (!blocks.length) return;

  const originals = blocks.map((b) => b.querySelector(".content").innerHTML);
  let reference = [];

  const normalise = (el) => el.textContent.replace(/\s+/g, " ").trim();

  async function sha256(text) {
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
    return Array.from(new Uint8Array(buf), (x) => x.toString(16).padStart(2, "0")).join("");
  }

  async function computeChain() {
    const out = [];
    let prev = GENESIS;
    for (const block of blocks) {
      const hash = await sha256(prev + "\n" + normalise(block.querySelector(".content")));
      out.push({ prev, hash });
      prev = hash;
    }
    return out;
  }

  function hashLine(block) {
    let line = block.querySelector(".hash");
    if (!line) {
      line = document.createElement("p");
      line.className = "hash";
      line.setAttribute("aria-hidden", "true");
      block.appendChild(line);
    }
    return line;
  }

  function render(current) {
    let firstBroken = -1;
    blocks.forEach((block, i) => {
      const ref = reference[i];
      const now = current[i];
      const broken = now.hash !== ref.hash;
      if (broken && firstBroken < 0) firstBroken = i;
      block.classList.toggle("is-broken", broken);

      const line = hashLine(block);
      line.textContent = "";
      line.append("prev ");
      const p = document.createElement("b");
      p.textContent = ref.prev.slice(0, SHORT);
      line.append(p, "   hash ");
      const h = document.createElement("b");
      h.textContent = ref.hash.slice(0, SHORT);
      line.append(h);
      if (broken) {
        const n = document.createElement("span");
        n.className = "now";
        n.textContent = " " + now.hash.slice(0, SHORT);
        line.append(n);
      }
    });

    if (firstBroken < 0) {
      status.classList.remove("is-broken");
      status.textContent = `Percorso verificato: ${blocks.length} voci concatenate con SHA-256, calcolato ora nel tuo browser.`;
    } else {
      const title = normalise(blocks[firstBroken].querySelector("h3") || blocks[firstBroken]);
      status.classList.add("is-broken");
      status.textContent = `Catena interrotta a partire da “${title}”: ${blocks.length - firstBroken} voci non corrispondono più.`;
    }
  }

  let pending = 0;
  async function refresh() {
    const ticket = ++pending;
    const current = await computeChain();
    if (ticket === pending) render(current);
  }

  function setEditing(on) {
    button.setAttribute("aria-pressed", String(on));
    button.textContent = on ? "Ripristina l’originale" : "Prova a modificarlo";
    blocks.forEach((block, i) => {
      const content = block.querySelector(".content");
      if (on) {
        content.setAttribute("contenteditable", "true");
        content.setAttribute("spellcheck", "false");
      } else {
        content.removeAttribute("contenteditable");
        content.innerHTML = originals[i];
      }
    });
    refresh();
  }

  (async () => {
    reference = await computeChain();
    render(reference);
    button.hidden = false;
    note.hidden = false;
    button.addEventListener("click", () => setEditing(button.getAttribute("aria-pressed") !== "true"));
    document.querySelector(".chain").addEventListener("input", refresh);
  })();
})();
