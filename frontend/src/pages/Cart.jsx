import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ImagePlaceholder from "../components/ImagePlaceholder";
import { getAuthToken, checkoutCart } from "../services/authService";
import { clearCart, getCart, removeFromCart, updateCartQuantity } from "../utils/cart";
import "../styles/Cart.css";

const priceFormatter = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 2,
});

function Cart() {
  const [items, setItems] = useState(getCart);
  const [checkoutError, setCheckoutError] = useState("");
  const [checkoutMessage, setCheckoutMessage] = useState("");
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const total = items.reduce(
    (sum, item) => sum + Number(item.precioUnitario) * item.quantity,
    0
  );

  const changeQuantity = (productId, quantity) => {
    setCheckoutError("");
    setItems(updateCartQuantity(productId, quantity));
  };

  const deleteItem = (productId) => {
    setCheckoutError("");
    setItems(removeFromCart(productId));
  };

  const handleCheckout = async () => {
    setCheckoutError("");
    setCheckoutMessage("");

    if (!getAuthToken()) {
      setCheckoutError("Inicia sesión para realizar una compra.");
      return;
    }

    setIsCheckingOut(true);
    try {
      const purchase = await checkoutCart(
        items.map(({ id, quantity }) => ({ id, quantity }))
      );
      clearCart();
      setItems([]);
      setCheckoutMessage(
        `¡Compra realizada! Se descontaron ${priceFormatter.format(Number(purchase.total))} de tu saldo.`
      );
    } catch (requestError) {
      setCheckoutError(requestError.message);
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <>
      <Header variant="dark" />
      <main className="cart-page">
        <h1 className="cart-page__title">Tu carrito</h1>
        {checkoutError && (
          <p className="cart-page__checkout-error" role="alert">
            {checkoutError}
            {!getAuthToken() && <> <a href="/login">Iniciar sesión</a></>}
          </p>
        )}
        {checkoutMessage && (
          <p className="cart-page__checkout-success" role="status">{checkoutMessage}</p>
        )}

        {items.length === 0 ? (
          <section className="cart-empty">
            <p>Tu carrito está vacío.</p>
            <a href="/menu">Explorar menú</a>
          </section>
        ) : (
          <div className="cart-layout">
            <section className="cart-items" aria-label="Productos en el carrito">
              {items.map((item) => (
                <article className="cart-item" key={item.id}>
                  <a className="cart-item__image-link" href={`/productos/${item.id}`}>
                    <ImagePlaceholder
                      className="cart-item__image"
                      src={item.imagen}
                      alt={item.nombre}
                    />
                  </a>
                  <div className="cart-item__details">
                    <a className="cart-item__name" href={`/productos/${item.id}`}>
                      {item.nombre}
                    </a>
                    <p>{priceFormatter.format(Number(item.precioUnitario))} c/u</p>
                    <div className="cart-item__quantity" aria-label={`Cantidad de ${item.nombre}`}>
                      <button
                        type="button"
                        onClick={() => changeQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        aria-label={`Quitar una unidad de ${item.nombre}`}
                      >
                        −
                      </button>
                      <span aria-live="polite">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => changeQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= Number(item.stock)}
                        aria-label={`Agregar una unidad de ${item.nombre}`}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <p className="cart-item__subtotal">
                    {priceFormatter.format(Number(item.precioUnitario) * item.quantity)}
                  </p>
                  <button
                    type="button"
                    className="cart-item__remove"
                    onClick={() => deleteItem(item.id)}
                    aria-label={`Quitar ${item.nombre} del carrito`}
                  >
                    Quitar
                  </button>
                </article>
              ))}
            </section>

            <aside className="cart-summary" aria-label="Resumen del carrito">
              <h2>Resumen</h2>
              <p>
                <span>Total</span>
                <strong>{priceFormatter.format(total)}</strong>
              </p>
              <a href="/menu">Seguir comprando</a>
              <button
                type="button"
                className="cart-summary__checkout"
                onClick={handleCheckout}
                disabled={isCheckingOut}
              >
                {isCheckingOut ? "PROCESANDO..." : "COMPRAR"}
              </button>
            </aside>
          </div>
        )}
      </main>
      <Footer variant="dark" />
    </>
  );
}

export default Cart;