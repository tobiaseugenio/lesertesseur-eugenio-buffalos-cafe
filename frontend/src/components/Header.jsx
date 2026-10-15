import { FaSearch } from "react-icons/fa";
import ImagePlaceholder from "./ImagePlaceholder";
import "../styles/Header.css";

function Header() {
  return (
    <header className="header">
      <ImagePlaceholder className="header__logo" />
      <form className="header__search" onSubmit={(e) => e.preventDefault()}>
        <FaSearch className="header__search-icon" />
        <input type="text" placeholder="Search..." aria-label="Buscar" />
      </form>
    </header>
  );
}

export default Header;
