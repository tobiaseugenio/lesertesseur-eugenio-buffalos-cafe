import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import FormField from "../components/FormField";
import "../styles/CreateProduct.css";

const INITIAL_FORM = { nombre: "", precio: "", urlFoto: "", stock: "" };

function CreateProduct() {
  const [form, setForm] = useState(INITIAL_FORM);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Producto a crear:", form);
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
            />
            <FormField
              label="Precio"
              id="precio"
              type="number"
              min="0"
              step="0.01"
              value={form.precio}
              onChange={handleChange}
            />
            <FormField
              label="URL Foto"
              id="urlFoto"
              type="url"
              value={form.urlFoto}
              onChange={handleChange}
            />
            <FormField
              label="Stock"
              id="stock"
              type="number"
              min="0"
              step="1"
              value={form.stock}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="create-product__submit">
            CREAR
          </button>
        </form>
      </main>
      <Footer variant="dark" />
    </>
  );
}

export default CreateProduct;
