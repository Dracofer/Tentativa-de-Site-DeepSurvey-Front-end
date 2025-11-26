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

  // Atualizar quantidade
  async function updateQty(id, newQty) {
    if (newQty < 1) return;

    await api.post("/cart/update", {
      itemId: id,
      quantity: newQty,
    });

    load();
  }

  // Remover item
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
        <div
          key={item.id}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            marginBottom: 25,
            background: "#fff",
            borderRadius: 10,
            padding: 15,
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            maxWidth: 650,
          }}
        >
          <img
            src={`/images/${item.product.imageUrl}`}
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
              <button
                className="btn btn-light"
                onClick={() => updateQty(item.id, item.quantity - 1)}
              >
                -
              </button>

              <span style={{ fontSize: 16 }}>{item.quantity}</span>

              <button
                className="btn btn-light"
                onClick={() => updateQty(item.id, item.quantity + 1)}
              >
                +
              </button>

              <button
                onClick={() => removeItem(item.id)}
                style={{
                  background: "#ff4d4d",
                  color: "#fff",
                  border: "none",
                  padding: "6px 14px",
                  borderRadius: 8,
                  cursor: "pointer",
                  fontSize: 14,
                  fontWeight: 600,
                  transition: "0.2s",
                }}
                onMouseOver={(e) =>
                  (e.target.style.background = "#e04343")
                }
                onMouseOut={(e) =>
                  (e.target.style.background = "#ff4d4d")
                }
              >
                Remover
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* BOTÃO FINALIZAR PEDIDO */}
      <button
        onClick={() => (window.location.href = "/checkout")}
        style={{
          marginTop: 20,
          padding: "12px 22px",
          background: "#4CAF50",
          color: "#fff",
          border: "none",
          borderRadius: 8,
          fontSize: 16,
          cursor: "pointer",
          fontWeight: 600,
        }}
      >
        Finalizar Pedido
      </button>
    </div>
  );
}