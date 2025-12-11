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
    <div className="container" style={{ paddingTop: 40 }}>
      <h2>🔥 Ofertas</h2>

      {items.length === 0 && (
        <p style={{ marginTop: 20 }}>Nenhum produto em oferta no momento.</p>
      )}

      <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
        {items.map((p) => (
          <Link
            key={p.id}
            to={`/produto/${p.id}`}
            className="themed-box"
            style={{
              width: 220,
              padding: 12,
              borderRadius: 12,
              textDecoration: "none",
              transition: "0.3s",
            }}
          >
            <img
              src={
                p.imageUrl.startsWith("http")
                  ? p.imageUrl
                  : `/images/${p.imageUrl}`
              }
              alt={p.name}
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
            <p style={{ fontWeight: "bold" }}>
              R$ {p.salePrice.toFixed(2).replace(".", ",")}
            </p>

            {/* Preço normal */}
            <p style={{ textDecoration: "line-through", opacity: 0.7 }}>
              R$ {p.price.toFixed(2).replace(".", ",")}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}