// Applica il tema salvato prima del primo rendering, poi gestisce il pulsante.
(() => {
  "use strict";
  const root = document.documentElement;
  let saved = null;
  try { saved = localStorage.getItem("theme"); } catch (e) { /* storage non disponibile */ }
  if (saved === "light" || saved === "dark") root.dataset.theme = saved;

  const current = () =>
    root.dataset.theme || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

  document.addEventListener("DOMContentLoaded", () => {
    const btn = document.querySelector(".theme");
    if (!btn) return;
    const label = btn.querySelector(".theme-label");
    const sync = () => { label.textContent = current() === "dark" ? "Tema chiaro" : "Tema scuro"; };
    sync();
    btn.addEventListener("click", () => {
      const next = current() === "dark" ? "light" : "dark";
      root.dataset.theme = next;
      try { localStorage.setItem("theme", next); } catch (e) { /* ignora */ }
      sync();
    });
  });
})();
