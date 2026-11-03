const STORAGE_KEY = "buffalos-cafe-cart";
export const CART_UPDATED_EVENT = "buffalos-cafe-cart-updated";

export function getCart() {
  try {
    const storedCart = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "[]");
    if (!Array.isArray(storedCart)) return [];

    return storedCart.filter(
      (item) => item && item.id !== undefined && Number.isInteger(item.quantity) && item.quantity > 0
    );
  } catch {
    return [];
  }
}

function saveCart(cart) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    window.dispatchEvent(new Event(CART_UPDATED_EVENT));
  } catch {
    throw new Error("No se pudo guardar el carrito en este navegador.");
  }

  return cart;
}

export function addToCart(product) {
  const stock = Number(product.stock);
  if (!Number.isInteger(stock) || stock < 1) {
    throw new Error("Este producto no tiene stock disponible.");
  }

  const cart = getCart();
  const existingItem = cart.find((item) => String(item.id) === String(product.id));

  if (existingItem && existingItem.quantity >= stock) {
    throw new Error(`No hay más unidades disponibles de ${product.nombre}.`);
  }

  const updatedCart = existingItem
    ? cart.map((item) => item.id === existingItem.id
      ? { ...product, quantity: item.quantity + 1 }
      : item)
    : [...cart, { ...product, quantity: 1 }];

  return saveCart(updatedCart);
}

export function updateCartQuantity(productId, quantity) {
  const requestedQuantity = Number(quantity);
  if (!Number.isInteger(requestedQuantity) || requestedQuantity < 1) return getCart();

  const updatedCart = getCart().map((item) => {
    if (String(item.id) !== String(productId)) return item;

    const stock = Number(item.stock);
    return {
      ...item,
      quantity: Number.isInteger(stock) && stock > 0
        ? Math.min(requestedQuantity, stock)
        : requestedQuantity,
    };
  });

  return saveCart(updatedCart);
}

export function removeFromCart(productId) {
  return saveCart(getCart().filter((item) => String(item.id) !== String(productId)));
}

export function clearCart() {
  return saveCart([]);
}