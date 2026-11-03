# Backend de Buffalo's Cafe

## Requisitos

- Node.js 18 o superior.
- MySQL 8 en ejecución local.

## Instalación y configuración

Desde la carpeta `backend`, creá la base y las tablas:

```sh
mysql -u root -p < database/schema.sql
```

Si el usuario local no tiene contraseña, quitá `-p`. El esquema crea la base
`buffalos_cafe` y las tablas `users` y `products`.

Instalá las dependencias y copiá la configuración de ejemplo:

```sh
npm install
cp .env.example .env
```

En `.env`, configurá `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD` y `DB_NAME`
según tu instalación local. `DB_NAME` debe coincidir con la base creada por
`schema.sql`. `FRONTEND_ORIGIN` permite configurar el origen permitido por CORS;
por defecto es `http://localhost:5173`.

Generá un secreto estable para los tokens y guardalo como `AUTH_TOKEN_SECRET`:

```sh
openssl rand -hex 32
```

El secreto debe tener al menos 32 caracteres. No compartas ni subas `.env` al
repositorio. Mantené el mismo secreto entre reinicios: cambiarlo invalida las
sesiones existentes.

Iniciá el servidor:

```sh
npm run dev
```

`npm run dev` reinicia el backend automáticamente cuando cambian los archivos.
`npm start` lo inicia sin modo watch. En ambos casos, el servidor verifica la
conexión a MySQL antes de escuchar en `PORT` (por defecto `3000`). Si las
variables, la base o las credenciales son incorrectas, el proceso falla en vez
de iniciar con almacenamiento temporal.

## Persistencia

Los repositorios de usuarios y productos usan MySQL. La configuración de
conexión se carga desde `.env` mediante `mysql2` y `dotenv`. Las tablas del
esquema son:

- `users`: nombre, email único, saldo, hash y salt de contraseña, rol y fechas.
- `products`: nombre, precio unitario, stock, URL de imagen, indicador de
  producto estrella y fechas.

Los registros y cambios persisten al reiniciar el servidor. El esquema se puede
volver a ejecutar sin borrar las tablas existentes.

## Cuentas y roles

El registro público crea usuarios con el rol `user`. Para dar privilegios de
administrador a una cuenta, primero registrala desde la aplicación y luego
actualizá su rol directamente en MySQL:

```sql
USE buffalos_cafe;
UPDATE users SET role = 'admin' WHERE mail = 'tu-correo@example.com';
```

El rol se consulta desde la base de datos. Recargá la aplicación para que el
header vuelva a consultar el perfil y muestre **Productos** para el admin. No
hay una opción pública para asignar el rol.

## Endpoints

La API devuelve respuestas exitosas como `{ "success": true, "data": ... }` y
errores como `{ "success": false, "message": "..." }`.

### Autenticación

| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/auth/register` | Crear cuenta `user` y devolver una sesión |
| `POST` | `/auth/login` | Iniciar sesión |
| `GET` | `/auth/me` | Consultar el perfil autenticado |
| `POST` | `/auth/balance` | Agregar saldo de prueba a la cuenta autenticada |

El registro recibe `nombre`, `mail` y `password`, crea una sesión y devuelve
`data.token` y `data.user`. El frontend guarda el token automáticamente, por lo
que el usuario queda logueado después de registrarse. Las contraseñas se
almacenan con hash `scrypt`; los tokens expiran a las 8 horas.

`/auth/me` requiere el header `Authorization: Bearer <token>` y devuelve
`id`, `nombre`, `mail`, `saldo` y `role`.

`POST /auth/balance` también requiere ese header y recibe un importe positivo
con hasta dos decimales:

```json
{ "amount": 5000 }
```

La respuesta `200` devuelve el perfil actualizado. Esta es una carga simulada
para pruebas; no procesa pagos reales. El saldo se incrementa de forma atómica
en MySQL. Un importe inválido responde `400`.

### Productos

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| `GET` | `/products` | Público | Listar productos |
| `POST` | `/products` | Admin | Crear producto |
| `PUT` | `/products/:id` | Admin | Actualizar producto |
| `DELETE` | `/products/:id` | Admin | Eliminar producto |
| `POST` | `/orders/checkout` | Usuario autenticado | Comprar los productos del carrito |

Las rutas de administración de productos (`POST`, `PUT` y `DELETE`) requieren
un token válido de un administrador. Sin token responden `401 Unauthorized`; un
usuario autenticado sin rol admin recibe `403 Forbidden`. La ruta de lectura es
pública para permitir mostrar productos en el menú.

Los campos de creación/actualización son `nombre` (texto no vacío),
`precioUnitario` (número mayor o igual a cero), `stock` (entero no negativo),
`imagen` (URL HTTP o HTTPS no vacía) y `esProductoEstrella` (booleano opcional,
por defecto `false`).

`POST /orders/checkout` requiere un usuario autenticado. Recibe el ID y la
cantidad solicitada de cada producto; el servidor obtiene precios y stock desde
MySQL. Calcula el total con precisión decimal, descuenta el saldo y las
existencias en una única transacción. Si el usuario no tiene saldo suficiente,
falta stock o un producto ya no existe, la operación completa se revierte. No
se crea todavía un historial de pedidos.
