import React, { useEffect, useState } from "react";
import api from "../api";
import { Link } from "react-router-dom";

export default function Offers() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const r = await api.get("/products/offers");
        setItems(r.data);
      } catch (err) {
        console.error("Erro ao carregar ofertas", err);
      }
    }

    load();
  }, []);

  return (
    <div className="container" style={{ paddingTop: 30 }}>
      <h2>🔥 Ofertas</h2>

      {items.length === 0 && (
        <p style={{ marginTop: 20 }}>Nenhum produto em oferta no momento.</p>
      )}

      <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
        {items.map((p) => (
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

            {/* Preço de oferta */}
            <p style={{ fontWeight: "bold", color: "#d9534f" }}>
              R$ {p.salePrice.toFixed(2).replace(".", ",")}
            </p>

            {/* Preço normal riscado */}
            <p style={{ textDecoration: "line-through", color: "#888" }}>
              R$ {p.price.toFixed(2).replace(".", ",")}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}