import ImagePlaceholder from "./ImagePlaceholder";
import "../styles/FeaturedProducts.css";

const PRODUCTS = [1, 2, 3, 4]; // placeholders; luego reemplazar por datos reales

function FeaturedProducts() {
  return (
    <section className="featured">
      <h2 className="featured__title">NUESTROS PRODUCTOS ESTRELLA</h2>
      <div className="featured__grid">
        {PRODUCTS.map((id) => (
          <ImagePlaceholder key={id} className="featured__item" />
        ))}
      </div>
    </section>
  );
}

export default FeaturedProducts;
