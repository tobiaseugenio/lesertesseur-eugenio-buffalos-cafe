import compraRepository from "../repositories/CompraRepository.js";
import { BadRequestError } from "../exceptions/AppError.js";

const MAX_CART_ITEMS = 50;
const MAX_PRODUCT_ID = 4294967295;

class CompraService {
    checkout(userId, data) {
        if (!data || typeof data !== "object" || Array.isArray(data) || !Array.isArray(data.items)) {
            throw new BadRequestError("Envía una lista de productos para comprar.");
        }

        if (data.items.length === 0 || data.items.length > MAX_CART_ITEMS) {
            throw new BadRequestError(`El carrito debe contener entre 1 y ${MAX_CART_ITEMS} productos.`);
        }

        const itemsById = new Map();
        for (const item of data.items) {
            const id = typeof item?.id === "string" && /^\d+$/.test(item.id)
                ? Number(item.id)
                : item?.id;
            const { quantity } = item ?? {};

            if (!Number.isSafeInteger(id) || id < 1 || id > MAX_PRODUCT_ID) {
                throw new BadRequestError("Cada producto debe tener un id entero positivo.");
            }
            if (!Number.isSafeInteger(quantity) || quantity < 1 || quantity > MAX_PRODUCT_ID) {
                throw new BadRequestError("Cada cantidad debe ser un entero positivo.");
            }

            const combinedQuantity = (itemsById.get(id) || 0) + quantity;
            if (combinedQuantity > MAX_PRODUCT_ID) {
                throw new BadRequestError("La cantidad solicitada supera el límite permitido.");
            }
            itemsById.set(id, combinedQuantity);
        }

        const items = [...itemsById].map(([id, quantity]) => ({ id, quantity }));
        return compraRepository.checkout(userId, items);
    }
}

export default new CompraService();
