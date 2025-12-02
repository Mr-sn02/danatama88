"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      const { data, error } = await supabase.auth.getUser();
      if (!error && data?.user) {
        setUser(data.user);
      }
      setChecking(false);
    }
    fetchUser();
  }, []);

  if (checking) {
    return (
      <p style={{ fontSize: "14px", color: "#9ca3af" }}>
        Memuat data profil…
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
          Profil Tidak Ditemukan
        </h1>
        <p
          style={{
            fontSize: "13px",
            color: "#cbd5e1",
            marginTop: 0,
            marginBottom: "12px"
          }}
        >
          Anda belum login. Silakan masuk terlebih dahulu untuk melihat profil
          nasabah.
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

  const meta = user.user_metadata || {};

  return (
    <div
      style={{
        maxWidth: "480px",
        margin: "0 auto",
        backgroundColor: "#020617",
        borderRadius: "16px",
        border: "1px solid #1f2937",
        padding: "20px"
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
        Profil Nasabah (Supabase)
      </h1>

      <p
        style={{
          fontSize: "13px",
          color: "#cbd5e1",
          marginTop: 0,
          marginBottom: "12px"
        }}
      >
        Data berikut diambil langsung dari session Supabase.
      </p>

      <div style={{ fontSize: "13px", lineHeight: 1.6 }}>
        <div>
          <strong>ID User:</strong> <br />
          <span style={{ color: "#9ca3af" }}>{user.id}</span>
        </div>
        <div style={{ marginTop: "8px" }}>
          <strong>Nama Pengguna:</strong> <br />
          <span style={{ color: "#e5e7eb" }}>
            {meta.username || "- (belum diisi)"}
          </span>
        </div>
        <div style={{ marginTop: "8px" }}>
          <strong>Email (Kontak):</strong> <br />
          <span style={{ color: "#e5e7eb" }}>{user.email}</span>
        </div>
        <div style={{ marginTop: "8px" }}>
          <strong>Dibuat Pada:</strong> <br />
          <span style={{ color: "#9ca3af" }}>
            {user.created_at
              ? new Date(user.created_at).toLocaleString("id-ID")
              : "-"}
          </span>
        </div>
      </div>
    </div>
  );
}
