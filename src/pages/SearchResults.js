import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api";
import ProductCard from "../components/ProductCard";

export default function SearchResults() {
  const [params] = useSearchParams();
  const query = params.get("q") || "";
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (!query) return;

    async function load() {
      try {
        const r = await api.get("/products/search?q=" + query);
        setProducts(r.data);
      } catch (err) {
        console.error("Erro ao buscar:", err);
      }
    }

    load();
  }, [query]);

  return (
    <div className="container" style={{ paddingTop: 30 }}>
      <h2>Resultados para: <b>{query}</b></h2>

      {products.length === 0 && (
        <p style={{ marginTop: 20 }}>Nenhum produto encontrado.</p>
      )}

      <div className="products-grid">
        {products.map((p) => (
          <ProductCard key={p.id} p={p} />
        ))}
      </div>
    </div>
  );
}