"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function PortfolioHistoryPage() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchUserAndData() {
      const { data, error } = await supabase.auth.getUser();
      if (!error && data?.user) {
        setUser(data.user);
        setLoading(true);
        const { data: portfolioData, error: pError } = await supabase
          .from("portfolios")
          .select("*")
          .eq("user_id", data.user.id)
          .order("created_at", { ascending: false });
        if (!pError && portfolioData) {
          setRows(portfolioData);
        }
        setLoading(false);
      }
      setChecking(false);
    }
    fetchUserAndData();
  }, []);

  if (checking) {
    return (
      <p style={{ fontSize: "14px", color: "#9ca3af" }}>
        Mengecek sesi & memuat data…
      </p>
    );
  }

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
          Untuk melihat riwayat portofolio simulasi, silakan login terlebih
          dahulu.
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
          Pergi ke Login
        </a>
      </div>
    );
  }

  return (
    <div>
      <h1
        style={{
          color: "#fbbf24",
          marginTop: 0,
          marginBottom: "8px",
          fontSize: "20px"
        }}
      >
        Riwayat Portofolio Simulasi
      </h1>
      <p
        style={{
          fontSize: "13px",
          color: "#cbd5e1",
          marginTop: 0,
          marginBottom: "16px"
        }}
      >
        Data ini diambil dari tabel <code>portfolios</code> di Supabase untuk
        akun Anda.
      </p>

      {loading ? (
        <p style={{ fontSize: "14px", color: "#9ca3af" }}>Memuat data…</p>
      ) : rows.length === 0 ? (
        <p style={{ fontSize: "14px", color: "#9ca3af" }}>
          Belum ada data portofolio. Simpan dulu keranjang investasi dari
          halaman Produk.
        </p>
      ) : (
        <div
          style={{
            borderRadius: "14px",
            border: "1px solid #334155",
            backgroundColor: "#020617",
            overflowX: "auto"
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "13px"
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#020617" }}>
                <th style={thStyle}>Tanggal</th>
                <th style={thStyle}>Kode</th>
                <th style={thStyle}>Nama</th>
                <th style={thStyle}>Qty</th>
                <th style={thStyle}>Harga</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <td style={tdStyle}>
                    {row.created_at
                      ? new Date(row.created_at).toLocaleString("id-ID")
                      : "-"}
                  </td>
                  <td style={tdStyle}>{row.code}</td>
                  <td style={tdStyle}>{row.name}</td>
                  <td style={tdStyle}>{row.qty}</td>
                  <td style={tdStyle}>
                    Rp {Number(row.avg_price).toLocaleString("id-ID")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const thStyle = {
  textAlign: "left",
  padding: "8px 10px",
  borderBottom: "1px solid #1f2937",
  color: "#e5e7eb"
};

const tdStyle = {
  padding: "8px 10px",
  borderBottom: "1px solid #1f2937",
  color: "#e5e7eb"
};
