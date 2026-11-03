import mysql from "mysql2/promise";

const requiredEnvironment = ["DB_HOST", "DB_USER", "DB_NAME"];
const missingEnvironment = requiredEnvironment.filter((name) => !process.env[name]);

if (missingEnvironment.length > 0) {
    throw new Error(`Faltan variables de entorno para MySQL: ${missingEnvironment.join(", ")}.`);
}

const port = Number(process.env.DB_PORT || 3306);
if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("DB_PORT debe ser un puerto válido.");
}

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

export async function verifyDatabaseConnection() {
    const connection = await pool.getConnection();
    try {
        await connection.ping();
    } finally {
        connection.release();
    }
}

export default pool;
