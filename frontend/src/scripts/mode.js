// theme mode switching (pro vs simple)import { showToast } from './toast.js';
import { STATE } from "./store.js";
import { renderDashboard } from "../pages/dashboard.js";
export const MODE_KEY = "flowra_mode";
let _currentMode = localStorage.getItem(MODE_KEY) || "pro";

export function applyMode(mode, animate) {
  _currentMode = mode;
  localStorage.setItem(MODE_KEY, mode);
  const body = document.body;
  const slider = document.getElementById("mode-pill-slider");
  const pillPro = document.getElementById("pill-pro");
  const pillSimple = document.getElementById("pill-simple");
  const label = document.getElementById("mode-label-sub");

  if (mode === "simple") {
    body.classList.add("mode-simple");
    if (slider) {
      slider.classList.remove("on-pro");
      slider.classList.add("on-simple");
    }
    if (pillPro) pillPro.classList.remove("active");
    if (pillSimple) pillSimple.classList.add("active");
    if (label) label.textContent = "AI-First Mode";
  } else {
    body.classList.remove("mode-simple");
    if (slider) {
      slider.classList.add("on-pro");
      slider.classList.remove("on-simple");
    }
    if (pillPro) pillPro.classList.add("active");
    if (pillSimple) pillSimple.classList.remove("active");
    if (label) label.textContent = "Developer Mode";
  }

  if (animate) {
    showToast(
      mode === "simple"
        ? "✨ Switched to Easy Mode"
        : "⚡ Switched to Pro Mode",
      "info",
    );
    body.style.transition = "background 0.4s ease, color 0.3s ease";
  }

  const mobLabel = document.getElementById("mob-mode-label");
  if (mobLabel)
    mobLabel.textContent =
      mode === "simple" ? "✨ Easy Mode Active" : "⚡ Pro Mode Active";

  const mobPro = document.getElementById("mob-pill-pro");
  const mobSimple = document.getElementById("mob-pill-simple");
  if (mobPro && mobSimple) {
    if (mode === "simple") {
      mobPro.style.cssText =
        "flex:1;text-align:center;font-size:11.5px;font-weight:700;padding:5px;border-radius:100px;color:var(--text-muted)";
      mobSimple.style.cssText =
        "flex:1;text-align:center;font-size:11.5px;font-weight:700;padding:5px;border-radius:100px;background:linear-gradient(135deg,#7c3aed,#5b21b6);color:white;";
    } else {
      mobPro.style.cssText =
        "flex:1;text-align:center;font-size:11.5px;font-weight:700;padding:5px;border-radius:100px;background:linear-gradient(135deg,#FF6B35,#c0520a);color:white;";
      mobSimple.style.cssText =
        "flex:1;text-align:center;font-size:11.5px;font-weight:700;padding:5px;border-radius:100px;color:var(--text-muted)";
    }
  }

  if (STATE.currentPage === "dashboard") renderDashboard();
}

export function toggleMode() {
  applyMode(_currentMode === "simple" ? "pro" : "simple", true);
}

export function isSimpleMode() {
  return _currentMode === "simple";
}
