import { useEffect, useRef, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import FormField from "../components/FormField";
import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
} from "../services/productService";
import "../styles/CreateProduct.css";

const INITIAL_FORM = {
  nombre: "",
  precio: "",
  urlFoto: "",
  stock: "",
  esProductoEstrella: false,
};

function productToForm(product) {
  return {
    nombre: product.nombre,
    precio: String(product.precioUnitario),
    urlFoto: product.imagen || "",
    stock: String(product.stock),
    esProductoEstrella: Boolean(product.esProductoEstrella),
  };
}

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
  const deleteDialogRef = useRef(null);
  const [form, setForm] = useState(INITIAL_FORM);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [mode, setMode] = useState("create");
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [pendingDeleteProduct, setPendingDeleteProduct] = useState(null);

  useEffect(() => {
    const dialog = deleteDialogRef.current;
    if (!dialog) return;

    if (pendingDeleteProduct && !dialog.open) {
      dialog.showModal();
    } else if (!pendingDeleteProduct && dialog.open) {
      dialog.close();
    }
  }, [pendingDeleteProduct]);

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    setError("");
    setSuccessMessage("");
  };

  const handleModeChange = async (nextMode) => {
    setMode(nextMode);
    setError("");
    setSuccessMessage("");

    if (nextMode === "create") {
      setForm(INITIAL_FORM);
      setSelectedProductId("");
      return;
    }

    setIsLoadingProducts(true);
    try {
      const loadedProducts = await getProducts();
      setProducts(loadedProducts);
      const firstProduct = loadedProducts[0];
      setSelectedProductId(firstProduct ? String(firstProduct.id) : "");
      setForm(firstProduct && nextMode === "edit" ? productToForm(firstProduct) : INITIAL_FORM);
      if (loadedProducts.length === 0) {
        setError("No hay productos disponibles.");
      }
    } catch (requestError) {
      setError(requestError.message);
      setProducts([]);
      setSelectedProductId("");
      setForm(INITIAL_FORM);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  const handleProductSelect = (e) => {
    const productId = e.target.value;
    setSelectedProductId(productId);
    setError("");
    setSuccessMessage("");

    if (mode === "edit") {
      const product = products.find((item) => String(item.id) === productId);
      setForm(product ? productToForm(product) : INITIAL_FORM);
    }
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
      const productData = {
        nombre,
        precioUnitario: precio,
        stock,
        imagen: urlFoto,
        esProductoEstrella: form.esProductoEstrella,
      };
      const product = mode === "edit"
        ? await updateProduct(selectedProductId, productData)
        : await createProduct(productData);

      if (mode === "edit") {
        setProducts((currentProducts) =>
          currentProducts.map((item) => item.id === product.id ? product : item)
        );
        setForm(productToForm(product));
        setSuccessMessage(`El producto “${product.nombre}” se actualizó correctamente.`);
      } else {
        setForm(INITIAL_FORM);
        setSuccessMessage(`El producto “${product.nombre}” se creó correctamente.`);
      }
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = () => {
    if (!selectedProductId) {
      setError("Selecciona un producto para eliminar.");
      return;
    }

    const selectedProduct = products.find((item) => String(item.id) === selectedProductId);
    if (!selectedProduct) {
      setError("No se encontró el producto seleccionado.");
      return;
    }

    setError("");
    setSuccessMessage("");
    setPendingDeleteProduct(selectedProduct);
  };

  const confirmDelete = async () => {
    if (!pendingDeleteProduct) return;

    const selectedProduct = pendingDeleteProduct;
    setIsDeleting(true);
    setError("");

    try {
      await deleteProduct(selectedProduct.id);
      const remainingProducts = products.filter((item) => item.id !== selectedProduct.id);
      setProducts(remainingProducts);
      setSelectedProductId(remainingProducts[0] ? String(remainingProducts[0].id) : "");
      setSuccessMessage(`El producto “${selectedProduct?.nombre}” se eliminó correctamente.`);
      setPendingDeleteProduct(null);
    } catch (requestError) {
      setError(requestError.message);
      setPendingDeleteProduct(null);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Header variant="dark" />
      <main className="create-product">
        <div className="create-product__layout">
          <section className="create-product__editor">
            <h1 className="create-product__title">
              {mode === "edit" ? "MODIFICAR PRODUCTO" : mode === "delete" ? "ELIMINAR PRODUCTO" : "CREAR PRODUCTO"}
            </h1>

            {mode !== "create" && (
              <div className="create-product__selector">
                <label htmlFor="product-selection">Producto</label>
                <select
                  id="product-selection"
                  value={selectedProductId}
                  onChange={handleProductSelect}
                  disabled={isLoadingProducts || products.length === 0}
                >
                  {products.length === 0 ? (
                    <option value="">No hay productos</option>
                  ) : products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.nombre} (ID: {product.id})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {mode !== "delete" && (
              <form id="product-form" className="create-product__form" onSubmit={handleSubmit}>
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
                  <label className="create-product__featured-toggle">
                    <input
                      type="checkbox"
                      name="esProductoEstrella"
                      checked={form.esProductoEstrella}
                      onChange={handleChange}
                    />
                    <span>Incluir en productos estrella</span>
                  </label>
                </div>
              </form>
            )}

            {error && <p className="create-product__message" role="alert">{error}</p>}
            {successMessage && (
              <div className="create-product__message" role="status">
                <p>{successMessage}</p>
                {mode === "create" && <a href="/#productos">Ver productos estrella</a>}
              </div>
            )}
          </section>

          <aside className="create-product__actions" aria-label="Acciones de productos">
            <div className="create-product__mode-options">
              <button
                type="button"
                className={`create-product__mode ${mode === "create" ? "is-active" : ""}`}
                aria-pressed={mode === "create"}
                onClick={() => handleModeChange("create")}
                disabled={isSubmitting || isDeleting || isLoadingProducts}
              >
                CREAR PRODUCTO
              </button>
              <button
                type="button"
                className={`create-product__mode ${mode === "edit" ? "is-active" : ""}`}
                aria-pressed={mode === "edit"}
                onClick={() => handleModeChange("edit")}
                disabled={isSubmitting || isDeleting || isLoadingProducts}
              >
                MODIFICAR PRODUCTO
              </button>
              <button
                type="button"
                className={`create-product__mode ${mode === "delete" ? "is-active" : ""}`}
                aria-pressed={mode === "delete"}
                onClick={() => handleModeChange("delete")}
                disabled={isSubmitting || isDeleting || isLoadingProducts}
              >
                ELIMINAR PRODUCTO
              </button>
            </div>

            {mode === "delete" ? (
              <button
                type="button"
                className="create-product__submit"
                onClick={handleDelete}
                disabled={isDeleting || isLoadingProducts || products.length === 0}
              >
                {isDeleting ? "ELIMINANDO..." : "ELIMINAR"}
              </button>
            ) : (
              <button
                type="submit"
                form="product-form"
                className="create-product__submit"
                disabled={isSubmitting || isLoadingProducts || (mode === "edit" && !selectedProductId)}
              >
                {isSubmitting ? (mode === "edit" ? "GUARDANDO..." : "CREANDO...") : (mode === "edit" ? "GUARDAR" : "CREAR")}
              </button>
            )}
          </aside>
        </div>
      </main>
      <dialog
        ref={deleteDialogRef}
        className="delete-confirm"
        aria-labelledby="delete-confirm-title"
        aria-describedby="delete-confirm-description"
        onCancel={(event) => {
          event.preventDefault();
          if (!isDeleting) setPendingDeleteProduct(null);
        }}
      >
        {pendingDeleteProduct && (
          <>
            <h2 id="delete-confirm-title">Confirmar eliminación</h2>
            <p id="delete-confirm-description">
              ¿Querés borrar definitivamente el producto <strong>{pendingDeleteProduct.nombre}</strong>?
            </p>
            <div className="delete-confirm__actions">
              <button
                type="button"
                className="delete-confirm__cancel"
                onClick={() => setPendingDeleteProduct(null)}
                disabled={isDeleting}
                autoFocus
              >
                Cancelar
              </button>
              <button
                type="button"
                className="delete-confirm__accept"
                onClick={confirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "Borrando..." : "Borrar definitivamente"}
              </button>
            </div>
          </>
        )}
      </dialog>
      <Footer variant="dark" />
    </>
  );
}

export default CreateProduct;
