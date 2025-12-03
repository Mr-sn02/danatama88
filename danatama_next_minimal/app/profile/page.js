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

  const pageWrapper = {
    maxWidth: "960px",
    margin: "0 auto",
    padding: "24px 10px",
    boxSizing: "border-box"
  };

  const card = {
    maxWidth: "520px",
    margin: "0 auto",
    backgroundColor: "#020617",
    borderRadius: "16px",
    border: "1px solid #1f2937",
    padding: "20px 18px",
    boxSizing: "border-box"
  };

  const label = {
    fontSize: "11px",
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    color: "#9ca3af",
    marginBottom: "2px"
  };

  const value = {
    fontSize: "14px",
    color: "#e5e7eb",
    fontWeight: 500
  };

  const row = {
    marginBottom: "12px",
    paddingBottom: "10px",
    borderBottom: "1px dashed #1f2937"
  };

  if (checking) {
    return (
      <div style={pageWrapper}>
        <p style={{ color: "#9ca3af", fontSize: "14px" }}>
          Memuat profil nasabah…
        </p>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={pageWrapper}>
        <div
          style={{
            maxWidth: "420px",
            margin: "0 auto",
            backgroundColor: "#020617",
            borderRadius: "16px",
            border: "1px solid #1f2937",
            padding: "20px",
            textAlign: "center",
            boxSizing: "border-box"
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
            Untuk melihat profil nasabah, silakan login terlebih dahulu dengan
            akun Danatama.
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
      </div>
    );
  }

  // Ambil metadata dari Supabase
  const meta = user.user_metadata || {};
  const fullName =
    meta.full_name || meta.name || "Belum diisi";
  const phone =
    meta.phone || meta.telepon || "Belum diisi";
  const email = user.email || "Belum diisi";

  return (
    <div style={pageWrapper}>
      <div style={card}>
        {/* Header Profil */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "14px"
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "999px",
              background:
                "radial-gradient(circle at 30% 20%, #fbbf24, #0f172a)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              color: "#0f172a",
              fontSize: "18px",
              textTransform: "uppercase"
            }}
          >
            {fullName?.[0] || "N"}
          </div>
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: "18px",
                color: "#fbbf24"
              }}
            >
              Profil Nasabah
            </h1>
            <p
              style={{
                margin: 0,
                marginTop: "4px",
                fontSize: "12px",
                color: "#9ca3af"
              }}
            >
              Data dasar akun simulasi Danatama Makmur Sekuritas.
            </p>
          </div>
        </div>

        {/* Info Penting */}
        <div
          style={{
            backgroundColor: "#0b1120",
            borderRadius: "10px",
            border: "1px solid #1e293b",
            padding: "10px 12px",
            marginBottom: "14px"
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: "11px",
              color: "#e5e7eb"
            }}
          >
            Informasi di bawah ini bersumber dari{" "}
            <strong>data pendaftaran aplikasi</strong> dan digunakan untuk
            kebutuhan simulasi. Ini <strong>bukan</strong> data KYC resmi dan
            tidak terhubung ke sistem sekuritas sungguhan.
          </p>
        </div>

        {/* Baris Nama */}
        <div style={row}>
          <div style={label}>Nama Lengkap</div>
          <div style={value}>{fullName}</div>
        </div>

        {/* Baris Email */}
        <div style={row}>
          <div style={label}>Email Terdaftar</div>
          <div style={value}>{email}</div>
        </div>

        {/* Baris HP */}
        <div style={row}>
          <div style={label}>Nomor HP</div>
          <div style={value}>{phone}</div>
        </div>

        {/* Info tambahan kecil */}
        <p
          style={{
            marginTop: "8px",
            marginBottom: 0,
            fontSize: "11px",
            color: "#6b7280"
          }}
        >
          Jika ada perbedaan data atau ingin memperbarui informasi, silakan
          hubungi Customer Service melalui tombol WhatsApp di bagian atas
          aplikasi.
        </p>
      </div>
    </div>
  );
}
