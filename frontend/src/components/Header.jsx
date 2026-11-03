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
import "../styles/Header.css";

function Header() {
  const balanceDialogRef = useRef(null);
  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState(null);
  const [balanceAmount, setBalanceAmount] = useState("");
  const [balanceError, setBalanceError] = useState("");
  const [balanceMessage, setBalanceMessage] = useState("");
  const [isAddingBalance, setIsAddingBalance] = useState(false);

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
      <form className="header__search" onSubmit={(e) => e.preventDefault()}>
        <FaSearch className="header__search-icon" />
        <input type="text" placeholder="Search..." aria-label="Buscar" />
      </form>
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
