import React, { useState, useEffect } from "react";
import api from "../api";

export default function ProdutoForm({ categorias, produtoEdit, onSave }) {

  const [form, setForm] = useState({
    name: "",
    price: "",
    imageUrl: "",
    category: null,
    onSale: false,
    salePrice: ""
  });

  useEffect(() => {
    if (produtoEdit) {
      setForm({
        name: produtoEdit.name,
        price: produtoEdit.price,
        imageUrl: produtoEdit.imageUrl,
        category: produtoEdit.category?.id || null,
        onSale: produtoEdit.onSale || false,
        salePrice: produtoEdit.salePrice || ""
      });
    }
  }, [produtoEdit]);

  function update(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function salvar() {
    const payload = {
      name: form.name,
      price: Number(form.price),
      imageUrl: form.imageUrl,
      onSale: form.onSale,
      salePrice: form.onSale ? Number(form.salePrice) : null,
      category: form.category ? { id: Number(form.category) } : null
    };

    if (produtoEdit) {
      await api.put(`/products/${produtoEdit.id}`, payload);
    } else {
      await api.post(`/products`, payload);
    }

    alert("Produto salvo!");

    setForm({
      name: "",
      price: "",
      imageUrl: "",
      category: null,
      onSale: false,
      salePrice: ""
    });

    onSave();
  }

  return (
    <div style={{ marginBottom: 20 }}>
      <h3>{produtoEdit ? "Editar Produto" : "Novo Produto"}</h3>

      <input placeholder="Nome" name="name" value={form.name} onChange={update} /><br />

      <input placeholder="Preço" name="price" value={form.price} onChange={update} /><br />

      <input placeholder="Imagem URL" name="imageUrl" value={form.imageUrl} onChange={update} /><br />

      <select name="category" value={form.category || ""} onChange={update}>
        <option value="">Sem categoria</option>
        {categorias.map(c => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>

      <br />

      <label>
        <input
          type="checkbox"
          checked={form.onSale}
          onChange={(e) => setForm({ ...form, onSale: e.target.checked })}
        />
        Produto em oferta?
      </label>

      {form.onSale && (
        <input
          placeholder="Preço promocional"
          name="salePrice"
          value={form.salePrice}
          onChange={update}
        />
      )}

      <br /><br />

      <button onClick={salvar}>Salvar</button>
    </div>
  );
}