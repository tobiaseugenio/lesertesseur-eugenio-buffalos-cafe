import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import CreateProduct from "./pages/CreateProduct";
import Menu from "./pages/Menu";
import Cart from "./pages/Cart";
import Auth from "./pages/Auth";
import "./styles/global.css";

function App() {
  const path = window.location.pathname;
  const productMatch = path.match(/^\/productos\/([^/]+)\/?$/);

  if (path.replace(/\/$/, "") === "/crear-producto") {
    return <CreateProduct />;
  }

  if (path.replace(/\/$/, "") === "/menu") {
    return <Menu />;
  }

  if (path.replace(/\/$/, "") === "/carrito") {
    return <Cart />;
  }

  if (path.replace(/\/$/, "") === "/login") {
    return <Auth />;
  }

  if (productMatch) {
    return <ProductDetail productId={productMatch[1]} />;
  }

  return <Home />;
}

export default App;