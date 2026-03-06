// simple local fallbacks for when API is unavailable
import { normaliseType, pickIcon } from "../utils.js";

export function localFallbackParse(prompt) {
  const p = prompt.toLowerCase();
  const steps = [];

  // Trigger steps
  if (/form|submit|signup/.test(p)) {
    steps.push({
      type: "trigger",
      label: "Form Submission",
      icon: "📋",
      config: "On submit",
    });
  } else if (/order|purchase/.test(p)) {
    steps.push({
      type: "trigger",
      label: "New Order Trigger",
      icon: "🛒",
      config: "Order created",
    });
  } else if (/schedule|cron|daily/.test(p)) {
    steps.push({
      type: "trigger",
      label: "Schedule Trigger",
      icon: "⏰",
      config: "Cron schedule",
    });
  } else {
    steps.push({
      type: "trigger",
      label: "Webhook Trigger",
      icon: "⚡",
      config: "Event received",
    });
  }

  // Condition steps
  if (/stock|inventory|out of/.test(p)) {
    steps.push({
      type: "condition",
      label: "Inventory Check",
      icon: "📦",
      config: "Stock ≤ threshold",
    });
  } else if (/if |condition|check/.test(p)) {
    steps.push({
      type: "condition",
      label: "Condition Check",
      icon: "🔀",
      config: "If condition",
    });
  }

  // AI steps
  if (/ai|smart|analyz|gpt/.test(p)) {
    steps.push({
      type: "ai",
      label: "AI Processing",
      icon: "🤖",
      config: "Claude AI",
    });
  }

  // Webhook / Notifications
  if (/slack/.test(p)) {
    steps.push({
      type: "webhook",
      label: "Slack Notification",
      icon: "💬",
      config: "Post to channel",
    });
  }
  if (/gmail|email|mail/.test(p)) {
    steps.push({
      type: "webhook",
      label: "Send Email",
      icon: "📧",
      config: "Gmail API",
    });
  }
  if (/notif|alert/.test(p) && !/slack|gmail/.test(p)) {
    steps.push({
      type: "webhook",
      label: "Send Notification",
      icon: "🔔",
      config: "Notify admin",
    });
  }

  // Database steps
  if (/database|save|store|crm/.test(p)) {
    steps.push({
      type: "database",
      label: "Save to Database",
      icon: "🗄️",
      config: "Insert record",
    });
  }

  // Transform / delay
  if (/delay|wait|pause/.test(p)) {
    steps.push({
      type: "transform",
      label: "Delay Step",
      icon: "⏱️",
      config: "Wait period",
    });
  }

  // Fallback steps to ensure at least 3 steps
  if (steps.length < 3) {
    steps.push({
      type: "webhook",
      label: "Send Notification",
      icon: "🔔",
      config: "Alert sent",
    });
  }
  if (steps.length < 3) {
    steps.push({
      type: "database",
      label: "Log Activity",
      icon: "📝",
      config: "Audit log",
    });
  }

  // Generate workflow name
  const wn = prompt
    .slice(0, 42)
    .replace(/[^a-zA-Z0-9 ]/g, "")
    .trim();
  const workflowName = wn.charAt(0).toUpperCase() + wn.slice(1);

  return {
    steps,
    reasoning: `Workflow for: "${prompt.slice(0, 80)}". ${steps.length} steps added.`,
    workflowName,
  };
}
