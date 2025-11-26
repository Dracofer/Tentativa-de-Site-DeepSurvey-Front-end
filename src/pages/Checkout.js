import React, { useEffect, useState } from "react";
import api from "../api";
import "./Checkout.css";

export default function Checkout() {
  const [items, setItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [delivery, setDelivery] = useState(0);
  const [total, setTotal] = useState(0);

  const cidades = {
    "Jandira-SP": 10,
    "Barueri-SP": 20,
    "Itapevi-SP": 20,
    "Cotia-SP": 20,
  };

  const [form, setForm] = useState({
    name: "",
    phone: "",
    city: "",
    cep: "",
    street: "",
    number: "",
    complement: "",
    reference: "",
    paymentMethod: "Dinheiro",
    change: ""
  });

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const sessionId = localStorage.getItem("sessionId");
    if (!sessionId) return;

    try {
      const r = await api.get("/cart/" + sessionId);
      const data = r.data || [];
      setItems(data);

      const st = data.reduce(
        (acc, i) => acc + (i.price || 0) * (i.quantity || 0),
        0
      );

      setSubtotal(st);
      setTotal(st); // total inicia igual subtotal
    } catch (err) {
      console.error("Erro ao carregar carrinho", err);
    }
  }

  function calcDelivery(cidadeSelecionada) {
    const price = cidades[cidadeSelecionada] || 0;
    setDelivery(price);
    setTotal(subtotal + price);
  }

  async function submitOrder() {
    const sessionId = localStorage.getItem("sessionId");

    let changeValue = form.change || null;
    if (changeValue !== null) changeValue = Number(changeValue);

    const endereco =
      `${form.street || ""} ${form.number || ""}` +
      (form.complement ? ` - ${form.complement}` : "") +
      (form.city ? `, ${form.city}` : "") +
      (form.cep ? `, CEP: ${form.cep}` : "") +
      (form.reference ? ` (Ref: ${form.reference})` : "");

    const req = {
      sessionId,
      ...form,
      change: changeValue
    };

    try {
      const r = await api.post("/orders/checkout", req);
      const order = r.data;

      localStorage.removeItem("sessionId");

      let msg =
        `DEEPSURVEY SUPLEMENTOS\n------------------------------\n` +
        `Pedido #${order.id}\n\nItens:\n`;

      order.items.forEach((i) => {
        msg += `${i.quantity}x ${i.product.name} - R$ ${Number(i.price)
          .toFixed(2)
          .replace(".", ",")}\n`;
      });

      msg +=
        `\nSubtotal: R$ ${subtotal.toFixed(2).replace(".", ",")}\n` +
        `Entrega: R$ ${delivery.toFixed(2).replace(".", ",")}\n` +
        `Total: R$ ${total.toFixed(2).replace(".", ",")}\n\n` +
        `Endereço:\n${endereco}\n\n` +
        `Pagamento: ${form.paymentMethod}\n` +
        `${changeValue ? "Troco para R$ " + changeValue : ""}\n\n` +
        `www.deepsurveysuplementos.com.br`;

      const encoded = encodeURIComponent(msg);
      window.location.href =
        `https://api.whatsapp.com/send?phone=5511947935371&text=${encoded}`;

    } catch (err) {
      console.error("Erro no checkout:", err);
      alert("Erro ao enviar pedido.");
    }
  }

  function fmt(v) {
    return Number(v || 0).toFixed(2).replace(".", ",");
  }

  return (
    <div className="container" style={{ maxWidth: 1100, paddingTop: 30 }}>
      <h2>Pedido Delivery</h2>

      <div style={{ display: "flex", gap: 40, alignItems: "flex-start" }}>

        {/* FORMULÁRIO */}
        <div style={{ flex: 1 }}>
          <div className="section-title">🧍 Dados do cliente</div>

          <input
            className="form-input"
            placeholder="Nome completo"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            value={form.name}
          />

          <input
            className="form-input"
            placeholder="Whatsapp"
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            value={form.phone}
          />

          <div className="section-title" style={{ marginTop: 25 }}>📦 Entrega</div>

          <label>Cidade:</label>
          <select
            className="form-input"
            value={form.city}
            onChange={(e) => {
              setForm({ ...form, city: e.target.value });
              calcDelivery(e.target.value);
            }}
          >
            <option value="">Selecione...</option>
            {Object.keys(cidades).map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <input
            className="form-input"
            placeholder="CEP"
            onChange={(e) => setForm({ ...form, cep: e.target.value })}
            value={form.cep}
          />

          <input
            className="form-input"
            placeholder="Rua"
            onChange={(e) => setForm({ ...form, street: e.target.value })}
            value={form.street}
          />

          <input
            className="form-input"
            placeholder="Número"
            onChange={(e) => setForm({ ...form, number: e.target.value })}
            value={form.number}
          />

          <input
            className="form-input"
            placeholder="Complemento"
            onChange={(e) => setForm({ ...form, complement: e.target.value })}
            value={form.complement}
          />

          <input
            className="form-input"
            placeholder="Ponto de referência"
            onChange={(e) => setForm({ ...form, reference: e.target.value })}
            value={form.reference}
          />

          <div className="section-title" style={{ marginTop: 25 }}>💳 Pagamento</div>

          <select
            className="form-input"
            value={form.paymentMethod}
            onChange={(e) =>
              setForm({ ...form, paymentMethod: e.target.value })
            }
          >
            <option>Dinheiro</option>
            <option>Débito</option>
            <option>Crédito</option>
            <option>Pix</option>
          </select>

          <input
            className="form-input"
            placeholder="Troco (opcional)"
            onChange={(e) => setForm({ ...form, change: e.target.value })}
            value={form.change}
          />

          <button className="btn-confirm" onClick={submitOrder}>
            Enviar pedido via WhatsApp
          </button>
        </div>

        {/* NOTINHA */}
        <div style={{ width: 320 }}>
          <div
            style={{
              background: "#fff8d5",
              padding: 18,
              borderRadius: 6,
              boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
              border: "1px solid rgba(0,0,0,0.06)"
            }}
          >
            <div style={{ textAlign: "center", fontWeight: 700 }}>
              DEEPSURVEY SUPLEMENTOS
            </div>

            <div
              style={{
                textAlign: "center",
                color: "#777",
                margin: "8px 0 12px"
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  width: 80,
                  borderTop: "2px solid rgba(0,0,0,0.15)"
                }}
              />
            </div>

            <div style={{ textAlign: "center", fontWeight: 700, marginBottom: 6 }}>
              Pedido
            </div>

            <div style={{ height: 8 }} />

            <div style={{ borderTop: "1px dashed rgba(0,0,0,0.12)", paddingTop: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <div style={{ color: "#333" }}>Subtotal:</div>
                <div style={{ fontWeight: 700 }}>R$ {fmt(subtotal)}</div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <div style={{ color: "#333" }}>Entrega:</div>
                <div style={{ fontWeight: 700 }}>
                  {delivery > 0 ? `R$ ${fmt(delivery)}` : "—"}
                </div>
              </div>

              <div style={{ borderTop: "1px solid rgba(0,0,0,0.06)", marginTop: 10, paddingTop: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div style={{ fontWeight: 800 }}>Total:</div>
                  <div style={{ fontWeight: 800 }}>R$ {fmt(total)}</div>
                </div>
              </div>
            </div>

            <div style={{ marginTop: 14, textAlign: "center", color: "#333", fontSize: 13 }}>
              <div style={{ fontWeight: 700, marginBottom: 6 }}>{form.paymentMethod}</div>
            </div>

            <div style={{ marginTop: 14, textAlign: "center", color: "#666", fontSize: 13 }}>
              <a
                href="https://www.deepsurveysuplementos.com.br"
                target="_blank"
                rel="noreferrer"
                style={{ color: "#333", textDecoration: "none" }}
              >
                www.deepsurveysuplementos.com.br
              </a>
            </div>
          </div>

          <div style={{ textAlign: "center", color: "#888", marginTop: 12 }}>
            O seu pedido será enviado para o nosso WhatsApp
          </div>
        </div>
      </div>
    </div>
  );
}