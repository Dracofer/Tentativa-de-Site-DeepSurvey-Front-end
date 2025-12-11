import React, { useEffect, useState } from "react";
import api from "../api";

export default function Cart() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const sessionId = localStorage.getItem("sessionId");
    if (!sessionId) return;

    const r = await api.get("/cart/" + sessionId);
    setItems(r.data);
  }

  async function updateQty(id, newQty) {
    if (newQty < 1) return;

    await api.post("/cart/update", {
      itemId: id,
      quantity: newQty,
    });

    load();
  }

  async function removeItem(id) {
    await api.post("/cart/remove", { itemId: id });
    load();
  }

  if (!items.length) {
    return (
      <div className="container" style={{ paddingTop: 40 }}>
        <h3>Minha sacola</h3>
        <p>Sua sacola está vazia.</p>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: 40 }}>
      <h3>Minha sacola</h3>

      {items.map((item) => (
        <div key={item.id} className="themed-box" style={{ display: "flex", gap: 20 }}>
          <img
            src={
              item.product.imageUrl?.startsWith("http")
                ? item.product.imageUrl
                : `/images/${item.product.imageUrl}`
            }
            alt=""
            style={{
              width: 120,
              height: 120,
              objectFit: "cover",
              borderRadius: 8,
            }}
          />

          <div style={{ flex: 1 }}>
            <h4 style={{ margin: 0 }}>{item.product.name}</h4>
            <p style={{ margin: "6px 0", fontWeight: "bold" }}>
              R$ {item.price.toFixed(2).replace(".", ",")}
            </p>

            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <button onClick={() => updateQty(item.id, item.quantity - 1)} className="btn btn-light">
                -
              </button>

              <span style={{ fontSize: 16 }}>{item.quantity}</span>

              <button onClick={() => updateQty(item.id, item.quantity + 1)} className="btn btn-light">
                +
              </button>

              <button
                onClick={() => removeItem(item.id)}
                className="btn"
                style={{
                  background: "#ff4d4d",
                  color: "#fff",
                  padding: "6px 14px",
                  borderRadius: 8,
                  fontWeight: 600,
                }}
              >
                Remover
              </button>
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={() => (window.location.href = "/checkout")}
        style={{
          marginTop: 20,
          padding: "12px 22px",
          background: "#4CAF50",
          color: "#fff",
          borderRadius: 8,
          fontSize: 16,
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        Finalizar Pedido
      </button>
    </div>
  );
}