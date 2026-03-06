import { STATE } from "../scripts/store.js";
import { showToast } from "../scripts/toast.js";

export function updateNotifBadge() {
  const unread = STATE.notifications.filter((n) => !n.read).length;
  const badge = document.getElementById("notif-badge");
  if (badge) {
    badge.textContent = unread;
    badge.style.display = unread > 0 ? "inline-flex" : "none";
  }
}

export function renderNotifications() {
  const c = document.getElementById("notifs-list");
  if (!c) return;
  c.innerHTML = STATE.notifications
    .map(
      (n, i) => `
    <div class="glass p-4 flex items-start gap-3 glass-hover ${n.read ? "" : "notif-unread"}">
      <div class="text-xl flex-shrink-0">${n.type === "error" ? "❌" : n.type === "success" ? "✅" : "ℹ️"}</div>
      <div class="flex-1 min-w-0">
        <div class="text-sm font-semibold" style="color:var(--text-primary);">${n.title}</div>
        <div class="text-xs mt-1" style="color:var(--text-secondary);">${n.body}</div>
        <div class="text-xs mt-1" style="color:var(--text-muted);">${n.time}</div>
      </div>
      ${!n.read ? `<button onclick="markRead(${i})" class="btn btn-ghost" style="padding:4px 10px;font-size:11px;flex-shrink:0;">Mark read</button>` : ""}
    </div>`,
    )
    .join("");
  updateNotifBadge();
}

export function markRead(i) {
  STATE.notifications[i].read = true;
  renderNotifications();
  updateNotifBadge();
}
export function markAllRead() {
  STATE.notifications.forEach((n) => (n.read = true));
  renderNotifications();
  updateNotifBadge();
  showToast("All marked as read", "info");
}
