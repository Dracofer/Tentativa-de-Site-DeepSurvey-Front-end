import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function ProductCard({ p }) {
  const nav = useNavigate();

  const imgSrc = p.imageUrl
    ? (p.imageUrl.startsWith("http")
        ? p.imageUrl
        : `/images/${p.imageUrl}`)
    : "/images/placeholder.jpeg";

  return (
    <div className="card" style={{ position: "relative" }}>
      
      {p.onSale && (
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
            fontSize: 12
          }}
        >
          Oferta
        </div>
      )}

      <Link to={`/produto/${p.id}`} style={{ width: "100%" }}>
        <img
          src={imgSrc}
          alt={p.name}
          style={{
            width: "100%",
            height: 200,
            objectFit: "contain",
            padding: 10,
            borderRadius: 12
          }}
        />
        <h3>{p.name}</h3>
      </Link>

      <div className="price" style={{ margin: "10px 0" }}>
        {p.onSale ? (
          <>
            <span className="price-promo">
              R$ {p.salePrice.toFixed(2).replace(".", ",")}
            </span>

            <span style={{
              marginLeft: 8,
              textDecoration: "line-through",
              color: "#777",
              fontSize: 14
            }}>
              R$ {p.price.toFixed(2).replace(".", ",")}
            </span>
          </>
        ) : (
          <span style={{ fontWeight: "bold", fontSize: 18 }}>
            R$ {p.price.toFixed(2).replace(".", ",")}
          </span>
        )}
      </div>

      <button className="btn" onClick={() => nav(`/produto/${p.id}`)}>
        Comprar
      </button>
    </div>
  );
}