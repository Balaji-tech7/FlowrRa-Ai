import { Toast } from "../components/components.js";
import { STATE } from "./store.js";

let activeTimeout;

export function showToast(msg, type = "success", duration = 3000) {
  clearTimeout(activeTimeout);
  const container = document.getElementById("toast-container");
  if (!container) return;
  container.innerHTML = "";
  const t = Toast(msg, type);
  container.appendChild(t);
  container.classList.add("visible");
  activeTimeout = setTimeout(() => {
    container.classList.remove("visible");
    container.innerHTML = "";
  }, duration);
}

export function initToast() {
  if (!document.getElementById("toast-container")) {
    const c = document.createElement("div");
    c.id = "toast-container";
    document.body.appendChild(c);
  }
}
