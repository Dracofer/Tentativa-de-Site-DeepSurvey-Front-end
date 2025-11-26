import React, {useEffect,useState} from "react";
import { Link } from "react-router-dom";
import api from "../api";
import ProductCard from "../components/ProductCard";

export default function Home(){
  const [products,setProducts]=useState([]);
  const [categories,setCategories]=useState([]);

  useEffect(()=>{ load(); },[]);

  async function load(){
    try{
      const r = await api.get("/products");
      setProducts(r.data || []);
      const c = await api.get("/categories");
      setCategories(c.data || []);
    }catch(e){ console.error(e) }
  }

  const promotions = products.filter(p => p.onSale === true);

  const byCategory = {};
  products.forEach(p => {
    const cid = p.category?.id || 0;
    if(!byCategory[cid]) byCategory[cid] = [];
    byCategory[cid].push(p);
  });

  return (
    <div className="container">

      {/* CATEGORIAS */}
      {categories.map(cat => (
        <section key={cat.id}>
          <div className="section-row">
            <h2>{cat.name}</h2>
            
            <Link to={`/categoria/${cat.id}`} className="view-all">
              Ver tudo
            </Link>
          </div>

          <div className="products-grid">
            {(byCategory[cat.id] || []).map(p => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}