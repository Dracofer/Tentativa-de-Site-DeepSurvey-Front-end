import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function ProductCard({ p }) {
  const nav = useNavigate();

  return (
    <div style={{ position: "relative" }} className="card">

      {/* Selo de oferta */}
      {p.onSale === true && (
        <div
          style={{
            position: "absolute",
            top: 10,
            left: 10,
            background: "red",
            color: "white",
            padding: "4px 8px",
            borderRadius: 6,
            fontWeight: "bold",
            fontSize: 12,
          }}
        >
          Oferta
        </div>
      )}

      <Link to={`/produto/${p.id}`} style={{ width: "100%" }}>
        <img
          className="img"
          src={p.imageUrl ? `/images/${p.imageUrl}` : "/images/placeholder.jpeg"}
          alt={p.name}
        />
        <h3>{p.name}</h3>
      </Link>

      {/* Preço */}
      <div className="price" style={{ margin: "10px 0" }}>
        {p.onSale ? (
          <>
            <span
              style={{
                color: "red",
                fontWeight: "bold",
                marginRight: 8,
                fontSize: 18,
              }}
            >
              R$ {p.salePrice.toFixed(2).replace(".", ",")}
            </span>

            <span
              style={{
                textDecoration: "line-through",
                color: "#777",
                fontSize: 14,
              }}
            >
              R$ {p.price.toFixed(2).replace(".", ",")}
            </span>
          </>
        ) : (
          <span style={{ fontWeight: "bold", fontSize: 18 }}>
            R$ {p.price.toFixed(2).replace(".", ",")}
          </span>
        )}
      </div>

      <button
        className="btn"
        onClick={() => nav(`/produto/${p.id}`)}
      >
        Comprar
      </button>
    </div>
  );
}