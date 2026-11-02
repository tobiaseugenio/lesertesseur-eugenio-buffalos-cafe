import { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ImagePlaceholder from "../components/ImagePlaceholder";
import { getProducts } from "../services/productService";
import "../styles/Menu.css";

const priceFormatter = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 2,
});

function Menu() {
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

  const featuredProducts = products.filter((product) => product.esProductoEstrella);
  const otherProducts = products.filter((product) => !product.esProductoEstrella);

  const renderProducts = (items) => (
    <div className="menu__grid">
      {items.map((product) => (
        <article className="menu__product" key={product.id}>
          <a
            className="menu__product-link"
            href={`/productos/${product.id}`}
            aria-label={`Ver ${product.nombre}, ${priceFormatter.format(Number(product.precioUnitario))}`}
          >
            <ImagePlaceholder
              className="menu__image"
              src={product.imagen}
              alt={product.nombre}
            />
            <h3>{product.nombre}</h3>
            <p>{priceFormatter.format(Number(product.precioUnitario))}</p>
          </a>
        </article>
      ))}
    </div>
  );

  return (
    <>
      <Header variant="dark" />
      <main className="menu-page">
        <header className="menu-page__heading">
          <h1>NUESTRO MENÚ</h1>
        </header>

        {loading && <p className="menu-page__message" role="status">Cargando productos...</p>}
        {!loading && error && <p className="menu-page__message" role="alert">{error}</p>}
        {!loading && !error && (
          <>
            <section className="menu-section menu-section--featured">
              <h2>PRODUCTOS ESTRELLA</h2>
              {featuredProducts.length > 0
                ? renderProducts(featuredProducts)
                : <p className="menu-section__empty">No hay productos estrella disponibles.</p>}
            </section>

            <section className="menu-section menu-section--regular">
              <h2>MENÚ</h2>
              {otherProducts.length > 0
                ? renderProducts(otherProducts)
                : <p className="menu-section__empty">No hay otros productos disponibles.</p>}
            </section>
          </>
        )}
      </main>
      <Footer variant="dark" />
    </>
  );
}

export default Menu;