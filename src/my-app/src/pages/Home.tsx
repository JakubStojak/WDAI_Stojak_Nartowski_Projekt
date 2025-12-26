import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Home() {
  const id = 39;
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await fetch(`https://dummyjson.com/products/${id}`);
      const data = await response.json();

      if (data.id) {
        setProduct(data);
      } else {
        setProduct(null);
      }
    } catch (error) {
      console.error("Błąd połączenia:", error);
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  if (loading) return <h2>Ładowanie...</h2>;

  if (!product) {
    return (
      <div style={{ color: "red", padding: "20px" }}>
        <h2>Nie znaleziono produktu!</h2>
        <p>
          Próbowano pobrać ID: <strong>{id}</strong>
        </p>
        <Link to="/products">Powrót do listy</Link>
      </div>
    );
  }

  return (
    <div>
      <h1>Witaj w naszym sklepie</h1>
      <div>
        <h2>Produkt miesiąca:</h2>
        <div>
          <h3>{product.title}</h3>
          <img
            src={product.thumbnail}
            alt={product.title}
            style={{ width: "200px" }}
          />
          <p>Cena: {product.price}$</p>
        </div>
      </div>
    </div>
  );
}

export default Home;
