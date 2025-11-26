import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api";
import { Link } from "react-router-dom";

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
      <h2>
        Resultados para: <b>{query}</b>
      </h2>

      {products.length === 0 && (
        <p style={{ marginTop: 20 }}>Nenhum produto encontrado.</p>
      )}

      <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
        {products.map((p) => (
          <Link
            key={p.id}
            to={`/produto/${p.id}`}
            style={{
              width: 220,
              padding: 12,
              textDecoration: "none",
              color: "#000",
              background: "#fff",
              borderRadius: 10,
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <img
              src={`/images/${p.imageUrl}`}
              alt=""
              style={{
                width: "100%",
                height: 180,
                objectFit: "cover",
                borderRadius: 8,
                marginBottom: 10,
              }}
            />

            <h4 style={{ margin: "6px 0", fontSize: 18 }}>{p.name}</h4>
            <p style={{ fontWeight: "bold", color: "#555" }}>
              R$ {p.price.toFixed(2).replace(".", ",")}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}