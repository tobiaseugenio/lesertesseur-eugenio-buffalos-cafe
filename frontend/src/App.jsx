import { useEffect, useState } from "react";
import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import CreateProduct from "./pages/CreateProduct";
import Menu from "./pages/Menu";
import Cart from "./pages/Cart";
import Auth from "./pages/Auth";
import { getCurrentUser } from "./services/authService";
import "./styles/global.css";

function AdminOnlyProducts() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    getCurrentUser()
      .then((user) => {
        if (!isMounted) return;

        if (!user) {
          window.location.replace("/login");
        } else if (user.role !== "admin") {
          window.location.replace("/");
        } else {
          setIsAuthorized(true);
          setIsChecking(false);
        }
      })
      .catch((requestError) => {
        if (!isMounted) return;
        if (requestError.status === 401) {
          window.location.replace("/login");
          return;
        }

        setError(requestError.message);
        setIsChecking(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (isChecking) {
    return <main aria-live="polite">Verificando permisos...</main>;
  }

  if (error) {
    return (
      <main role="alert">
        <p>No se pudo verificar el acceso: {error}</p>
        <a href="/">Volver al inicio</a>
      </main>
    );
  }

  return isAuthorized ? <CreateProduct /> : null;
}

function App() {
  const path = window.location.pathname;
  const productMatch = path.match(/^\/productos\/([^/]+)\/?$/);

  if (path.replace(/\/$/, "") === "/crear-producto") {
    return <AdminOnlyProducts />;
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