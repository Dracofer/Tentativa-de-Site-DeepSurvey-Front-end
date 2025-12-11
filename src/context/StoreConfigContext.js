import { createContext, useContext, useEffect, useState } from "react";
import api from "../api";

const StoreConfigContext = createContext();

export function StoreConfigProvider({ children }) {
  const [cfg, setCfg] = useState(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const r = await api.get("/store-config");
      setCfg(r.data);

      // 🔥 APLICAR TEMA NO SITE
      applyTheme(r.data);

    } catch (err) {
      console.error("Erro ao carregar configurações da loja", err);
    }
  }

  // -------------------------------------------------------
  // ✅ APLICA AS CONFIGURAÇÕES NO BODY
  // -------------------------------------------------------
  function applyTheme(config) {
    if (!config) return;

    // Aplicar cor do tema
    if (config.themeColor) {
      document.documentElement.style.setProperty(
        "--theme-color",
        config.themeColor
      );
    }

    // Aplicar imagem de fundo
    if (config.backgroundImage && config.backgroundImage.trim() !== "") {
      const url = config.backgroundImage.startsWith("/images")
        ? config.backgroundImage
        : `/images/${config.backgroundImage}`;

      document.body.style.setProperty("--bg-image", `url(${url})`);
    } else {
      // Se não tiver imagem, remove fundo
      document.body.style.setProperty("--bg-image", "none");
    }
  }

  // -------------------------------------------------------
  // Quando cfg mudar (admin salvou), aplica automaticamente
  // -------------------------------------------------------
  useEffect(() => {
    if (cfg) applyTheme(cfg);
  }, [cfg]);

  return (
    <StoreConfigContext.Provider value={{ cfg, setCfg, load }}>
      {children}
    </StoreConfigContext.Provider>
  );
}

export function useStoreConfig() {
  return useContext(StoreConfigContext);
}