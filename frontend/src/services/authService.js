const API_BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:3000").replace(/\/$/, "");
const AUTH_URL = `${API_BASE_URL}/auth`;
const TOKEN_KEY = "buffalos-cafe-auth-token";
export const AUTH_UPDATED_EVENT = "buffalos-cafe-auth-updated";

export function getAuthToken() {
  return window.sessionStorage.getItem(TOKEN_KEY);
}

function saveAuthToken(token) {
  window.sessionStorage.setItem(TOKEN_KEY, token);
  window.dispatchEvent(new Event(AUTH_UPDATED_EVENT));
}

export function logout() {
  window.sessionStorage.removeItem(TOKEN_KEY);
  window.dispatchEvent(new Event(AUTH_UPDATED_EVENT));
}

async function requestAuth(path, options = {}) {
  let response;

  try {
    response = await fetch(`${AUTH_URL}${path}`, options);
  } catch {
    throw new Error(`No se pudo conectar con el backend en ${API_BASE_URL}.`);
  }

  const result = await response.json().catch(() => ({}));
  if (!response.ok || !result.success) {
    const error = new Error(result.message || "No se pudo completar la autenticación.");
    error.status = response.status;
    throw error;
  }

  return result.data;
}

async function createSession(path, credentials) {
  const session = await requestAuth(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  if (!session.token || !session.user) {
    throw new Error("El servidor no devolvió una sesión válida.");
  }

  saveAuthToken(session.token);
  return session.user;
}

export function register(credentials) {
  return createSession("/register", credentials);
}

export function login(credentials) {
  return createSession("/login", credentials);
}

export async function getCurrentUser() {
  const token = getAuthToken();
  if (!token) return null;

  try {
    return await requestAuth("/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    if (error.status === 401) logout();
    throw error;
  }
}