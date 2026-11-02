import { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ImagePlaceholder from "../components/ImagePlaceholder";
import { getProducts } from "../services/productService";
import { addToCart } from "../utils/cart";
import "../styles/ProductDetail.css";

function ProductDetail({ productId }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cartMessage, setCartMessage] = useState("");
  const [cartError, setCartError] = useState("");

  const handleBuy = () => {
    try {
      addToCart(product);
      setCartError("");
      setCartMessage(`${product.nombre} se agregó al carrito.`);
    } catch (requestError) {
      setCartMessage("");
      setCartError(requestError.message);
    }
  };

  useEffect(() => {
    let isMounted = true;

    getProducts()
      .then((products) => {
        const foundProduct = products.find(
          (item) => String(item.id) === productId
        );

        if (isMounted) setProduct(foundProduct ?? null);
      })
      .catch((requestError) => {
        if (isMounted) setError(requestError.message);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [productId]);

  return (
    <>
      <Header variant="dark" />
      <main className="product">
        {loading && <p role="status">Cargando producto...</p>}
        {!loading && error && <p role="alert">{error}</p>}
        {!loading && !error && !product && (
          <p role="status">No se encontró el producto solicitado.</p>
        )}
        {!loading && !error && product && (
          <>
            <ImagePlaceholder
              className="product__image"
              src={product.imagen}
              alt={product.nombre}
            />
            <div className="product__info">
              <h1 className="product__name">{product.nombre}</h1>
              <p className="product__price">
                ${Number(product.precioUnitario).toLocaleString("es-AR")}
              </p>
              <p className="product__stock">Disponibles: {product.stock}</p>
              <button
                type="button"
                className="product__buy-button"
                onClick={handleBuy}
                disabled={product.stock < 1}
              >
                Comprar
              </button>
              {cartMessage && (
                <p className="product__cart-message" role="status">
                  {cartMessage} <a href="/carrito">Ver carrito</a>
                </p>
              )}
              {cartError && <p className="product__cart-error" role="alert">{cartError}</p>}
            </div>
          </>
        )}
      </main>
      <Footer variant="dark" />
    </>
  );
}

export default ProductDetail;
