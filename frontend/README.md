# Buffalo's Café frontend

## Desarrollo

1. Inicia el backend desde `backend` con `npm start` (escucha en `http://localhost:3000`).
2. Inicia el frontend desde `frontend` con `npm run dev`.
3. Abre en el navegador la URL que muestra Vite, normalmente `http://localhost:5173`.

`http://localhost:3000` es la API del backend, no la página del frontend. Por eso,
al abrir `http://localhost:3000/` se obtiene una respuesta JSON indicando que esa
ruta no existe. La sección de productos consulta `GET http://localhost:3000/products`
mediante `src/services/productService.js`. Para apuntar a otra API, define
`VITE_API_URL` con su URL base (sin la barra final). El backend permite por defecto
el origen `http://localhost:5173`; puedes cambiarlo con `FRONTEND_ORIGIN`.

## Crear productos desde Postman

- Método: `POST`
- URL: `http://localhost:3000/products`
- Header: `Content-Type: application/json`
- Body: selecciona **raw** y **JSON**, por ejemplo:

```json
{
  "nombre": "Café americano",
  "precioUnitario": 2500,
  "stock": 20,
  "imagen": "https://ejemplo.com/cafe.jpg"
}
```

`nombre`, `precioUnitario` y `stock` son obligatorios. El precio debe ser un número
mayor o igual a cero y el stock un entero no negativo. `imagen` es opcional. Una
creación correcta responde con estado `201` y el producto creado en `data`.
Los productos se guardan en memoria y se reinician al reiniciar el backend.

## Eliminar productos desde Postman

- Método: `DELETE`
- URL: `http://localhost:3000/products/{id}` (reemplaza `{id}` por el id del producto).
- No requiere body.

Por ejemplo, `DELETE http://localhost:3000/products/1` elimina el producto con id
`1` y responde con estado `200` y el producto eliminado en `data`. Si el id no es
un entero positivo, responde con estado `400`; si no existe un producto con ese id,
responde con estado `404`.
