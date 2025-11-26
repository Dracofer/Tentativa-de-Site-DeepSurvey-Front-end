import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard";

export default function Produtos() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8083/products")
      .then(res => setProducts(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="container" style={{ paddingTop: 40 }}>
      <h2>Todos os Produtos</h2>

      <div className="grid">
        {products.map(p => (
          <ProductCard key={p.id} p={p} />
        ))}
      </div>
    </div>
  );
}