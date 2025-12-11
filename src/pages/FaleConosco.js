import React from "react";
import { useStoreConfig } from "../context/StoreConfigContext";

export default function FaleConosco() {
  const { cfg } = useStoreConfig();

  if (!cfg) {
    return <div className="container themed-box">Carregando...</div>;
  }

  const phoneMain = cfg.whatsappNumber || "5511947935371";
  const phone2 = cfg.whatsappNumber2 || null;

  const whatsappUrl = (num) =>
    `https://api.whatsapp.com/send?phone=${num}&text=${encodeURIComponent(
      "Olá! Gostaria de pedir informações."
    )}`;

  const renderMultiline = (text) =>
    (text || "")
      .split("\n")
      .filter((line) => line.trim() !== "")
      .map((line, idx) => <p key={idx}>{line}</p>);

  return (
    <div className="container" style={{ maxWidth: 700, paddingTop: 40 }}>
      <h2>Fale Conosco</h2>

      {/* Funcionamento */}
      <div className="themed-box" style={{ marginBottom: 25 }}>
        <h4>📅 Funcionamento</h4>
        {renderMultiline(cfg.contactText)}
      </div>

      {/* Endereço */}
      <div className="themed-box" style={{ marginBottom: 25 }}>
        <h4>📍 Endereço</h4>
        {renderMultiline(cfg.addressText)}
      </div>

      {/* Contato */}
      <div className="themed-box">
        <h4>📞 Contato</h4>

        <p>📱 WhatsApp: {phoneMain}</p>

        {phone2 && <p>📱 WhatsApp 2: {phone2}</p>}

        {cfg.contactEmail && (
          <p>✉️ E-mail: {cfg.contactEmail}</p>
        )}
      </div>
    </div>
  );
}