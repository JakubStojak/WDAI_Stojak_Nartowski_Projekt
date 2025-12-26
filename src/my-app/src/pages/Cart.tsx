import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  thumbnail: string;
}

function Cart() {
  const [items, setItems] = useState<Product[]>([]);

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setItems(JSON.parse(savedCart));
    }
  }, []);

  const clearCart = () => {
    localStorage.removeItem("cart");
    setItems([]);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Twój Koszyk</h1>
      <Link to="/products">Wróć do produktów</Link>
      <button onClick={clearCart} style={{ marginLeft: "10px" }}>
        Wyczyść koszyk
      </button>

      {items.length === 0 ? (
        <p>Koszyk jest pusty</p>
      ) : (
        <table style={{ width: "100%", marginTop: "20px" }}>
          <thead>
            <tr>
              <th>Produkt</th>
              <th>Obraz</th>
              <th>Cena</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index}>
                <td>{item.title}</td>
                <td>
                  <img src={item.thumbnail} alt={item.description} />
                </td>
                <td>${item.price}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td>
                <strong>Suma:</strong>
              </td>
              <td>
                <strong>
                  ${items.reduce((sum, p) => sum + p.price, 0).toFixed(2)}
                </strong>
              </td>
            </tr>
          </tfoot>
        </table>
      )}
    </div>
  );
}

export default Cart;
