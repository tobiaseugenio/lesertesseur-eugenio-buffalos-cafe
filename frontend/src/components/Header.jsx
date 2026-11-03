import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import buffaloLogo from "../assets/Buffalologo.png";
import { CART_UPDATED_EVENT, getCart } from "../utils/cart";
import {
  AUTH_UPDATED_EVENT,
  getCurrentUser,
  logout,
} from "../services/authService";
import "../styles/Header.css";

function Header() {
  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const updateCartCount = () => {
      setCartCount(getCart().reduce((total, item) => total + item.quantity, 0));
    };

    updateCartCount();
    window.addEventListener(CART_UPDATED_EVENT, updateCartCount);
    window.addEventListener("storage", updateCartCount);

    return () => {
      window.removeEventListener(CART_UPDATED_EVENT, updateCartCount);
      window.removeEventListener("storage", updateCartCount);
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const updateUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (isMounted) setUser(currentUser);
      } catch {
        if (isMounted) setUser(null);
      }
    };

    updateUser();
    window.addEventListener(AUTH_UPDATED_EVENT, updateUser);
    window.addEventListener("storage", updateUser);

    return () => {
      isMounted = false;
      window.removeEventListener(AUTH_UPDATED_EVENT, updateUser);
      window.removeEventListener("storage", updateUser);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setUser(null);
  };

  const formatBalance = (balance) =>
    new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 2,
    }).format(Number(balance));

  return (
    <header className="header">
      <a href="/" aria-label="Ir a la página de inicio">
        <img className="header__logo" src={buffaloLogo} alt="Buffalo Music" />
      </a>
      <nav className="header__nav" aria-label="Navegación principal">
        {user ? (
          <>
            <span className="header__account" title={user.nombre}>
              Saldo: {formatBalance(user.saldo)}
            </span>
            <button type="button" className="header__logout" onClick={handleLogout}>
              Salir
            </button>
          </>
        ) : (
          <a className="header__menu-link" href="/login">Ingresar</a>
        )}
        {user?.role === "admin" && (
          <a className="header__menu-link" href="/crear-producto">Productos</a>
        )}
        <a className="header__menu-link" href="/menu">Menú</a>
        <a
          className="header__menu-link header__cart-link"
          href="/carrito"
          aria-label={`Carrito, ${cartCount} ${cartCount === 1 ? "producto" : "productos"}`}
        >
          Carrito <span>{cartCount}</span>
        </a>
      </nav>
      <form className="header__search" onSubmit={(e) => e.preventDefault()}>
        <FaSearch className="header__search-icon" />
        <input type="text" placeholder="Search..." aria-label="Buscar" />
      </form>
    </header>
  );
}

export default Header;
