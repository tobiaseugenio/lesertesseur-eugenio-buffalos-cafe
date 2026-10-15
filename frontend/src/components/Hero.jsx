import ImagePlaceholder from "./ImagePlaceholder";
import { CAFE_NAME } from "../utils/constants";
import "../styles/Hero.css";

function Hero() {
  return (
    <section className="hero">
      <ImagePlaceholder className="hero__image" />
      <h1 className="hero__title">{CAFE_NAME.toUpperCase()}</h1>
    </section>
  );
}

export default Hero;
