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

async function requestApi(url, options = {}, fallbackMessage = "No se pudo completar la autenticación.") {
  let response;

  try {
    response = await fetch(url, options);
  } catch {
    throw new Error(`No se pudo conectar con el backend en ${API_BASE_URL}.`);
  }

  const result = await response.json().catch(() => ({}));
  if (!response.ok || !result.success) {
    const error = new Error(result.message || fallbackMessage);
    error.status = response.status;
    error.field = result.field;
    throw error;
  }

  return result.data;
}

function requestAuth(path, options = {}) {
  return requestApi(`${AUTH_URL}${path}`, options);
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

export async function addBalance(amount) {
  const token = getAuthToken();
  if (!token) throw new Error("Debes iniciar sesión para agregar saldo.");

  const user = await requestAuth("/balance", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ amount }),
  });
  window.dispatchEvent(new Event(AUTH_UPDATED_EVENT));
  return user;
}

export async function checkoutCart(items) {
  const token = getAuthToken();
  if (!token) throw new Error("Debes iniciar sesión para realizar una compra.");

  const purchase = await requestApi(
    `${API_BASE_URL}/orders/checkout`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ items }),
    },
    "No se pudo completar la compra."
  );
  window.dispatchEvent(new Event(AUTH_UPDATED_EVENT));
  return purchase;
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