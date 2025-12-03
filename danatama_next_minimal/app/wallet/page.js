"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function WalletPage() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);
  const [loadingTx, setLoadingTx] = useState(false);
  const [transactions, setTransactions] = useState([]);

  // Form Deposit
  const [deposit, setDeposit] = useState({
    amount: "",
    senderName: "",
    note: "",
    targetAccount: "BCA - 1234567890 a.n. DANATAMA",
    proofName: ""
  });

  // Form Withdraw (mirip screenshot akhi)
  const [withdraw, setWithdraw] = useState({
    amount: "",
    bankName: "",
    accountNumber: "",
    accountName: "",
    note: ""
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
        const { data: tx } = await supabase
          .from("wallet_transactions")
          .select("*")
          .eq("user_id", data.user.id)
          .order("created_at", { ascending: false });

        if (tx) setTransactions(tx);
        setLoadingTx(false);
      }
      setChecking(false);
    }
    fetchUserAndTx();
  }, []);

  // Hitung saldo yg APPROVED
  const summary = transactions.reduce(
    (acc, tx) => {
      if (tx.status !== "APPROVED") return acc;
      const amt = Number(tx.amount);

      if (tx.type === "DEPOSIT") {
        acc.deposit += amt;
        acc.balance += amt;
      }
      if (tx.type === "WITHDRAW") {
        acc.withdraw += amt;
        acc.balance -= amt;
      }
      return acc;
    },
    { balance: 0, deposit: 0, withdraw: 0 }
  );

  function handleDepositChange(e) {
    const { name, value } = e.target;
    setDeposit((prev) => ({ ...prev, [name]: value }));
  }

  function handleWithdrawChange(e) {
    const { name, value } = e.target;
    setWithdraw((prev) => ({ ...prev, [name]: value }));
  }

  // ========== SUBMIT DEPOSIT ==========
  async function handleSubmitDeposit(e) {
    e.preventDefault();
    setMessage("");

    const amountNum = Number(deposit.amount);
    if (!amountNum || amountNum <= 0) {
      setMessage("Nominal harus lebih besar dari 0.");
      return;
    }

    const desc = [
      deposit.senderName ? `Atas nama: ${deposit.senderName}` : "",
      deposit.note ? `Catatan: ${deposit.note}` : "",
      deposit.targetAccount ? `Tujuan: ${deposit.targetAccount}` : "",
      deposit.proofName ? `Bukti: ${deposit.proofName} (simulasi)` : ""
    ]
      .filter(Boolean)
      .join(" | ");

    setSubmitting(true);

    const { error } = await supabase.from("wallet_transactions").insert({
      user_id: user.id,
      type: "DEPOSIT",
      amount: amountNum,
      description: desc,
      status: "PENDING"
    });

    setSubmitting(false);

    if (error) {
      setMessage("Gagal mengajukan deposit: " + error.message);
      return;
    }

    setTransactions((prev) => [
      {
        id: Date.now(),
        user_id: user.id,
        type: "DEPOSIT",
        amount: amountNum,
        description: desc,
        status: "PENDING",
        created_at: new Date().toISOString()
      },
      ...prev
    ]);

    setDeposit({
      amount: "",
      senderName: "",
      note: "",
      targetAccount: "BCA - 1234567890 a.n. DANATAMA",
      proofName: ""
    });

    setMessage("Deposit berhasil diajukan. Menunggu persetujuan admin.");
  }

  // ========== SUBMIT WITHDRAW ==========
  async function handleSubmitWithdraw(e) {
    e.preventDefault();
    setMessage("");

    const amountNum = Number(withdraw.amount);

    if (!amountNum || amountNum <= 0) {
      setMessage("Nominal harus lebih besar dari 0.");
      return;
    }

    if (amountNum > summary.balance) {
      setMessage("Nominal melebihi saldo tersedia.");
      return;
    }

    const desc = [
      withdraw.bankName ? `Bank: ${withdraw.bankName}` : "",
      withdraw.accountNumber ? `No Rek: ${withdraw.accountNumber}` : "",
      withdraw.accountName ? `Atas nama: ${withdraw.accountName}` : "",
      withdraw.note ? `Catatan: ${withdraw.note}` : ""
    ]
      .filter(Boolean)
      .join(" | ");

    setSubmitting(true);

    const { error } = await supabase.from("wallet_transactions").insert({
      user_id: user.id,
      type: "WITHDRAW",
      amount: amountNum,
      description: desc,
      status: "PENDING"
    });

    setSubmitting(false);

    if (error) {
      setMessage("Gagal mengajukan penarikan: " + error.message);
      return;
    }

    setTransactions((prev) => [
      {
        id: Date.now(),
        user_id: user.id,
        type: "WITHDRAW",
        amount: amountNum,
        description: desc,
        status: "PENDING",
        created_at: new Date().toISOString()
      },
      ...prev
    ]);

    setWithdraw({
      amount: "",
      bankName: "",
      accountNumber: "",
      accountName: "",
      note: ""
    });

    setMessage("Penarikan berhasil diajukan dan menunggu ACC admin.");
  }

  // ========== HANDLING USER SESSION ==========
  if (checking) {
    return <p style={{ color: "#9ca3af" }}>Memeriksa sesi...</p>;
  }

  if (!user) {
    return (
      <div style={loginBox}>
        <h1 style={loginTitle}>Butuh Login</h1>
        <p style={loginText}>
          Untuk mengakses dompet simulasi Danatama, silakan login terlebih dulu.
        </p>

        <a href="/login" style={loginButton}>
          Pergi ke Login
        </a>
      </div>
    );
  }

  // ========== UI DOMPET ==========
  return (
    <div>
      <h1 style={{ color: "#fbbf24" }}>Dompet Simulasi</h1>
      <p style={{ color: "#cbd5e1", fontSize: "13px" }}>
        Deposit & Withdraw akan diproses oleh admin. Saldo hanya berubah jika
        status transaksi <strong>APPROVED</strong>.
      </p>

      {/* RINGKASAN SALDO */}
      <div style={summaryGrid}>
        <SummaryCard
          label="Saldo Tersedia"
          value={summary.balance}
          highlight
        />
        <SummaryCard label="Total Deposit (APPROVED)" value={summary.deposit} />
        <SummaryCard label="Total Withdraw (APPROVED)" value={summary.withdraw} negative />
      </div>

      {/* ======================== FORM DEPOSIT ======================== */}
      <section style={card}>
        <h2 style={cardTitle}>Ajukan Deposit</h2>

        <form onSubmit={handleSubmitDeposit}>
          <label style={labelStyle}>Nominal Deposit</label>
          <input
            type="number"
            name="amount"
            value={deposit.amount}
            onChange={handleDepositChange}
            placeholder="contoh: 100000"
            style={inputStyle}
          />

          <label style={labelStyle}>Atas Nama Pengirim</label>
          <input
            type="text"
            name="senderName"
            value={deposit.senderName}
            onChange={handleDepositChange}
            placeholder="contoh: nama sesuai rekening"
            style={inputStyle}
          />

          <label style={labelStyle}>Catatan (opsional)</label>
          <textarea
            name="note"
            value={deposit.note}
            onChange={handleDepositChange}
            rows={3}
            placeholder="contoh: setor pertama, mohon dibantu"
            style={{ ...inputStyle, resize: "vertical" }}
          />

          {/* Rekening Tujuan */}
          <label style={labelStyle}>Rekening Tujuan Deposit</label>
          <select
            name="targetAccount"
            value={deposit.targetAccount}
            onChange={handleDepositChange}
            style={inputStyle}
          >
            <option value="BCA - 1234567890 a.n. DANATAMA">
              BCA - 1234567890 a.n. DANATAMA
            </option>
            <option value="Mandiri - 9876543210 a.n. DANATAMA">
              Mandiri - 9876543210 a.n. DANATAMA
            </option>
            <option value="BNI - 5566778899 a.n. DANATAMA">
              BNI - 5566778899 a.n. DANATAMA
            </option>
          </select>

          {/* Bukti Transfer */}
          <label style={labelStyle}>Bukti Transfer (opsional)</label>
          <div style={fileBox}>
            <input
              type="file"
              onChange={(e) =>
                setDeposit((prev) => ({
                  ...prev,
                  proofName: e.target.files?.[0]?.name || ""
                }))
              }
              style={fileInput}
            />
            <div style={fileFake}>
              {deposit.proofName || "Pilih file (simulasi)"}
            </div>
          </div>

          <button type="submit" disabled={submitting} style={submitButton}>
            {submitting ? "Mengirim..." : "Ajukan Deposit"}
          </button>
        </form>
      </section>

      {/* ======================== FORM WITHDRAW ======================== */}
      <section style={card}>
        <h2 style={cardTitle}>Ajukan Penarikan</h2>

        <form onSubmit={handleSubmitWithdraw}>
          <label style={labelStyle}>Nominal Penarikan</label>
          <input
            type="number"
            name="amount"
            value={withdraw.amount}
            onChange={handleWithdrawChange}
            placeholder="contoh: 50000"
            style={inputStyle}
          />

          <label style={labelStyle}>Nama Bank / E-Wallet</label>
          <input
            type="text"
            name="bankName"
            value={withdraw.bankName}
            onChange={handleWithdrawChange}
            placeholder="contoh: BCA / BRI / Dana"
            style={inputStyle}
          />

          <label style={labelStyle}>Nomor Rekening / Akun</label>
          <input
            type="text"
            name="accountNumber"
            value={withdraw.accountNumber}
            onChange={handleWithdrawChange}
            placeholder="contoh: 1234567890"
            style={inputStyle}
          />

          <label style={labelStyle}>Nama Pemilik Rekening</label>
          <input
            type="text"
            name="accountName"
            value={withdraw.accountName}
            onChange={handleWithdrawChange}
            placeholder="contoh: nama lengkap"
            style={inputStyle}
          />

          <label style={labelStyle}>Catatan (opsional)</label>
          <textarea
            name="note"
            value={withdraw.note}
            onChange={handleWithdrawChange}
            rows={3}
            placeholder="contoh: tarik untuk kebutuhan tertentu"
            style={{ ...inputStyle, resize: "vertical" }}
          />

          <button type="submit" disabled={submitting} style={withdrawButton}>
            {submitting ? "Mengirim..." : "Ajukan Penarikan"}
          </button>
        </form>
      </section>

      {/* Pesan sistem */}
      {message && (
        <p style={{ color: "#9ca3af", fontSize: "13px", marginTop: "12px" }}>
          {message}
        </p>
      )}

      {/* ======================== RIWAYAT TRANSAKSI ======================== */}
      <h2 style={historyTitle}>Riwayat Transaksi</h2>

      {loadingTx ? (
        <p style={{ color: "#9ca3af" }}>Memuat...</p>
      ) : transactions.length === 0 ? (
        <p style={{ color: "#9ca3af" }}>Belum ada transaksi.</p>
      ) : (
        <div style={historyBox}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Tanggal</th>
                <th style={thStyle}>Jenis</th>
                <th style={thStyle}>Nominal</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Keterangan</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id}>
                  <td style={tdStyle}>
                    {new Date(tx.created_at).toLocaleString("id-ID")}
                  </td>
                  <td style={tdStyle}>
                    <span style={{ color: tx.type === "DEPOSIT" ? "#4ade80" : "#f87171" }}>
                      {tx.type}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    Rp {Number(tx.amount).toLocaleString("id-ID")}
                  </td>
                  <td style={tdStyle}>
                    <span
                      style={{
                        color:
                          tx.status === "APPROVED"
                            ? "#4ade80"
                            : tx.status === "REJECTED"
                            ? "#f87171"
                            : "#fbbf24"
                      }}
                    >
                      {tx.status}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    {tx.description || <span style={{ color: "#64748b" }}>-</span>}
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

/* ———————— COMPONENTS ———————— */

function SummaryCard({ label, value, highlight = false, negative = false }) {
  return (
    <div
      style={{
        backgroundColor: "#020617",
        border: "1px solid #1f2937",
        padding: "12px",
        borderRadius: "12px",
        minWidth: "180px",
        flex: "1"
      }}
    >
      <div style={{ fontSize: "11px", color: "#9ca3af" }}>{label}</div>
      <div
        style={{
          fontSize: "16px",
          fontWeight: 700,
          color: highlight ? "#4ade80" : negative ? "#f87171" : "#e5e7eb"
        }}
      >
        Rp {Number(value).toLocaleString("id-ID")}
      </div>
    </div>
  );
}

/* ———————— STYLES ———————— */

const summaryGrid = {
  display: "flex",
  gap: "16px",
  marginBottom: "20px",
  flexWrap: "wrap"
};

const card = {
  backgroundColor: "#020617",
  border: "1px solid #1f2937",
  padding: "20px",
  borderRadius: "16px",
  marginBottom: "24px",
  maxWidth: "800px"
};

const cardTitle = {
  color: "#e5e7eb",
  margin: 0,
  marginBottom: "12px",
  fontSize: "16px"
};

const labelStyle = {
  display: "block",
  marginBottom: "6px",
  marginTop: "10px",
  color: "#e5e7eb",
  fontSize: "13px"
};

const inputStyle = {
  width: "100%",
  padding: "8px",
  backgroundColor: "#020617",
  border: "1px solid #334155",
  borderRadius: "8px",
  color: "#e5e7eb",
  fontSize: "13px"
};

const fileBox = {
  position: "relative",
  width: "100%",
  marginBottom: "10px"
};

const fileInput = {
  position: "absolute",
  width: "100%",
  height: "100%",
  opacity: 0,
  cursor: "pointer"
};

const fileFake = {
  ...inputStyle,
  cursor: "pointer",
  color: "#9ca3af"
};

const submitButton = {
  marginTop: "14px",
  backgroundColor: "#eab308",
  padding: "10px 16px",
  borderRadius: "999px",
  border: "none",
  fontWeight: 700,
  cursor: "pointer"
};

const withdrawButton = {
  ...submitButton,
  backgroundColor: "#f59e0b"
};

const loginBox = {
  maxWidth: "420px",
  margin: "20px auto",
  padding: "20px",
  backgroundColor: "#020617",
  border: "1px solid #1f2937",
  borderRadius: "16px",
  textAlign: "center"
};

const loginTitle = { color: "#fbbf24", marginBottom: "8px" };
const loginText = { color: "#cbd5e1", fontSize: "13px" };
const loginButton = {
  display: "inline-block",
  backgroundColor: "#fbbf24",
  padding: "10px 16px",
  borderRadius: "8px",
  fontWeight: 700,
  color: "#111"
};

const historyTitle = {
  color: "#e5e7eb",
  marginTop: "20px",
  marginBottom: "12px"
};

const historyBox = {
  border: "1px solid #334155",
  borderRadius: "12px",
  overflowX: "auto",
  backgroundColor: "#020617"
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  fontSize: "13px"
};

const thStyle = {
  padding: "10px",
  borderBottom: "1px solid #1f2937",
  color: "#e5e7eb",
  textAlign: "left"
};

const tdStyle = {
  padding: "10px",
  borderBottom: "1px solid #1f2937",
  color: "#e5e7eb"
};
