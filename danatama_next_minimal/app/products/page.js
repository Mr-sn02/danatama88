"use client";

import { useState, useEffect } from "react";
import products from "../../lib/products";
import { supabase } from "../../lib/supabaseClient";

export default function ProductsPage() {
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [checkingUser, setCheckingUser] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    async function fetchUser() {
      const { data, error } = await supabase.auth.getUser();
      if (!error && data?.user) {
        setUser(data.user);
      }
      setCheckingUser(false);
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

  async function handleSavePortfolio() {
    setSaveMessage("");
    if (!user) {
      setSaveMessage("Anda harus login untuk menyimpan portofolio.");
      return;
    }
    if (cart.length === 0) {
      setSaveMessage("Keranjang masih kosong. Tambahkan produk terlebih dahulu.");
      return;
    }

    setSaving(true);

    const rows = cart.map((item) => ({
      user_id: user.id,
      code: item.code,
      name: item.name,
      qty: item.qty,
      avg_price: item.price
    }));

    const { error } = await supabase.from("portfolios").insert(rows);

    setSaving(false);

    if (error) {
      console.error(error);
      setSaveMessage("Gagal menyimpan ke portofolio: " + error.message);
      return;
    }

    setSaveMessage(
      "Portofolio simulasi berhasil disimpan. Anda bisa melihatnya di halaman Riwayat Portofolio."
    );
  }

  // ⏳ Saat masih cek user
  if (checkingUser) {
    return (
      <p style={{ fontSize: "14px", color: "#9ca3af" }}>
        Mengecek sesi login…
      </p>
    );
  }

  // 🚫 Kalau belum login
  if (!user) {
    return (
      <div
        style={{
          maxWidth: "420px",
          margin: "0 auto",
          backgroundColor: "#020617",
          borderRadius: "16px",
          border: "1px solid #1f2937",
          padding: "20px",
          textAlign: "center"
        }}
      >
        <h1
          style={{
            color: "#fbbf24",
            marginTop: 0,
            marginBottom: "8px",
            fontSize: "20px"
          }}
        >
          Butuh Login
        </h1>
        <p
          style={{
            fontSize: "13px",
            color: "#cbd5e1",
            marginTop: 0,
            marginBottom: "12px"
          }}
        >
          Untuk mengakses simulasi produk investasi, silakan login terlebih
          dahulu dengan akun Danatama.
        </p>
        <a
          href="/login"
          style={{
            display: "inline-block",
            textDecoration: "none",
            backgroundColor: "#fbbf24",
            color: "#111827",
            padding: "10px 16px",
            borderRadius: "8px",
            fontWeight: 700,
            fontSize: "14px"
          }}
        >
          Pergi ke Halaman Login
        </a>
      </div>
    );
  }

  // ✅ Kalau sudah login
  return (
    <>
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
            <div
              style={{
                fontSize: "11px",
                color: "#9ca3af",
                marginBottom: "4px",
                textTransform: "uppercase",
                letterSpacing: "0.12em"
              }}
            >
              {p.code}
            </div>
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
                    <div style={{ fontWeight: 600 }}>
                      {item.code} – {item.name}
                    </div>
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
                cursor: saving ? "default" : "pointer",
                fontWeight: 600,
                fontSize: "14px",
                opacity: saving ? 0.7 : 1
              }}
              onClick={handleSavePortfolio}
              disabled={saving}
            >
              {saving ? "Menyimpan…" : "Simpan ke Portofolio"}
            </button>

            {saveMessage && (
              <p
                style={{
                  fontSize: "12px",
                  color: "#9ca3af",
                  marginTop: "8px"
                }}
              >
                {saveMessage}
              </p>
            )}
          </>
        )}
      </section>
    </>
  );
}
