"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function WalletPage() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);
  const [loadingTx, setLoadingTx] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [form, setForm] = useState({
    type: "DEPOSIT",
    amount: "",
    description: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  // Ambil user + transaksi
  useEffect(() => {
    async function fetchUserAndTx() {
      const { data, error } = await supabase.auth.getUser();
      if (!error && data?.user) {
        setUser(data.user);
        setLoadingTx(true);
        const { data: tx, error: txErr } = await supabase
          .from("wallet_transactions")
          .select("*")
          .eq("user_id", data.user.id)
          .order("created_at", { ascending: false });
        if (!txErr && tx) {
          setTransactions(tx);
        }
        setLoadingTx(false);
      }
      setChecking(false);
    }
    fetchUserAndTx();
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  }

  // Hitung saldo hanya dari transaksi APPROVED
  const summary = transactions.reduce(
    (acc, tx) => {
      if (tx.status !== "APPROVED") return acc;
      const amt = Number(tx.amount);
      if (tx.type === "DEPOSIT") {
        acc.deposit += amt;
        acc.balance += amt;
      } else if (tx.type === "WITHDRAW") {
        acc.withdraw += amt;
        acc.balance -= amt;
      }
      return acc;
    },
    { balance: 0, deposit: 0, withdraw: 0 }
  );

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");

    if (!user) {
      setMessage("Anda harus login untuk menggunakan dompet.");
      return;
    }

    const amountNum = Number(form.amount);
    if (!amountNum || amountNum <= 0) {
      setMessage("Nominal harus lebih besar dari 0.");
      return;
    }

    // NOTE: Di level pengajuan, kita tidak cek saldo. Cek saldo bisa dilakukan admin saat ACC.
    setSubmitting(true);

    const { error } = await supabase.from("wallet_transactions").insert({
      user_id: user.id,
      type: form.type,
      amount: amountNum,
      description: form.description || null,
      status: "PENDING" // penting: jadi pengajuan, bukan langsung aktif
    });

    setSubmitting(false);

    if (error) {
      console.error(error);
      setMessage("Gagal menyimpan pengajuan: " + error.message);
      return;
    }

    // Tambah pengajuan baru ke list lokal (status PENDING)
    const newTx = {
      id: Date.now(),
      user_id: user.id,
      type: form.type,
      amount: amountNum,
      description: form.description || null,
      status: "PENDING",
      created_at: new Date().toISOString()
    };

    setTransactions((prev) => [newTx, ...prev]);

    setForm({
      type: "DEPOSIT",
      amount: "",
      description: ""
    });

    setMessage(
      form.type === "DEPOSIT"
        ? "Pengajuan deposit berhasil dikirim. Menunggu persetujuan admin."
        : "Pengajuan withdraw berhasil dikirim. Menunggu persetujuan admin."
    );
  }

  if (checking) {
    return (
      <p style={{ fontSize: "14px", color: "#9ca3af" }}>
        Mengecek sesi login…
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
          Untuk menggunakan dompet simulasi Danatama, silakan login terlebih
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
        Dompet Simulasi
      </h1>
      <p
        style={{
          fontSize: "13px",
          color: "#cbd5e1",
          marginTop: 0,
          marginBottom: "12px"
        }}
      >
        Pengajuan deposit dan withdraw akan masuk ke admin panel untuk
        disetujui atau ditolak. Saldo hanya bertambah/berkurang dari transaksi
        yang berstatus <strong>APPROVED</strong>.
      </p>

      {/* Ringkasan saldo */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "16px",
          marginBottom: "20px"
        }}
      >
        <SummaryCard
          label="Saldo Tersedia (APPROVED)"
          value={summary.balance}
          highlight
        />
        <SummaryCard label="Total Deposit Disetujui" value={summary.deposit} />
        <SummaryCard
          label="Total Withdraw Disetujui"
          value={summary.withdraw}
          negative
        />
      </div>

      {/* Form transaksi */}
      <div
        style={{
          maxWidth: "480px",
          marginBottom: "24px",
          backgroundColor: "#020617",
          borderRadius: "16px",
          border: "1px solid #1f2937",
          padding: "20px"
        }}
      >
        <h2
          style={{
            color: "#e5e7eb",
            marginTop: 0,
            marginBottom: "12px",
            fontSize: "16px"
          }}
        >
          Ajukan Transaksi
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Jenis transaksi */}
          <label
            style={{
              display: "block",
              fontSize: "13px",
              marginBottom: "4px",
              color: "#e5e7eb"
            }}
          >
            Jenis Transaksi
          </label>
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            style={inputStyle}
          >
            <option value="DEPOSIT">Deposit</option>
            <option value="WITHDRAW">Withdraw</option>
          </select>

          {/* Nominal */}
          <label
            style={{
              display: "block",
              fontSize: "13px",
              marginBottom: "4px",
              marginTop: "10px",
              color: "#e5e7eb"
            }}
          >
            Nominal (Rp)
          </label>
          <input
            type="number"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            placeholder="Contoh: 1000000"
            style={inputStyle}
            min="0"
            step="1000"
          />

          {/* Keterangan */}
          <label
            style={{
              display: "block",
              fontSize: "13px",
              marginBottom: "4px",
              marginTop: "10px",
              color: "#e5e7eb"
            }}
          >
            Keterangan (opsional)
          </label>
          <input
            type="text"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Contoh: Top up awal, penarikan keuntungan"
            style={inputStyle}
          />

          {message && (
            <p
              style={{
                fontSize: "12px",
                color: "#9ca3af",
                marginTop: "6px",
                marginBottom: 0
              }}
            >
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            style={{
              width: "100%",
              backgroundColor: "#fbbf24",
              color: "#111827",
              border: "none",
              padding: "10px 16px",
              borderRadius: "8px",
              fontWeight: 700,
              fontSize: "14px",
              cursor: submitting ? "default" : "pointer",
              marginTop: "16px",
              opacity: submitting ? 0.7 : 1
            }}
          >
            {submitting ? "Mengirim Pengajuan…" : "Kirim Pengajuan"}
          </button>
        </form>
      </div>

      {/* Riwayat transaksi */}
      <h2
        style={{
          color: "#e5e7eb",
          fontSize: "16px",
          marginTop: 0,
          marginBottom: "8px"
        }}
      >
        Riwayat Pengajuan & Transaksi Dompet
      </h2>

      {loadingTx ? (
        <p style={{ fontSize: "14px", color: "#9ca3af" }}>Memuat data…</p>
      ) : transactions.length === 0 ? (
        <p style={{ fontSize: "14px", color: "#9ca3af" }}>
          Belum ada transaksi. Mulai dengan mengajukan deposit simulasi.
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
                <th style={thStyle}>Jenis</th>
                <th style={thStyle}>Nominal</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Keterangan</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => {
                const amt = Number(tx.amount);
                const isDep = tx.type === "DEPOSIT";
                const statusColor =
                  tx.status === "APPROVED"
                    ? "#4ade80"
                    : tx.status === "REJECTED"
                    ? "#f97373"
                    : "#fbbf24";

                return (
                  <tr key={tx.id}>
                    <td style={tdStyle}>
                      {tx.created_at
                        ? new Date(tx.created_at).toLocaleString("id-ID")
                        : "-"}
                    </td>
                    <td style={tdStyle}>
                      <span
                        style={{
                          fontWeight: 600,
                          color: isDep ? "#4ade80" : "#f97373"
                        }}
                      >
                        {isDep ? "Deposit" : "Withdraw"}
                      </span>
                    </td>
                    <td style={tdStyle}>
                      <span
                        style={{
                          color: isDep ? "#4ade80" : "#f97373"
                        }}
                      >
                        {isDep ? "+" : "-"} Rp{" "}
                        {Math.abs(amt).toLocaleString("id-ID")}
                      </span>
                    </td>
                    <td style={tdStyle}>
                      <span
                        style={{
                          fontSize: "12px",
                          fontWeight: 600,
                          color: statusColor
                        }}
                      >
                        {tx.status}
                      </span>
                    </td>
                    <td style={tdStyle}>
                      {tx.description || (
                        <span style={{ color: "#6b7280" }}>-</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function SummaryCard({ label, value, highlight = false, negative = false }) {
  const color = highlight
    ? "#4ade80"
    : negative
    ? "#f97373"
    : "#e5e7eb";

  return (
    <div
      style={{
        flex: "1 1 150px",
        minWidth: "150px",
        backgroundColor: "#020617",
        borderRadius: "12px",
        border: "1px solid #1f2937",
        padding: "12px 14px"
      }}
    >
      <div
        style={{
          fontSize: "11px",
          color: "#9ca3af",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          marginBottom: "4px"
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: "16px",
          fontWeight: 700,
          color
        }}
      >
        Rp {Number(value).toLocaleString("id-ID")}
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "8px 10px",
  borderRadius: "8px",
  border: "1px solid #334155",
  backgroundColor: "#020617",
  color: "#e5e7eb",
  fontSize: "13px"
};

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
  color: "#e5e7eb"
};
