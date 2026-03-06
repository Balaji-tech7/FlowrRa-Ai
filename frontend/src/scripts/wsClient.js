import { getToken } from "./auth.js";
import { showToast } from "./toast.js";

let ws;
let reconnectAttempts = 0;

function connect() {
  const token = getToken();
  if (!token) return;
  const url = `ws://${window.location.hostname}:8000`; // same as backend
  ws = new WebSocket(url, ["Bearer " + token]);

  ws.onopen = () => {
    reconnectAttempts = 0;
    console.log("ws connected");
  };

  ws.onmessage = (evt) => {
    try {
      const msg = JSON.parse(evt.data);
      handleMessage(msg);
    } catch (e) {
      console.error("ws parse", e);
    }
  };

  ws.onclose = () => {
    console.log("ws closed");
    scheduleReconnect();
  };

  ws.onerror = (e) => {
    console.error("ws error", e);
    ws.close();
  };
}

function scheduleReconnect() {
  reconnectAttempts += 1;
  const delay = Math.min(30000, 1000 * 2 ** reconnectAttempts);
  setTimeout(connect, delay);
}

function handleMessage(msg) {
  switch (msg.type) {
    case "execution.start":
      showToast("Execution started", "info");
      break;
    case "execution.complete":
      showToast("Execution complete", "success");
      break;
    case "workflow.created":
      showToast("Workflow created", "success");
      break;
    case "ai.chunk":
      appendAIChunk(msg.chunk);
      break;
    case "ai.token":
      updateAITokenStats(msg.tokens, msg.cost);
      break;
    case "ai.error":
      showToast("AI error: " + msg.message, "error");
      break;
    // add more
  }
}

function appendAIChunk(chunk) {
  const el = document.getElementById("ai-stream-output");
  if (el) el.textContent += chunk.text || "";
}

function updateAITokenStats(tokens, cost) {
  const el = document.getElementById("ai-token-stats");
  if (el) el.textContent = `Tokens: ${tokens}  Cost: $${cost.toFixed(4)}`;
}

window.addEventListener("beforeunload", () => {
  ws && ws.close();
});

export function initWebsocketClient() {
  connect();
}
