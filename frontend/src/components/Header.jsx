import { useEffect, useRef, useState } from "react";
import { FaSearch } from "react-icons/fa";
import buffaloLogo from "../assets/Buffalologo.png";
import { CART_UPDATED_EVENT, getCart } from "../utils/cart";
import {
  AUTH_UPDATED_EVENT,
  addBalance,
  getCurrentUser,
  logout,
} from "../services/authService";
import { getProducts } from "../services/productService";
import "../styles/Header.css";

const priceFormatter = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 2,
});

function Header() {
  const balanceDialogRef = useRef(null);
  const searchRef = useRef(null);
  const searchRequestRef = useRef(null);
  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchProducts, setSearchProducts] = useState(null);
  const [searchError, setSearchError] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [balanceAmount, setBalanceAmount] = useState("");
  const [balanceError, setBalanceError] = useState("");
  const [balanceMessage, setBalanceMessage] = useState("");
  const [isAddingBalance, setIsAddingBalance] = useState(false);
  const normalizedSearchQuery = searchQuery
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
  const matchingProducts = normalizedSearchQuery && searchProducts
    ? searchProducts.filter((product) =>
      product.nombre
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .includes(normalizedSearchQuery)
    )
    : [];
  const showSearchResults = isSearchFocused && normalizedSearchQuery.length > 0;

  useEffect(() => {
    if (!normalizedSearchQuery || searchProducts) return undefined;

    let isCurrent = true;
    const timeoutId = window.setTimeout(() => {
      setIsSearchLoading(true);
      setSearchError("");
      if (!searchRequestRef.current) {
        searchRequestRef.current = getProducts().catch((requestError) => {
          searchRequestRef.current = null;
          throw requestError;
        });
      }

      searchRequestRef.current
        .then((products) => {
          if (isCurrent) setSearchProducts(products);
        })
        .catch((requestError) => {
          if (isCurrent) setSearchError(requestError.message);
        })
        .finally(() => {
          if (isCurrent) setIsSearchLoading(false);
        });
    }, 200);

    return () => {
      isCurrent = false;
      window.clearTimeout(timeoutId);
    };
  }, [normalizedSearchQuery, searchProducts]);

  useEffect(() => {
    if (!isSearchFocused) return undefined;

    const closeOnOutsideClick = (event) => {
      if (!searchRef.current?.contains(event.target)) setIsSearchFocused(false);
    };

    document.addEventListener("pointerdown", closeOnOutsideClick);
    return () => document.removeEventListener("pointerdown", closeOnOutsideClick);
  }, [isSearchFocused]);

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

  const openBalanceDialog = () => {
    setBalanceAmount("");
    setBalanceError("");
    setBalanceMessage("");
    balanceDialogRef.current?.showModal();
  };

  const handleAddBalance = async (event) => {
    event.preventDefault();
    setBalanceError("");
    setBalanceMessage("");

    const amount = Number(balanceAmount);
    if (!Number.isFinite(amount) || amount <= 0 || Number(amount.toFixed(2)) !== amount) {
      setBalanceError("Ingresa un importe positivo con un máximo de dos decimales.");
      return;
    }

    setIsAddingBalance(true);
    try {
      const updatedUser = await addBalance(amount);
      setUser(updatedUser);
      setBalanceAmount("");
      setBalanceMessage("El saldo de prueba se agregó correctamente.");
    } catch (requestError) {
      setBalanceError(requestError.message);
    } finally {
      setIsAddingBalance(false);
    }
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
            <span className="header__account">
              <span className="header__user-name">{user.nombre}</span>
              <span>Saldo: {formatBalance(user.saldo)}</span>
              <button
                type="button"
                className="header__balance-button"
                onClick={openBalanceDialog}
              >
                Agregar saldo
              </button>
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
      <div className="header__search-container" ref={searchRef}>
        <form
          className="header__search"
          role="search"
          onSubmit={(event) => event.preventDefault()}
        >
          <FaSearch className="header__search-icon" aria-hidden="true" />
          <input
            type="search"
            placeholder="Buscar productos..."
            aria-label="Buscar productos"
            aria-controls="header-search-results"
            aria-expanded={showSearchResults}
            value={searchQuery}
            onFocus={() => setIsSearchFocused(true)}
            onChange={(event) => {
              setSearchQuery(event.target.value);
              setSearchError("");
            }}
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                setIsSearchFocused(false);
                event.currentTarget.blur();
              }
            }}
          />
        </form>
        {showSearchResults && (
          <div className="header__search-results" id="header-search-results">
            {isSearchLoading && (
              <p className="header__search-message" role="status">Buscando productos...</p>
            )}
            {searchError && (
              <p className="header__search-message header__search-message--error" role="alert">
                {searchError}
              </p>
            )}
            {!isSearchLoading && !searchError && searchProducts && (
              matchingProducts.length > 0 ? (
                <ul>
                  {matchingProducts.map((product) => (
                    <li key={product.id}>
                      <a
                        href={`/productos/${product.id}`}
                        onClick={() => setIsSearchFocused(false)}
                      >
                        <span>{product.nombre}</span>
                        <span>{priceFormatter.format(Number(product.precioUnitario))}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="header__search-message" role="status">
                  No se encontraron productos que coincidan.
                </p>
              )
            )}
          </div>
        )}
      </div>
      <dialog className="balance-dialog" ref={balanceDialogRef} aria-labelledby="balance-title">
        <form className="balance-dialog__form" onSubmit={handleAddBalance}>
          <h2 id="balance-title">Agregar saldo de prueba</h2>
          <p>Este importe simulado se sumará al saldo de tu cuenta.</p>
          <label htmlFor="balance-amount">Importe (ARS)</label>
          <input
            id="balance-amount"
            type="number"
            min="0.01"
            max="9999999999.99"
            step="0.01"
            value={balanceAmount}
            onChange={(event) => {
              setBalanceAmount(event.target.value);
              setBalanceError("");
              setBalanceMessage("");
            }}
            aria-invalid={Boolean(balanceError)}
            aria-describedby={balanceError ? "balance-error" : undefined}
            required
          />
          {balanceError && <p className="balance-dialog__error" id="balance-error" role="alert">{balanceError}</p>}
          {balanceMessage && <p className="balance-dialog__success" role="status">{balanceMessage}</p>}
          <div className="balance-dialog__actions">
            <button type="button" onClick={() => balanceDialogRef.current?.close()}>
              Cerrar
            </button>
            <button type="submit" disabled={isAddingBalance}>
              {isAddingBalance ? "AGREGANDO..." : "AGREGAR SALDO"}
            </button>
          </div>
        </form>
      </dialog>
    </header>
  );
}

export default Header;
