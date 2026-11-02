const API_BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:3000").replace(/\/$/, "");
const API_URL = `${API_BASE_URL}/products`;

async function requestProducts(options, fallbackMessage, url = API_URL) {
  let response;

  try {
    response = await fetch(url, options);
  } catch (error) {
    if (
      error instanceof TypeError ||
      (error instanceof Error && error.name === "NetworkError")
    ) {
      throw new Error(
        `No se pudo conectar con el backend. Comprueba que esté iniciado en ${API_BASE_URL}.`
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

export async function updateProduct(productId, product) {
  const result = await requestProducts({
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(product),
  }, "No se pudo actualizar el producto.", `${API_URL}/${productId}`);

  if (!result.success || !result.data) {
    throw new Error("La respuesta del servidor no contiene el producto actualizado.");
  }

  return result.data;
}

export async function deleteProduct(productId) {
  const result = await requestProducts({
    method: "DELETE",
  }, "No se pudo eliminar el producto.", `${API_URL}/${productId}`);

  if (!result.success) {
    throw new Error("No se pudo confirmar la eliminación del producto.");
  }

  return result.data;
}
