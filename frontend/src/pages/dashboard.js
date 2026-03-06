import { STATE } from "../scripts/store.js";
import { escHtml, tick } from "../scripts/utils.js";
import { showToast } from "../scripts/toast.js";

export async function renderDashboard() {
  // fetch latest workflows from server if we have a token
  const token = STATE.user?.token || null;
  if (token) {
    try {
      const resp = await fetch("/workflows", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await resp.json();
      if (resp.ok && json.success) {
        STATE.workflows = json.data || [];
      } else {
        console.warn("could not load workflows", json);
      }
    } catch (e) {
      console.error("fetch workflows", e);
      showToast("Unable to load workflows", "error");
    }
  }

  const el = (id) => document.getElementById(id);
  const total = STATE.workflows.length;
  const active = STATE.workflows.filter((w) => w.status === "active").length;
  const runs = STATE.workflows.reduce((a, w) => a + w.runs, 0);
  const success = STATE.execLogs.length
    ? Math.round(
        (STATE.execLogs.filter((l) => l.status === "success").length /
          STATE.execLogs.length) *
          100,
      )
    : 0;

  if (el("dash-greeting"))
    el("dash-greeting").textContent =
      `${getGreeting()}, ${STATE.user?.name?.split(" ")[0] || ""}!`;
  if (el("simple-dash-greeting"))
    el("simple-dash-greeting").textContent =
      `${getGreeting()}, ${STATE.user?.name?.split(" ")[0] || ""}! 👋`;
  if (el("stat-total")) el("stat-total").textContent = total;
  if (el("stat-active")) el("stat-active").textContent = active;
  if (el("stat-runs")) el("stat-runs").textContent = runs;
  if (el("stat-success")) el("stat-success").textContent = success + "%";
  if (el("stat-total-bar"))
    el("stat-total-bar").style.width = Math.min(100, total * 20) + "%";
  if (el("stat-active-bar"))
    el("stat-active-bar").style.width = total
      ? (active / total) * 100 + "%"
      : "0%";

  const rw = el("recent-workflows");
  if (rw)
    rw.innerHTML = STATE.workflows
      .slice(0, 4)
      .map(
        (w) => `
    <div class="flex items-center gap-3 p-3 rounded-xl transition cursor-pointer hover-wf" onclick="editWorkflow('${w.id}')" style="border:1px solid var(--border);background:rgba(255,255,255,0.02);transition:all .2s ease;" onmouseover="this.style.borderColor='var(--border-accent)'" onmouseout="this.style.borderColor='var(--border)'>
      <div class="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style="background:rgba(255,107,53,0.08);">
        <span style="font-size:14px;">⚡</span>
      </div>
      <div class="flex-1 min-w-0">
        <div class="text-sm font-semibold truncate" style="color:var(--text-primary);">${w.name}</div>
        <div class="text-xs" style="color:var(--text-muted);">${w.steps} steps · ${w.lastRun}</div>
      </div>
      <span class="badge badge-${w.status}">${w.status}</span>
    </div>`,
      )
      .join("");

  const mc = el("mini-chart");
  if (mc) {
    const bars = [28, 45, 32, 67, 52, 78, 43];
    const days = ["M", "T", "W", "T", "F", "S", "S"];
    mc.innerHTML = `<div style="display:flex;align-items:flex-end;gap:6px;height:60px;">${bars
      .map(
        (h, i) => `
      <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;">
        <div style="width:100%;background:linear-gradient(to top,rgba(255,107,53,0.5),rgba(255,107,53,0.2));border-radius:3px 3px 0 0;height:${h}%;transition:height .8s ease;"></div>
        <span style="font-size:9px;color:var(--text-muted);">${days[i]}</span>
      </div>`,
      )
      .join("")}</div>`;
  }
}

function getGreeting() {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
}

export function runSimplePrompt() {
  const box = document.getElementById("simple-prompt-box");
  const val = box?.value?.trim();
  if (!val) {
    showToast("Describe what you want to automate", "warning");
    return;
  }
  navigateTo("builder");
  setTimeout(() => {
    const inp = document.getElementById("copilot-prompt-input");
    if (inp) {
      inp.value = val;
      runCopilotPrompt();
    }
  }, 200);
}
