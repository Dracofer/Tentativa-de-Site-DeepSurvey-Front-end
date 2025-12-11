import React, { useEffect, useState } from "react";
import api from "../api";
import "./Checkout.css";
import { useStoreConfig } from "../context/StoreConfigContext";

export default function Checkout() {
  const [items, setItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [delivery, setDelivery] = useState(0);
  const [total, setTotal] = useState(0);

  const [regions, setRegions] = useState([]);
  const [loading, setLoading] = useState(false);

  const { cfg } = useStoreConfig();

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
    change: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadCart();
    loadRegions();
  }, []);

  // Carrega carrinho
  async function loadCart() {
    const sessionId = localStorage.getItem("sessionId");
    if (!sessionId) return;

    try {
      const r = await api.get("/cart/" + sessionId);
      const data = r.data || [];
      setItems(data);

      // 👉 SUBTOTAL considerando preço promocional
      const st = data.reduce((acc, i) => {
        const unitPrice =
          i.product.salePrice && i.product.salePrice < i.product.price
            ? i.product.salePrice
            : i.product.price;

        return acc + unitPrice * (i.quantity || 0);
      }, 0);

      setSubtotal(st);
      setTotal(st + delivery);
    } catch (err) {
      console.error("Erro ao carregar carrinho", err);
    }
  }

  // Carrega cidades / fretes
  async function loadRegions() {
    try {
      const r = await api.get("/delivery-regions");
      setRegions(r.data.filter((rg) => rg.active));
    } catch (err) {
      console.error("Erro ao carregar regiões de entrega", err);
    }
  }

  // Calcula frete
  function calcDelivery(cityName) {
    const region = regions.find((r) => r.name === cityName);
    const valor = region ? region.fee : 0;

    setDelivery(valor);
    setTotal(subtotal + valor);
  }

  // Busca CEP
  async function buscarCEP() {
    const cepNum = form.cep.replace(/\D/g, "");
    if (cepNum.length !== 8) return;

    try {
      const r = await fetch(`https://viacep.com.br/ws/${cepNum}/json/`);
      const data = await r.json();
      if (!data.erro) {
        setForm((prev) => ({
          ...prev,
          street: data.logradouro || prev.street,
        }));
      }
    } catch (err) {
      console.error("Erro ao buscar CEP:", err);
    }
  }

  // Validação
  function validateForm() {
    const newErrors = {};

    if (!form.name.trim()) newErrors.name = "Informe seu nome completo.";

    if (!form.phone.trim() || form.phone.length < 10)
      newErrors.phone = "Informe um Whatsapp válido.";

    if (!form.city.trim()) newErrors.city = "Selecione sua cidade.";

    if (!form.cep.trim() || form.cep.replace(/\D/g, "").length < 8)
      newErrors.cep = "CEP inválido.";

    if (!form.street.trim()) newErrors.street = "Informe a rua.";
    if (!form.number.trim()) newErrors.number = "Informe o número.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function fmt(v) {
    return Number(v || 0).toFixed(2).replace(".", ",");
  }

  // Envio do pedido
  async function submitOrder() {
    if (loading) return;

    if (cfg && cfg.storeOpen === false) {
      alert("A loja está fechada no momento.");
      return;
    }

    if (!regions || regions.length === 0) {
      alert("Nenhuma região de entrega configurada.");
      return;
    }

    if (!items || items.length === 0) {
      alert("Seu carrinho está vazio.");
      return;
    }

    if (!validateForm()) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    }

    if (!form.city) {
      alert("Selecione sua cidade.");
      return;
    }

    const sessionId = localStorage.getItem("sessionId");

    let changeValue = form.change || null;
    if (changeValue !== null && changeValue !== "") {
      changeValue = Number(
        String(changeValue).replace(",", ".").replace(" ", "")
      );

      if (isNaN(changeValue)) {
        alert("Valor de troco inválido.");
        return;
      }

      if (changeValue < total) {
        alert(
          `O valor para troco (R$ ${fmt(
            changeValue
          )}) é menor que o total (R$ ${fmt(total)}).`
        );
        return;
      }
    } else {
      changeValue = null;
    }

    const req = {
      sessionId,
      name: form.name,
      phone: form.phone,
      region: form.city,
      cep: form.cep,
      street: form.street,
      number: form.number,
      complement: form.complement,
      reference: form.reference,
      paymentMethod: form.paymentMethod,
      change: changeValue,
    };

    try {
      setLoading(true);

      const r = await api.post("/orders/checkout", req);
      const order = r.data;

      localStorage.removeItem("sessionId");

      // Mensagem WhatsApp
      let msg =
        `DEEPSURVEY SUPLEMENTOS\n------------------------------\n\n` +
        `Pedido #${order.id}\n\nItens:\n`;

      order.items.forEach((i) => {
        msg += `${i.quantity}x ${i.product.name} - R$ ${fmt(i.price)}\n`;
      });

      msg += `\nSubtotal: R$ ${fmt(subtotal)}\n`;
      msg += `Entrega: R$ ${fmt(delivery)}\n`;
      msg += `Total: R$ ${fmt(total)}\n\n`;

      msg += `Endereço:\n${form.street} ${form.number}`;
      if (form.complement) msg += ` - ${form.complement}`;
      msg += `, ${form.city}, CEP: ${form.cep}`;
      if (form.reference) msg += ` (Ref: ${form.reference})`;
      msg += `\n\nPagamento: ${form.paymentMethod}\n`;
      if (form.change) msg += `Troco para R$ ${fmt(form.change)}\n\n`;

      msg += `www.deepsurveysuplementos.com.br`;

      try {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(msg);
        }
      } catch {}

      const encoded = encodeURIComponent(msg);
      const whatsappNumber = cfg?.whatsappNumber || "5511947935371";

      window.location.href =
        `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encoded}`;
    } catch (err) {
      console.error("Erro no checkout:", err);
      alert("Erro ao enviar pedido.");
    } finally {
      setLoading(false);
    }
  }

  // JSX
  return (
    <div className="container" style={{ maxWidth: 1100, paddingTop: 30 }}>
      <h2>Pedido Delivery</h2>

      <div style={{ display: "flex", gap: 40, alignItems: "flex-start" }}>
        {/* FORMULÁRIO */}
        <div style={{ flex: 1 }}>
          <div className="section-title">🧍 Dados do cliente</div>

          <input
            className={`form-input ${errors.name ? "error" : ""}`}
            placeholder="Nome completo"
            value={form.name}
            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ\s\.'-]/g, ""),
              })
            }
          />
          {errors.name && <div className="input-error">{errors.name}</div>}

          <input
            className={`form-input ${errors.phone ? "error" : ""}`}
            placeholder="Whatsapp"
            value={form.phone}
            onChange={(e) =>
              setForm({ ...form, phone: e.target.value.replace(/\D/g, "") })
            }
          />
          {errors.phone && <div className="input-error">{errors.phone}</div>}

          <div className="section-title" style={{ marginTop: 25 }}>
            📦 Entrega
          </div>

          <label>Cidade:</label>
          <select
            className={`form-input ${errors.city ? "error" : ""}`}
            value={form.city}
            onChange={(e) => {
              setForm({ ...form, city: e.target.value });
              calcDelivery(e.target.value);
            }}
          >
            <option value="">Selecione...</option>
            {regions.map((r) => (
              <option key={r.id} value={r.name}>
                {r.name}
              </option>
            ))}
          </select>
          {errors.city && <div className="input-error">{errors.city}</div>}

          <input
            className={`form-input ${errors.cep ? "error" : ""}`}
            placeholder="CEP"
            value={form.cep}
            onChange={(e) =>
              setForm({ ...form, cep: e.target.value.replace(/[^0-9-]/g, "") })
            }
            onBlur={buscarCEP}
          />
          {errors.cep && <div className="input-error">{errors.cep}</div>}

          <input
            className={`form-input ${errors.street ? "error" : ""}`}
            placeholder="Rua"
            value={form.street}
            onChange={(e) =>
              setForm({
                ...form,
                street: e.target.value.replace(
                  /[^A-Za-zÀ-ÖØ-öø-ÿ0-9\s\.,'-]/g,
                  ""
                ),
              })
            }
          />
          {errors.street && <div className="input-error">{errors.street}</div>}

          <input
            className={`form-input ${errors.number ? "error" : ""}`}
            placeholder="Número"
            value={form.number}
            onChange={(e) =>
              setForm({
                ...form,
                number: e.target.value.replace(/[^0-9A-Za-z\-\/]/g, ""),
              })
            }
          />
          {errors.number && <div className="input-error">{errors.number}</div>}

          <input
            className="form-input"
            placeholder="Complemento"
            value={form.complement}
            onChange={(e) => setForm({ ...form, complement: e.target.value })}
          />

          <input
            className="form-input"
            placeholder="Ponto de referência"
            value={form.reference}
            onChange={(e) =>
              setForm({
                ...form,
                reference: e.target.value.replace(
                  /[^A-Za-zÀ-ÖØ-öø-ÿ0-9\s\.,'-]/g,
                  ""
                ),
              })
            }
          />

          <div className="section-title" style={{ marginTop: 25 }}>
            💳 Pagamento
          </div>

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
            value={form.change}
            onChange={(e) =>
              setForm({
                ...form,
                change: e.target.value.replace(/[^0-9,\.]/g, ""),
              })
            }
          />

          <button
            className="btn-confirm"
            onClick={submitOrder}
            disabled={loading}
          >
            {loading ? "Enviando..." : "Enviar pedido via WhatsApp"}
          </button>
        </div>

        {/* RESUMO DO PEDIDO */}
        <div style={{ width: 320 }}>
          <div
            className="checkout-summary"
            style={{
              background: "#fff8d5",
              padding: 18,
              borderRadius: 6,
              boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
              border: "1px solid rgba(0,0,0,0.06)",
            }}
          >
            {/* LOJA */}
            <div className="store-name" style={{ textAlign: "center", fontWeight: 700 }}>
              {cfg?.storeName || "Minha Loja"}
              <div className="subtitle" style={{ fontWeight: 400, fontSize: 13 }}>
                {cfg?.storeSubtitle}
              </div>
            </div>

            <div
              style={{
                textAlign: "center",
                color: "#777",
                margin: "8px 0 12px",
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  width: 80,
                  borderTop: "2px solid rgba(0,0,0,0.15)",
                }}
              />
            </div>

            <div
              style={{
                textAlign: "center",
                fontWeight: 700,
                marginBottom: 6,
              }}
            >
              Pedido
            </div>

            <div style={{ height: 8 }} />

            {/* SUBTOTAL / ENTREGA / TOTAL */}
            <div
  style={{
    borderTop: "1px dashed rgba(0,0,0,0.12)",
    paddingTop: 10,
  }}
>

  {/* SUBTOTAL */}
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      marginBottom: 8,
    }}
  >
    <div style={{ color: "#333" }}>Subtotal:</div>
    <div style={{ fontWeight: 700 }}>R$ {fmt(subtotal)}</div>
  </div>

  {/* DESCONTO — calculado automaticamente */}
  {(() => {
    const totalDiscount = items.reduce((acc, i) => {
      if (i.product.salePrice && i.product.salePrice < i.product.price) {
        const d = (i.product.price - i.product.salePrice) * i.quantity;
        return acc + d;
      }
      return acc;
    }, 0);

    if (totalDiscount <= 0) return null;

    return (
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 8,
          color: "#b30000",
          fontWeight: 700,
        }}
      >
        <div>Desconto:</div>
        <div>- R$ {fmt(totalDiscount)}</div>
      </div>
    );
  })()}

  {/* ENTREGA */}
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
    }}
  >
    <div style={{ color: "#333" }}>Entrega:</div>
    <div style={{ fontWeight: 700 }}>
      {delivery > 0 ? `R$ ${fmt(delivery)}` : "—"}
    </div>
  </div>

  {/* TOTAL FINAL */}
  <div
    style={{
      borderTop: "1px solid rgba(0,0,0,0.06)",
      marginTop: 10,
      paddingTop: 10,
    }}
  >
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        fontWeight: 800,
      }}
    >
      <div>Total:</div>
      <div>R$ {fmt(total)}</div>
    </div>
  </div>
</div>

            {/* PAGAMENTO */}
            <div
              style={{
                marginTop: 14,
                textAlign: "center",
                color: "#333",
                fontSize: 13,
              }}
            >
              <div style={{ fontWeight: 700, marginBottom: 6 }}>
                {form.paymentMethod}
              </div>
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