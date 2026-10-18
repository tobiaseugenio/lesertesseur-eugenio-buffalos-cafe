import { FaSearch } from "react-icons/fa";
import buffaloLogo from "../assets/Buffalologo.png";
import "../styles/Header.css";

function Header() {
  return (
    <header className="header">
      <a href="/" aria-label="Ir a la página de inicio">
        <img className="header__logo" src={buffaloLogo} alt="Buffalo Music" />
      </a>
      <form className="header__search" onSubmit={(e) => e.preventDefault()}>
        <FaSearch className="header__search-icon" />
        <input type="text" placeholder="Search..." aria-label="Buscar" />
      </form>
    </header>
  );
}

export default Header;
