import pool from "../config/database.js";
import Alimento from "../models/Alimento.js";

function toAlimento(row) {
    if (!row) return null;

    return new Alimento(
        row.id,
        row.nombre,
        Number(row.precio_unitario),
        row.stock,
        row.imagen,
        Boolean(row.es_producto_estrella)
    );
}

class AlimentoRepository {
    async findAll() {
        const [rows] = await pool.execute(
            `SELECT id, nombre, precio_unitario, stock, imagen, es_producto_estrella
             FROM products ORDER BY id`
        );
        return rows.map(toAlimento);
    }

    async create({ nombre, precioUnitario, stock, imagen, esProductoEstrella = false }) {
        const [result] = await pool.execute(
            `INSERT INTO products
                (nombre, precio_unitario, stock, imagen, es_producto_estrella)
             VALUES (?, ?, ?, ?, ?)`,
            [nombre.trim(), precioUnitario, stock, imagen.trim(), esProductoEstrella]
        );
        return this.findById(result.insertId);
    }

    async findById(id) {
        const [rows] = await pool.execute(
            `SELECT id, nombre, precio_unitario, stock, imagen, es_producto_estrella
             FROM products WHERE id = ?`,
            [Number(id)]
        );
        return toAlimento(rows[0]);
    }

    async updateById(id, { nombre, precioUnitario, stock, imagen, esProductoEstrella = false }) {
        await pool.execute(
            `UPDATE products
             SET nombre = ?, precio_unitario = ?, stock = ?, imagen = ?, es_producto_estrella = ?
             WHERE id = ?`,
            [nombre.trim(), precioUnitario, stock, imagen.trim(), esProductoEstrella, Number(id)]
        );
        return this.findById(id);
    }

    async deleteById(id) {
        const alimento = await this.findById(id);
        if (!alimento) return null;

        const [result] = await pool.execute("DELETE FROM products WHERE id = ?", [Number(id)]);
        return result.affectedRows > 0 ? alimento : null;
    }
}

export default new AlimentoRepository();
