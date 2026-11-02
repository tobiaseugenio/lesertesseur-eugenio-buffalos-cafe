import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import buffaloLogo from "../assets/Buffalologo.png";
import { CART_UPDATED_EVENT, getCart } from "../utils/cart";
import "../styles/Header.css";

function Header() {
  const [cartCount, setCartCount] = useState(0);

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

  return (
    <header className="header">
      <a href="/" aria-label="Ir a la página de inicio">
        <img className="header__logo" src={buffaloLogo} alt="Buffalo Music" />
      </a>
      <nav className="header__nav" aria-label="Navegación principal">
        <a className="header__menu-link" href="/crear-producto">Productos</a>
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
