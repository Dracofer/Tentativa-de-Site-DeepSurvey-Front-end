import React from "react";
import { Routes, Route } from "react-router-dom";

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

export default function App() {
  return (
    <div className="app-root">
      <Navbar />

      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/produto/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/faleconosco" element={<FaleConosco />} />
<Route path="/ofertas" element={<Offers />} />
<Route path="/categorias" element={<Categories />} />
<Route path="/categoria/:id" element={<CategoryProducts />} />
<Route path="/buscar" element={<SearchResults />} />
<Route path="/produtos" element={<Produtos />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}