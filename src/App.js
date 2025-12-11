import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import FaleConosco from "./pages/FaleConosco";
import Categories from "./pages/Categories";
import CategoryProducts from "./pages/CategoryProducts";
import SearchResults from "./pages/SearchResults";
import Offers from "./pages/Offers";
import Produtos from "./pages/Produtos";
import AdminStore from "./pages/AdminStore";
import AdminFretes from "./pages/AdminFretes";

import useAuth from "./hooks/useAuth";
import { useStoreConfig } from "./context/StoreConfigContext";

function AdminRoute({ children }) {
  const auth = useAuth();

  if (!auth.logged) return <Navigate to="/login" />;
  if (!auth.admin) return <Navigate to="/" />;

  return children;
}

export default function App() {
  const { cfg } = useStoreConfig();

  useEffect(() => {
    if (!cfg) return;

    // tema geral
    document.body.classList.remove("theme-light", "theme-dark", "theme-glass");
    document.body.classList.add(`theme-${cfg.themeMode}`);

    // tema topo
    document.body.classList.remove(
      "header-light",
      "header-dark",
      "header-blue",
      "header-glass"
    );

    if (cfg.headerTheme) {
      document.body.classList.add(`header-${cfg.headerTheme}`);
    }

    // fundo
    document.documentElement.style.setProperty(
      "--bg-image",
      cfg.backgroundImage ? `url("${cfg.backgroundImage}")` : "none"
    );

    // NOVAS CORES
    document.documentElement.style.setProperty("--title-color", cfg.titleColor || "#ffffff");
    document.documentElement.style.setProperty("--product-text-color", cfg.productTextColor || "#dddddd");
    document.documentElement.style.setProperty("--page-text-color", cfg.pageTextColor || "#cccccc");

  }, [cfg]);

  return (
    <div className="app-root">
      <Navbar />
      <main className="container" style={{ background: "transparent" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/produto/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/login" element={<Login />} />
          <Route path="/faleconosco" element={<FaleConosco />} />
          <Route path="/ofertas" element={<Offers />} />
          <Route path="/categorias" element={<Categories />} />
          <Route path="/categoria/:id" element={<CategoryProducts />} />
          <Route path="/buscar" element={<SearchResults />} />
          <Route path="/produtos" element={<Produtos />} />

          <Route path="/painel" element={<AdminRoute><Admin /></AdminRoute>} />
          <Route path="/painel-loja" element={<AdminRoute><AdminStore /></AdminRoute>} />
          <Route path="/painel-fretes" element={<AdminRoute><AdminFretes /></AdminRoute>} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}