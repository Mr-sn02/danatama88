"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      const { data, error } = await supabase.auth.getUser();
      if (!error && data?.user) setUser(data.user);
      setChecking(false);
    }
    fetchUser();
  }, []);

  if (checking) {
    return (
      <div className="dt-container">
        <p className="dt-muted">Memuat profil nasabah…</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="dt-container">
        <div className="dt-card" style={{ maxWidth: 420, margin: "0 auto" }}>
          <h1 style={{ color: "#fbbf24", fontSize: 20 }}>Butuh Login</h1>
          <p className="dt-soft dt-mt-2" style={{ fontSize: 13 }}>
            Untuk melihat profil nasabah, silakan login terlebih dahulu dengan
            akun Danatama.
          </p>
          <a href="/login" className="dt-btn dt-btn-primary dt-mt-3">
            Pergi ke Login
          </a>
        </div>
      </div>
    );
  }

  const meta = user.user_metadata || {};
  const fullName = meta.full_name || meta.name || "Belum diisi";
  const phone = meta.phone || meta.telepon || "Belum diisi";
  const email = user.email || "Belum diisi";

  return (
    <div className="dt-container">
      <div className="dt-card" style={{ maxWidth: 520, margin: "0 auto" }}>
        {/* Header */}
        <div className="dt-flex dt-gap-2" style={{ alignItems: "center" }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "999px",
              background:
                "radial-gradient(circle at 30% 20%, #fbbf24, #0f172a)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              color: "#0f172a",
              fontSize: 18,
              textTransform: "uppercase",
            }}
          >
            {fullName?.[0] || "N"}
          </div>
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: 18,
                color: "#fbbf24",
              }}
            >
              Profil Nasabah
            </h1>
            <p className="dt-muted" style={{ fontSize: 12, marginTop: 4 }}>
              Data dasar akun Management Danatama Makmur Sekuritas.
            </p>
          </div>
        </div>

        {/* Info banner */}
        <div
          className="dt-card-soft dt-mt-3"
          style={{
            backgroundColor: "#0b1120",
            borderColor: "#1e293b",
          }}
        >
          <p className="dt-soft" style={{ fontSize: 11 }}>
            Informasi di bawah ini bersumber dari{" "}
            <strong>data pendaftaran aplikasi</strong> dan digunakan untuk
            kebutuhan Management. Ini <strong>data KYC resmi</strong> dan
            terhubung ke sistem sekuritas sungguhan.
          </p>
        </div>

        {/* Detail */}
        <div className="dt-mt-3" style={{ fontSize: 14 }}>
          <div
            style={{
              marginBottom: 12,
              paddingBottom: 10,
              borderBottom: "1px dashed #1f2937",
            }}
          >
            <div className="dt-muted" style={{ fontSize: 11 }}>
              Nama Lengkap
            </div>
            <div>{fullName}</div>
          </div>

          <div
            style={{
              marginBottom: 12,
              paddingBottom: 10,
              borderBottom: "1px dashed #1f2937",
            }}
          >
            <div className="dt-muted" style={{ fontSize: 11 }}>
              Email Terdaftar
            </div>
            <div>{email}</div>
          </div>

          <div
            style={{
              marginBottom: 4,
              paddingBottom: 10,
              borderBottom: "1px dashed #1f2937",
            }}
          >
            <div className="dt-muted" style={{ fontSize: 11 }}>
              Nomor HP
            </div>
            <div>{phone}</div>
          </div>
        </div>

        <p
          className="dt-muted dt-mt-2"
          style={{ fontSize: 11 }}
        >
          Jika ada perbedaan data atau ingin memperbarui informasi, silakan
          hubungi Customer Service melalui tombol WhatsApp di bagian atas
          aplikasi.
        </p>
      </div>
    </div>
  );
}
