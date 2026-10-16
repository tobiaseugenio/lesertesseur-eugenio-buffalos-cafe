const API_URL = `${(import.meta.env.VITE_API_URL || "http://localhost:3000").replace(/\/$/, "")}/products`;

export async function getProducts() {
  const response = await fetch(API_URL);
  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(result.message || "No se pudieron cargar los productos.");
  }

  if (!result.success || !Array.isArray(result.data)) {
    throw new Error("La respuesta del servidor no contiene una lista de productos válida.");
  }

  return result.data;
}

export async function createProduct(product) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(product),
  });
  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(result.message || "No se pudo crear el producto.");
  }

  if (!result.success || !result.data) {
    throw new Error("La respuesta del servidor no contiene el producto creado.");
  }

  return result.data;
}
