import React, { useEffect, useState } from "react";
import api from "../api";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

export default function CategoryProducts() {
  const { id } = useParams();
  const [cat, setCat] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    load();
  }, [id]);

  async function load() {
    const c = await api.get("/categories/" + id);
    setCat(c.data);

    const p = await api.get("/products/category/" + id);
    setProducts(p.data);
  }

  if (!cat) return <div className="container">Carregando...</div>;

  return (
    <div className="container" style={{ paddingTop: 30 }}>
      <h2>{cat.name}</h2>

      <div style={{ marginTop: 20 }}>
        {products.length === 0 && <p>Nenhum produto nessa categoria.</p>}

        {products.map((p) => (
          <div
            key={p.id}
            style={{
              display: "flex",
              gap: 20,
              marginBottom: 20,
              padding: 15,
              background: "#fff",
              borderRadius: 8,
              boxShadow: "0 2px 6px rgba(0,0,0,0.08)"
            }}
          >
            <img
              src={`/images/${p.imageUrl}`}
              alt=""
              style={{ width: 120, height: 120, objectFit: "cover", borderRadius: 8 }}
            />

            <div>
              <h4>{p.name}</h4>
              <p>R$ {p.price.toFixed(2).replace(".", ",")}</p>

              <Link
                to={`/produto/${p.id}`}
                style={{
                  background: "#4CAF50",
                  color: "#fff",
                  padding: "6px 14px",
                  borderRadius: 6,
                  textDecoration: "none"
                }}
              >
                Ver produto
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}