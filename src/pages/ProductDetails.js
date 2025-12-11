import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";

export default function ProductDetails() {
  const { id } = useParams();
  const [p, setP] = useState(null);
  const nav = useNavigate();

  const [currentImage, setCurrentImage] = useState(null);
  const [zoomImage, setZoomImage] = useState(null);

  useEffect(() => {
    load();
  }, [id]);

  async function load() {
    try {
      const r = await api.get("/products/" + id);
      const product = r.data;

      setP(product);

      const mainImg = product.imageUrl?.startsWith("http")
        ? product.imageUrl
        : `/images/${product.imageUrl}`;

      setCurrentImage(mainImg);
    } catch (e) {
      console.error(e);
    }
  }

  async function add() {
    try {
      let sessionId = localStorage.getItem("sessionId");
      if (!sessionId) {
        sessionId = crypto.randomUUID();
        localStorage.setItem("sessionId", sessionId);
      }

      await api.post("/cart/add", {
        sessionId: sessionId,
        product: { id: p.id },
        quantity: 1,
      });

      nav("/cart");
    } catch (e) {
      console.error(e);
      alert("Erro ao adicionar à sacola.");
    }
  }

  if (!p) return <div className="container">Carregando...</div>;

  const mainImg = p.imageUrl?.startsWith("http")
    ? p.imageUrl
    : `/images/${p.imageUrl}`;

  const extraImages = Array.isArray(p.images)
    ? p.images.map((img) =>
        img.startsWith("http") ? img : `/images/${img}`
      )
    : [];

  const gallery = [mainImg, ...extraImages];

  const isOnSale = p.salePrice && p.salePrice < p.price;

  return (
    <div
      className="container"
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 40,
        paddingTop: 40,
      }}
    >
      {/* ================================
          CARROSSEL DE IMAGENS
      ================================= */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {/* IMAGEM PRINCIPAL */}
        <img
          src={currentImage}
          onClick={() => setZoomImage(currentImage)}
          alt={p.name}
          style={{
            width: 420,
            height: 420,
            objectFit: "contain",
            borderRadius: 10,
            cursor: "zoom-in",
            background: "#fff",
            transition: "0.2s",
          }}
        />

        {/* MINIATURAS */}
        <div style={{ display: "flex", gap: 10 }}>
          {gallery.map((img, i) => (
            <img
              key={i}
              src={img}
              onClick={() => setCurrentImage(img)}
              alt=""
              style={{
                width: 80,
                height: 80,
                objectFit: "contain",
                borderRadius: 6,
                border:
                  img === currentImage
                    ? "2px solid #0a7cff"
                    : "1px solid #ccc",
                cursor: "pointer",
                background: "#fff",
                padding: 3,
              }}
            />
          ))}
        </div>
      </div>

      {/* ================================
          DETALHES DO PRODUTO
      ================================= */}
      <div style={{ flex: 1 }}>
        {/* 🔥 BADGE DE OFERTA */}
        {isOnSale && (
          <div
            style={{
              display: "inline-block",
              background: "#ff3b3b",
              color: "#fff",
              padding: "6px 12px",
              borderRadius: 8,
              fontWeight: 700,
              marginBottom: 10,
              fontSize: 15,
            }}
          >
            🔥 Oferta Especial
          </div>
        )}

        <h2 style={{ fontSize: 28, fontWeight: 700 }}>{p.name}</h2>

        {/* ================================
            PREÇO DO PRODUTO
        ================================= */}
        {isOnSale ? (
          <div style={{ marginTop: 10, marginBottom: 20 }}>
            <div
              style={{
                color: "#0a7cff",
                fontWeight: 800,
                fontSize: 30,
              }}
            >
              R$ {p.salePrice.toFixed(2).replace(".", ",")}
            </div>

            <div
              style={{
                textDecoration: "line-through",
                color: "#bbb",
                fontSize: 18,
                marginTop: 4,
              }}
            >
              R$ {p.price.toFixed(2).replace(".", ",")}
            </div>
          </div>
        ) : (
          <div
            style={{
              color: "#0a7cff",
              fontWeight: 800,
              fontSize: 30,
              marginTop: 10,
              marginBottom: 20,
            }}
          >
            R$ {p.price.toFixed(2).replace(".", ",")}
          </div>
        )}

        {/* DESCRIÇÃO */}
        <p style={{ fontSize: 16, color: "#ccc", lineHeight: "22px" }}>
          {p.description}
        </p>

        {/* BOTÃO */}
        <button
          onClick={add}
          className="btn"
          style={{
            padding: "12px 22px",
            fontSize: 17,
            fontWeight: 700,
            borderRadius: 10,
            marginTop: 25,
            width: 220,
          }}
        >
          Adicionar à sacola
        </button>
      </div>

      {/* ================================
          MODAL DE ZOOM
      ================================= */}
      {zoomImage && (
        <div
          onClick={() => setZoomImage(null)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: "zoom-out",
            zIndex: 9999,
          }}
        >
          <img
            src={zoomImage}
            alt="Zoom"
            style={{
              maxWidth: "90%",
              maxHeight: "90%",
              borderRadius: 10,
            }}
          />
        </div>
      )}
    </div>
  );
}