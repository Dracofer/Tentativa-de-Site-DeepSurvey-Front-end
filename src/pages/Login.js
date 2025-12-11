import React, { useState } from "react";
import api, { setAuthToken } from "../api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [u, setU] = useState("");
  const [p, setP] = useState("");
  const nav = useNavigate();

  async function doLogin() {
    try {
      const r = await api.post("/auth/login", {
        username: u,
        password: p,
      });

      if (r.data.token) {
        setAuthToken(r.data.token);

        const roles = r.data.roles || [];

        if (roles.includes("ROLE_ADMIN")) {
          alert("Bem-vindo administrador!");
          return nav("/painel");
        }

        alert("Login realizado!");
        return nav("/");
      }
    } catch (e) {
      console.error(e);
      alert("Usuário ou senha incorretos");
    }
  }

  return (
    <div className="container" style={{ maxWidth: 420, paddingTop: 30 }}>
      <h2 style={{ marginBottom: 20 }}>Login</h2>

      <input
        placeholder="Usuário"
        value={u}
        onChange={(e) => setU(e.target.value)}
        style={{
          width: "100%",
          padding: 10,
          marginBottom: 10,
          borderRadius: 6,
          border: "1px solid #ccc",
        }}
      />

      <input
        placeholder="Senha"
        type="password"
        value={p}
        onChange={(e) => setP(e.target.value)}
        style={{
          width: "100%",
          padding: 10,
          marginBottom: 15,
          borderRadius: 6,
          border: "1px solid #ccc",
        }}
      />

      <button
        onClick={doLogin}
        style={{
          width: "100%",
          padding: 12,
          background: "#2c2b6e",
          color: "#fff",
          border: "none",
          borderRadius: 6,
          cursor: "pointer",
          fontSize: 16,
          fontWeight: 600,
        }}
      >
        Entrar
      </button>
    </div>
  );
}