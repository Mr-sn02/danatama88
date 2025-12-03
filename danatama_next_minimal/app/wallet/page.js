"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function WalletPage() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);
  const [loadingTx, setLoadingTx] = useState(false);
  const [transactions, setTransactions] = useState([]);

  const [deposit, setDeposit] = useState({
    amount: "",
    senderName: "",
    note: "",
    targetAccount: "BCA - 1234567890 a.n. DANATAMA",
    proofName: "",
  });

  const [withdraw, setWithdraw] = useState({
    amount: "",
    bankName: "",
    accountNumber: "",
    accountName: "",
    note: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

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
      deposit.proofName ? `Bukti: ${deposit.proofName} (simulasi)` : "",
    ]
      .filter(Boolean)
      .join(" | ");

    setSubmitting(true);

    const { error } = await supabase.from("wallet_transactions").insert({
      user_id: user.id,
      type: "DEPOSIT",
      amount: amountNum,
      description: desc,
      status: "PENDING",
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
        created_at: new Date().toISOString(),
      },
      ...prev,
    ]);

    setDeposit({
      amount: "",
      senderName: "",
      note: "",
      targetAccount: "BCA - 1234567890 a.n. DANATAMA",
      proofName: "",
    });

    setMessage("Deposit berhasil diajukan. Menunggu persetujuan admin.");
  }

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
      withdraw.note ? `Catatan: ${withdraw.note}` : "",
    ]
      .filter(Boolean)
      .join(" | ");

    setSubmitting(true);

    const { error } = await supabase.from("wallet_transactions").insert({
      user_id: user.id,
      type: "WITHDRAW",
      amount: amountNum,
      description: desc,
      status: "PENDING",
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
        created_at: new Date().toISOString(),
      },
      ...prev,
    ]);

    setWithdraw({
      amount: "",
      bankName: "",
      accountNumber: "",
      accountName: "",
      note: "",
    });

    setMessage("Penarikan berhasil diajukan dan menunggu ACC admin.");
  }

  if (checking) {
    return (
      <div className="dt-container">
        <p className="dt-muted">Memeriksa sesi…</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="dt-container">
        <div className="dt-card" style={{ maxWidth: 420, margin: "0 auto" }}>
          <h1 style={{ color: "#fbbf24", fontSize: 20 }}>Butuh Login</h1>
          <p className="dt-soft dt-mt-2" style={{ fontSize: 13 }}>
            Untuk mengakses dompet simulasi Danatama, silakan login terlebih
            dulu.
          </p>
          <a href="/login" className="dt-btn dt-btn-primary dt-mt-3">
            Pergi ke Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="dt-container">
      <span className="dt-badge dt-badge-gold">Dompet Simulasi</span>
      <h1
        className="dt-mt-2"
        style={{ color: "#fbbf24", fontSize: 20, marginBottom: 4 }}
      >
        Dompet Danatama
      </h1>
      <p className="dt-soft" style={{ fontSize: 13 }}>
        Deposit &amp; Withdraw akan diproses oleh admin. Saldo hanya berubah jika
        status transaksi <strong>APPROVED</strong>.
      </p>

      {/* Ringkasan */}
      <div className="dt-flex dt-flex-wrap dt-gap-2 dt-mt-3">
        <div className="dt-card-soft" style={{ flex: "1 1 140px" }}>
          <div className="dt-muted" style={{ fontSize: 11 }}>
            Saldo Tersedia
          </div>
          <div
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: "#4ade80",
              marginTop: 4,
            }}
          >
            Rp {summary.balance.toLocaleString("id-ID")}
          </div>
        </div>
        <div className="dt-card-soft" style={{ flex: "1 1 140px" }}>
          <div className="dt-muted" style={{ fontSize: 11 }}>
            Total Deposit (APPROVED)
          </div>
          <div
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: "#e5e7eb",
              marginTop: 4,
            }}
          >
            Rp {summary.deposit.toLocaleString("id-ID")}
          </div>
        </div>
        <div className="dt-card-soft" style={{ flex: "1 1 140px" }}>
          <div className="dt-muted" style={{ fontSize: 11 }}>
            Total Withdraw (APPROVED)
          </div>
          <div
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: "#f97373",
              marginTop: 4,
            }}
          >
            Rp {summary.withdraw.toLocaleString("id-ID")}
          </div>
        </div>
      </div>

      {/* DEPOSIT */}
      <section className="dt-card dt-mt-3">
        <h2 className="dt-card-title">Ajukan Deposit</h2>

        <form onSubmit={handleSubmitDeposit}>
          <label className="dt-label">Nominal Deposit</label>
          <input
            type="number"
            name="amount"
            value={deposit.amount}
            onChange={handleDepositChange}
            placeholder="contoh: 100000"
            className="dt-input"
          />

          <label className="dt-label">Atas Nama Pengirim</label>
          <input
            type="text"
            name="senderName"
            value={deposit.senderName}
            onChange={handleDepositChange}
            placeholder="contoh: nama sesuai rekening"
            className="dt-input"
          />

          <label className="dt-label">Catatan (opsional)</label>
          <textarea
            name="note"
            value={deposit.note}
            onChange={handleDepositChange}
            rows={3}
            placeholder="contoh: setor pertama, mohon dibantu"
            className="dt-textarea"
          />

          <label className="dt-label">Rekening Tujuan Deposit</label>
          <select
            name="targetAccount"
            value={deposit.targetAccount}
            onChange={handleDepositChange}
            className="dt-select"
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

          <label className="dt-label">Bukti Transfer (opsional)</label>
          <div style={{ position: "relative", width: "100%", marginBottom: 4 }}>
            <input
              type="file"
              onChange={(e) =>
                setDeposit((prev) => ({
                  ...prev,
                  proofName: e.target.files?.[0]?.name || "",
                }))
              }
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                opacity: 0,
                cursor: "pointer",
              }}
            />
            <div className="dt-input dt-muted" style={{ cursor: "pointer" }}>
              {deposit.proofName || "Pilih file (simulasi)"}
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="dt-btn dt-btn-primary dt-mt-3"
            style={{ width: "100%" }}
          >
            {submitting ? "Mengirim..." : "Ajukan Deposit"}
          </button>
        </form>
      </section>

      {/* WITHDRAW */}
      <section className="dt-card dt-mt-3">
        <h2 className="dt-card-title">Ajukan Penarikan</h2>

        <form onSubmit={handleSubmitWithdraw}>
          <label className="dt-label">Nominal Penarikan</label>
          <input
            type="number"
            name="amount"
            value={withdraw.amount}
            onChange={handleWithdrawChange}
            placeholder="contoh: 50000"
            className="dt-input"
          />

          <div className="dt-flex dt-flex-wrap dt-gap-2">
            <div style={{ flex: "1 1 150px" }}>
              <label className="dt-label">Nama Bank / E-Wallet</label>
              <input
                type="text"
                name="bankName"
                value={withdraw.bankName}
                onChange={handleWithdrawChange}
                placeholder="contoh: BCA / BRI / Dana"
                className="dt-input"
              />
            </div>
            <div style={{ flex: "1 1 150px" }}>
              <label className="dt-label">Nomor Rekening / Akun</label>
              <input
                type="text"
                name="accountNumber"
                value={withdraw.accountNumber}
                onChange={handleWithdrawChange}
                placeholder="contoh: 1234567890"
                className="dt-input"
              />
            </div>
          </div>

          <label className="dt-label">Nama Pemilik Rekening</label>
          <input
            type="text"
            name="accountName"
            value={withdraw.accountName}
            onChange={handleWithdrawChange}
            placeholder="contoh: nama lengkap"
            className="dt-input"
          />

          <label className="dt-label">Catatan (opsional)</label>
          <textarea
            name="note"
            value={withdraw.note}
            onChange={handleWithdrawChange}
            rows={3}
            placeholder="contoh: tarik untuk kebutuhan tertentu"
            className="dt-textarea"
          />

          <button
            type="submit"
            disabled={submitting}
            className="dt-btn dt-mt-3"
            style={{
              width: "100%",
              backgroundColor: "#f59e0b",
              color: "#111827",
            }}
          >
            {submitting ? "Mengirim..." : "Ajukan Penarikan"}
          </button>
        </form>
      </section>

      {message && (
        <p className="dt-muted dt-mt-2" style={{ fontSize: 13 }}>
          {message}
        </p>
      )}

      {/* RIWAYAT */}
      <h2 className="dt-mt-3" style={{ color: "#e5e7eb", fontSize: 16 }}>
        Riwayat Transaksi
      </h2>

      {loadingTx ? (
        <p className="dt-muted">Memuat…</p>
      ) : transactions.length === 0 ? (
        <p className="dt-muted">Belum ada transaksi.</p>
      ) : (
        <div className="dt-table-wrap dt-mt-2">
          <table className="dt-table">
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>Jenis</th>
                <th>Nominal</th>
                <th>Status</th>
                <th>Keterangan</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id}>
                  <td>
                    {new Date(tx.created_at).toLocaleString("id-ID")}
                  </td>
                  <td>
                    <span
                      style={{
                        color:
                          tx.type === "DEPOSIT" ? "#4ade80" : "#f87171",
                        fontWeight: 600,
                      }}
                    >
                      {tx.type}
                    </span>
                  </td>
                  <td>
                    Rp {Number(tx.amount).toLocaleString("id-ID")}
                  </td>
                  <td>
                    <span
                      style={{
                        color:
                          tx.status === "APPROVED"
                            ? "#4ade80"
                            : tx.status === "REJECTED"
                            ? "#f87171"
                            : "#fbbf24",
                        fontWeight: 600,
                        fontSize: 12,
                      }}
                    >
                      {tx.status}
                    </span>
                  </td>
                  <td style={{ wordBreak: "break-word" }}>
                    {tx.description || (
                      <span style={{ color: "#64748b" }}>-</span>
                    )}
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
