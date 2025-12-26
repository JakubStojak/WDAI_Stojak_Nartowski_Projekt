import { useState, useEffect } from "react";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";

interface Review {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
}

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  thumbnail: string;
  reviews: Review[];
}

const addToCart = (product: Product) => {
  const existingCart = localStorage.getItem("cart");
  const cart: Product[] = existingCart ? JSON.parse(existingCart) : [];

  const updatedCart = [...cart, product];

  localStorage.setItem("cart", JSON.stringify(updatedCart));
  alert("Dodano do koszyka!");
};

const Products = () => {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [displayList, setDisplayList] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("https://dummyjson.com/products");
        const data = await response.json();
        setAllProducts(data.products);
        setDisplayList(data.products.slice(0, 30));
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchProducts();
  }, []);

  const handleFilter = (word: string) => {
    setSearchTerm(word);
    const filtered = allProducts.filter(
      (p) =>
        p.title.toLowerCase().includes(word.toLowerCase()) ||
        p.description.toLowerCase().includes(word.toLowerCase())
    );
    setDisplayList(filtered.slice(0, 30));
  };

  const sortAsc = () => {
    const sorted = [...displayList].sort((a, b) =>
      a.title.localeCompare(b.title)
    );
    setDisplayList(sorted);
  };

  const sortDesc = () => {
    const sorted = [...displayList].sort((a, b) =>
      b.title.localeCompare(a.title)
    );
    setDisplayList(sorted);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Produkty</h1>

      <div style={{ marginBottom: "10px" }}>
        <input
          type="text"
          placeholder="Szukaj..."
          value={searchTerm}
          onChange={(e) => handleFilter(e.target.value)}
        />
        <button onClick={sortAsc}>Sortuj A-Z</button>
        <button onClick={sortDesc}>Sortuj Z-A</button>
        <button onClick={() => setDisplayList(allProducts.slice(0, 30))}>
          Oryginalna kolejność
        </button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Zdjęcie</th>
            <th>Tytuł</th>
            <th>Opis</th>
            <th>Do Koszyka</th>
          </tr>
        </thead>
        <tbody>
          {displayList.map((p) => (
            <tr key={p.id}>
              <td>
                <img
                  src={p.thumbnail}
                  alt={p.title}
                  style={{ width: "100px" }}
                />
              </td>
              <td>
                <Button component={Link} to={`/productdetails/${p.id}`}>
                  {p.title}
                </Button>
              </td>
              <td>{p.description}</td>
              <td>
                <Button
                  type="submit"
                  variant="contained"
                  onClick={() => addToCart(p)}
                >
                  Dodaj do koszyka
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Products;
