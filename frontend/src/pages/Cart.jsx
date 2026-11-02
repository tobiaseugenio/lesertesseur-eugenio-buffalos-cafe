import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ImagePlaceholder from "../components/ImagePlaceholder";
import { getCart, removeFromCart, updateCartQuantity } from "../utils/cart";
import "../styles/Cart.css";

const priceFormatter = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 2,
});

function Cart() {
  const [items, setItems] = useState(getCart);
  const total = items.reduce(
    (sum, item) => sum + Number(item.precioUnitario) * item.quantity,
    0
  );

  const changeQuantity = (productId, quantity) => {
    setItems(updateCartQuantity(productId, quantity));
  };

  const deleteItem = (productId) => {
    setItems(removeFromCart(productId));
  };

  return (
    <>
      <Header variant="dark" />
      <main className="cart-page">
        <h1 className="cart-page__title">Tu carrito</h1>

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
            </aside>
          </div>
        )}
      </main>
      <Footer variant="dark" />
    </>
  );
}

export default Cart;