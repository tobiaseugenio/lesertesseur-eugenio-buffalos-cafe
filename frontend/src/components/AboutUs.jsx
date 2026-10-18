import ImagePlaceholder from "./ImagePlaceholder";
import { ABOUT_PARAGRAPHS } from "../utils/constants";
import aboutImage from "../assets/sobreNosotros.jpg";
import "../styles/AboutUs.css";

function AboutUs() {
  return (
    <section className="about">
      <h2 className="about__title">SOBRE NOSOTROS</h2>
      <ImagePlaceholder
        className="about__image"
        src={aboutImage}
        alt="Frente del local Buffalo Music"
      />
      <div className="about__text">
        {ABOUT_PARAGRAPHS.map((text, i) => (
          <p key={i}>{text}</p>
        ))}
      </div>
    </section>
  );
}

export default AboutUs;
