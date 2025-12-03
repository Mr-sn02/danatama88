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

  const [walletLoading, setWalletLoading] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);

  useEffect(() => {
    async function fetchUserAndWallet() {
      const { data, error } = await supabase.auth.getUser();
      if (!error && data?.user) {
        setUser(data.user);

        setWalletLoading(true);
        const { data: tx, error: txErr } = await supabase
          .from("wallet_transactions")
          .select("*")
          .eq("user_id", data.user.id)
          .eq("status", "APPROVED");

        if (!txErr && tx) {
          const saldo = tx.reduce((acc, t) => {
            const amt = Number(t.amount);
            if (t.type === "DEPOSIT") acc += amt;
            if (t.type === "WITHDRAW") acc -= amt;
            return acc;
          }, 0);
          setWalletBalance(saldo);
        }
        setWalletLoading(false);
      }
      setCheckingUser(false);
    }

    fetchUserAndWallet();
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
    user?.user_metadata?.full_name ||
    user?.user_metadata?.username ||
    user?.email ||
    "Nasabah";

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

    if (subtotal > walletBalance) {
      setSaveMessage(
        "Saldo dompet Saham tidak mencukupi. Silakan lakukan deposit pada menu Dompet untuk mengisi dana Anda kemabli."
      );
      return;
    }

    setSaving(true);

    const rows = cart.map((item) => ({
      user_id: user.id,
      code: item.code,
      name: item.name,
      qty: item.qty,
      avg_price: item.price,
    }));

    const { error: portError } = await supabase.from("portfolios").insert(rows);

    if (portError) {
      console.error(portError);
      setSaving(false);
      setSaveMessage("Gagal menyimpan ke portofolio: " + portError.message);
      return;
    }

    const { error: walletError } = await supabase
      .from("wallet_transactions")
      .insert({
        user_id: user.id,
        type: "WITHDRAW",
        amount: subtotal,
        description: "Management pembelian produk investasi",
        status: "APPROVED",
      });

    setSaving(false);

    if (walletError) {
      console.error(walletError);
      setSaveMessage(
        "Portofolio tersimpan, namun gagal mencatat transaksi dompet: " +
          walletError.message
      );
      return;
    }

    setWalletBalance((prev) => prev - subtotal);
    setCart([]);
    setSaveMessage(
      "Portofolio Management berhasil disimpan dan saldo dompet terpotong otomatis."
    );
  }

  if (checkingUser) {
    return (
      <div className="dt-container">
        <p className="dt-muted">Mengecek sesi login…</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="dt-container">
        <div className="dt-card" style={{ maxWidth: 420, margin: "0 auto" }}>
          <h1 style={{ color: "#fbbf24", fontSize: 20 }}>Butuh Login</h1>
          <p className="dt-soft dt-mt-2" style={{ fontSize: 13 }}>
            Untuk mengakses Management produk investasi, silakan login terlebih
            dahulu dengan akun Danatama.
          </p>
          <a href="/login" className="dt-btn dt-btn-primary dt-mt-3">
            Pergi ke Halaman Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="dt-container">
      {/* Salam & saldo */}
      <p className="dt-soft" style={{ fontSize: 13 }}>
        Selamat datang, <span className="dt-gold">{displayName}</span>. Simulasi
        berikut hanya untuk tujuan edukasi.
      </p>

      <div className="dt-flex dt-flex-wrap dt-gap-2 dt-mt-2" style={{ fontSize: 13 }}>
        <span>Saldo Dompet Management (APPROVED):</span>
        <span style={{ fontWeight: 700, color: "#4ade80" }}>
          {walletLoading
            ? "Memuat…"
            : `Rp ${walletBalance.toLocaleString("id-ID")}`}
        </span>
        <a href="/wallet" style={{ fontSize: 12 }} className="dt-muted">
          Kelola di menu Dompet →
        </a>
      </div>

      {/* GRID PRODUK */}
      <h1 className="dt-mt-3" style={{ color: "#fbbf24", fontSize: 20 }}>
        Daftar Produk Investasi
      </h1>
      <p className="dt-soft" style={{ fontSize: 13, marginTop: 4 }}>
        Pilih instrumen investasi yang ingin kamu simulasikan. Total pembelian
        tidak boleh melebihi saldo dompet simulasi.
      </p>

      <div
        style={{
          display: "grid",
          gap: 12,
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          marginTop: 14,
          marginBottom: 18,
        }}
      >
        {products.map((p) => (
          <div key={p.id} className="dt-card-soft">
            <div
              style={{
                fontSize: 11,
                color: "#9ca3af",
                marginBottom: 4,
                textTransform: "uppercase",
                letterSpacing: "0.12em",
              }}
            >
              {p.code}
            </div>
            <h3
              style={{
                color: "#fbbf24",
                marginTop: 0,
                marginBottom: 4,
                fontSize: 15,
              }}
            >
              {p.name}
            </h3>
            <p
              style={{
                fontSize: 13,
                color: "#cbd5e1",
                marginBottom: 6,
              }}
            >
              {p.description}
            </p>
            <p
              style={{
                fontWeight: "bold",
                color: "#38bdf8",
                marginTop: 4,
                marginBottom: 8,
                fontSize: 14,
              }}
            >
              Rp {p.price.toLocaleString("id-ID")}
            </p>
            <button
              className="dt-btn dt-btn-primary dt-btn-xs"
              style={{ width: "100%", marginTop: 4 }}
              onClick={() => handleAddToCart(p)}
            >
              Tambah ke Keranjang
            </button>
          </div>
        ))}
      </div>

      {/* KERANJANG */}
      <section className="dt-card">
        <h2 className="dt-card-title">Ringkasan Keranjang Investasi</h2>

        {cart.length === 0 ? (
          <p className="dt-muted" style={{ fontSize: 13 }}>
            Keranjang masih kosong. Tambahkan saham atau produk lain untuk
            melihat Management nominal investasi.
          </p>
        ) : (
          <>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                marginBottom: 10,
              }}
            >
              {cart.map((item) => (
                <li
                  key={item.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    fontSize: 13,
                    padding: "6px 0",
                    borderBottom: "1px solid #1f2937",
                    gap: 8,
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600 }}>
                      {item.code} – {item.name}
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        color: "#9ca3af",
                        marginTop: 2,
                      }}
                    >
                      Qty: {item.qty} × Rp{" "}
                      {item.price.toLocaleString("id-ID")}
                    </div>
                  </div>
                  <div
                    style={{
                      fontWeight: 600,
                      color: "#38bdf8",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Rp{" "}
                    {(item.price * item.qty).toLocaleString("id-ID")}
                  </div>
                </li>
              ))}
            </ul>

            <div className="dt-flex dt-flex-between dt-mt-2 dt-flex-wrap dt-gap-2">
              <div style={{ fontWeight: 700, fontSize: 14 }}>
                Total Nominal Investasi
              </div>
              <div
                style={{
                  fontWeight: 800,
                  fontSize: 16,
                  color:
                    subtotal > walletBalance ? "#f97373" : "#4ade80",
                }}
              >
                Rp {subtotal.toLocaleString("id-ID")}
              </div>
            </div>

            {subtotal > walletBalance && (
              <p
                style={{
                  fontSize: 12,
                  color: "#f97373",
                  marginTop: 4,
                }}
              >
                Total keranjang melebihi saldo dompet simulasi. Kurangi nominal
                atau lakukan deposit dan tunggu ACC admin di menu Dompet.
              </p>
            )}

            <button
              className="dt-btn dt-mt-3"
              style={{
                width: "100%",
                backgroundColor:
                  saving || subtotal > walletBalance ? "#6b7280" : "#1d4ed8",
                color: "#e5e7eb",
                cursor:
                  saving || subtotal > walletBalance
                    ? "default"
                    : "pointer",
              }}
              onClick={handleSavePortfolio}
              disabled={saving || subtotal > walletBalance}
            >
              {saving ? "Menyimpan…" : "Simpan ke Portofolio"}
            </button>

            {saveMessage && (
              <p className="dt-muted" style={{ fontSize: 12, marginTop: 6 }}>
                {saveMessage}
              </p>
            )}
          </>
        )}
      </section>
    </div>
  );
}
