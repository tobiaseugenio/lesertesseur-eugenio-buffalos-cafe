const API_URL = `${(import.meta.env.VITE_API_URL || "http://localhost:3000").replace(/\/$/, "")}/products`;

export async function getProducts() {
  const response = await fetch(API_URL);
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "No se pudieron cargar los productos.");
  }

  if (!result.success || !Array.isArray(result.data)) {
    throw new Error("La respuesta del servidor no contiene una lista de productos válida.");
  }

  return result.data;
}
