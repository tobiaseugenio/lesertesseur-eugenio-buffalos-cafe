const API_URL = `${(import.meta.env.VITE_API_URL || "http://localhost:3000").replace(/\/$/, "")}/products`;

async function requestProducts(options, fallbackMessage) {
  let response;

  try {
    response = await fetch(API_URL, options);
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(
        "No se pudo conectar con el backend. Comprueba que esté iniciado en http://localhost:3000."
      );
    }

    throw error;
  }

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(result.message || fallbackMessage);
  }

  return result;
}

export async function getProducts() {
  const result = await requestProducts(undefined, "No se pudieron cargar los productos.");

  if (!result.success || !Array.isArray(result.data)) {
    throw new Error("La respuesta del servidor no contiene una lista de productos válida.");
  }

  return result.data;
}

export async function createProduct(product) {
  const result = await requestProducts({
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(product),
  }, "No se pudo crear el producto.");

  if (!result.success || !result.data) {
    throw new Error("La respuesta del servidor no contiene el producto creado.");
  }

  return result.data;
}
