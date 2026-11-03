import pool from "../config/database.js";
import Cliente from "../models/Cliente.js";

function toCliente(row) {
    if (!row) return null;

    return new Cliente(
        row.id,
        row.nombre,
        row.mail,
        Number(row.saldo),
        row.password_hash,
        row.password_salt,
        row.role
    );
}

class ClienteRepository {
    async findAll() {
        const [rows] = await pool.execute(
            "SELECT id, nombre, mail, saldo, password_hash, password_salt, role FROM users"
        );
        return rows.map(toCliente);
    }

    async findById(id) {
        const [rows] = await pool.execute(
            "SELECT id, nombre, mail, saldo, password_hash, password_salt, role FROM users WHERE id = ?",
            [Number(id)]
        );
        return toCliente(rows[0]);
    }

    async findByMail(mail) {
        const [rows] = await pool.execute(
            "SELECT id, nombre, mail, saldo, password_hash, password_salt, role FROM users WHERE mail = ?",
            [mail.trim().toLowerCase()]
        );
        return toCliente(rows[0]);
    }

    async createAccount({ nombre, mail, saldo = 0, passwordHash, passwordSalt }) {
        try {
            const [result] = await pool.execute(
                `INSERT INTO users (nombre, mail, saldo, password_hash, password_salt)
                 VALUES (?, ?, ?, ?, ?)`,
                [nombre, mail, saldo, passwordHash, passwordSalt]
            );
            return this.findById(result.insertId);
        } catch (error) {
            if (error.code === "ER_DUP_ENTRY") return null;
            throw error;
        }
    }

    async create({ nombre, mail, saldo = 0 }) {
        const [result] = await pool.execute(
            `INSERT INTO users (nombre, mail, saldo, password_hash, password_salt)
             VALUES (?, ?, ?, '', '')`,
            [nombre, mail.trim().toLowerCase(), saldo]
        );
        return this.findById(result.insertId);
    }

    async update(id, { nombre, mail, saldo }) {
        const fields = [];
        const values = [];

        if (nombre !== undefined) {
            fields.push("nombre = ?");
            values.push(nombre);
        }
        if (mail !== undefined) {
            fields.push("mail = ?");
            values.push(mail.trim().toLowerCase());
        }
        if (saldo !== undefined) {
            fields.push("saldo = ?");
            values.push(saldo);
        }

        if (fields.length === 0) return this.findById(id);

        values.push(Number(id));
        await pool.execute(`UPDATE users SET ${fields.join(", ")} WHERE id = ?`, values);
        return this.findById(id);
    }

    async addBalance(id, amount) {
        const [result] = await pool.execute(
            `UPDATE users
             SET saldo = saldo + ?
             WHERE id = ? AND saldo <= 9999999999.99 - ?`,
            [amount, Number(id), amount]
        );
        if (result.affectedRows === 0) return null;
        return this.findById(id);
    }

    async delete(id) {
        const [result] = await pool.execute("DELETE FROM users WHERE id = ?", [Number(id)]);
        return result.affectedRows > 0;
    }
}

export default new ClienteRepository();
