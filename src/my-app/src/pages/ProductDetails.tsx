import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@mui/material";

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  thumbnail: string;
  reviews: Review[];
}

interface Review {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
}

const addToCart = (product: Product) => {
  const existingCart = localStorage.getItem("cart");
  const cart: Product[] = existingCart ? JSON.parse(existingCart) : [];

  const updatedCart = [...cart, product];

  localStorage.setItem("cart", JSON.stringify(updatedCart));
  alert("Dodano do koszyka!");
};

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id || id === "id") {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`https://dummyjson.com/products/${id}`);
        const data = await response.json();

        if (data.message) {
          console.error("API zwróciło błąd:", data.message);
          setProduct(null);
        } else {
          setProduct(data);
        }
      } catch (error) {
        console.error("Błąd połączenia:", error);
      } finally {
        setLoading(false);
      }
    };

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
    <div style={{ padding: "20px" }}>
      <Link to="/products">← Powrót</Link>
      <hr />
      <h1>{product.title}</h1>
      <img
        src={product.thumbnail}
        alt={product.title}
        style={{ width: "200px" }}
      />
      <Button
        type="submit"
        variant="contained"
        onClick={() => addToCart(product)}
      >
        Dodaj do koszyka
      </Button>
      <p>{product.description}</p>
      <p>Cena: ${product.price}</p>
      <div style={{ marginTop: "30px" }}>
        <h3>Opinie ({product.reviews?.length || 0})</h3>

        {product.reviews && product.reviews.length > 0 ? (
          product.reviews.map((review: Review, index: number) => (
            <div
              key={`review-${index}`}
              style={{
                padding: "10px",
                borderBottom: "1px solid #ddd",
                marginBottom: "10px",
              }}
            >
              <p>
                <strong>{review.reviewerName}</strong> ({review.rating}/5 ⭐)
              </p>
              <p>{review.comment}</p>
              <small>{new Date(review.date).toLocaleDateString()}</small>
            </div>
          ))
        ) : (
          <p>Brak opinii.</p>
        )}
      </div>
    </div>
  );
}

export default ProductDetails;
