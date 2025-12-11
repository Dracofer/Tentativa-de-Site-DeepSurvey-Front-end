import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { setAuthToken } from "../api";
import { useStoreConfig } from "../context/StoreConfigContext";

export default function Navbar() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const auth = useAuth();
  const { cfg } = useStoreConfig();

  function handleSearch(e) {
    if (e.key === "Enter" && search.trim() !== "") {
      navigate("/buscar?q=" + search);
    }
  }

  function logout() {
    setAuthToken(null);
    window.location.reload();
  }

  // Lida com URL externa INTERNAMENTE ou imagem local
  const logoSrc = cfg?.logoUrl
    ? (cfg.logoUrl.startsWith("http")
        ? cfg.logoUrl
        : `/images/${cfg.logoUrl}`)
    : "/images/logo.jpeg";

  return (
    <>
      {/* BARRA SUPERIOR */}
      <div
        className="topbar"
        style={{
          background: cfg?.themeColor || "#2c2b6e",
          color: "white",
          padding: "6px 20px",
          display: "flex",
          justifyContent: "space-between",
          fontWeight: 600
        }}
      >
        <div>
          Pedido mínimo: R$ {cfg?.minimumOrderValue?.toFixed(2) || "0,00"}
        </div>
        <div>
          {cfg?.storeOpen ? "Estabelecimento aberto" : "Fechado no momento"}
        </div>
      </div>

      {/* CABEÇALHO */}
      <header
        className="header"
        style={{
          background: "#fff",
          padding: "20px 0",
          borderBottom: "1px solid #ddd"
        }}
      >
        <div className="header-inner"
          style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>

          {/* LOGO + TEXTO */}
          <div className="logo" style={{ display: "flex", alignItems: "center" }}>
            <img
              src={logoSrc}
              alt="logo"
              style={{
                height: 120,
                width: 120,
                objectFit: "cover",
                borderRadius: "50%",
                marginRight: 12
              }}
            />

            <div>
  <h1 style={{ fontSize: "1.8rem", margin: 0 }}>
    {cfg?.storeName || "Minha Loja"}
  </h1>

  <small style={{ fontSize: "1rem", opacity: 0.8 }}>
    {cfg?.storeSubtitle ?? "Sua loja de suplementos"}
  </small>
</div>
          </div>

          {/* BUSCA */}
          <div className="searchbox">
            <input
              placeholder="Digite sua busca..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleSearch}
            />
          </div>

          {/* LINKS DIREITA */}
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <Link to="/cart">Minha sacola</Link>

            {auth.admin && (
              <>
                <Link to="/painel">Painel</Link>
                <Link to="/painel-loja">Config. Loja</Link>
<Link to="/painel-fretes">Fretes</Link>
              </>
            )}

            {auth.logged && (
              <span
                style={{ cursor: "pointer", color: "#c00", fontWeight: 600 }}
                onClick={logout}
              >
                Sair
              </span>
            )}
          </div>

        </div>
      </header>

      {/* MENU */}
      <nav
        className="navbar"
        style={{
          background: cfg?.themeColor || "#2c2b6e",
          padding: "10px 0",
          display: "flex",
          justifyContent: "center",
          gap: 20
        }}
      >
        <Link to="/" style={{ color: "#fff" }}>Início</Link>
        <Link to="/categorias" style={{ color: "#fff" }}>Categorias</Link>
        <Link to="/ofertas" style={{ color: "#fff" }}>Ofertas</Link>
        <Link to="/faleconosco" style={{ color: "#fff" }}>Fale conosco</Link>
      </nav>
    </>
  );
}