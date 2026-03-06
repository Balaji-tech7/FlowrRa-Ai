import { STATE } from "./store.js";
import { showToast } from "./toast.js";
import { navigateTo } from "./navigation.js";

// helper that wraps reading/storing the user object (including token)
function saveUser(user) {
  STATE.user = user;
  try {
    localStorage.setItem("flowforge_user", JSON.stringify(user));
  } catch {}
}

function loadStoredUser() {
  try {
    const raw = localStorage.getItem("flowforge_user");
    if (raw) {
      STATE.user = JSON.parse(raw);
    }
  } catch {}
}

export function getToken() {
  return STATE.user?.token || null;
}

export function isLoggedIn() {
  return Boolean(getToken());
}

export async function doLogin() {
  const email = document.getElementById("login-email")?.value.trim();
  const pwd = document.getElementById("login-password")?.value;
  const err = document.getElementById("login-error");

  if (!email || !pwd) {
    if (err) {
      err.textContent = "Please enter both email and password";
      err.classList.remove("hidden");
    }
    return;
  }

  try {
    const resp = await fetch("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password: pwd }),
    });
    const data = await resp.json();
    if (!resp.ok || !data.success) {
      throw new Error(data.error || "Login failed");
    }
    const token = data.data?.token;
    if (!token) throw new Error("No token returned");
    const name = email.split("@")[0];
    const user = { email, name, token };
    saveUser(user);

    // update UI immediately
    document.getElementById("sidebar-name").textContent = name;
    document.getElementById("sidebar-email").textContent = email;
    document.getElementById("sidebar-avatar").textContent = name[0] || "";

    document.getElementById("login-screen").classList.add("hidden");
    document.getElementById("main-app").classList.remove("hidden");
    navigateTo("dashboard");
    updateNotifBadge();
  } catch (e) {
    console.error(e);
    if (err) {
      err.textContent = e.message || "Invalid credentials";
      err.classList.remove("hidden");
    }
  }
}

export function doLogout() {
  STATE.user = null;
  try {
    localStorage.removeItem("flowforge_user");
  } catch {}
  // if the page is a single‑page app hide the app and show login
  document.getElementById("main-app")?.classList.add("hidden");
  document.getElementById("login-screen")?.classList.remove("hidden");
  ["login-email", "login-password"].forEach((id) => {
    const e = document.getElementById(id);
    if (e) e.value = "";
  });
}

export function doRegister() {
  const email = document.getElementById("login-email")?.value.trim();
  const pwd = document.getElementById("login-password")?.value;
  const err = document.getElementById("login-error");
  if (!email || !pwd) {
    if (err) {
      err.textContent = "Please provide email & password";
      err.classList.remove("hidden");
    }
    return;
  }
  fetch("/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password: pwd }),
  })
    .then((r) => r.json())
    .then((data) => {
      if (data.success) {
        showToast("Registration successful, please log in", "success");
      } else {
        showToast(data.error || "Registration failed", "error");
      }
    })
    .catch((e) => {
      console.error(e);
      showToast("Registration error", "error");
    });
}

export function initializeAuth() {
  loadStoredUser();
  if (STATE.user) {
    // if we landed on dashboard already
    document.getElementById("sidebar-name")?.textContent = STATE.user.name;
    document.getElementById("sidebar-email")?.textContent = STATE.user.email;
    document.getElementById("sidebar-avatar")?.textContent =
      STATE.user.name[0] || "";
    document.getElementById("login-screen")?.classList.add("hidden");
    document.getElementById("main-app")?.classList.remove("hidden");
  }
}

function getGreeting() {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
}
