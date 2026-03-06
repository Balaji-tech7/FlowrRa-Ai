// reusable DOM components as functions
import { escHtml } from "../scripts/utils.js";

export function StepCard(step, { index = 0, total = 1 } = {}) {
  const card = document.createElement("div");
  card.className = "step-card";
  card.innerHTML = `
    ${index > 0 ? `<div class="step-connector"><div class="step-connector-dot"></div></div>` : ""}
    <div class="flex items-center gap-3">
      <div class="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style="background:${step.color || "#666"}22;font-size:16px;">${step.icon}</div>
      <div class="flex-1 min-w-0">
        <div class="text-sm font-semibold" style="color:var(--text-primary);">${escHtml(step.label)}</div>
        <div class="text-xs truncate mt-0.5" style="color:var(--text-muted);">${escHtml(step.config || "Click to configure")}</div>
      </div>
    </div>`;
  return card;
}

export function Toast(message, type = "success") {
  const t = document.createElement("div");
  t.className = `toast ${type}`;
  t.innerHTML = `<span>${escHtml(message)}</span>`;
  return t;
}

export function WorkflowPlanCard(steps) {
  const card = document.createElement("div");
  card.className = "workflow-plan-card";
  const inner = steps
    .map(
      (s, i) => `
    ${i > 0 ? `<div style="text-align:center;color:rgba(255,107,53,0.5);font-size:14px;line-height:1;margin:1px 0 1px 20px;">↓</div>` : ""}
    <div style="display:flex;align-items:center;gap:8px;padding:5px 8px;border-radius:8px;background:rgba(255,255,255,0.025);margin-bottom:3px;font-size:12px;">
      <span style="font-size:13px;">${s.icon}</span>
      <span style="font-weight:600;color:var(--text-primary);font-size:12.5px;">${escHtml(s.label)}</span>
      ${s.config ? `<span style="color:var(--text-muted);font-size:11px;margin-left:4px;">${escHtml(s.config)}</span>` : ""}
      <span style="margin-left:auto;font-size:10.5px;padding:2px 8px;border-radius:10px;background:rgba(255,107,53,0.1);color:#FF6B35;border:1px solid rgba(255,107,53,0.2);text-transform:uppercase;font-weight:600;">${s.type}</span>
    </div>`,
    )
    .join("");
  card.innerHTML = `<div style="font-size:11px;font-weight:700;color:#FF6B35;text-transform:uppercase;letter-spacing:.08em;margin-bottom:8px;">📋 Workflow Plan</div>${inner}`;
  return card;
}
