import React, { useEffect, useState } from "react";
import api from "../api";

export default function AdminFretes() {
  const [regions, setRegions] = useState([]);
  const [form, setForm] = useState({ id: null, name: "", fee: "", active: true });

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const r = await api.get("/delivery-regions");
    setRegions(r.data);
  }

  function resetForm() {
    setForm({ id: null, name: "", fee: "", active: true });
  }

  async function save() {
    if (!form.name.trim() || !form.fee) {
      alert("Preencha nome e valor do frete.");
      return;
    }

    const payload = {
      name: form.name,
      fee: parseFloat(form.fee),
      active: form.active,
    };

    if (form.id) {
      await api.put(`/delivery-regions/${form.id}`, payload);
    } else {
      await api.post("/delivery-regions", payload);
    }

    resetForm();
    load();
  }

  async function editRegion(r) {
    setForm({
      id: r.id,
      name: r.name,
      fee: r.fee,
      active: r.active,
    });
  }

  async function removeRegion(id) {
    if (!window.confirm("Excluir região?")) return;
    await api.delete(`/delivery-regions/${id}`);
    load();
  }

  return (
    <div className="container" style={{ paddingTop: 40 }}>
      <h2>Regiões de Entrega / Fretes</h2>
      <hr />

      {/* Formulário */}
      <div className="themed-box" style={{ marginBottom: 24 }}>
        <h4>{form.id ? "Editar região" : "Nova região"}</h4>

        <label>Nome da cidade/região</label>
        <input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Ex.: Jandira-SP"
        />

        <label>Valor do frete (R$)</label>
        <input
          type="number"
          value={form.fee}
          onChange={(e) => setForm({ ...form, fee: e.target.value })}
        />

        <label>Ativo?</label>
        <select
          value={form.active ? "true" : "false"}
          onChange={(e) =>
            setForm({ ...form, active: e.target.value === "true" })
          }
        >
          <option value="true">Sim</option>
          <option value="false">Não</option>
        </select>

        <br />
        <br />

        <button onClick={save}>
          {form.id ? "Salvar alterações" : "Adicionar região"}
        </button>

        {form.id && (
          <button onClick={resetForm} style={{ marginLeft: 10 }}>
            Cancelar
          </button>
        )}
      </div>

      {/* Tabela */}
      <div className="themed-box">
        <table className="table">
          <thead>
            <tr>
              <th>Cidade/Região</th>
              <th>Frete (R$)</th>
              <th>Ativo</th>
              <th style={{ width: 140 }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {regions.map((r) => (
              <tr key={r.id}>
                <td>{r.name}</td>
                <td>R$ {Number(r.fee).toFixed(2).replace(".", ",")}</td>
                <td>{r.active ? "Sim" : "Não"}</td>
                <td>
                  <button onClick={() => editRegion(r)}>Editar</button>{" "}
                  <button onClick={() => removeRegion(r.id)}>Excluir</button>
                </td>
              </tr>
            ))}

            {regions.length === 0 && (
              <tr>
                <td colSpan={4}>Nenhuma região cadastrada.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}