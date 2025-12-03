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

  // Data dompet
  const [walletLoading, setWalletLoading] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);

  useEffect(() => {
    async function fetchUserAndWallet() {
      const { data, error } = await supabase.auth.getUser();
      if (!error && data?.user) {
        setUser(data.user);

        // Ambil transaksi dompet APPROVED untuk hitung saldo
        setWalletLoading(true);
        const { data: tx, error: txErr } = await supabase
          .from("wallet_transactions")
          .select("*")
          .eq("user_id", data.user.id)
          .eq("status", "APPROVED");

        if (!txErr && tx) {
          const summary = tx.reduce((acc, t) => {
            const amt = Number(t.amount);
            if (t.type === "DEPOSIT") acc += amt;
            if (t.type === "WITHDRAW") acc -= amt;
            return acc;
          }, 0);
          setWalletBalance(summary);
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

    if (subtotal > walletBalance) {
      setSaveMessage(
        "Saldo dompet simulasi tidak mencukupi. Silakan lakukan deposit dan menunggu ACC admin di menu Dompet."
      );
      return;
    }

    setSaving(true);

    // Simpan ke portfolios
    const rows = cart.map((item) => ({
      user_id: user.id,
      code: item.code,
      name: item.name,
      qty: item.qty,
      avg_price: item.price
    }));

    const { error: portError } = await supabase
      .from("portfolios")
      .insert(rows);

    if (portError) {
      console.error(portError);
      setSaving(false);
      setSaveMessage("Gagal menyimpan ke portofolio: " + portError.message);
      return;
    }

    // Catat transaksi dompet sebagai WITHDRAW APPROVED langsung (karena pembelian)
    const { error: walletError } = await supabase
      .from("wallet_transactions")
      .insert({
        user_id: user.id,
        type: "WITHDRAW",
        amount: subtotal,
        description: "Simulasi pembelian produk investasi",
        status: "APPROVED" // langsung mengurangi saldo
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
      "Portofolio simulasi berhasil disimpan dan saldo dompet terpotong otomatis."
    );
  }

  // ... (lanjutan isi komponennya sama seperti versi terakhir yang kita punya:
  // bagian checkingUser, tampilan saldo, grid produk, ringkasan keranjang)
}
