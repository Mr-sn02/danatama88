"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function PortfolioHistoryPage() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  // Harga pasar SIMULASI (bisa akhi ubah kapan saja)
  const currentPrices = {
    BBCA: 37000,
    BBRI: 5200,
    TLKM: 4100,
    RDPU: 101000,
    ORIRTL: 1020000
  };

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

  // Hitung total P/L keseluruhan
  const totalPL = rows.reduce((sum, row) => {
    const buy = Number(row.avg_price);
    const cur = currentPrices[row.code] ?? buy;
    const qty = Number(row.qty);
    return sum + (cur - buy) * qty;
  }, 0);

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
        akun Anda. Harga pasar pada kolom P/L bersifat simulasi.
      </p>

      {loading ? (
        <p style={{ fontSize: "14px", color: "#9ca3af" }}>Memuat data…</p>
      ) : rows.length === 0 ? (
        <p style={{ fontSize: "14px", color: "#9ca3af" }}>
          Belum ada data portofolio. Simpan dulu keranjang investasi dari
          halaman Produk.
        </p>
      ) : (
        <>
          {/* Ringkasan P/L total */}
          <div
            style={{
              marginBottom: "12px",
              fontSize: "14px",
              fontWeight: 600
            }}
          >
            Total P/L Simulasi:{" "}
            <span
              style={{
                color: totalPL >= 0 ? "#4ade80" : "#f97373"
              }}
            >
              {totalPL >= 0 ? "+" : "-"} Rp{" "}
              {Math.abs(totalPL).toLocaleString("id-ID")}
            </span>
          </div>

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
                  <th style={thStyle}>Harga Beli</th>
                  <th style={thStyle}>Harga Pasar</th>
                  <th style={thStyle}>P/L</th>
                  <th style={thStyle}>P/L %</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => {
                  const buy = Number(row.avg_price);
                  const cur = currentPrices[row.code] ?? buy;
                  const qty = Number(row.qty);
                  const pl = (cur - buy) * qty;
                  const plPct =
                    buy > 0 ? ((cur - buy) / buy) * 100 : 0;
                  const plColor = pl >= 0 ? "#4ade80" : "#f97373";

                  return (
                    <tr key={row.id}>
                      <td style={tdStyle}>
                        {row.created_at
                          ? new Date(row.created_at).toLocaleString("id-ID")
                          : "-"}
                      </td>
                      <td style={tdStyle}>{row.code}</td>
                      <td style={tdStyle}>{row.name}</td>
                      <td style={tdStyle}>{qty}</td>
                      <td style={tdStyle}>
                        Rp {buy.toLocaleString("id-ID")}
                      </td>
                      <td style={tdStyle}>
                        Rp {cur.toLocaleString("id-ID")}
                      </td>
                      <td style={{ ...tdStyle, color: plColor }}>
                        {pl >= 0 ? "+" : "-"} Rp{" "}
                        {Math.abs(pl).toLocaleString("id-ID")}
                      </td>
                      <td style={{ ...tdStyle, color: plColor }}>
                        {pl >= 0 ? "+" : "-"}
                        {Math.abs(plPct).toFixed(2)}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

const thStyle = {
  textAlign: "left",
  padding: "8px 10px",
  borderBottom: "1px solid #1f2937",
  color: "#e5e7eb",
  whiteSpace: "nowrap"
};

const tdStyle = {
  padding: "8px 10px",
  borderBottom: "1px solid #1f2937",
  color: "#e5e7eb",
  whiteSpace: "nowrap"
};
