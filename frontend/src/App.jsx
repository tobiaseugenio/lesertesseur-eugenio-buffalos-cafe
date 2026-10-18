import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import "./styles/global.css";
 
function App() {
  const productMatch = window.location.pathname.match(/^\/productos\/([^/]+)\/?$/);

  if (productMatch) {
    return <ProductDetail productId={productMatch[1]} />;
  }

  return <Home />;
}
 
export default App;
 
