// central navigation logic
import { renderDashboard } from "../pages/dashboard.js";
import { renderWorkflows } from "../pages/workflows.js";
import { renderBuilder } from "../pages/builder.js";
import { renderMarketplace } from "../pages/marketplace.js";
import { renderPublishPage } from "../pages/publish.js";
import { renderLogs } from "../pages/logs.js";
import { renderNotifications } from "../pages/notifications.js";
import { renderTeam } from "../pages/team.js";
import { renderSettings } from "../pages/settings.js";
import { renderProfile } from "../pages/profile.js";
import { renderAndrea } from "../pages/andrea.js";
import { initDebugger } from "../pages/debugger.js";
import { STATE } from "./store.js";

const PAGE_TITLES = {
  dashboard: "Dashboard",
  workflows: "Workflows",
  builder: "Builder",
  templates: "Marketplace",
  publish: "Publish",
  andrea: "Bruce Wayne AI",
  debugger: "Code Debugger",
  logs: "Exec Logs",
  notifications: "Notifications",
  team: "Team",
  settings: "Settings",
  profile: "Profile",
};

export function navigateTo(page) {
  document
    .querySelectorAll(".page")
    .forEach((p) => p.classList.remove("active"));
  document
    .querySelectorAll(".nav-item")
    .forEach((n) => n.classList.remove("active"));
  const pageEl = document.getElementById(`page-${page}`);
  if (pageEl) pageEl.classList.add("active");
  document
    .querySelectorAll(`[data-page="${page}"]`)
    .forEach((n) => n.classList.add("active"));
  STATE.currentPage = page;
  syncMobileNav(page);
  const footer = document.getElementById("flora-footer");
  if (footer) {
    const showOn = [
      "dashboard",
      "workflows",
      "settings",
      "profile",
      "team",
      "notifications",
    ];
    footer.style.display = showOn.includes(page) ? "flex" : "none";
  }

  // Page init
  if (page === "dashboard") renderDashboard();
  if (page === "workflows") renderWorkflows();
  if (page === "builder") renderBuilder();
  if (page === "templates") renderMarketplace();
  if (page === "logs") renderLogs();
  if (page === "notifications") renderNotifications();
  if (page === "team") renderTeam();
  if (page === "settings") renderSettings();
  if (page === "profile") renderProfile();
  if (page === "andrea") renderAndrea();
  if (page === "publish") renderPublishPage();
  if (page === "debugger") initDebugger();
}

function syncMobileNav(page) {
  const titleEl = document.getElementById("mob-page-title");
  if (titleEl) titleEl.textContent = PAGE_TITLES[page] || "";
  document.querySelectorAll(".mob-nav-btn").forEach((b) => {
    b.classList.toggle("active", b.dataset.mobBottom === page);
  });
  document.querySelectorAll("[data-mob-page]").forEach((b) => {
    b.classList.toggle("active", b.dataset.mobPage === page);
  });
  if (STATE.user) {
    const av = document.getElementById("mob-drawer-avatar");
    const nm = document.getElementById("mob-drawer-name");
    const em = document.getElementById("mob-drawer-email");
    const name = STATE.user.name || STATE.user.email.split("@")[0] || "";
    if (av) av.textContent = name[0] || "";
    if (nm) nm.textContent = name;
    if (em) em.textContent = STATE.user.email || "";
  }
}
