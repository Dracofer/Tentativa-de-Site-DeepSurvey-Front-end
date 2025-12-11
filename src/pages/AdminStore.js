import React, { useEffect, useState } from "react";
import api from "../api";

export default function AdminStore() {
  const [cfg, setCfg] = useState(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const r = await api.get("/store-config");
    setCfg(r.data);
  }

  async function save() {
    await api.put(`/store-config/${cfg.id}`, cfg);
    alert("Configurações salvas!");
  }

  if (!cfg) return <div className="container">Carregando...</div>;

  return (
    <div className="container" style={{ maxWidth: 900, paddingTop: 30 }}>
      {/* ================================
          BLOCO PRINCIPAL COM TEMA
      ================================= */}
      <div className="themed-box">
        <h2 style={{ marginTop: 0 }}>Configurações da Loja</h2>

        {/* ===============================
            IDENTIDADE VISUAL
        =================================*/}
        <h3>Identidade Visual</h3>

        <label>Nome da Loja</label>
        <input
          value={cfg.storeName || ""}
          onChange={(e) => setCfg({ ...cfg, storeName: e.target.value })}
        />

        <label>Subtítulo da Loja</label>
        <input
          value={cfg.storeSubtitle || ""}
          onChange={(e) => setCfg({ ...cfg, storeSubtitle: e.target.value })}
        />

        <label>Logo (URL ou arquivo em /images)</label>
        <input
          value={cfg.logoUrl || ""}
          onChange={(e) => setCfg({ ...cfg, logoUrl: e.target.value })}
        />

        <label>Cor do Tema</label>
        <input
          type="color"
          value={cfg.themeColor || "#2c2b6e"}
          onChange={(e) => setCfg({ ...cfg, themeColor: e.target.value })}
        />

        <label>Imagem de fundo</label>
        <input
          value={cfg.backgroundImage || ""}
          onChange={(e) => setCfg({ ...cfg, backgroundImage: e.target.value })}
        />

        <label>Tema da Loja</label>
        <select
          value={cfg.themeMode || "light"}
          onChange={(e) => setCfg({ ...cfg, themeMode: e.target.value })}
        >
          <option value="light">Claro</option>
          <option value="dark">Escuro</option>
          <option value="glass">Glass</option>
        </select>

        <label>Tema do Topo</label>
        <select
          value={cfg.headerTheme || "default"}
          onChange={(e) => setCfg({ ...cfg, headerTheme: e.target.value })}
        >
          <option value="default">Padrão</option>
          <option value="light">Claro</option>
          <option value="dark">Escuro</option>
          <option value="blue">Azul</option>
          <option value="glass">Glass</option>
        </select>

        <hr />

        {/* ===============================
            CORES CUSTOMIZADAS
        ================================= */}
        <h3>Cores dos Textos</h3>

        <label>Cor dos Títulos (não afeta o título da loja)</label>
        <input
          type="color"
          value={cfg.titleColor || "#ffffff"}
          onChange={(e) => setCfg({ ...cfg, titleColor: e.target.value })}
        />

        <label>Cor dos Textos dos Produtos</label>
        <input
          type="color"
          value={cfg.productTextColor || "#dddddd"}
          onChange={(e) => setCfg({ ...cfg, productTextColor: e.target.value })}
        />

        <label>Cor dos Textos das Páginas Internas</label>
        <input
          type="color"
          value={cfg.pageTextColor || "#cccccc"}
          onChange={(e) => setCfg({ ...cfg, pageTextColor: e.target.value })}
        />

        <hr />

        {/* ===============================
            CONFIG. OPERACIONAIS
        ================================= */}
        <h3>Operação</h3>

        <label>Pedido Mínimo</label>
        <input
          type="number"
          value={cfg.minimumOrderValue ?? 0}
          onChange={(e) =>
            setCfg({ ...cfg, minimumOrderValue: parseFloat(e.target.value) })
          }
        />

        <label>Endereço da loja</label>
        <textarea
          value={cfg.addressText || ""}
          onChange={(e) => setCfg({ ...cfg, addressText: e.target.value })}
        />

        <label>Status da Loja</label>
        <select
          value={cfg.storeOpen}
          onChange={(e) =>
            setCfg({ ...cfg, storeOpen: e.target.value === "true" })
          }
        >
          <option value="true">Aberto</option>
          <option value="false">Fechado</option>
        </select>

        <hr />

        {/* ===============================
            CONTATOS
        ================================= */}
        <h3>WhatsApp & Contato</h3>

        <label>WhatsApp principal</label>
        <input
          value={cfg.whatsappNumber || ""}
          onChange={(e) => setCfg({ ...cfg, whatsappNumber: e.target.value })}
        />

        <label>WhatsApp secundário</label>
        <input
          value={cfg.whatsappNumber2 || ""}
          onChange={(e) =>
            setCfg({ ...cfg, whatsappNumber2: e.target.value })
          }
        />

        <label>Email</label>
        <input
          type="email"
          value={cfg.contactEmail || ""}
          onChange={(e) => setCfg({ ...cfg, contactEmail: e.target.value })}
        />

        <label>Texto Fale Conosco</label>
        <textarea
          rows={5}
          value={cfg.contactText || ""}
          onChange={(e) => setCfg({ ...cfg, contactText: e.target.value })}
        />

        <br />

        <button onClick={save} className="btn-confirm">
          Salvar Alterações
        </button>
      </div>
    </div>
  );
}