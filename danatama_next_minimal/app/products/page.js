"use client";

import { useState, useEffect } from "react";
import products from "../../lib/products";
import { supabase } from "../../lib/supabaseClient";

export default function ProductsPage() {
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      const { data, error } = await supabase.auth.getUser();
      if (!error && data?.user) {
        setUser(data.user);
      }
    }
    fetchUser();
  }, []);

  function handleAddToCart(product) {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  }

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  const displayName =
    user?.user_metadata?.username || user?.email || "Nasabah";

  return (
    <>
      {user && (
        <p
          style={{
            fontSize: "13px",
            color: "#a5b4fc",
            marginTop: 0,
            marginBottom: "8px"
          }}
        >
          Selamat datang, <strong>{displayName}</strong>. Simulasi berikut hanya
          untuk tujuan edukasi.
        </p>
      )}

      <h1 style={{ color: "#fbbf24", marginTop: 0 }}>
        Daftar Produk Investasi
      </h1>
      <p style={{ marginBottom: "20px", color: "#cbd5e1" }}>
        Pilih instrumen investasi yang ingin kamu simulasikan.
      </p>

      {/* GRID PRODUK */}
      <div
        style={{
          display: "grid",
          gap: "16px",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          marginBottom: "24px"
        }}
      >
        {products.map((p) => (
          <div
            key={p.id}
            style={{
              background: "#020617",
              borderRadius: "14px",
              padding: "16px",
              border: "1px solid #334155"
            }}
          >
            <h3 style={{ color: "#fbbf24", marginTop: 0 }}>{p.name}</h3>
            <p style={{ fontSize: "14px", color: "#cbd5e1" }}>
              {p.description}
            </p>
            <p
              style={{
                fontWeight: "bold",
                color: "#38bdf8",
                marginTop: "8px"
              }}
            >
              Rp {p.price.toLocaleString("id-ID")}
            </p>
            <button
              style={{
                marginTop: "10px",
                background: "#fbbf24",
                color: "#111",
                padding: "10px 16px",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                fontWeight: 600
              }}
              onClick={() => handleAddToCart(p)}
            >
              Tambah ke Keranjang
            </button>
          </div>
        ))}
      </div>

      {/* RINGKASAN KERANJANG */}
      <section
        style={{
          background: "#020617",
          borderRadius: "14px",
          border: "1px solid #334155",
          padding: "16px"
        }}
      >
        <h2
          style={{
            fontSize: "18px",
            marginTop: 0,
            marginBottom: "8px",
            color: "#fbbf24"
          }}
        >
          Ringkasan Keranjang Investasi
        </h2>

        {cart.length === 0 ? (
          <p style={{ fontSize: "14px", color: "#9ca3af" }}>
            Keranjang masih kosong. Tambahkan saham atau produk lain untuk
            melihat simulasi nominal investasi.
          </p>
        ) : (
          <>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                marginBottom: "12px"
              }}
            >
              {cart.map((item) => (
                <li
                  key={item.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontSize: "14px",
                    padding: "6px 0",
                    borderBottom: "1px solid #1f2937"
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600 }}>{item.name}</div>
                    <div style={{ fontSize: "12px", color: "#9ca3af" }}>
                      Qty: {item.qty} × Rp{" "}
                      {item.price.toLocaleString("id-ID")}
                    </div>
                  </div>
                  <div style={{ fontWeight: 600, color: "#38bdf8" }}>
                    Rp{" "}
                    {(item.price * item.qty).toLocaleString("id-ID")}
                  </div>
                </li>
              ))}
            </ul>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "8px"
              }}
            >
              <div style={{ fontWeight: 700 }}>Total Nominal Investasi</div>
              <div
                style={{
                  fontWeight: 800,
                  fontSize: "16px",
                  color: "#4ade80"
                }}
              >
                Rp {subtotal.toLocaleString("id-ID")}
              </div>
            </div>

            <button
              style={{
                marginTop: "12px",
                background: "#1d4ed8",
                color: "#e5e7eb",
                padding: "10px 16px",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "14px"
              }}
              onClick={() =>
                alert(
                  `Simulasi investasi dengan total nominal Rp ${subtotal.toLocaleString(
                    "id-ID"
                  )}`
                )
              }
            >
              Simulasikan Investasi
            </button>
          </>
        )}
      </section>
    </>
  );
}
