import Header from "../components/Header";
import Hero from "../components/Hero";
import FeaturedProducts from "../components/FeaturedProducts";
import AboutUs from "../components/AboutUs";
import Footer from "../components/Footer";

function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <FeaturedProducts />
        <AboutUs />
      </main>
      <Footer />
    </>
  );
}

export default Home;
