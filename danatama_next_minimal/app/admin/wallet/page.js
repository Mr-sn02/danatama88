"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabaseClient";

const ADMIN_EMAILS = ["admin@danatama.co.id"]; // ganti kalau perlu

export default function AdminWalletPage() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);
  const [pendingTx, setPendingTx] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionId, setActionId] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchAdminAndTx() {
      const { data, error } = await supabase.auth.getUser();
      if (!error && data?.user) {
        setUser(data.user);
        if (ADMIN_EMAILS.includes(data.user.email)) {
          setLoading(true);
          const { data: tx, error: txErr } = await supabase
            .from("wallet_transactions")
            .select("*")
            .eq("status", "PENDING")
            .order("created_at", { ascending: true });
          if (!txErr && tx) {
            setPendingTx(tx);
          }
          setLoading(false);
        }
      }
      setChecking(false);
    }
    fetchAdminAndTx();
  }, []);

  if (checking) {
    return (
      <p style={{ fontSize: "14px", color: "#9ca3af" }}>
        Mengecek sesi admin…
      </p>
    );
  }

  if (!user || !ADMIN_EMAILS.includes(user.email)) {
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
          Akses Ditolak
        </h1>
        <p
          style={{
            fontSize: "13px",
            color: "#cbd5e1",
            marginTop: 0,
            marginBottom: "12px"
          }}
        >
          Halaman ini hanya dapat diakses oleh admin yang terdaftar. Pastikan
          Anda login dengan akun admin.
        </p>
      </div>
    );
  }

  async function handleUpdateStatus(tx, newStatus) {
    setMessage("");
    setActionId(tx.id);

    const { error } = await supabase
      .from("wallet_transactions")
      .update({
        status: newStatus,
        approved_at: new Date().toISOString(),
        approved_by: user.email
      })
      .eq("id", tx.id);

    setActionId(null);

    if (error) {
      console.error(error);
      setMessage("Gagal memperbarui status transaksi: " + error.message);
      return;
    }

    // Hapus dari list pending
    setPendingTx((prev) => prev.filter((p) => p.id !== tx.id));
    setMessage(
      `Transaksi ${tx.type} sebesar Rp ${Number(tx.amount).toLocaleString(
        "id-ID"
      )} telah ditandai sebagai ${newStatus}.`
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
        Admin Panel — Pengajuan Dompet
      </h1>
      <p
        style={{
          fontSize: "13px",
          color: "#cbd5e1",
          marginTop: 0,
          marginBottom: "12px"
        }}
      >
        Halaman ini menampilkan seluruh pengajuan deposit dan withdraw dengan
        status <strong>PENDING</strong>. Admin dapat menyetujui (APPROVED) atau
        menolak (REJECTED).
      </p>

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

      {loading ? (
        <p style={{ fontSize: "14px", color: "#9ca3af" }}>Memuat data…</p>
      ) : pendingTx.length === 0 ? (
        <p style={{ fontSize: "14px", color: "#9ca3af" }}>
          Belum ada pengajuan PENDING.
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
              <tr>
                <th style={thStyle}>Tanggal</th>
                <th style={thStyle}>User ID</th>
                <th style={thStyle}>Jenis</th>
                <th style={thStyle}>Nominal</th>
                <th style={thStyle}>Keterangan</th>
                <th style={thStyle}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {pendingTx.map((tx) => {
                const isDep = tx.type === "DEPOSIT";
                const amt = Number(tx.amount);

                return (
                  <tr key={tx.id}>
                    <td style={tdStyle}>
                      {tx.created_at
                        ? new Date(tx.created_at).toLocaleString("id-ID")
                        : "-"}
                    </td>
                    <td style={tdStyle}>
                      <code style={{ fontSize: "11px" }}>{tx.user_id}</code>
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
                      {isDep ? "+" : "-"} Rp{" "}
                      {Math.abs(amt).toLocaleString("id-ID")}
                    </td>
                    <td style={tdStyle}>
                      {tx.description || (
                        <span style={{ color: "#6b7280" }}>-</span>
                      )}
                    </td>
                    <td style={tdStyle}>
                      <div
                        style={{
                          display: "flex",
                          gap: "8px",
                          flexWrap: "wrap"
                        }}
                      >
                        <button
                          onClick={() => handleUpdateStatus(tx, "APPROVED")}
                          disabled={actionId === tx.id}
                          style={{
                            backgroundColor: "#22c55e",
                            color: "#f9fafb",
                            border: "none",
                            borderRadius: "6px",
                            padding: "6px 10px",
                            fontSize: "12px",
                            cursor:
                              actionId === tx.id ? "default" : "pointer",
                            opacity: actionId === tx.id ? 0.7 : 1
                          }}
                        >
                          {actionId === tx.id &&
                          message.includes("APPROVED")
                            ? "Memproses…"
                            : "Setujui"}
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(tx, "REJECTED")}
                          disabled={actionId === tx.id}
                          style={{
                            backgroundColor: "#ef4444",
                            color: "#f9fafb",
                            border: "none",
                            borderRadius: "6px",
                            padding: "6px 10px",
                            fontSize: "12px",
                            cursor:
                              actionId === tx.id ? "default" : "pointer",
                            opacity: actionId === tx.id ? 0.7 : 1
                          }}
                        >
                          {actionId === tx.id &&
                          message.includes("REJECTED")
                            ? "Memproses…"
                            : "Tolak"}
                        </button>
                      </div>
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
  verticalAlign: "top"
};
