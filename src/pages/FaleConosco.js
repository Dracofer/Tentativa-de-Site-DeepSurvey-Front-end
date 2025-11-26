import React from "react";

export default function FaleConosco() {
  const phone1 = "5511947935371"; // número 1
  const phone2 = "5511933700756"; // número 2

  const whatsappUrl = (num) =>
    `https://api.whatsapp.com/send?phone=${num}&text=${encodeURIComponent(
      "Olá! Gostaria de pedir informações."
    )}`;

  return (
    <div className="container" style={{ maxWidth: 700, paddingTop: 40 }}>
      <h2>Fale Conosco</h2>
      <p style={{ marginBottom: 25, color: "#444" }}>
        Entre em contato conosco pelos canais abaixo. Estamos disponíveis para
        tirar dúvidas, receber pedidos e ajudar no que for preciso.
      </p>

      {/* Funcionamento */}
      <div
        style={{
          padding: 20,
          borderRadius: 10,
          background: "#fff",
          boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
          marginBottom: 25,
        }}
      >
        <h4>📅 Funcionamento</h4>

        <p>Segunda: 08:00 às 22:00</p>
        <p>Terça: 08:00 às 22:00</p>
        <p>Quarta: 08:00 às 22:00</p>
        <p>Quinta: 08:00 às 22:00</p>
        <p>Sexta: 08:00 às 22:00</p>
        <p>Sábado: 08:00 às 22:00</p>
        <p style={{ color: "red" }}>Domingo: Fechado</p>
      </div>

      {/* Endereço */}
      <div
        style={{
          padding: 20,
          borderRadius: 10,
          background: "#fff",
          boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
          marginBottom: 25,
        }}
      >
        <h4>📍 Endereço</h4>

        <p>
          Rua Sônia Maria F. de Andrade, Nº 69, <br />
          Bairro: Jardim Novo Horizonte, <br />
          CEP: 06604-130, Jandira/São Paulo
        </p>
      </div>

      {/* Contato */}
      <div
        style={{
          padding: 20,
          borderRadius: 10,
          background: "#fff",
          boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
        }}
      >
        <h4>📞 Contato</h4>

        <p>
          📱 WhatsApp 1:{" "}
          <a
            href={whatsappUrl(phone1)}
            target="_blank"
            rel="noreferrer"
            style={{ color: "#128C7E", fontWeight: 600 }}
          >
            (11) 94793-5371
          </a>
        </p>

        <p>
          📱 WhatsApp 2:{" "}
          <a
            href={whatsappUrl(phone2)}
            target="_blank"
            rel="noreferrer"
            style={{ color: "#128C7E", fontWeight: 600 }}
          >
            (11) 93370-0756
          </a>
        </p>

        <p>
          ✉️ E-mail:{" "}
          <a
            href="mailto:Ruan.2205@hotmail.com"
            style={{ color: "#555", fontWeight: 600 }}
          >
            Ruan.2205@hotmail.com
          </a>
        </p>
      </div>

      <div style={{ textAlign: "center", marginTop: 30 }}>
        <a
          href={whatsappUrl(phone1)}
          target="_blank"
          rel="noreferrer"
          style={{
            padding: "12px 20px",
            background: "#25D366",
            color: "#fff",
            borderRadius: 8,
            textDecoration: "none",
            fontWeight: 600,
            fontSize: 16,
          }}
        >
          💬 Falar via WhatsApp
        </a>
      </div>
    </div>
  );
}