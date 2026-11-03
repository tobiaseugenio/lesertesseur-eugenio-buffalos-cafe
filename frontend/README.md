# Buffalo's Café

Aplicación para explorar el menú, ver productos, gestionar una cuenta y
administrar el catálogo con una cuenta de administrador.

## Requisitos

- Node.js 18 o superior.
- MySQL 8 en ejecución local.

## Configuración e inicio

### Backend

Seguí las instrucciones de configuración de MySQL, variables de entorno y
primer administrador en [backend/README.md](../backend/README.md). Luego, desde
la carpeta `backend`:

```sh
npm install
npm run dev
```

La API escucha por defecto en `http://localhost:3000` y verifica la conexión a
MySQL antes de iniciar.

### Frontend

Desde la carpeta `frontend`:

```sh
npm install
npm run dev
```

Abrí la URL que muestra Vite, normalmente `http://localhost:5173`. La URL base
de la API por defecto es `http://localhost:3000`. Para cambiarla, definí
`VITE_API_URL` en el entorno del frontend. El backend permite por defecto el
origen `http://localhost:5173`; se puede cambiar con `FRONTEND_ORIGIN`.

Para validar cambios en el frontend:

```sh
npm run lint
npm run build
```

## Cuentas, roles y sesión

Registrarse crea una cuenta con saldo inicial `0`, rol `user` e inicia la sesión
automáticamente. El cliente guarda el token de sesión en `sessionStorage` y el
header consulta el perfil actual para mostrar el saldo.

Para iniciar sesión, elegí **Ingresar** en la página `/login`. Para crear una
cuenta nueva, elegí **Registrarme**. Las contraseñas se guardan hasheadas y las
sesiones expiran a las 8 horas.

Las cuentas nuevas no pueden elegir su rol: solo un administrador puede
administrar productos. La opción **Productos** del header y la página
`/crear-producto` son para admins. El backend también protege las operaciones
de escritura; ocultar la opción en la interfaz no es el control de seguridad.
La lectura del catálogo sigue siendo pública para el menú y las páginas de
productos.

## API

Todas las respuestas exitosas usan el formato `{ "success": true, "data": ... }`.
Los errores usan `{ "success": false, "message": "..." }`.

### Autenticación

`POST /auth/register` crea una cuenta e inicia sesión automáticamente:

```json
{
  "nombre": "Ana Pérez",
  "mail": "ana@example.com",
  "password": "una-clave-segura"
}
```

El nombre es obligatorio (máximo 100 caracteres), el email debe ser válido y la
contraseña debe tener entre 8 y 128 caracteres. El servidor asigna el saldo y
el rol; no envíes `saldo` ni `role`. La respuesta `201` contiene
`data.token` y `data.user`.

`POST /auth/login` recibe `mail` y `password`; responde `200` con el token y el
perfil de la cuenta.

`GET /auth/me` obtiene el perfil de la cuenta autenticada. Enviá el token así:

```http
Authorization: Bearer <token>
```

El perfil contiene `id`, `nombre`, `mail`, `saldo` y `role`.

### Productos

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| `GET` | `/products` | Público | Lista de productos |
| `POST` | `/products` | Admin | Crear un producto |
| `PUT` | `/products/{id}` | Admin | Actualizar un producto |
| `DELETE` | `/products/{id}` | Admin | Eliminar un producto |

Para las operaciones de administración, enviá el token de una cuenta admin en
`Authorization: Bearer <token>`. Sin sesión, la API responde `401`; con una
cuenta común, responde `403`.

El cuerpo de creación y actualización contiene todos los campos:

```json
{
  "nombre": "Café americano",
  "precioUnitario": 2500,
  "stock": 20,
  "imagen": "https://ejemplo.com/cafe.jpg",
  "esProductoEstrella": true
}
```

`nombre` e `imagen` son textos obligatorios no vacíos; `imagen` debe ser una URL
HTTP o HTTPS. `precioUnitario` debe ser un número mayor o igual a cero, `stock`
un entero no negativo, y `esProductoEstrella` un booleano opcional que por
defecto es `false`. Crear responde `201`; actualizar y eliminar responden `200`.
Un ID inválido responde `400` y un producto inexistente responde `404`.

Las cuentas, saldos y productos se guardan en MySQL y persisten al reiniciar el
backend.
