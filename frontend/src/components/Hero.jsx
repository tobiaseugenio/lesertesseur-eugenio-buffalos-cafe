import heroBackground from "../assets/heroSectionBg.png";
import { CAFE_NAME } from "../utils/constants";
import "../styles/Hero.css";

function Hero() {
  return (
    <section className="hero">
      <img className="hero__image" src={heroBackground} alt="" />
      <h1 className="hero__title">{CAFE_NAME.toUpperCase()}</h1>
    </section>
  );
}

export default Hero;
