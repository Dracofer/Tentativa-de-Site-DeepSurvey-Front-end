import React, { useState, useEffect } from "react";
import api from "../api";

export default function Admin() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [onSale, setOnSale] = useState(false);

  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [extraImages, setExtraImages] = useState("");
  const [stock, setStock] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const [newCategory, setNewCategory] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  async function loadProducts() {
    const r = await api.get("/products");
    setProducts(r.data);
  }

  async function loadCategories() {
    const r = await api.get("/categories");
    setCategories(r.data);
  }

  async function addProduct() {
    try {
      await api.post("/products", {
        name,
        price: parseFloat(price),
        salePrice: onSale ? parseFloat(salePrice) : null,
        onSale,
        description,
        imageUrl,
        stock: parseInt(stock || "0"),
        category: categoryId ? { id: categoryId } : null,
        images: extraImages
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      });

      // Limpando os campos
      setName("");
      setPrice("");
      setSalePrice("");
      setOnSale(false);
      setDescription("");
      setImageUrl("");
      setExtraImages("");
      setStock("");
      setCategoryId("");

      loadProducts();
    } catch (e) {
      console.error(e);
      alert("Erro ao adicionar produto");
    }
  }

  async function deleteProduct(id) {
    if (!window.confirm("Excluir este produto?")) return;
    await api.delete("/products/" + id);
    loadProducts();
  }

  async function saveEdit() {
    try {
      const updated = {
        ...editingProduct,
        price: parseFloat(editingProduct.price),
        salePrice: editingProduct.onSale
          ? parseFloat(editingProduct.salePrice)
          : null,
        images: editingProduct.images
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      };

      await api.put("/products/" + editingProduct.id, updated);
      setEditingProduct(null);
      loadProducts();
    } catch (e) {
      console.error(e);
      alert("Erro ao salvar edição");
    }
  }

  async function addCategory() {
    if (!newCategory) return;
    await api.post("/categories", { name: newCategory });
    setNewCategory("");
    loadCategories();
  }

  async function deleteCategory(id) {
    if (!window.confirm("Excluir categoria?")) return;
    await api.delete("/categories/" + id);
    loadCategories();
  }

  return (
    <div className="container" style={{ maxWidth: 1000, paddingTop: 30 }}>
      {/* ================================
           CAIXA PRINCIPAL (THEMED-BOX)
      ================================= */}
      <div className="themed-box">
        <h2>Painel Admin</h2>

        {/* NOVO PRODUTO */}
        <h3>Novo Produto</h3>

        <div
          style={{
            maxWidth: 400,
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          <input placeholder="Nome" value={name} onChange={(e) => setName(e.target.value)} />

          <input
            type="number"
            placeholder="Preço"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />

          {/* Checkbox oferta */}
          <label>
            <input
              type="checkbox"
              checked={onSale}
              onChange={(e) => setOnSale(e.target.checked)}
            />
            Produto em oferta?
          </label>

          {onSale && (
            <input
              type="number"
              placeholder="Preço promocional"
              value={salePrice}
              onChange={(e) => setSalePrice(e.target.value)}
            />
          )}

          <input
            type="number"
            placeholder="Estoque"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
          />

          <input
            placeholder="Imagem principal (ex: whey.jpeg)"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />

          <textarea
            placeholder="Descrição"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <input
            placeholder="Imagens extras separadas por vírgula"
            value={extraImages}
            onChange={(e) => setExtraImages(e.target.value)}
          />

          <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
            <option value="">Selecione categoria</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <button onClick={addProduct}>Adicionar Produto</button>
        </div>

        <hr />

        {/* CATEGORIAS */}
        <h3>Categorias</h3>

        <div style={{ display: "flex", gap: 10 }}>
          <input
            placeholder="Nova categoria"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          />
          <button onClick={addCategory}>Adicionar</button>
        </div>

        <ul>
          {categories.map((c) => (
            <li key={c.id}>
              {c.name}
              <button
                style={{ color: "red", marginLeft: 10 }}
                onClick={() => deleteCategory(c.id)}
              >
                Excluir
              </button>
            </li>
          ))}
        </ul>

        <hr />

        {/* LISTA DE PRODUTOS */}
        <h3>Produtos</h3>

        {products.map((p) => (
          <div
            key={p.id}
            className="themed-box"
            style={{
              marginBottom: 15,
              padding: 12,
              borderRadius: 10,
            }}
          >
            <strong>{p.name}</strong> — R$ {p.price.toFixed(2)}
            {p.onSale && (
              <>
                {" "}
                —{" "}
                <span style={{ color: "red", fontWeight: 700 }}>
                  R$ {p.salePrice.toFixed(2)}
                </span>{" "}
                (oferta)
              </>
            )}
            <br />

            Categoria: {p.category?.name || "Sem categoria"}
            <br />

            <button
              onClick={() =>
                setEditingProduct({
                  ...p,
                  images: (p.images || []).join(", "),
                })
              }
            >
              Editar
            </button>

            <button
              style={{ color: "red", marginLeft: 10 }}
              onClick={() => deleteProduct(p.id)}
            >
              Excluir
            </button>
          </div>
        ))}
      </div>

      {/* MODAL EDIÇÃO */}
      {editingProduct && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <div className="themed-box" style={{ width: 420 }}>
            <h3>Editar Produto</h3>

            <input
              value={editingProduct.name}
              onChange={(e) =>
                setEditingProduct({ ...editingProduct, name: e.target.value })
              }
            />

            <input
              type="number"
              value={editingProduct.price}
              onChange={(e) =>
                setEditingProduct({ ...editingProduct, price: e.target.value })
              }
            />

            <label>
              <input
                type="checkbox"
                checked={editingProduct.onSale}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    onSale: e.target.checked,
                  })
                }
              />
              Produto em oferta?
            </label>

            {editingProduct.onSale && (
              <input
                type="number"
                placeholder="Preço promocional"
                value={editingProduct.salePrice || ""}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    salePrice: e.target.value,
                  })
                }
              />
            )}

            <input
              type="number"
              value={editingProduct.stock}
              onChange={(e) =>
                setEditingProduct({ ...editingProduct, stock: e.target.value })
              }
            />

            <input
              value={editingProduct.imageUrl}
              onChange={(e) =>
                setEditingProduct({
                  ...editingProduct,
                  imageUrl: e.target.value,
                })
              }
            />

            <textarea
              value={editingProduct.description}
              onChange={(e) =>
                setEditingProduct({
                  ...editingProduct,
                  description: e.target.value,
                })
              }
            />

            <input
              placeholder="Imagens extras separadas por vírgula"
              value={editingProduct.images}
              onChange={(e) =>
                setEditingProduct({ ...editingProduct, images: e.target.value })
              }
            />

            <select
              value={editingProduct.category?.id || ""}
              onChange={(e) =>
                setEditingProduct({
                  ...editingProduct,
                  category: e.target.value ? { id: e.target.value } : null,
                })
              }
            >
              <option value="">Sem categoria</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            <br />
            <br />

            <button onClick={saveEdit}>Salvar</button>
            <button
              style={{ marginLeft: 10 }}
              onClick={() => setEditingProduct(null)}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}