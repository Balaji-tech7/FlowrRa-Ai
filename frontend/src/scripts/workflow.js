import { STATE } from "./store.js";
import { showToast } from "./toast.js";
import { getToken } from "./auth.js";
import { initWebsocketClient } from "./wsClient.js";

function authHeaders() {
  const t = getToken();
  return t ? { Authorization: `Bearer ${t}` } : {};
}

export async function saveWorkflow() {
  // assume global currentWorkflow and workflows defined by the page
  if (!window.currentWorkflow) return;
  window.currentWorkflow.name =
    document.getElementById("workflow-name")?.value ||
    window.currentWorkflow.name;

  const payload = {
    name: window.currentWorkflow.name,
    description: window.currentWorkflow.description || "",
    definition: JSON.stringify(window.currentWorkflow),
  };

  try {
    const resp = await fetch("/workflows", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(),
      },
      body: JSON.stringify(payload),
    });
    const json = await resp.json();
    if (resp.ok && json.success) {
      showToast("Workflow saved!", "success");
      // update local list (if any) from server data
      if (json.data) {
        // replace or push
        const idx = (window.workflows || []).findIndex(
          (w) => w.id === json.data.id,
        );
        if (idx >= 0) {
          window.workflows[idx] = json.data;
        } else {
          window.workflows = window.workflows || [];
          window.workflows.push(json.data);
        }
      }
    } else {
      throw new Error(json.error || "save failed");
    }
  } catch (e) {
    console.error(e);
    showToast(e.message || "Unable to save workflow", "error");
  }
}

export async function runWorkflow() {
  if (!window.currentWorkflow) return;
  try {
    const resp = await fetch("/executions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(),
      },
      body: JSON.stringify({ workflowId: window.currentWorkflow.id }),
    });
    const json = await resp.json();
    if (resp.ok && json.success) {
      showToast("Workflow executed", "success");
      // optionally add a log entry and increment run count
      if (window.currentWorkflow) {
        window.currentWorkflow.runs = (window.currentWorkflow.runs || 0) + 1;
        // update workflows array
        const idx = (window.workflows || []).findIndex(
          (w) => w.id === window.currentWorkflow.id,
        );
        if (idx >= 0) window.workflows[idx].runs = window.currentWorkflow.runs;
      }
    } else {
      throw new Error(json.error || "execution failed");
    }
  } catch (e) {
    console.error(e);
    showToast(e.message || "Unable to run workflow", "error");
  }
}

export function deleteWorkflow(id) {
  // backend has no delete route yet; just remove locally
  if (!window.workflows) return;
  window.workflows = window.workflows.filter((w) => w.id !== id);
  showToast("Workflow deleted locally", "info");
}

export function checkAuth() {
  const token = getToken();
  if (!token) {
    document.getElementById("main-app")?.classList.add("hidden");
    document.getElementById("login-screen")?.classList.remove("hidden");
    return false;
  }
  return true;
}

// expose to global scope so inline handlers still work
window.saveWorkflow = saveWorkflow;
window.runWorkflow = runWorkflow;
window.deleteWorkflow = deleteWorkflow;
window.checkAuth = checkAuth;

// initialize websocket once authenticated
if (getToken()) initWebsocketClient();
