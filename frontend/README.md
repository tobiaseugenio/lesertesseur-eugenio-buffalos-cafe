# Buffalo's Café frontend

## Desarrollo

1. Inicia el backend desde `backend` con `npm start` (escucha en `http://localhost:3000`).
2. Inicia el frontend desde `frontend` con `npm run dev`.

La sección de productos carga su información mediante `src/services/productService.js`,
que consulta `GET http://localhost:3000/products`. Para apuntar a otro host, define
`VITE_API_URL` con la URL base de la API (sin la barra final). El backend permite
por defecto el origen `http://localhost:5173`; puedes cambiarlo con `FRONTEND_ORIGIN`.
