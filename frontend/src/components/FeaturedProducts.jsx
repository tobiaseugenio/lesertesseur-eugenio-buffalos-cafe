import { useEffect, useState } from "react";
import ImagePlaceholder from "./ImagePlaceholder";
import { getProducts } from "../services/productService";
import "../styles/FeaturedProducts.css";

function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    getProducts()
      .then((data) => {
        if (isMounted) setProducts(data);
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
  }, []);

  return (
    <section className="featured">
      <h2 className="featured__title">NUESTROS PRODUCTOS ESTRELLA</h2>
      {loading && <p role="status">Cargando productos...</p>}
      {!loading && error && <p role="alert">{error}</p>}
      {!loading && !error && products.length === 0 && (
        <p>No hay productos disponibles por el momento.</p>
      )}
      {!loading && !error && products.length > 0 && (
        <div className="featured__grid">
          {products.map((product, index) => (
            <article className="featured__product" key={product.id ?? `${product.nombre}-${index}`}>
              <ImagePlaceholder
                className="featured__item"
                src={product.imagen}
                alt={product.nombre}
              />
              <h3>{product.nombre}</h3>
              {product.precioUnitario !== undefined && (
                <p>${product.precioUnitario}</p>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default FeaturedProducts;
