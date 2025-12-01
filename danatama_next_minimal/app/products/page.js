"use client";

import products from "../../lib/products";

export default function ProductsPage() {
  return (
    <>
      <h1 style={{ color: "#fbbf24", marginTop: 0 }}>Daftar Produk Investasi</h1>
      <p style={{ marginBottom: "20px", color: "#cbd5e1" }}>
        Pilih instrumen investasi yang ingin kamu simulasikan.
      </p>

      <div
        style={{
          display: "grid",
          gap: "16px",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))"
        }}
      >
        {products.map((p) => (
          <div
            key={p.id}
            style={{
              background: "#1e293b",
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
                cursor: "pointer"
              }}
              onClick={() => alert(`Ditambahkan ke keranjang: ${p.name}`)}
            >
              Tambah ke Keranjang
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
