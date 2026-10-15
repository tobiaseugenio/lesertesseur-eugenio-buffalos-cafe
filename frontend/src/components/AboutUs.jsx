import ImagePlaceholder from "./ImagePlaceholder";
import { ABOUT_PARAGRAPHS } from "../utils/constants";
import "../styles/AboutUs.css";

function AboutUs() {
  return (
    <section className="about">
      <div className="about__left">
        <h2 className="about__title">
          SOBRE <br /> NOSOTROS
        </h2>
        <ImagePlaceholder className="about__image" />
      </div>
      <div className="about__text">
        {ABOUT_PARAGRAPHS.map((text, i) => (
          <p key={i}>{text}</p>
        ))}
      </div>
    </section>
  );
}

export default AboutUs;
