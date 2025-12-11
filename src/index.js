import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import "./styles.css";

import { StoreConfigProvider } from "./context/StoreConfigContext";

const root = createRoot(document.getElementById("root"));

// Garantia: evita erro caso "root" não seja encontrado
if (!root) {
  console.error("ERRO: Elemento #root não encontrado no HTML.");
}

root.render(
  <BrowserRouter>
    <StoreConfigProvider>
      <App />
    </StoreConfigProvider>
  </BrowserRouter>
);