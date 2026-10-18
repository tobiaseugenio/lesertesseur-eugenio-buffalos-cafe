import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import FormField from "../components/FormField";
import { createProduct } from "../services/productService";
import "../styles/CreateProduct.css";

const INITIAL_FORM = { nombre: "", precio: "", urlFoto: "", stock: "" };

function isValidImageUrl(value) {
  try {
    const url = new URL(value);
    return (
      ["http:", "https:"].includes(url.protocol) &&
      Boolean(url.hostname)
    );
  } catch {
    return false;
  }
}

function CreateProduct() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [error, setError] = useState("");
  const [createdProduct, setCreatedProduct] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
    setCreatedProduct("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nombre = form.nombre.trim();
    const precio = Number(form.precio);
    const stock = Number(form.stock);
    const urlFoto = form.urlFoto.trim();

    if (!nombre || !form.precio.trim() || !form.stock.trim() || !urlFoto) {
      setError("Completa todos los campos.");
      return;
    }

    if (!Number.isFinite(precio) || precio < 0) {
      setError("Ingresa un precio numérico mayor o igual a cero.");
      return;
    }

    if (!Number.isInteger(stock) || stock < 0) {
      setError("Ingresa un stock entero mayor o igual a cero.");
      return;
    }

    if (!isValidImageUrl(urlFoto)) {
      setError("Ingresa una URL de foto válida que comience con http:// o https://.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const product = await createProduct({
        nombre,
        precioUnitario: precio,
        stock,
        imagen: urlFoto,
      });
      setForm(INITIAL_FORM);
      setCreatedProduct(product.nombre);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header variant="dark" />
      <main className="create-product">
        <form className="create-product__form" onSubmit={handleSubmit}>
          <h1 className="create-product__title">CREAR PRODUCTO</h1>

          <div className="create-product__fields">
            <FormField
              label="Nombre"
              id="nombre"
              value={form.nombre}
              onChange={handleChange}
              required
            />
            <FormField
              label="Precio"
              id="precio"
              type="number"
              min="0"
              step="0.01"
              value={form.precio}
              onChange={handleChange}
              required
            />
            <FormField
              label="URL Foto"
              id="urlFoto"
              type="url"
              value={form.urlFoto}
              onChange={handleChange}
              required
            />
            <FormField
              label="Stock"
              id="stock"
              type="number"
              min="0"
              step="1"
              value={form.stock}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="create-product__submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "CREANDO..." : "CREAR"}
          </button>
          {error && <p className="create-product__message" role="alert">{error}</p>}
          {createdProduct && (
            <div className="create-product__message" role="status">
              <p>El producto “{createdProduct}” se creó correctamente.</p>
              <a href="/#productos">Ver productos estrella</a>
            </div>
          )}
        </form>
      </main>
      <Footer variant="dark" />
    </>
  );
}

export default CreateProduct;
