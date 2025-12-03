"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function WalletPage() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);
  const [loadingTx, setLoadingTx] = useState(false);
  const [transactions, setTransactions] = useState([]);

  // Form deposit
  const [deposit, setDeposit] = useState({
    amount: "",
    senderName: "",
    note: "",
    targetAccount: "BCA - 1234567890 a.n. MONEYMAIL",
    proofName: ""
  });

  // Form withdraw (versi lengkap mirip screenshot)
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

  function handleDepositChange(e) {
    const { name, value } = e.target;
    setDeposit((prev) => ({ ...prev, [name]: value }));
  }

  function handleWithdrawChange(e) {
    const { name, value } = e.target;
    setWithdraw((prev) => ({ ...prev, [name]: value }));
  }

  // ========= SUBMIT DEPOSIT =========
  async function handleSubmitDeposit(e) {
    e.preventDefault();
    setMessage("");

    if (!user) {
      setMessage("Anda harus login untuk menggunakan dompet.");
      return;
    }

    const amountNum = Number(deposit.amount);
    if (!amountNum || amountNum <= 0) {
      setMessage("Nominal deposit harus lebih besar dari 0.");
      return;
    }

    const descParts = [];
    if (deposit.note) descParts.push(`Catatan: ${deposit.note}`);
    if (deposit.senderName)
      descParts.push(`Atas nama pengirim: ${deposit.senderName}`);
    if (deposit.targetAccount)
      descParts.push(`Rekening tujuan: ${deposit.targetAccount}`);
    if (deposit.proofName)
      descParts.push(`Nama file bukti: ${deposit.proofName} (simulasi)`);
    const finalDescription = descParts.join(" | ") || null;

    setSubmitting(true);

    const { error } = await supabase.from("wallet_transactions").insert({
      user_id: user.id,
      type: "DEPOSIT",
      amount: amountNum,
      description: finalDescription,
      status: "PENDING"
    });

    setSubmitting(false);

    if (error) {
      console.error(error);
      setMessage("Gagal menyimpan pengajuan deposit: " + error.message);
      return;
    }

    const newTx = {
      id: Date.now(),
      user_id: user.id,
      type: "DEPOSIT",
      amount: amountNum,
      description: finalDescription,
      status: "PENDING",
      created_at: new Date().toISOString()
    };

    setTransactions((prev) => [newTx, ...prev]);
    setDeposit({
      amount: "",
      senderName: "",
      note: "",
      targetAccount: "BCA - 1234567890 a.n. MONEYMAIL",
      proofName: ""
    });

    setMessage(
      "Pengajuan DEPOSIT berhasil dikirim. Admin akan meninjau dan menyetujui/menolak pengajuan Anda."
    );
  }

  // ========= SUBMIT WITHDRAW =========
  async function handleSubmitWithdraw(e) {
    e.preventDefault();
    setMessage("");

    if (!user) {
      setMessage("Anda harus login untuk menggunakan dompet.");
      return;
    }

    const amountNum = Number(withdraw.amount);
    if (!amountNum || amountNum <= 0) {
      setMessage("Nominal withdraw harus lebih besar dari 0.");
      return;
    }

    if (amountNum > summary.balance) {
      setMessage(
        "Pengajuan withdraw melebihi saldo tersetujui. Silakan kurangi nominal."
      );
      return;
    }

    const descParts = [];
    if (withdraw.bankName)
      descParts.push(`Bank/e-wallet: ${withdraw.bankName}`);
    if (withdraw.accountNumber)
      descParts.push(`No. rekening/akun: ${withdraw.accountNumber}`);
    if (withdraw.accountName)
      descParts.push(`Atas nama: ${withdraw.accountName}`);
    if (withdraw.note) descParts.push(`Catatan: ${withdraw.note}`);
    const finalDescription = descParts.join(" | ") || null;

    setSubmitting(true);

    const { error } = await supabase.from("wallet_transactions").insert({
      user_id: user.id,
      type: "WITHDRAW",
      amount: amountNum,
      description: finalDescription,
      status: "PENDING"
    });

    setSubmitting(false);

    if (error) {
      console.error(error);
      setMessage("Gagal menyimpan pengajuan withdraw: " + error.message);
      return;
    }

    const newTx = {
      id: Date.now(),
      user_id: user.id,
      type: "WITHDRAW",
      amount: amountNum,
      description: finalDescription,
      status: "PENDING",
      created_at: new Date().toISOString()
    };

    setTransactions((prev) => [newTx, ...prev]);
    setWithdraw({
      amount: "",
      bankName: "",
      accountNumber: "",
      accountName: "",
      note: ""
    });

    setMessage(
      "Pengajuan WITHDRAW berhasil dikirim. Admin akan meninjau dan menyetujui/menolak pengajuan Anda."
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

      {/* FORM DEPOSIT */}
      <div
        style={{
          maxWidth: "800px",
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
            marginBottom: "8px",
            fontSize: "16px"
          }}
        >
          Ajukan menabung
        </h2>
        <p
          style={{
            fontSize: "12px",
            color: "#9ca3af",
            marginTop: 0,
            marginBottom: "12px"
          }}
        >
          Lakukan transfer ke salah satu rekening resmi Dompet Danatama, lalu isi
          nominal, nama pengirim, dan (opsional) catatan atau unggah bukti
          transfer. Admin akan mengecek dan menyetujui secara simulasi.
        </p>

        <form onSubmit={handleSubmitDeposit}>
          <label style={labelStyle}>Nominal Menabung</label>
          <input
            type="number"
            name="amount"
            value={deposit.amount}
            onChange={handleDepositChange}
            placeholder="contoh: 100000"
            style={inputStyle}
            min="0"
            step="1000"
          />

          <label style={labelStyle}>Atas nama pengirim</label>
          <input
            type="text"
            name="senderName"
            value={deposit.senderName}
            onChange={handleDepositChange}
            placeholder="nama pemilik rekening pengirim"
            style={inputStyle}
          />

          <label style={labelStyle}>Catatan tambahan (opsional)</label>
          <textarea
            name="note"
            value={deposit.note}
            onChange={handleDepositChange}
            placeholder="contoh: setor untuk tabungan pendidikan / setor pertama, mohon dibantu."
            rows={3}
            style={{
              ...inputStyle,
              resize: "vertical",
              fontFamily: "inherit"
            }}
          />

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "12px",
              marginTop: "10px"
            }}
          >
            <div style={{ flex: "1 1 220px" }}>
              <label style={labelStyle}>Rekening tujuan deposit</label>
              <select
                name="targetAccount"
                value={deposit.targetAccount}
                onChange={handleDepositChange}
                style={inputStyle}
              >
                <option value="BCA - 1234567890 a.n. MONEYMAIL">
                  BCA - 1234567890 a.n. MONEYMAIL
                </option>
                <option value="Mandiri - 9876543210 a.n. MONEYMAIL">
                  Mandiri - 9876543210 a.n. MONEYMAIL
                </option>
                <option value="BRI - 555666777 a.n. MONEYMAIL">
                  BRI - 555666777 a.n. MONEYMAIL
                </option>
              </select>
            </div>

            <div style={{ flex: "1 1 220px" }}>
              <label style={labelStyle}>Bukti transfer (opsional)</label>
              <div
                style={{
                  position: "relative",
                  overflow: "hidden",
                  display: "inline-block",
                  width: "100%"
                }}
              >
                <input
                  type="file"
                  onChange={(e) =>
                    setDeposit((prev) => ({
                      ...prev,
                      proofName:
                        e.target.files && e.target.files[0]
                          ? e.target.files[0].name
                          : ""
                    }))
                  }
                  style={{
                    position: "absolute",
                    opacity: 0,
                    width: "100%",
                    height: "100%",
                    cursor: "pointer"
                  }}
                />
                <div
                  style={{
                    ...inputStyle,
                    cursor: "pointer",
                    color: deposit.proofName ? "#e5e7eb" : "#9ca3af"
                  }}
                >
                  {deposit.proofName || "Pilih file (simulasi, belum di-upload)"}
                </div>
              </div>
            </div>
          </div>

          <p
            style={{
              fontSize: "11px",
              color: "#64748b",
              marginTop: "10px",
              marginBottom: "12px"
            }}
          >
            Jika nomor rekening tujuan berbeda dari informasi resmi, tidak aktif,
            atau kamu ragu, jangan melakukan transfer. Fitur ini hanya simulasi
            dan tidak menyimpan uang nyata.
          </p>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "12px",
              marginTop: "8px"
            }}
          >
            <button
              type="submit"
              disabled={submitting}
              style={{
                flex: "1 1 200px",
                background: submitting ? "#eab308aa" : "#eab308",
                color: "#111827",
                border: "none",
                padding: "10px 16px",
                borderRadius: "999px",
                fontWeight: 700,
                fontSize: "14px",
                cursor: submitting ? "default" : "pointer",
                textTransform: "uppercase"
              }}
            >
              {submitting ? "Mengirim..." : "Ajukan Deposit"}
            </button>

            <a
              href="https://wa.me/6281234567890"
              target="_blank"
              rel="noreferrer"
              style={{
                flex: "1 1 200px",
                textAlign: "center",
                textDecoration: "none",
                backgroundColor: "#020617",
                border: "1px solid #e5e7eb33",
                color: "#e5e7eb",
                padding: "10px 16px",
                borderRadius: "999px",
                fontWeight: 600,
                fontSize: "14px",
                textTransform: "uppercase"
              }}
            >
              Pengaduan WhatsApp
            </a>
          </div>
        </form>
      </div>

      {/* FORM WITHDRAW – mirip screenshot Ajukan penarikan */}
      <div
        style={{
          maxWidth: "800px",
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
            marginBottom: "8px",
            fontSize: "16px"
          }}
        >
          Ajukan penarikan
        </h2>
        <p
          style={{
            fontSize: "12px",
            color: "#9ca3af",
            marginTop: 0,
            marginBottom: "12px"
          }}
        >
          Penarikan akan diproses ke rekening yang kamu isi di bawah. Saldo akan
          berkurang otomatis setelah pengajuan disetujui oleh sistem (admin).
        </p>

        <form onSubmit={handleSubmitWithdraw}>
          <label style={labelStyle}>Nominal penarikan</label>
          <input
            type="number"
            name="amount"
            value={withdraw.amount}
            onChange={handleWithdrawChange}
            placeholder="contoh: 50000"
            style={inputStyle}
            min="0"
            step="1000"
          />

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "12px",
              marginTop: "10px"
            }}
          >
            <div style={{ flex: "1 1 220px" }}>
              <label style={labelStyle}>Nama bank / e-wallet</label>
              <input
                type="text"
                name="bankName"
                value={withdraw.bankName}
                onChange={handleWithdrawChange}
                placeholder="contoh: BCA / BRI / Dana"
                style={inputStyle}
              />
            </div>
            <div style={{ flex: "1 1 220px" }}>
              <label style={labelStyle}>Nomor rekening / akun</label>
              <input
                type="text"
                name="accountNumber"
                value={withdraw.accountNumber}
                onChange={handleWithdrawChange}
                placeholder="contoh: 1234567890"
                style={inputStyle}
              />
            </div>
          </div>

          <label style={labelStyle}>Nama pemilik rekening</label>
          <input
            type="text"
            name="accountName"
            value={withdraw.accountName}
            onChange={handleWithdrawChange}
            placeholder="contoh: Nama lengkap kamu"
            style={inputStyle}
          />

          <label style={labelStyle}>Catatan tambahan (opsional)</label>
          <textarea
            name="note"
            value={withdraw.note}
            onChange={handleWithdrawChange}
            placeholder="contoh: tarik untuk kebutuhan darurat / pembayaran tertentu."
            rows={3}
            style={{
              ...inputStyle,
              resize: "vertical",
              fontFamily: "inherit"
            }}
          />

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "12px",
              marginTop: "12px"
            }}
          >
            <button
              type="submit"
              disabled={submitting}
              style={{
                flex: "1 1 200px",
                backgroundColor: "#f59e0b",
                color: "#111827",
                border: "none",
                padding: "10px 16px",
                borderRadius: "999px",
                fontWeight: 700,
                fontSize: "14px",
                cursor: submitting ? "default" : "pointer",
                textTransform: "uppercase"
              }}
            >
              {submitting ? "Mengirim..." : "Ajukan Penarikan"}
            </button>

            <a
              href="https://wa.me/6281234567890"
              target="_blank"
              rel="noreferrer"
              style={{
                flex: "1 1 200px",
                textAlign: "center",
                textDecoration: "none",
                backgroundColor: "#020617",
                border: "1px solid #e5e7eb33",
                color: "#e5e7eb",
                padding: "10px 16px",
                borderRadius: "999px",
                fontWeight: 600,
                fontSize: "14px",
                textTransform: "uppercase"
              }}
            >
              Pengaduan WhatsApp
            </a>
          </div>
        </form>
      </div>

      {message && (
        <p
          style={{
            fontSize: "12px",
            color: "#9ca3af",
            marginTop: 0,
            marginBottom: "12px"
          }}
        >
          {message}
        </p>
      )}

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

const labelStyle = {
  display: "block",
  fontSize: "13px",
  marginBottom: "4px",
  marginTop: "10px",
  color: "#e5e7eb"
};

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
