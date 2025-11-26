import React, { useEffect, useState } from "react";
import api from "../api";
import { Link } from "react-router-dom";

export default function Categories() {
  const [cats, setCats] = useState([]);

  useEffect(() => {
    api.get("/categories").then((res) => setCats(res.data));
  }, []);

  return (
    <div className="container" style={{ paddingTop: 30, maxWidth: 700 }}>
      <h2>Categorias</h2>

      {cats.map((c) => (
        <div
          key={c.id}
          style={{
            padding: 15,
            margin: "10px 0",
            background: "#fff",
            borderRadius: 8,
            boxShadow: "0 2px 6px rgba(0,0,0,0.08)"
          }}
        >
          <Link
            to={`/categoria/${c.id}`}
            style={{ textDecoration: "none", fontSize: 18, fontWeight: 600 }}
          >
            {c.name}
          </Link>
        </div>
      ))}
    </div>
  );
}