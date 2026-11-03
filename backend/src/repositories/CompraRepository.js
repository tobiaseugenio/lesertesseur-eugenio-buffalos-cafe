import pool from "../config/database.js";
import Cliente from "../models/Cliente.js";
import { ConflictError, NotFoundError, UnauthorizedError } from "../exceptions/AppError.js";

function toCents(value) {
    const amount = String(value);
    if (!/^\d+(?:\.\d{1,2})?$/.test(amount)) {
        throw new Error("La base de datos devolvió un importe monetario inválido.");
    }

    const [whole, fraction = ""] = amount.split(".");
    return BigInt(whole) * 100n + BigInt(fraction.padEnd(2, "0"));
}

function fromCents(cents) {
    const whole = cents / 100n;
    const fraction = String(cents % 100n).padStart(2, "0");
    return `${whole}.${fraction}`;
}

function toCliente(row) {
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

class CompraRepository {
    async checkout(userId, items) {
        const connection = await pool.getConnection();

        try {
            await connection.beginTransaction();

            const [users] = await connection.execute(
                `SELECT id, nombre, mail, saldo, password_hash, password_salt, role
                 FROM users WHERE id = ? FOR UPDATE`,
                [Number(userId)]
            );
            const user = users[0];
            if (!user) {
                throw new UnauthorizedError("La sesión no es válida o expiró.");
            }

            const productIds = items.map((item) => item.id).sort((a, b) => a - b);
            const placeholders = productIds.map(() => "?").join(", ");
            const [products] = await connection.execute(
                `SELECT id, nombre, precio_unitario, stock
                 FROM products
                 WHERE id IN (${placeholders})
                 ORDER BY id
                 FOR UPDATE`,
                productIds
            );
            const productsById = new Map(products.map((product) => [Number(product.id), product]));

            let totalCents = 0n;
            for (const item of items) {
                const product = productsById.get(item.id);
                if (!product) {
                    throw new NotFoundError(`No se encontró el producto con id ${item.id}.`);
                }
                if (Number(product.stock) < item.quantity) {
                    throw new ConflictError(`No hay stock suficiente de ${product.nombre}.`);
                }

                totalCents += toCents(product.precio_unitario) * BigInt(item.quantity);
            }

            const balanceCents = toCents(user.saldo);
            if (balanceCents < totalCents) {
                throw new ConflictError(
                    `Saldo insuficiente. Tu saldo es $${fromCents(balanceCents)} y el total es $${fromCents(totalCents)}.`
                );
            }

            for (const item of items) {
                const [result] = await connection.execute(
                    `UPDATE products
                     SET stock = stock - ?
                     WHERE id = ? AND stock >= ?`,
                    [item.quantity, item.id, item.quantity]
                );
                if (result.affectedRows !== 1) {
                    throw new ConflictError("El stock cambió mientras se procesaba la compra. Inténtalo nuevamente.");
                }
            }

            if (totalCents > 0n) {
                const [result] = await connection.execute(
                    `UPDATE users
                     SET saldo = saldo - ?
                     WHERE id = ? AND saldo >= ?`,
                    [fromCents(totalCents), Number(userId), fromCents(totalCents)]
                );
                if (result.affectedRows !== 1) {
                    throw new ConflictError("El saldo cambió mientras se procesaba la compra. Inténtalo nuevamente.");
                }
            }

            const [updatedUsers] = await connection.execute(
                `SELECT id, nombre, mail, saldo, password_hash, password_salt, role
                 FROM users WHERE id = ?`,
                [Number(userId)]
            );

            await connection.commit();
            return {
                user: toCliente(updatedUsers[0]),
                total: fromCents(totalCents),
            };
        } catch (error) {
            try {
                await connection.rollback();
            } catch (rollbackError) {
                throw new AggregateError(
                    [error, rollbackError],
                    "La compra falló y tampoco se pudo revertir la transacción."
                );
            }
            throw error;
        } finally {
            connection.release();
        }
    }
}

export default new CompraRepository();
