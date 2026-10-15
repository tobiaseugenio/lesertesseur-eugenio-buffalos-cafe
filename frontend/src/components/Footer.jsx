import { FaFacebook, FaInstagram, FaTiktok } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { CAFE_NAME, CONTACT } from "../utils/constants";
import "../styles/Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__contact">
        <h3>Contacto</h3>
        <p>{CONTACT.phone}</p>
        <p>{CONTACT.whatsapp}</p>
        <p>{CONTACT.address}</p>
      </div>
      <div className="footer__brand">
        <h3>{CAFE_NAME}</h3>
        <div className="footer__social">
          <a href="#" aria-label="Facebook"><FaFacebook /></a>
          <a href="#" aria-label="Instagram"><FaInstagram /></a>
          <a href="#" aria-label="TikTok"><FaTiktok /></a>
          <a href="#" aria-label="Email"><MdEmail /></a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
